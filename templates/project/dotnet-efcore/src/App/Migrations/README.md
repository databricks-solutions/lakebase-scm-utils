# EF Core migrations

Create a migration with the kit's tool-agnostic command (run in the project
root):

```bash
./scripts/lk lakebase-new-migration --name "<description>"
```

This runs `dotnet ef migrations add`, which generates the migration from the
difference between your `AppDbContext` model and the last snapshot. Review the
generated `Up()` / `Down()` before committing. You can also run
`dotnet ef migrations add <Name> --project src/App` directly.

EF Core names migrations `<UTC timestamp>_<Name>.cs`, so sibling feature
branches never collide on an id. Commit the migration, its `.Designer.cs`, and
the updated `AppDbContextModelSnapshot.cs` together.

You do not run migrations by hand: the kit applies them to each paired Lakebase
branch through CI (`pr.yml` on the feature branch, `merge.yml` on staging /
production) via `lakebase-schema-migrate`, which passes the branch connection to
`dotnet ef` in `DATABASE_URL` (read by `Data/DesignTimeDbContextFactory.cs`).
To migrate your paired branch locally, run `./scripts/flyway-migrate.sh`.
