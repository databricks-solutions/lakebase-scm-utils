# Changelog

All notable changes to `@databricks-solutions/lakebase-scm-utils` are documented here.

## 0.2.18

Complete the migrate-before-serve e2e fix: pin the served DB into the Playwright webServer env.

- **fix(e2e): forward `DATABASE_URL` (and `VERIFY_DATABASE_URL`) into the scaffolded Playwright backend `webServer` env.** v0.2.17 made the backend `webServer` run `alembic upgrade head && uvicorn …` (migrate-before-serve, no reuse), but the `webServer` command does NOT inherit the shell's `DATABASE_URL`, so `alembic` could migrate a different database than `uvicorn` served , leaving the served schema missing a story's new table (the reconcile 500). `client/playwright.config.ts` (and the `client-reference`) now forward `DATABASE_URL` and `VERIFY_DATABASE_URL` into that `env` when set, so the migrate step and the served app resolve the SAME DB (run-tests.sh exports the ephemeral `VERIFY_DATABASE_URL` when the substrate provides an isolated child, else the branch DB). Only forwarded when set, to keep the env clean. Test: `scaffold-client.test.ts` (+1 guard asserting both keys are forwarded).

## 0.2.17

Two connection/e2e-harness fixes.

- **fix(connection): the `application_name` label now reaches the POOLED path too (`PGAPPNAME`).** v0.2.16 stamped `application_name` on the two direct `pg.Client` sites, but the PRIMARY path , `createLakebasePool` (used by `schema-diff`, `reconcile-tier`) , came back with an EMPTY `application_name`: `createLakebasePool` builds its own pg config and drops a passed `application_name` (accepted by the type since `LakebasePoolConfig extends PoolConfig`, but ignored at runtime). node-postgres honors the `PGAPPNAME` env as the connection's `application_name` and `createLakebasePool` doesn't override it, so `getConnection`'s pool branch now sets `process.env.PGAPPNAME = connectionApplicationName()` before creating the pool. Live-verified: the pooled connection lands in `pg_stat_activity` as `consort/<version>` (under a Consort run) / `scm-utils/<version>` (direct).
- **fix(e2e): the scaffolded Playwright backend migrates before serving + never reuses a stale server.** `client/playwright.config.ts` (and the `client-reference`) started the backend with plain `uvicorn` and `reuseExistingServer: !process.env.CI`. Locally that reused a uvicorn started BEFORE a later story's migration , GET hit the old table (ok), a write to the new table 500'd , and the reuse skipped any migration step. The backend `webServer` now runs `alembic upgrade head && uvicorn …` with `reuseExistingServer: false`, so every e2e run gets a fresh, migrated backend against the current schema. The frontend keeps reuse (no schema). Test: `scaffold-client.test.ts` (+1 guard).

## 0.2.16

Stamp a transparent `application_name` on the substrate's Postgres connections.

- **feat(connection): set `application_name` on the pg connections this package opens , `consort/<version>`
  under a Consort run, `scm-utils/<version>` when used directly.** A transparent connection label
  (standard practice; visible to the database OWNER in their own `pg_stat_activity`) that identifies
  which tool connected and which build, reading no table contents. New `connectionApplicationName()`
  (get-connection.ts) resolves the label: it reads the `CONSORT_VERSION` env (which Consort exports from
  its own version) and returns `consort/<that>`; with no env , the VS Code extension or a bare `lakebase-*`
  CLI , it falls back to this package's own brand + SemVer via a new leaf `self-version.ts`
  (`substrateSelfVersion()`, a dist-safe package.json read that never throws). Applied at both direct
  `pg.Client` sites (get-connection ping, branch-schema diff). Brands + the env-var contract are named
  constants in `constants.ts`. Never breaks a connection (an unresolved version → `scm-utils/unknown`;
  a blank env is ignored) and stays within Postgres's 63-byte `application_name` limit. Test:
  `application-name.test.ts` (5).

## 0.2.15

Doctor enforces the documented Python **3.10** floor (was major-only).

- **fix(doctor): the prereq check now gates on the minor version, so a 3.9 interpreter no longer
  reports `[doctor] environment ok`.** The `python` prereq was `minMajor: 3`, which can only express
  "some Python 3", so macOS's system `python3` (3.9.6) passed the doctor while the hint promised
  3.10+ , observed directly: `lakebase-create-project` printed `[doctor] environment ok` on a 3.9.6
  machine. `parseVersion` already extracts `{major, minor}`, so the minor was parsed but never
  compared. Added an optional `minMinor` field to `PrereqSpec` (the floor becomes `minMajor.minMinor`
  when set) and set the python prereq to `minMajor: 3, minMinor: 10`; `checkPrereq` now warns when the
  major matches but the minor is short, and the messages read `3.10+`. Only `python` sets a minor
  floor; the other prereqs keep their major-line floors unchanged. Pairs with the consort `bootstrap.sh`
  fix for the same class (a present-but-below-floor tool reporting green). Test: `doctor-prereqs.test.ts`
  (+1, plus the previously-silent 3.9 case now asserted).

