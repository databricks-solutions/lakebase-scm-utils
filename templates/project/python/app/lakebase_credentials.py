"""Runtime Lakebase credential minting for the app + migrations.

No DB token is stored in .env. Instead the app mints a short-lived Postgres
credential ON DEMAND from the connection METADATA in the environment
(LAKEBASE_PROJECT_ID, LAKEBASE_BRANCH_ID, LAKEBASE_ENDPOINT), caches it
in-process, and re-mints before it expires. This mirrors the kit's
get-connection.ts / mintCredential seam (the databricks CLI is the single
credential source), so the pattern is identical across languages.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import threading
import time

# Re-mint a token this many seconds after it was minted. Lakebase database
# credentials live ~1h; 40 min keeps a comfortable margin so a pooled
# connection never presents an expired token (paired with pool_recycle in
# database.py).
_MINT_TTL_SECONDS = 40 * 60

_DEFAULT_ENDPOINT = "primary"

_lock = threading.Lock()
_cached_token: str | None = None
_minted_at: float = 0.0


class DatabricksAuthExpired(RuntimeError):
    """The databricks CLI could not mint a credential because the OAuth session
    (refresh token) is expired/invalid. Distinct + non-retryable: the SQLAlchemy
    pool must NOT retry this (it cannot self-heal), and the caller should surface
    the `databricks auth login` remediation and stop, rather than hang."""


# stderr signatures the CLI emits when the refresh token is dead / no valid auth.
_AUTH_EXPIRED_RE = re.compile(
    r"refresh token is invalid|could not be retrieved because|reauthenticate|"
    r"auth login|not authenticated|no valid.*(credential|token)|\b401\b|unauthorized",
    re.IGNORECASE,
)


def endpoint_path_from_env() -> str | None:
    """Build the Lakebase endpoint resource path from env METADATA, or None when
    the metadata needed to mint is absent (so a caller can fall back)."""
    instance = os.getenv("LAKEBASE_PROJECT_ID")
    branch = os.getenv("LAKEBASE_BRANCH_ID")
    if not instance or not branch:
        return None
    endpoint = os.getenv("LAKEBASE_ENDPOINT", _DEFAULT_ENDPOINT)
    return f"projects/{instance}/branches/{branch}/endpoints/{endpoint}"


def _profile_args() -> list[str]:
    profile = os.getenv("DATABRICKS_CONFIG_PROFILE")
    return ["--profile", profile] if profile else []


def _run_databricks(args: list[str]) -> str:
    # NOTE: check=False + explicit returncode handling so we can INSPECT stderr.
    # With check=True the CalledProcessError discards the classified message and
    # (worse) an expired-refresh-token failure would bubble as a generic error
    # into the SQLAlchemy do_connect hook, where the pool retries + hangs. We
    # instead detect the auth-expiry signature and raise DatabricksAuthExpired
    # immediately (non-retryable) with the reauth remediation.
    proc = subprocess.run(
        ["databricks", *args, *_profile_args()],
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        stderr = (proc.stderr or "").strip()
        if _AUTH_EXPIRED_RE.search(stderr):
            profile = os.getenv("DATABRICKS_CONFIG_PROFILE")
            hint = f" --profile {profile}" if profile else ""
            raise DatabricksAuthExpired(
                "Databricks auth session expired , cannot mint a Lakebase "
                f"credential. Re-authenticate with: databricks auth login{hint}\n"
                f"(databricks stderr: {stderr})"
            )
        raise subprocess.CalledProcessError(
            proc.returncode, ["databricks", *args], output=proc.stdout, stderr=proc.stderr
        )
    return proc.stdout


def mint_token(*, force: bool = False) -> str:
    """Return a valid Lakebase DB token, minting a fresh one via the databricks
    CLI when the cache is empty or near expiry. Thread-safe + cached."""
    global _cached_token, _minted_at
    endpoint = endpoint_path_from_env()
    if endpoint is None:
        raise RuntimeError(
            "Cannot mint a Lakebase credential: LAKEBASE_PROJECT_ID / "
            "LAKEBASE_BRANCH_ID are not set. The post-checkout hook sets them; "
            "otherwise provide DATABASE_URL explicitly."
        )
    with _lock:
        fresh_enough = (
            _cached_token is not None
            and (time.monotonic() - _minted_at) < _MINT_TTL_SECONDS
        )
        if fresh_enough and not force:
            return _cached_token
        raw = _run_databricks(
            ["postgres", "generate-database-credential", endpoint, "-o", "json"]
        )
        token = (json.loads(raw) or {}).get("token")
        if not token:
            raise RuntimeError(
                f"generate-database-credential returned no token for {endpoint}"
            )
        _cached_token = token
        _minted_at = time.monotonic()
        return token


def current_user() -> str:
    """The Lakebase user (email). Prefer the DB_USERNAME metadata; fall back to
    `databricks current-user me`."""
    user = os.getenv("DB_USERNAME")
    if user:
        return user
    raw = _run_databricks(["current-user", "me", "-o", "json"])
    me = json.loads(raw) or {}
    emails = me.get("emails") or []
    return me.get("userName") or (emails[0].get("value") if emails else "") or ""
