# Build Plan — cleanup / destroy bin (`lakebase-scm-cleanup`)

**Status:** design, not built. **Goal:** a safe, user-facing command to tear down the
kit-created resources for a project — the throwaway half of the scaffold/`/spike` story
(the PRD sells "just try it and throw it away"), plus routine pruning of spikes, merged/
abandoned feature branches, and orphaned Lakebase branches, and a guarded full-project
destroy for demos/experiments.

Scope: `lakebase-scm-utils` (the SCM primitives layer). Consort/the extension surface it
as a command later. Do NOT put anything workspace-specific in the code.

## Why (gap)
`lakebase-scm-abandon-feature` already resets ONE in-flight feature claim, and
`lakebase-scm-recover-orphans` finds orphans. What's missing is a single command that:
- **lists** what the kit created for a project (features, spikes, orphaned Lakebase
  branches, local worktrees/`.consort` state) — a "what would be removed" view;
- **prunes** spikes + merged/abandoned feature branches + orphaned Lakebase branches in bulk;
- **destroys** a whole scaffolded project (all non-tier branches + the Lakebase project +
  optionally the GitHub repo + the local dir) for demos/experiments;
- does all of it **safely** (dry-run default, tier-protected, idempotent, confirm-to-delete).

## Reuse (already in the repo — do NOT reinvent)
- `branch-utils.ts` → `listBranches({ instance })`, `getBranchByName`, `isTier`,
  `protectedTierNamesFromEnv` — enumerate branches and identify protected tiers.
- `branch-delete.ts` → `deleteBranch({ branch, instance, allowDefault })` — the delete
  primitive; **keep `allowDefault:false`** except in the project-destroy path. It already
  refuses to delete the default branch.
- `scm-abandon-feature.ts` → `abandonFeatureBranch(...)` — reuse for the feature path (it
  resets local state + drops the paired branch).
- `paired-branch.ts` → the paired GitHub+Lakebase construct + tier logic.
- `convention-branches.ts` → tier/naming conventions (feature/test fork from `staging`);
  use to classify spike vs feature vs tier.
- `databricks-cli.ts` (`runDatabricks`) + `resolve-profile`/`databricks-host` — profile/host.
- `scripts/github/*` (gh auth/pr) + the `gh` CLI — GitHub branch/repo deletion.
- `util/cli-entry.ts` (`isCliEntry`), `kit-config.ts` (`KIT_TIMEOUTS`) — CLI + timeout conventions.

## Design
One bin, `lakebase-scm-cleanup`, with an explicit **mode** so the dangerous paths are
visible, not a flag on a routine command:

```
lakebase-scm-cleanup <mode> [flags]
  modes:
    list       (default) show what each other mode WOULD remove; deletes nothing
    spikes     delete spike branches (code + Lakebase) — throwaway by definition
    feature    abandon + delete a named/current feature (delegates to abandonFeatureBranch)
    orphans    delete Lakebase branches with no matching git branch (wraps recover-orphans logic)
    project    DESTROY the whole scaffolded project (see guards) — all non-tier branches,
               the Lakebase project, optional GitHub repo, and the local dir
  flags:
    --project-dir <p> / --cwd <p>   project root (default cwd)
    --instance <id>                 Lakebase instance/project id (else resolved from state)
    --dry-run                       force plan-only (default for all modes except when --yes)
    --yes                           actually perform deletions (required for any real delete)
    --include-github                also delete the GitHub branch/repo (default: leave git alone)
    --keep-local                    don't remove local worktrees/.consort (project mode)
    --json / --pretty               machine / human output (match the other CLIs)
    --force                         proceed past soft warnings (never past tier protection)
```

### Behavior
- **list** — enumerate (via `listBranches` + git + `.consort` state): tiers (protected,
  shown but never touched), feature branches (+ merged/abandoned status), spikes, orphaned
  Lakebase branches, local worktrees. Emit a categorized plan. This is the dry-run view every
  destructive mode prints first.