## 0.2.12

Toolkit-install liveness (scaffolded `lk`).

- **fix(lk): heartbeat during the toolkit install so a backgrounded `--refresh` shows
  progress.** `install_pkg` printed one "Downloading…" line then ran `npm install >&2`;
  npm's progress bar is suppressed when stderr is not a TTY (exactly a backgrounded
  `--refresh` whose output is a redirected log), so the log sat silent for the whole
  1-2 min install and looked hung. `install_pkg` now runs npm in the background and
  prints an elapsed-time line every 15s until it exits, so a tailing relay shows
  liveness regardless of TTY. + a scaffold-output-contract guard.

## 0.2.11

Deploy pre-serve migrate + gitignore hygiene (scaffold templates).

- **fix(deploy): the `local` deploy target now ships a `migrate:` command.** `deploy.ts`'s
  pre-serve forward-migrate is gated on `cfg.migrate`; the scaffold's `deploy-targets.yaml`
  (the source scaffolded into projects) had no `migrate:` entry, so the gate served the
  experiment branch UNMIGRATED , DB-backed routes 500'd with `relation "..." does not exist`
  even though honest-GREEN verify (which migrates a disposable child) passed. The v0.3.8 fix
  had landed only in the consort copy of the template, not this scaffold source. Added
  `migrate: ./scripts/flyway-migrate.sh` (language-dispatches: Python→alembic, Node→knex,
  Java→flyway) + a `scaffold-output-contract` guard so it can't drift again.
- **chore(gitignore): exclude transient `.consort/drive-live.log` + `.consort/diagnostics/`.**
  The backgrounded drive's live log and the `consort-diagnose` bundles are per-run artifacts;
  a stray `git add -A` from a build commit must not carry them into history. Guarded.

## 0.2.10

Scaffold fix: `run-tests.sh` no longer reports a hollow pass when client tests can't run.

- **fix(run-tests): fail fast when client test files exist but there is no `client/package.json`.**
  The client Vitest block runs only when `client/package.json` exists, so a project scaffolded with
  no client SPA (`uiTrack`/`clientFramework=none`) whose design still authored client-owned ACs , the
  agents wrote a home-screen `*.test.tsx` / e2e `*.spec.ts` against a client that was never built ,
  had its entire client suite SILENTLY SKIPPED, greening every client-owned AC with ZERO coverage (a
  false GREEN that surfaces, if ever, only as "the home screen doesn't exist" at the acceptance gate).
  `run-tests.sh` now detects, on the authoritative full run, client test files present under `client/`
  with no `client/package.json` to run them and EXITS NON-ZERO with a loud diagnosis, before any
  backend/migration work. A genuinely backend-only project authors no client tests, so it never trips.
  Covered by `tests/bdd/run-tests-client-only.test.ts`.

## 0.2.9

Makes the `@databricks/*` bundling FORMAT-SPECIFIC , fixes the ESM regression 0.2.8 introduced.

