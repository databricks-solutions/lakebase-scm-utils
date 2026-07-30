# Changelog

All notable changes to `@databricks-solutions/lakebase-scm-utils` are documented here.

## 0.1.0-beta.11

- **`createProject` accepts a pre-existing EMPTY target directory on the
  `--no-github` path.** It previously refused any existing directory, so the
  common "I made the folder first, then ran create in it" case failed with
  `Directory already exists`. A pre-existing empty dir is now fine (mkdir is a
  no-op on it); only a non-empty directory is refused, with the clearer message
  `Directory already exists and is not empty`.
- **`tiers 2`/`3` with `--no-github` is now rejected up front, not after
  provisioning.** Cutting a long-running tier (staging/dev) pushes its git side
  to `origin`, so it requires a GitHub remote. The old behavior provisioned the
  whole tier-1 project and only then skipped the extra tiers with a post-hoc
  warning, leaving a silently under-provisioned project. The incompatible
  combination now fails in the cheap pure-input validation, before the auth
  probe or any provisioning, telling you to supply a `--github-owner` or pair
  `--no-github` with `--tiers 1`.
- Both checks move into a single `validateCreateInputs` preflight helper
  (with the github-owner requirement), so the validation lives in one place and
  is unit-tested hermetically.

## 0.1.0-beta.10

- **`lakebase-doctor` now covers the cold-start prerequisites.** Alongside the
  existing Databricks CLI version gate, the doctor version-checks Node.js 20+,
  Python 3.10+, JDK 17+, npm, and the GitHub CLI (present + authenticated), each
  emitting the same `{name,status,message,hint}` record. A wrong or missing
  prerequisite is now caught up front with a fix hint rather than failing later
  in the alembic / Flyway path or the plugin itself.
- **New `lakebase-enabled` probe.** The doctor now confirms the resolved
  workspace actually has Lakebase (database instances) enabled, rather than
  assuming it from a successful auth. A workspace without Lakebase turned on is
  the highest-consequence cold-start blocker; it now surfaces as a clear doctor
  finding instead of an opaque failure at first provisioning.
- **Fix: `--profile` is no longer threaded onto global CLI commands.** The CLI
  wrapper appended `--profile` to every invocation, which made `databricks
  --version` fail (the CLI parsed the profile as an unknown subcommand). That
  made the `databricks-cli` check report "not found" whenever a profile was set,
  cascading auth / identity / lakebase checks to skip. A new `noProfile` option
  suppresses the thread for profile-independent commands.

## 0.1.0-beta.9

- **Client scaffold now ships a working `.gitignore`.** npm strips a literal
  `.gitignore` from a packed tarball, so the React client template carried one in
  source that never reached an installed consumer; a scaffolded project therefore
  committed `client/node_modules/`, whose Vite/Vitest cache kept the tree
  perpetually dirty and made `scm-prepare-pr` refuse to open the promote PR. The
  template now ships the file as the npm-safe `.gitignore.base`, and
  `deployClientProject` renames it to `.gitignore` at scaffold time (the same
  pattern the base project's `deployGitignore` already uses).

## 0.1.0-beta.3

- Add the SFTDD-decoupled base project scaffolders `createProject` and
  `adoptLakebaseProject` (+ `assertAdoptionPreflight`, `_testMakeBrownfieldFixture`)
  to the `lakebase` barrel. The base scaffolders no longer depend on the SFTDD
  orchestration or its templates: the `.sftdd/` lay-down and sftdd-config seeding
  are supplied by injected hooks (`SftddSetupHooks` / `adoptSftddHook`), which the
  SFTDD kit provides. Omitting the hooks creates a plain SCM project. This lets
  the VS Code extension consume project creation from this package directly.

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
