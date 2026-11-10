"""SQLAlchemy database engine and session.

Connection credentials are minted at RUNTIME, never stored in .env: the engine
is built from connection METADATA (LAKEBASE_HOST, LAKEBASE_PROJECT_ID,
LAKEBASE_BRANCH_ID, DB_USERNAME) and a `do_connect` event injects a freshly
minted, short-lived Lakebase token as the password on every physical
connection. Pooled connections are recycled well under the token lifetime, so
a connection never carries an expired credential.

An explicit DATABASE_URL (a CI secret, Docker, or the ephemeral-verify DSN the
deploy substrate exports) OVERRIDES this and is used verbatim.
"""

import os
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app import lakebase_credentials

# Load .env from repo root so the connection metadata is available regardless of
# how the process is started (uvicorn directly, pytest, etc.). override=False
# means explicitly-set env vars (CI secrets, Docker --env) always win.
load_dotenv(Path(__file__).resolve().parents[1] / ".env", override=False)

DB_NAME = os.getenv("DB_NAME", "databricks_postgres")
# Recycle pooled connections well under the Lakebase token lifetime (~1h) so a
# pooled connection never presents an expired credential; do_connect re-mints
# a fresh token on each new physical connect.
_POOL_RECYCLE_SECONDS = 30 * 60

# App-runtime safety net: Postgres rolls back a connection left IDLE INSIDE A
# TRANSACTION for longer than this, releasing any locks it holds. Without it an
# aborted or orphaned app connection (e.g. a server killed mid-request, or a leaked
# process) can sit `idle in transaction` holding an AccessExclusiveLock forever, and
# a later schema operation (ALTER / DROP) blocks on it indefinitely. A web request's
# transaction is short, so 60s is far above normal and only ever fires on a wedged
# session. Overridable via LAKEBASE_APP_IDLE_TX_TIMEOUT (e.g. "0" to disable). It is
# NOT a statement timeout — an actively running migration statement is never cut.
_IDLE_TX_TIMEOUT = os.getenv("LAKEBASE_APP_IDLE_TX_TIMEOUT", "60s")


def _with_idle_timeout(kwargs: dict) -> dict:
    """Merge the idle-in-transaction timeout into connect_args.options. Skipped when the
    caller already set connect_args.options (migrations pass their own lock_timeout via
    alembic/env.py and own their connection-timeout policy) or when disabled with "0"."""
    ca = kwargs.get("connect_args") or {}
    if _IDLE_TX_TIMEOUT == "0" or ca.get("options"):
        return kwargs
    return {**kwargs, "connect_args": {**ca, "options": f"-c idle_in_transaction_session_timeout={_IDLE_TX_TIMEOUT}"}}


def _normalize_url(url: str) -> str:
    """The single door for every connection URL this app builds: force the psycopg
    driver + sslmode=require + a non-empty application_name.

    application_name is PRESERVED when the incoming URL already carries one , the
    consort-provided DATABASE_URL / ephemeral-verify DSN is labeled `consort/<version>`
    (or `scm-utils/<version>`), so a connection opened under a Consort operation stays
    identifiable in pg_stat_activity. A bare app URL (the app's own runtime-mint path)
    falls back to PGAPPNAME, else the app's DB name , so EVERY connection this app opens
    is labeled, never empty."""
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    if "sslmode" not in url:
        url += "?sslmode=require" if "?" not in url else "&sslmode=require"
    if "application_name" not in url:
        # Label reflecting WHO opened it: PGAPPNAME (the post-checkout hook writes the resolved
        # consort/<v> or scm-utils/<v> into .env) wins; else consort/<consort-version> when run
        # under a Consort drive; else scm-utils/unknown (a standalone app with no .env label).
        _cv = os.getenv("CONSORT_VERSION")
        app_name = os.getenv("PGAPPNAME") or (f"consort/{_cv}" if _cv else "scm-utils/{{LAKEBASE_SCM_UTILS_VERSION}}")
        url += ("?" if "?" not in url else "&") + "application_name=" + quote_plus(app_name)
    return url


def resolved_url() -> str:
    """A connection URL STRING for tools that want one (alembic offline mode +
    logging). Never contains a token: it is the explicit DATABASE_URL override,
    or the password-less metadata URL."""
    explicit = os.getenv("DATABASE_URL")
    if explicit:
        return _normalize_url(explicit)
    host = os.getenv("LAKEBASE_HOST") or os.getenv("DB_HOST") or "localhost"
    user = os.getenv("DB_USERNAME", "")
    userpart = f"{quote_plus(user)}@" if user else ""
    return _normalize_url(f"postgresql+psycopg://{userpart}{host}:5432/{DB_NAME}")


def make_engine(**kwargs) -> Engine:
    """Build the SQLAlchemy engine.

    Priority:
      1. Explicit DATABASE_URL (verbatim; CI / Docker / ephemeral-verify) , no minting.
      2. Metadata + runtime token minting (the default for a scaffolded project).
      3. Local fallback (localhost) for pure-local dev with no Lakebase metadata.
    """
    explicit = os.getenv("DATABASE_URL")
    if explicit:
        return create_engine(_normalize_url(explicit), pool_pre_ping=True, **_with_idle_timeout(kwargs))

    host = os.getenv("LAKEBASE_HOST") or os.getenv("DB_HOST")
    endpoint = lakebase_credentials.endpoint_path_from_env()
    if host and endpoint:
        user = os.getenv("DB_USERNAME") or lakebase_credentials.current_user()
        # Password-less URL; do_connect injects a freshly-minted token per connect.
        # Through _normalize_url so this runtime-mint connection is labeled too.
        url = _normalize_url(f"postgresql+psycopg://{quote_plus(user)}@{host}:5432/{DB_NAME}")
        engine = create_engine(
            url, pool_pre_ping=True, pool_recycle=_POOL_RECYCLE_SECONDS, **_with_idle_timeout(kwargs)
        )

        @event.listens_for(engine, "do_connect")
        def _inject_token(_dialect, _conn_rec, _cargs, cparams):
            cparams["password"] = lakebase_credentials.mint_token()

        return engine

    # Local fallback: no Lakebase metadata and no explicit URL.
    return create_engine(
        _normalize_url(f"postgresql+psycopg://{host or 'localhost'}:5432/{DB_NAME}"),
        pool_pre_ping=True,
        **_with_idle_timeout(kwargs),
    )


# Back-compat export: a connection URL string with NO token (see resolved_url).
DATABASE_URL = resolved_url()
engine = make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# The request-scoped session DEPENDENCY (`get_session`) lives in the repository layer,
# at `app/repositories/session.py` — NOT here. This module is pure infrastructure (engine,
# SessionLocal, Base); keeping the per-request session door out of it is what lets a
# service-backed feature's boundary stay off infrastructure (the layering contract). A route
# that needs a session depends on the session a SERVICE exposes (sourced from the repository
# layer), never `from app.database import ...` a session dependency.
