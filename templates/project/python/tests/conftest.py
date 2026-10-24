"""Shared fixtures for tests against the real Lakebase database."""

import pytest
from fastapi.testclient import TestClient

from app.database import SessionLocal  # .env already loaded by app.database
from app.main import app


@pytest.fixture()
def client(request):
    """FastAPI TestClient for making HTTP requests.

    Tagged with the test's ``@pytest.mark.testid`` via the ``X-Consort-Test-Id`` header, so the
    backend's per-test capture (``app/consort_capture.py``) attributes the rows each request
    RETRIEVES/STORES to this test — exactly as the Vitest fetch shim and the Playwright fixture do.
    (Direct ``db_session`` setup/asserts bypass the app and are not captured, by design: the capture
    is what the test did THROUGH the app's ``/api``.)"""
    c = TestClient(app)
    test_id = _consort_testid(request.node)
    if test_id:
        c.headers["X-Consort-Test-Id"] = test_id
    return c


@pytest.fixture()
def db_session():
    """Raw SQLAlchemy session for test setup / assertions."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def _restore_migration_head_after_each_test(request):
    """Within-run test isolation for migration up/down fixtures.

    Some tests drive Alembic up/down against the shared verify database (a
    contract/cleanup story DROPS a column; a backfill story seeds rows then
    `upgrade head`). Run sequentially against ONE database, those fixtures can
    leave it half-migrated , or, if a downgrade overshoots, below a table a later
    test needs , so the next test fails with `relation ... does not exist`. This
    teardown brings the DB back to `head` after a schema-mutating test.

    SCOPED to ``@pytest.mark.migration`` tests only (perf): ONLY a migration test
    downgrades/alters the schema , and the ``migration-marker-presence`` smell
    GUARANTEES every schema-mutating test carries that marker , so a NON-migration
    test cannot have changed the schema and needs no restore. Restoring after every
    test ran a full alembic env-load + DB round-trip (~1-2s) after each of the many
    non-migration tests to 'restore' a schema they never touched , the dominant cost
    of the non-migration pass. Skipping it there is safe by construction."""
    yield
    if request.node.get_closest_marker("migration") is None:
        return  # a non-migration test cannot have altered the schema (marker smell enforces it)
    try:
        from pathlib import Path

        from alembic import command
        from alembic.config import Config
        from alembic.util.exc import CommandError
        from sqlalchemy.exc import OperationalError

        ini = str(Path(__file__).resolve().parent.parent / "alembic.ini")
        command.upgrade(Config(ini), "head")
    except (CommandError, OperationalError) as exc:
        # Best-effort isolation, but never SILENT and never an umbrella swallow:
        # surface a restore failure instead of hiding it (a broken migration must
        # be visible, not masked as routine teardown noise). CommandError wraps
        # alembic's own failures; OperationalError covers DBAPI/connection errors.
        # Everything else (a real schema error) propagates and fails loudly, which
        # is the correct behavior for a genuinely broken restore.
        print(f"WARNING: migration-head restore failed during teardown: {exc}")


# --- Per-test "green as it runs" signal for the dashboard -------------------------------------
# Each test tagged `@pytest.mark.testid("T37")` streams its lifecycle to `.consort/test-run.jsonl`:
# `running` when it STARTS (pytest_runtest_setup), then `green`/`red`/`skipped` when it FINISHES
# (pytest_runtest_makereport, the CALL phase). A dashboard tails that file and lights each bubble
# the moment it changes, so even a single whole-suite run (story cadence) shows per-test progress —
# pending -> running -> green — not an all-at-once batch flip. The `file` disambiguates a reused id
# across features (F1 and F2 may both have a T37); the reader keys by (scenario_file + id) and takes
# the LAST write per key, so running -> green composes. Observability only.


def _consort_testid(item):
    """The test's ``@pytest.mark.testid(...)`` id, or ``None`` when it carries no marker."""
    return next((m.args[0] for m in item.iter_markers("testid") if m.args), None)


