# Flyway migrations

Create a migration with the kit's tool-agnostic command (run in the project
root):

```bash
./scripts/lk lakebase-new-migration --name "<description>"
```

This writes a timestamp-versioned skeleton (`V<timestamp>__<slug>.sql`, a UTC
`YYYYMMDDHHMMSS` version); then author the DDL/DML. Timestamps are globally
unique and sort chronologically, so sibling feature branches never collide on a
version. Flyway runs with `-baselineOnMigrate=true -baselineVersion=0`, so every
`V<n>` file is applied as a pending migration.

Flyway owns the schema; EF Core is used only as the runtime ORM. Keep your
`AppDbContext` model in step with the SQL here, and do not add EF Core
migrations to this project.

You do not run migrations by hand: the kit applies them to each paired Lakebase
branch through CI (`pr.yml` on the feature branch, `merge.yml` on staging /
production) via `lakebase-schema-migrate`. To migrate your paired branch
locally, run `./scripts/flyway-migrate.sh`.
