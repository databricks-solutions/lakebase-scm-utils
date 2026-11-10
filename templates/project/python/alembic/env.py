"""Alembic environment configuration. Reads DATABASE_URL from environment."""

import os
import sys
from pathlib import Path

# Ensure project root is on sys.path so 'from app.database import ...' works
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from logging.config import fileConfig
from alembic import context
from sqlalchemy import pool
from app.database import Base, make_engine, resolved_url

# Register all model classes with SQLAlchemy's declarative metadata so
# alembic's autogenerate sees the full schema. Without this side-effect
# import, Base.metadata is empty and `alembic revision --autogenerate`
# produces an empty diff (silent failure mode that every user hits on
# their first migration).
import app.models  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
# resolved_url() is token-FREE (the app mints its Lakebase credential at
# runtime); it is used for offline mode + logging only. Escape literal '%' as
# '%%' before config.set_main_option: alembic stores it in a configparser
# section whose BasicInterpolation treats '%' as a substitution token, and
# Lakebase URLs URL-encode the user's email '@' as '%40'. SQLAlchemy unescapes
# the doubled percents when it parses the URL.
config.set_main_option("sqlalchemy.url", resolved_url().replace("%", "%%"))


def run_migrations_offline():
    context.configure(url=resolved_url(), target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    # make_engine wires the do_connect token-minting event (the online path
    # actually connects, so it needs a live credential); NullPool keeps each
    # migration invocation short-lived.
    #
    # lock_timeout (migration connections ONLY, not the app runtime engine): a schema
    # migration's DDL (ALTER TABLE / ADD/DROP COLUMN) needs an ACCESS EXCLUSIVE lock. If
    # another connection holds a conflicting lock when the DDL fires, the ALTER blocks
    # indefinitely — during feature-verify that hangs the whole suite to the 15-min SIGTERM
    # with no clue which statement stalled. Cap the wait: a blocked DDL now fails fast (~30s)
    # with a labeled `canceling statement due to lock timeout` naming the migration, instead
    # of a silent hang. Overridable via LAKEBASE_MIGRATION_LOCK_TIMEOUT (e.g. "0" to disable).
    lock_timeout = os.getenv("LAKEBASE_MIGRATION_LOCK_TIMEOUT", "30s")
    connectable = make_engine(
        poolclass=pool.NullPool,
        connect_args={"options": f"-c lock_timeout={lock_timeout}"},
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