- **fix(esm): keep `@databricks/*` EXTERNAL in the ESM build; bundle it in CJS only.**
  0.2.8 added `@databricks/*` to a single `noExternal` that applied to BOTH formats. That
  fixed the CJS/extension host (ESM-only `@databricks/lakebase` is now inlined + require-able)
  but BROKE the ESM build: esbuild inlined `@databricks/lakebase` -> `@databricks/sdk-experimental`,
  whose runtime `require("https")` (a Node built-in) became a `__require` shim that throws
  `Dynamic require of "https" is not supported` the moment an ESM CONSUMER loads the barrel.
  consort imports scm-utils as ESM, so its whole suite failed to load (116 suites). tsup is now
  an ARRAY of two format-specific configs: the ESM (`.js`) build leaves `@databricks/*` external
  (Node's ESM loader imports it fine), the CJS (`.cjs`) build bundles both `octokit` and
  `@databricks/*` (zero `require()` of any ESM-only dep). Verified: ESM barrel imports cleanly +
  consort's full suite is green; CJS barrel require()s clean, so the extension host is unaffected.
  Purely a build-config fix, no source/API change.

## 0.2.8

Completes the CJS-consumability fix (0.2.7 bundled only `octokit`).

- **fix(cjs): also bundle `@databricks/*` (`@databricks/lakebase`, `@databricks/appkit`).**
  They are ESM-only too, so after 0.2.7 the CJS build still threw `ERR_REQUIRE_ESM` on
  `require("@databricks/lakebase")` in the extension host (traced from `lakebase-scm-extension`'s
  activation log). tsup `noExternal` now covers `octokit`, `@octokit/*`, AND `@databricks/*`;
  verified ZERO `require()` of any ESM-only dep remains in the `.cjs` output, so the extension
  activates cleanly (trees + commands register). Confirmed live in Cursor before release.

## 0.2.7

CJS-consumability fix + leaner create.

- **fix(cjs): bundle `octokit` so the CJS build is require-able in a CommonJS host.**
  octokit v4 is ESM-only (`type: module`, no CJS entry), so the default-externalized
  `require("octokit")` in `dist/scripts/*.cjs` threw `ERR_REQUIRE_ESM` in a CommonJS
  runtime , which aborted `lakebase-scm-extension`'s activation (Electron extension
  host): "failed to load its substrate dependency" -> no tree views, no commands. tsup
  now `noExternal`s `octokit` + `@octokit/*`, so esbuild inlines its (self-contained)
  bundle as CJS and the `.cjs` output is self-contained + require-able. Restores the
  dual-format build's promise that the extension can consume the substrate.
- **change(create): create no longer prefetches the Consort toolkit.** The 180s-capped
  create-time warm kept getting killed on a heavy/slow install and was re-downloaded
  anyway by the post-create `./scripts/lk --refresh` (or first `lk` command, which
  installs a cold cache). Dropped the fragile double-download; the toolkit downloads
  ONCE, at that reliable point. create-project pins `kit-ref` + reports where the
  download happens; the banner drops the toolkit step (provisioning is now ~2-4 min).

## 0.2.6

Central workspace resolution + kit-download UX.

- **fix(central): every `databricks` call now auto-targets the project's workspace.**
  `buildInvocation` (the one wrapper all CLI calls go through) already read `.env`
  `DATABRICKS_CONFIG_PROFILE`; it now also reads `.env` `DATABRICKS_HOST` via a single
  `effectiveHost()` resolver (`opts.host` -> exported `DATABRICKS_HOST` -> `<cwd>/.env`
  `DATABRICKS_HOST`), threaded into both the child env and the profile host-match. So any
  in-project call , doctor, tier-cut, drive auth preflight, credential mint, the agents ,
  targets the project workspace instead of silently falling back to the DEFAULT profile.
  This closes centrally the class the doctor (0.2.2) and tier-cut (0.2.5) fixes patched
  pointwise; no caller can regress it by forgetting to thread a host.
- **feat(lk): plain-language install/refresh + narration.** `--install` / `--refresh`
  (and `--download`/`--update`/`--reinstall`) alias the old `--warm`/`--rewarm`; the
  install narrates ("Downloading the Consort toolkit … one-time, ~1-2 min … ready") and
  runs leaner (`--omit=dev --no-audit --no-fund`).
- **feat(create): create-project narrates.** An upfront one-time-provisioning plan
  (repo / Lakebase / files / runner / toolkit [/ tiers]) with the slow steps' durations,
  and plain "Consort toolkit" wording (was "warm the kit cache").

## 0.2.5

Tier-cut auth fix + recovery bin.

- **fix(tiers): `createLongRunningBranch` now forwards the workspace host to the Lakebase
  branch create.** The `databricksHost` arg was documented as forwarded but was dropped ,
  the tier-cut resolved auth ambiently and fell back to the DEFAULT profile (often an
  unrelated/expired workspace). So a `lakebase-create-project --tiers 2` / `--tiers 3`
  could silently fail to cut staging/dev and leave the project prod-only. The tier-cut now
  runs against the SAME workspace the rest of create used.
- **feat: `lakebase-cut-tier` , recover a missing tier without re-creating.** New bin that
  cuts a long-running tier (`--name staging --fork-from main`), defaulting instance + host
  from the project `.env`. Creates both the Lakebase (no-expiry) and git sides. The
  counterpart when a create-time tier-cut failed. (`lakebase-reconcile-tier` reconciles
  state; it does NOT cut a branch.)
- **create-project: a failed tier-cut is now a loud "INCOMPLETE TIERS" warning** that names
  the exact `lakebase-cut-tier` recovery command instead of a buried message.