- **spikes** — for each spike branch (classified via `convention-branches`), `deleteBranch`
  (Lakebase) + delete the git branch (if `--include-github`) + prune the local worktree.
- **feature** — delegate to `abandonFeatureBranch` (adds nothing new; the bin just routes to it).
- **orphans** — Lakebase branches with no matching git ref → `deleteBranch` each.
- **project** — the full teardown, in this ORDER (mirrors the harness sequence, guarded):
  1. confirm intent: require `--yes` **and** the project id echoed back (`--confirm <id>`);
  2. delete every non-tier branch (`deleteBranch`, `allowDefault:false`);
  3. delete the Lakebase project (`runDatabricks(["postgres","delete-project", …])` /
     `database delete-database-instance` — pick per the create path used);
  4. if `--include-github`: `gh repo delete` / branch delete;
  5. unless `--keep-local`: `rmSync` the project dir / worktrees + `.consort` state.

## Safety model (non-negotiable)
- **Dry-run by default.** No deletion happens without `--yes`. `list` never deletes.
- **Tier-protected.** Never delete `production`/`staging`/`main` or any
  `protectedTierNamesFromEnv()` tier; rely on `deleteBranch`'s `allowDefault:false` as the
  backstop, and filter tiers out up front via `isTier`.
- **Project mode double-confirms** (`--yes` + `--confirm <project-id>`), because it deletes
  the Lakebase project.
- **Idempotent.** Missing branch/project → treat as already-clean (catch + continue), never crash.
- **Partial-failure honest.** Collect per-resource {resource, action, ok/err}; exit non-zero
  if any real deletion failed; report the full list (never a summary-only success).
- **No workspace specifics in code** — profile/instance/host all resolved or passed as flags.

## Files (match existing conventions)
```
scripts/lakebase/scm-cleanup.ts       # impl: listPlan(), runCleanup(mode, opts) -> CleanupResult
scripts/lakebase/scm-cleanup.cli.ts   # CLI: parseArgs + isCliEntry, --json/--pretty, ScmCleanupError
tests/bdd/scm-cleanup.test.ts         # hermetic: injected listBranches/deleteBranch/git/gh runners
package.json                          # add bin: "lakebase-scm-cleanup"
```
Follow `scm-abandon-feature.{ts,cli.ts}` for structure (error class, parseArgs, result shape,
`--json/--pretty`, `isCliEntry`). Dist ships committed at release (kit convention).

## Tests (hermetic, injected runners — like doctor-prereqs / scm-*.test.ts)
- `list` returns the correct categories from a fake branch/git/state set; deletes nothing.
- `spikes --yes` deletes only spikes; leaves tiers + features.
- Tier protection: a tier in the delete set is refused even with `--force`.
- Dry-run (no `--yes`): planned, nothing deleted (spy asserts 0 delete calls).
- `project` without `--confirm <id>` refuses; with it, deletes non-tier branches + project in order.
- Idempotency: a missing branch mid-run is skipped, run still succeeds.
- Partial failure: one delete throws → overall non-zero exit + the failure reported.

## Edge cases
- Feature merged vs abandoned vs in-flight (classify from `.consort`/git state before deleting).
- Orphaned Lakebase branch whose git branch was already deleted (orphans mode covers it).
- Project id not resolvable (no state) → require `--instance`, else fail with a clear hint.
- GitHub deletion is opt-in (`--include-github`); default leaves git history alone (safer).

## Acceptance
- `lakebase-scm-cleanup list` on a scaffolded project shows tiers/features/spikes/orphans/local.
- `spikes`/`orphans`/`feature`/`project` each delete exactly their scope, tier-protected,
  dry-run unless `--yes`, idempotent, partial-failure-honest.
- Hermetic tests green; a live pass on a throwaway project confirms real teardown.
- Nothing workspace-specific committed.

## Out of scope
- Deleting shared prod/staging tiers (never).
- Cross-account/whole-workspace cleanup (this is per-project).
- The consort/extension command surface (separate follow-up once the bin exists).