def _consort_emit_test_run(test_id, status, item):
    """Append one per-test line to ``.consort/test-run.jsonl``. Best-effort with a SCOPED except
    (the only errors this body can raise: file I/O, JSON serialization) — never a blanket
    ``except Exception``, which the kit's deterministic broad-integrity-except test-smell gate
    correctly flags even in a conftest. A reporter write must never break the suite."""
    try:
        import json
        from datetime import datetime, timezone
        from pathlib import Path

        root = Path(__file__).resolve().parent.parent
        rel = str(Path(str(item.fspath))).replace(f"{root}/", "")
        out = root / ".consort"
        out.mkdir(parents=True, exist_ok=True)
        ts = datetime.now(timezone.utc).isoformat()
        line = json.dumps(
            {"ts": ts, "test_id": test_id, "status": status, "file": rel, "kind": "behavior"}
        )
        with open(out / "test-run.jsonl", "a", encoding="utf-8") as fh:
            fh.write(line + "\n")
        # RECORD a durable per-test test.result into the agent-log AT RUN TIME (mirrors the TS reporter
        # in consort-capture.ts) so the dashboard lights each behavior test the moment it runs, scrubbing
        # lights it at its real run position, and a replay of the recording does the same.
        _consort_record_test_result(out, test_id, status, rel, ts)
    except (OSError, ValueError, TypeError):
        pass


def _consort_test_owner(consort_dir, test_id, file_rel):
    """Resolve (feature_id, story_id, ac_id) for a test id from the per-story test-lists — the
    attribution the reporter lacks (it sees only id + file). Ids are unique only WITHIN a story, so a
    reused id has several owners: (1) the owner whose scenario_file basename matches ``file_rel`` (a
    client/e2e spec pins ITSELF); then (2) the owner in the feature currently on the build lane
    (``next.json``) — a fitness/behavior test carries no scenario_file, so during THIS feature's build
    its reused id belongs to the active feature (a sibling feature's same-id test already resolved via
    (1)). Else None (skip, never mis-key). Mirrors consort-capture.ts resolveOwner. Scoped, best-effort."""
    try:
        import glob
        import json
        import os
        import re

        m = re.match(r"^(T\d+)", test_id or "")
        base = m.group(1) if m else test_id
        owners = []  # (feature, story, ac, scenario_file)
        for p in glob.glob(os.path.join(str(consort_dir), "features", "*", "stories", "*", "test-list-per-story.json")):
            try:
                with open(p, encoding="utf-8") as fh:
                    o = json.load(fh)
            except (OSError, ValueError):
                continue
            feat, story = o.get("feature_id"), o.get("story_id")
            for it in o.get("items", []):
                if it.get("id") in (test_id, base):
                    owners.append((feat, story, it.get("ac_id") or "unknown", it.get("scenario_file")))
        if not owners:
            return None
        if len(owners) == 1:
            return owners[0][:3]
        # (1) the owner whose scenario_file matches the running file (unique match)
        fb = os.path.basename(file_rel or "")
        by_file = [o for o in owners if o[3] and os.path.basename(o[3]) == fb]
        if len(by_file) == 1:
            return by_file[0][:3]
        # (2) fall back to the owner in the currently-building feature (one match only)
        try:
            with open(os.path.join(str(consort_dir), "next.json"), encoding="utf-8") as fh:
                active = json.load(fh).get("feature")
        except (OSError, ValueError):
            active = None
        if active:
            by_feat = [o for o in owners if o[0] == active]
            if len(by_feat) == 1:
                return by_feat[0][:3]
        return None
    except (OSError, ValueError, TypeError):
        return None


def _consort_record_test_result(out, test_id, status, file_rel, ts):
    """Append a schema-shaped ``test.result`` to ``.consort/agent-log.jsonl`` (+ the corpus mirror when
    a recording is in flight), identical in shape to the kit's emitAgentLogEvent output so the dashboard
    fold reads it the same. Only for an attributable test; scoped except, never breaks the suite."""
    try:
        import json
        import os

        owner = _consort_test_owner(out, test_id, file_rel)
        if not owner:
            return
        feat, story, ac = owner
        line = json.dumps(
            {
                "timestamp": ts,
                "level": "info",
                "role": "driver",
                "event": "test.result",
                "message": f"TEST {test_id} {status}",
                "metadata": {"feature_id": feat, "test_id": test_id, "status": status, "story_id": story, "ac_id": ac},
            }
        )
        with open(os.path.join(str(out), "agent-log.jsonl"), "a", encoding="utf-8") as fh:
            fh.write(line + "\n")
        rec = (os.environ.get("LAKEBASE_CONSORT_RECORD_DIR") or "").strip()
        if rec:
            os.makedirs(rec, exist_ok=True)
            with open(os.path.join(rec, "agent-log.jsonl"), "a", encoding="utf-8") as fh:
                fh.write(line + "\n")
    except (OSError, ValueError, TypeError):
        pass