## 0.2.4

Kit-warm UX + speed.

- **feat(lk): the runtime-kit install now narrates instead of going dark.** `install_pkg`
  (used by `lk --warm` / `--rewarm` and a cold bin run) prints a leading "installing
  <kit>@<ref> , one-time for this ref (~1-2 min)" line, streams npm's own progress to
  stderr (was `>/dev/null 2>&1`), and prints a "ready (cached ...)" line on success. A
  multi-minute first install no longer looks hung.
- **perf(lk): leaner install , `--omit=dev --no-audit --no-fund`.** The kit ships prebuilt
  `dist/`, so consumers never build; skipping the build-toolchain devDeps (tsup, vitest,
  typescript, esbuild) and the audit/fund round-trips trims the warm. Prod postinstalls
  (`@databricks/appkit`, `protobufjs`) still run.

## 0.2.3

De-sftdd drift sweep + legacy-alias deprecation.

- **deprecate(lk): the scaffolded launcher warns on legacy `lakebase-sftdd-*` /
  `lakebase-tdd-*` bin aliases.** They still route to the kit and run; the one-line
  notice points at the `consort-*` / `lakebase-*` names. Scheduled for removal in
  consort v0.4.0.
- **docs/chore: swept leftover `sftdd`/`tdd`-era drift** from doc prose, comments, and
  help/usage text (the kit is Consort). Fixed stale user-facing references to the
  actual names: `lakebase-sftdd-collapse-heads` -> `lakebase-collapse-heads`,
  `lakebase-sftdd-new-migration` -> `lakebase-new-migration`, doctor remediation
  suggestions -> `consort-experiment` / `consort-spike`, scaffolded-template gate/deploy
  names -> `consort-ux-clean` / `consort-deploy`, and stale `sftdd-config.json` comments
  -> `consort-config.json` (the file the scaffold actually writes).
- **Back-compat unchanged:** the `.sftdd` / `.tdd` artifact-root literals + migration,
  the legacy read of `sftdd-config.json`, and the `--sftdd-dir` CLI alias are all still
  honored. No behavior change.

## 0.2.2

Doctor auth fix.

- **fix(doctor): resolve the profile from the pinned host + thread the host into the auth
  checks.** When a caller pins the TARGET workspace (`create-project`'s `--databricks-host`)
  but no explicit profile, `runDoctor` now resolves the profile that matches that host up
  front and threads the host (sets `DATABRICKS_HOST`) into the `auth token` / `auth describe` /
  `current-user` probes. Previously an unset profile made `databricks auth token` fall back to
  the DEFAULT profile , whose refresh token may be stale , so the doctor failed spuriously even
  though the target workspace authenticated fine. An explicit `--profile` still wins (no
  host-based resolution). Covered by `tests/bdd/doctor-auth-host.test.ts`.

## 0.2.1

Scaffold + teardown polish.

- **fix(scaffold): the project launcher template is now `scripts/consort.sh`** (was the
  stale pre-rename `scripts/sftdd.sh`), matching the consort commands + docs;
  `lakebase-create-project`'s "Next:" hint points at `./scripts/consort.sh plan`. Existing
  scaffolded projects keep their `sftdd.sh` (still works); new scaffolds get `consort.sh`.
- **feat(cleanup): `lakebase-scm-cleanup` defaults `--instance` / `--host` from the project
  `.env`** (`LAKEBASE_PROJECT_ID` / `DATABRICKS_HOST`, what create-project records) when not
  passed, so it can be run from inside a scaffolded project without re-specifying them.
  Explicit flags still win; `--project-dir` selects the `.env`.

## 0.2.0

Adds the `lakebase-scm-cleanup` teardown bin and fixes the doctor's JDK version gate.

- **`lakebase-scm-cleanup`**: safe cleanup / destroy for a project's Lakebase resources —
  `list` (classify trunk / tier / ephemeral), `branches` (delete the ephemeral
  feature/test/uat/perf/spike branches; tiers and the trunk branch are protected), and
  `project` (destroy the whole Lakebase project, guarded by `--confirm <id>`). Dry-run by
  default (`--yes` to apply), idempotent, and partial-failure-honest.
- **fix(doctor): enforce the JDK version floor.** `java -version` writes to stderr and exits
  0, so the stdout-only runner resolved `""` and the version gate short-circuited on
  `&& version`, reporting JDK OK on any version (11 and 22 alike). The version runner now
  captures stdout+stderr, and the gate fails closed: a floored tool with an unreadable version
  warns instead of passing silently.

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
