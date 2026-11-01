"""Per-test RETRIEVED/STORED row capture (dev/test/CI only) for the Consort dashboard.

The dashboard's per-test table view wants the rows each TEST actually touched — not the whole table.
Every test (pytest / Playwright / Vitest component) exercises the DB THROUGH this app over `/api`, so
this app is the one place that sees every query. Each test tags its requests with an
`X-Consort-Test-Id: T<id>` header; a middleware stashes that id in a contextvar for the request, and
two SQLAlchemy events record the rows that request touched, keyed by the test id:

  * RETRIEVED  — the ORM `load` event fires as each row is materialized into a mapped instance
                 (covers every `select(Model)` read path).
  * STORED     — the `after_cursor_execute` event fires for INSERT/UPDATE/DELETE; the written values
                 live in the statement's bound parameters (the app writes via `insert(...).returning()`
                 executed as a statement, which `after_flush`/unit-of-work would NOT see).

Each touched row is appended to `.consort/test-interactions.jsonl` as
`{ts, test_id, table, op: "read"|"write", row}`. Guarded by the PRESENCE of a `.consort/` dir (dev/
test/CI checkout, not a packaged prod app) exactly like the snapshot route — so this is simply absent
in a real deploy. Everything is wrapped so a capture write can NEVER fail a request.
"""

from __future__ import annotations

import contextvars
import json
import os
import re
import threading
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase

# The current request's test id (from the X-Consort-Test-Id header), and the per-request buffer of
# touched rows. ContextVars propagate into Starlette's sync-endpoint threadpool, so the SQLAlchemy
# events (which fire on the DB call within the handler) see the id the middleware set.
_TEST_ID: contextvars.ContextVar[str | None] = contextvars.ContextVar("consort_test_id", default=None)
_BUFFER: contextvars.ContextVar[list[dict[str, Any]] | None] = contextvars.ContextVar("consort_buffer", default=None)

_WRITE_LOCK = threading.Lock()
_ROWS_CAP = 200  # per (test, table, op) within one request — keep the log bounded
_DML = re.compile(r"^\s*(INSERT|UPDATE|DELETE)\b", re.IGNORECASE)
_TABLE = re.compile(r'(?:INTO|UPDATE|FROM)\s+"?([A-Za-z_][A-Za-z0-9_]*)"?', re.IGNORECASE)


def _jsonable(v: Any) -> Any:
    if isinstance(v, datetime):
        return v.isoformat()
    try:
        json.dumps(v)
        return v
    except (TypeError, ValueError):
        return str(v)


def _record(table: str, op: str, row: dict[str, Any]) -> None:
    """Append a touched row to the current request's buffer (no-op outside a tagged request)."""
    buf = _BUFFER.get()
    if buf is None:
        return
    # Bound the buffer per (table, op) so a big list read can't explode the log.
    n = sum(1 for e in buf if e["table"] == table and e["op"] == op)
    if n >= _ROWS_CAP:
        return
    buf.append({"table": table, "op": op, "row": {k: _jsonable(v) for k, v in row.items()}})


def _consort_scope(consort_dir: str) -> tuple[str | None, str | None]:
    """Best-effort (feature_id, story_id) to STAMP each capture line so the dashboard can scope
    reads/writes per feature (test ids repeat across features — e.g. F1 and F2 both have a T40, so an
    unstamped log commingles their reads). The app sees only the test id (from the header), not the
    test FILE, so it scopes by the CURRENTLY-driven feature (`.consort/next.json` `feature`, the same
    active-feature signal the reporter's owner-resolution uses) and that feature's active story
    (`features/<f>/pipeline.json` `build_active` — null during a whole-feature deploy, which the reader
    treats as "any story of this feature"). Never raises."""
    feature_id: str | None = None
    story_id: str | None = None
    try:
        with open(os.path.join(consort_dir, "next.json"), encoding="utf-8") as fh:
            feat = json.load(fh).get("feature")
            feature_id = feat if isinstance(feat, str) and feat else None
    except (OSError, ValueError):
        pass
    if feature_id:
        try:
            with open(os.path.join(consort_dir, "features", feature_id, "pipeline.json"), encoding="utf-8") as fh:
                active = json.load(fh).get("build_active")
                story_id = active if isinstance(active, str) and active else None
        except (OSError, ValueError):
            pass
    return feature_id, story_id


def _flush(path: str, test_id: str, buf: list[dict[str, Any]], feature_id: str | None, story_id: str | None) -> None:
    if not buf:
        return
    ts = datetime.now(timezone.utc).isoformat()

    def _line(e: dict[str, Any]) -> str:
        rec: dict[str, Any] = {"ts": ts, "test_id": test_id, "table": e["table"], "op": e["op"], "row": e["row"]}
        # Stamp feature/story so the dashboard scopes per feature; omit when unknown (reader keeps
        # unstamped lines by test id for back-compat with older corpora).
        if feature_id:
            rec["feature_id"] = feature_id
        if story_id:
            rec["story_id"] = story_id
        return json.dumps(rec) + "\n"

    lines = "".join(_line(e) for e in buf)
    try:
        with _WRITE_LOCK:
            with open(path, "a", encoding="utf-8") as fh:
                fh.write(lines)
    except OSError:
        pass  # best-effort: a capture write must never fail a request


def install(app: Any, engine: Engine, base: type[DeclarativeBase]) -> None:
    """Wire the middleware + SQLAlchemy events. No-op unless a `.consort/` dir is present."""
    project_root = os.path.join(os.path.dirname(__file__), os.pardir)
    consort_dir = os.path.join(project_root, ".consort")
    if not os.path.isdir(consort_dir):
        return
    interactions_path = os.path.join(consort_dir, "test-interactions.jsonl")

    @app.middleware("http")
    async def _consort_tag_request(request: Any, call_next: Any) -> Any:
        test_id = request.headers.get("x-consort-test-id")
        id_token = _TEST_ID.set(test_id)
        buf_token = _BUFFER.set([] if test_id else None)
        try:
            return await call_next(request)
        finally:
            buf = _BUFFER.get()
            if test_id and buf:
                feature_id, story_id = _consort_scope(consort_dir)
                _flush(interactions_path, test_id, buf, feature_id, story_id)
            _BUFFER.reset(buf_token)
            _TEST_ID.reset(id_token)

    @event.listens_for(base, "load", propagate=True)
    def _consort_on_load(target: Any, _context: Any) -> None:  # RETRIEVED
        if _TEST_ID.get() is None:
            return
        try:
            table = target.__tablename__
            row = {c.key: getattr(target, c.key) for c in target.__table__.columns}
            _record(table, "read", row)
        except Exception:  # noqa: BLE001 — capture must never break a load
            pass

    @event.listens_for(engine, "after_cursor_execute")
    def _consort_on_execute(_conn, _cursor, statement, parameters, _context, _executemany) -> None:  # STORED
        if _TEST_ID.get() is None or not statement or not _DML.match(statement):
            return
        try:
            m = _TABLE.search(statement)
            table = m.group(1) if m else "?"
            params_list = parameters if isinstance(parameters, (list, tuple)) else [parameters]
            for p in params_list:
                if isinstance(p, dict) and p:
                    _record(table, "write", dict(p))
        except Exception:  # noqa: BLE001
            pass
