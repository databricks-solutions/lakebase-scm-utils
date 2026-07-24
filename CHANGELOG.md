# Changelog

All notable changes to `@databricks-solutions/lakebase-scm-utils` are documented here.

## 0.1.0-beta.2

- Export the health-check doctor (`doctor.ts`) from the `lakebase` barrel under
  the unambiguous alias `runHealthDoctor` (+ `HealthDoctorReport`). The plain
  `runDoctor` in the barrel is the SCM doctor; library consumers that need the
  health-check doctor (e.g. the MCP `lakebase_doctor` tool in
  lakebase-app-dev-kit) use the alias. Fills a gap surfaced re-pointing the kit.

## 0.1.0-beta.1

Initial extraction from `lakebase-app-dev-kit`. History for the moved paths is preserved
via `git filter-repo`.

- SCM workflow state machine + CLIs (`scm-claim-feature`, `scm-prepare-pr`, `scm-wait-ci`,
  `scm-merge`, `scm-doctor`, `scm-reconcile-tier`, `scm-recover-orphans`,
  `scm-abandon-feature`, `scm-adopt-state`, `scm-state`, `scm-feature-branch`).
- Branch + connection substrate (paired branches, convention/long-running branches,
  connection + credential minting, databricks CLI wrapper, profile resolution).
- Schema migration engine (alembic / knex / flyway runners + adapters, migration layout,
  schema diff, new-migration).
- Project scaffold + deploy primitives (scaffold, deploy targets/validate/rollback,
  UC resources, spring-initializr, runner setup, detect-language).
- Shared `git` / `github` / `util` layer.
- The `lakebase-scm-workflows` agent skill.
- `scm-doctor` core no longer imports the SFTDD stale-branch finder: the standalone
  `lakebase-scm-doctor` bin drops the stale-experiment/spike finding (an SFTDD concept);
  the SFTDD kit re-adds it via injection.
