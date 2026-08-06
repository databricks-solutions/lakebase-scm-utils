# Changelog

All notable changes to `@databricks-solutions/lakebase-scm-utils` are documented here.

## 0.1.2

Renames the injected setup-hook API to the Consort name, backwards-compatibly ,
the consort kit renamed its workflow surface to Consort and this lets it drop the
last external-contract naming exception. Every old name is retained, so existing
callers keep compiling and running unchanged.

- **`SftddSetupHooks` -> `ConsortSetupHooks`.** The old type name is kept as a
  structural alias (`type SftddSetupHooks = ConsortSetupHooks`).
- **`CreateProjectArgs.sftddHooks` -> `consortHooks`.** The old field is still
  read as a fallback (`consortHooks ?? sftddHooks`).
- **`AdoptLakebaseProjectArgs.adoptSftddHook` -> `adoptConsortHook`.** The old
  field is still read as a fallback.
- No behavior change; the base scaffolder is unchanged apart from the hook names.

## 0.1.1

Upgrades the React client scaffold so a fresh project ships with a design-system
vocabulary to apply, an app-icon slot, and a reachable + styled example page ,
the pattern consort's UX gate (`lakebase-sftdd-ux-clean`) checks for, so a build
no longer hand-rolls bare, unreachable feature pages.

- **`global.css` component vocabulary.** New shared classes built entirely from
  `var(--token)`: `page`/`card`/`btn`/`field`/`table`/`badge`/`empty-state`/
  `toast`/`navbar`. Every feature page composes these instead of raw HTML.
- **Fuller `theme.css` token set.** The navy scale, semantic light-pill colors,
  the type scale, the 4px spacing scale, radius (incl the sharp-0 primary CTA),
  and navy-tinted shadows the vocabulary needs.
- **App-icon slot.** `public/favicon.svg` (a generic brandable Databricks spark
  mark), wired into `index.html` and shown in the navbar / page titles.
- **Reachable, styled example page.** `pages/AboutPage.tsx` is routed in
  `App.tsx` and linked from a navbar affordance, and `tests/e2e/about.spec.ts`
  navigates the real app to it , the reachable + styled + navigated pattern to
  model feature pages on (a bare, unrouted page is what the UX gate flags).
- `STYLE_GUIDE.md` documents the vocabulary + the icon slot.

## 0.1.0

First stable (graduated from the `0.1.0-beta` line). Ships a fail-fast fix for
expired Databricks authentication, so a dead OAuth session surfaces immediately
with the `databricks auth login` remediation instead of degrading into a
credential-mint hang.

- **Auth preflight now exercises the REFRESH token.** `checkDatabricksAuth`
  (create preflight) and the health doctor's `databricks-auth` check now run
  `databricks auth token --force-refresh` instead of `current-user me` /
  `auth describe`. Those older probes are served from the CACHED access token,
  so they reported "authenticated" even when the refresh token was expired,
  then credential minting (which needs a fresh token exchange) failed much later
  inside the app/tests and degraded into a connection hang. Forcing a refresh
  here fails up front with a clear reason.
- **The scaffolded Python app fails fast on an expired session instead of
  hanging.** `app/lakebase_credentials.py` now raises a distinct, non-retryable
  `DatabricksAuthExpired` (naming `databricks auth login`) when
  `generate-database-credential` reports an invalid refresh token, rather than
  letting a raw `CalledProcessError` bubble into the SQLAlchemy `do_connect`
  pool, where it retried and hung.

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