def _consort_capture_tables(test_id, item):
    """Append a per-test TABLE snapshot to ``.consort/table-snapshots.jsonl``, keyed by test id: the
    rows of each public app table AS THIS TEST LEFT THEM, captured on the CALL phase (before teardown
    prunes). The dashboard shows the table 'as of' the running/selected test — same corpus/one-reader
    path as the test-status view. Read-only + row-capped. A ``@migration`` test runs on its OWN
    isolated ephemeral branch and drops/recreates the table, so its snapshot is flagged ``isolated``.
    Best-effort with a SCOPED except (DB errors + file I/O + JSON) — never a blanket catch, never
    breaks the suite."""
    try:
        import json
        import re
        from datetime import datetime, timezone
        from pathlib import Path

        from sqlalchemy import text
        from sqlalchemy.exc import SQLAlchemyError

        from app.database import engine

        isolated = any(True for _ in item.iter_markers("migration"))
        ident = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
        root = Path(__file__).resolve().parent.parent
        rel = str(Path(str(item.fspath))).replace(f"{root}/", "")
        out = root / ".consort"
        out.mkdir(parents=True, exist_ok=True)
        ts = datetime.now(timezone.utc).isoformat()
        lines = []
        try:
            with engine.connect() as conn:
                names = [
                    r[0]
                    for r in conn.execute(
                        text(
                            "select tablename from pg_tables where schemaname='public' "
                            "and tablename <> 'alembic_version' order by 1"
                        )
                    )
                ]
                for name in names:
                    if not ident.fullmatch(name):
                        continue
                    rows = [dict(r) for r in conn.execute(text(f'SELECT * FROM "{name}" ORDER BY 1 DESC LIMIT 50')).mappings()]
                    total = conn.execute(text(f'SELECT count(*) FROM "{name}"')).scalar()
                    lines.append(
                        json.dumps(
                            {"ts": ts, "test_id": test_id, "file": rel, "table": name, "rows": rows, "row_count": total, "isolated": isolated},
                            default=str,
                        )
                    )
        except SQLAlchemyError:
            return  # branch unreachable / mid-migration — skip this snapshot, never fail the test
        if lines:
            with open(out / "table-snapshots.jsonl", "a", encoding="utf-8") as fh:
                fh.write("\n".join(lines) + "\n")
    except (OSError, ValueError, TypeError):
        pass


def pytest_collection_modifyitems(config, items):
    """Build-lane SCOPE (per-cycle waste elimination): when ``SFTDD_TEST_IDS`` is set (a space/comma
    list of test ids), run ONLY the tests whose ``@pytest.mark.testid`` is in that set and DESELECT the
    rest. The build's per-cycle GREEN verify sets it to the CURRENT STORY's ids, so a cycle re-runs
    only its own story instead of every feature's suite (intra-story regressions still caught); the
    story-close REFACTOR + feature-deploy gates leave it UNSET and run the FULL cross-story suite (that
    is where a cross-story regression is caught, before merge). UNTAGGED items (no testid — shared
    fixtures / infra) are always KEPT, never deselected. Unset/empty => no-op (full collection)."""
    import os
    import re

    raw = (os.environ.get("SFTDD_TEST_IDS") or "").strip()
    if not raw:
        return
    wanted = {t for t in re.split(r"[,\s]+", raw) if t}
    if not wanted:
        return
    selected, deselected = [], []
    for item in items:
        tid = _consort_testid(item)
        (selected if (tid is None or tid in wanted) else deselected).append(item)
    if deselected:
        config.hook.pytest_deselected(items=deselected)
        items[:] = selected


def pytest_runtest_setup(item):
    """Emit ``running`` the moment a tagged test starts, so the dashboard shows it in-flight."""
    test_id = _consort_testid(item)
    if test_id:
        _consort_emit_test_run(test_id, "running", item)


@pytest.hookimpl(wrapper=True)
def pytest_runtest_makereport(item, call):
    """Emit the FINAL status on the CALL phase, and capture the per-test table snapshot (before
    teardown prunes). A ``makereport`` wrapper (NOT the ``logreport`` hook, whose ``TestReport``
    carries no test node) so the ``testid`` marker is reachable off ``item``; always returns the
    real report unchanged so pytest's own reporting is untouched."""
    report = yield
    if report.when == "call":
        test_id = _consort_testid(item)
        if test_id:
            status = "green" if report.passed else "red" if report.failed else "skipped"
            _consort_emit_test_run(test_id, status, item)
            _consort_capture_tables(test_id, item)
    return report
