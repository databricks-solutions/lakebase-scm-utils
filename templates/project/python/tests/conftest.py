"""Shared fixtures for tests against the real Lakebase database."""

import pytest
from fastapi.testclient import TestClient

from app.database import SessionLocal  # .env already loaded by app.database
from app.main import app


@pytest.fixture()
def client():
    """FastAPI TestClient for making HTTP requests."""
    return TestClient(app)


@pytest.fixture()
def db_session():
    """Raw SQLAlchemy session for test setup / assertions."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def _restore_migration_head_after_each_test():
    """Within-run test isolation for migration up/down fixtures.

    Some tests drive Alembic up/down against the shared verify database (a
    contract/cleanup story DROPS a column; a backfill story seeds rows then
    `upgrade head`). Run sequentially against ONE database, those fixtures can
    leave it half-migrated , or, if a downgrade overshoots, below a table a later
    test needs , so the next test fails with `relation ... does not exist`. This
    autouse teardown brings the DB back to `head` after EVERY test, so each test
    starts from the fully-migrated schema regardless of what the previous one did.
    """
    yield
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
