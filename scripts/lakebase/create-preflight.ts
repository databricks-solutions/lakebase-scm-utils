// Preflight + cleanup helpers for create-project, extracted so each is
// unit-testable without running the full createProject orchestration:
//
//   W5  checkDatabricksAuth      probe auth up front so the flow fails with an
//                                actionable "run databricks auth login" message
//                                instead of a cryptic failure deep in create.
//   W3  warmAndVerifyKit         warm the kit fast-CLI cache AND verify it
//                                resolved, returning a specific reason so the
//                                create flow surfaces a failure loudly at create
//                                time rather than letting a later commit
//                                silently skip schema-diff enrichment.
//   W9  withLakebaseRollback     if a create step throws AFTER the Lakebase
//                                project was created, delete that project so its
//                                slug isn't orphaned (a same-name retry would
//                                otherwise collide with the reserved slug).

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { deleteLakebaseProject } from "./lakebase-project.js";
import { runDatabricks } from "./databricks-cli.js";
import { checkGitHubScopes, getCurrentUser, repoExists, type GitHubScopeStatus } from "../github/repo.js";

export interface PreflightResult {
  ok: boolean;
  reason?: string;
}

/**
 * Cheap, pure-input validation for createProject, run BEFORE any auth probe or
 * provisioning so a bad request fails fast with the specific input error (not a
 * masking auth error, and not deep inside provisioning after a repo or Lakebase
 * project already exists). Returns the first blocking reason, or ok when the
 * inputs are internally consistent. `dirExists`/`dirIsEmpty` are injected so the
 * check is unit-testable without touching the filesystem; the caller wires the
 * real fs probes.
 */
export function validateCreateInputs(input: {
  projectDir: string;
  useGithub: boolean;
  githubOwner?: string;
  tiers?: 1 | 2 | 3;
  dirExists: (p: string) => boolean;
  dirIsEmpty: (p: string) => boolean;
}): PreflightResult {
  if (input.useGithub && !input.githubOwner) {
    return { ok: false, reason: "GitHub owner is required when creating a GitHub repository" };
  }
  // Tiers 2/3 cut a long-running branch, which pushes the tier's git side to
  // origin, so they REQUIRE a GitHub remote. Reject the combination up front
  // rather than provisioning everything and then skipping the tiers with a
  // post-hoc warning (the old behavior silently produced a tier-1 project).
  if ((input.tiers === 2 || input.tiers === 3) && !input.useGithub) {
    return {
      ok: false,
      reason:
        `tiers ${input.tiers} requires a GitHub repository: cutting a long-running tier ` +
        `(staging/dev) pushes its git side to origin. Re-run with a --github-owner, or ` +
        `pair --no-github with --tiers 1 (prod only).`,
    };
  }
  // On the local-only (--no-github) path the creator makes the project dir
  // itself. A pre-existing EMPTY dir is fine (a common "I made the folder first"
  // case); only refuse one that already has contents, which would risk
  // clobbering an unrelated project. (With GitHub, the clone owns the dir, so
  // this check is the local-path counterpart.)
  if (!input.useGithub && input.dirExists(input.projectDir) && !input.dirIsEmpty(input.projectDir)) {
    return { ok: false, reason: `Directory already exists and is not empty: ${input.projectDir}` };
  }
  return { ok: true };
}

/** True when `dir` does not exist, or exists with no entries. */
export function dirIsEmpty(dir: string): boolean {
  try {
    return fs.readdirSync(dir).length === 0;
  } catch {
    // Unreadable / nonexistent: treat as "empty" for the caller's purposes;
    // the dirExists probe governs whether it is there at all.
    return true;
  }
}

function lastLines(s?: string, n = 3): string {
  return (s ?? "").trim().split("\n").filter(Boolean).slice(-n).join("; ");
}

/** Injectable runner for checkDatabricksAuth (defaults to the real CLI wrapper). */
type AuthProbe = (args: string[]) => Promise<string>;

/**
 * W5: probe Databricks auth before any project work. Uses `databricks auth token
 * --force-refresh`, which forces a REFRESH-token exchange , so an EXPIRED refresh
 * token fails HERE, up front, with the `databricks auth login` remediation.
 *
 * This deliberately does NOT use `current-user me`: that call is served from the
 * CACHED access token and passes even when the refresh token is dead, so it
 * silently masks an expired session , the preflight reports ok, then credential
 * MINTING (generate-database-credential, which needs a fresh token exchange)
 * fails much later inside the app/tests, where it degrades into a connection
 * hang. Exercising the refresh token here is what turns that latent 2-hour spin
 * into an immediate, actionable failure.
 */
export async function checkDatabricksAuth(
  host?: string,
  run: AuthProbe = (args) => runDatabricks(args, { host, timeout: 8_000 }),
): Promise<PreflightResult> {
  try {
    await run(["auth", "token", "--force-refresh", "-o", "json"]);
    return { ok: true };
  } catch (err) {
    const e = err as { stderr?: string; message?: string };
    return { ok: false, reason: lastLines(e.stderr, 2) || e.message || "databricks auth token failed" };
  }
}

/** Injectable scope probe for checkGitHubWorkflowScope (defaults to the real GitHub API read). */
type ScopeProbe = () => Promise<{ granted: string[] | null; missing: string[] }>;

/**
 * W-workflow-scope: preflight the GitHub token's `workflow` OAuth scope BEFORE
 * any repo / Lakebase project is created. The scaffold's FINAL push commits
 * `.github/workflows/*`, which GitHub REJECTS unless the token carries
 * `workflow` — without this, that rejection only surfaces at the very end,
 * after all the provisioning, forcing a full rollback. Gating the ONE scope the
 * push needs here turns that into an immediate, actionable failure.
 *
 * Non-blocking in two cases (ok:true): a token that exposes NO OAuth scopes
 * (fine-grained PAT / GitHub App token — `granted` null; its workflow
 * permission isn't visible this way, so we can't assert), and any probe error
 * (a genuinely bad/absent token surfaces clearly at repo creation, not here).
 */
export async function checkGitHubWorkflowScope(
  probe: ScopeProbe = () => checkGitHubScopes(["workflow"]),
): Promise<PreflightResult> {
  try {
    const { granted, missing } = await probe();
    if (granted === null) return { ok: true }; // scopes not visible → can't assert, don't false-fail
    if (missing.includes("workflow")) {
      return { ok: false, reason: `token grants [${granted.join(", ") || "none"}] but not \`workflow\`` };
    }
    return { ok: true };
  } catch {
    return { ok: true }; // best-effort: a probe failure must not block scaffold
  }
}

export interface GitHubPreflightInput {
  /** Target repo owner (user or org). */
  owner: string;
  /** Bare repo name (the project name). */
  repoName: string;
  /** Scopes whose absence BLOCKS the happy path (create + push). Default ["repo","workflow"]. */
  hardScopes?: readonly string[];
  /** Scopes whose absence only WARNS (e.g. delete_repo, needed for rollback repo-delete). Default ["delete_repo"]. */
  advisoryScopes?: readonly string[];
  /** Injected probes (default to the real GitHub reads). */
  currentUser?: () => Promise<string>;
  scopes?: (required: readonly string[]) => Promise<GitHubScopeStatus>;
  repoExists?: (fullName: string) => Promise<boolean>;
}

export interface GitHubPreflightResult extends PreflightResult {
  /** Non-blocking notes (org/owner mismatch, missing advisory scope, invisible scopes). */
  warnings: string[];
  /** The resolved authenticated login, when B1 succeeded. */
  activeUser?: string;
}

/**
 * One up-front GitHub preflight run BEFORE any repo / Lakebase project is created,
 * so a missing requisite fails in seconds with a fix instead of mid-create (where
 * it orphans partially-created artifacts). Supersedes the workflow-only check:
 *
 *   B1  active account   getCurrentUser() must resolve (a valid token) — else a
 *                        wrong/absent token otherwise 403s LATE at the push.
 *   B2  scope set        checkGitHubScopes([...hard, ...advisory]): a missing HARD
 *                        scope (repo/workflow) fails; a missing ADVISORY scope
 *                        (delete_repo) warns (rollback repo-delete unavailable);
 *                        granted null (fine-grained PAT / App) can't be asserted.
 *   B3  name availability  repoExists(owner/name) → fail before anything exists.
 *   B4  owner note       login != owner ⇒ creating under an org/other account —
 *                        surfaced (createRepo enforces the real org-create right).
 *
 * CONSERVATIVE: hard-fails ONLY on the clear blockers (invalid token, missing
 * happy-path scope, name taken); every other uncertainty is a warning, never a
 * false block (same ethos as checkGitHubWorkflowScope). All probes injected, so
 * this is unit-testable with no network.
 */
export async function checkGitHubPreflight(input: GitHubPreflightInput): Promise<GitHubPreflightResult> {
  const warnings: string[] = [];
  const hard = input.hardScopes ?? ["repo", "workflow"];
  const advisory = input.advisoryScopes ?? ["delete_repo"];
  const currentUserProbe = input.currentUser ?? getCurrentUser;
  const scopesProbe = input.scopes ?? ((req: readonly string[]) => checkGitHubScopes(req));
  const repoExistsProbe = input.repoExists ?? repoExists;

  // B1: active account — a valid token. Hard blocker; nothing downstream works without it.
  let activeUser: string;
  try {
    activeUser = await currentUserProbe();
  } catch (err) {
    return {
      ok: false,
      warnings,
      reason:
        `GitHub authentication failed: ${err instanceof Error ? err.message : String(err)}. ` +
        "Sign in with `gh auth login`, or set GITHUB_TOKEN to a valid token, then re-run.",
    };
  }

  // B4 (note): a login different from the owner means an org (or another account).
  // Not a hard block — createRepo surfaces the real org-create permission — but
  // surface it so a wrong active account is visible BEFORE the push's late 403.
  if (activeUser.toLowerCase() !== input.owner.toLowerCase()) {
    warnings.push(
      `Signed in to GitHub as "${activeUser}" but creating under "${input.owner}" (an org or another account); ` +
        `ensure "${activeUser}" can create repositories there.`,
    );
  }

  // B2: the full required scope set — not just `workflow`.
  try {
    const { granted, missing } = await scopesProbe([...hard, ...advisory]);
    if (granted !== null) {
      const missingHard = missing.filter((s) => hard.includes(s));
      const missingAdvisory = missing.filter((s) => advisory.includes(s));
      if (missingHard.length > 0) {
        return {
          ok: false,
          warnings,
          activeUser,
          reason:
            `GitHub token missing required scope(s): ${missingHard.join(", ")} ` +
            `(grants [${granted.join(", ") || "none"}]). Fix: gh auth refresh -h github.com -s ${[...hard].join(",")}`,
        };
      }
      if (missingAdvisory.length > 0) {
        warnings.push(
          `GitHub token missing the ${missingAdvisory.join(", ")} scope — automatic rollback of the repo on a failed ` +
            "create is unavailable (you would delete it by hand). Grant it with: gh auth refresh -h github.com -s delete_repo",
        );
      }
    } else {
      warnings.push(
        "GitHub token scopes are not visible (fine-grained PAT or App token); cannot pre-verify repo/workflow access , " +
          "the create will surface any gap when it pushes.",
      );
    }
  } catch {
    warnings.push("Could not read GitHub token scopes (probe error); skipping the scope pre-check.");
  }

  // B3: name availability — fail before anything is created.
  try {
    if (await repoExistsProbe(`${input.owner}/${input.repoName}`)) {
      return {
        ok: false,
        warnings,
        activeUser,
        reason:
          `GitHub repo "${input.owner}/${input.repoName}" already exists. ` +
          "Pick a different project name, or delete the existing repo first.",
      };
    }
  } catch {
    warnings.push(
      `Could not check whether "${input.owner}/${input.repoName}" already exists (probe error); ` +
        "the create will fail clearly if it does.",
    );
  }

  return { ok: true, warnings, activeUser };
}

/** The actionable prereq message for a GitHub token missing the `workflow` scope. */
export function githubWorkflowScopePrereqMessage(reason?: string): string {
  return (
    "The GitHub token lacks the `workflow` OAuth scope, required to push the project's " +
    "`.github/workflows/*` CI files. (Without this check, scaffolding runs all the way to the " +
    "final push, is rejected, and rolls back.) Grant the scope, then re-run:\n" +
    "  - gh CLI:  gh auth refresh -h github.com -s workflow\n" +
    "  - VS Code: re-sign in to GitHub and approve the workflow scope\n" +
    "  - token:   set GITHUB_TOKEN to a PAT that includes the `workflow` scope" +
    (reason ? `\n(${reason})` : "")
  );
}

/** The actionable prereq message for a failed auth probe (W5). */
export function databricksAuthPrereqMessage(host?: string, reason?: string): string {
  const hostFlag = host ? ` --host ${host.replace(/\/+$/, "")}` : "";
  return (
    "Databricks authentication is required before creating a project. " +
    `Run: databricks auth login${hostFlag}` +
    (reason ? `\n(auth probe failed: ${reason})` : "")
  );
}

/**
 * W3: warm the kit fast-CLI cache (`scripts/lk --warm`) and verify a CLI
 * actually resolves afterward. Returns ok:false with a specific reason on
 * failure so the create flow can surface it loudly at create time.
 */
export function warmAndVerifyKit(projectDir: string, timeoutMs = 180_000): PreflightResult {
  const lk = path.join(projectDir, "scripts", "lk");
  if (!fs.existsSync(lk)) {
    return { ok: false, reason: "scripts/lk shim missing from the scaffold" };
  }
  const warm = spawnSync("bash", [lk, "--warm"], { cwd: projectDir, encoding: "utf-8", timeout: timeoutMs });
  if (warm.status !== 0) {
    return { ok: false, reason: lastLines(warm.stderr) || `lk --warm exited ${warm.status ?? "(killed)"}` };
  }
  // Confirm node can actually load + run a warmed CLI. LK_NO_INSTALL so the
  // verify never triggers an install of its own (warm is the only installer).
  const verify = spawnSync("bash", [lk, "lakebase-schema-diff", "--help"], {
    cwd: projectDir,
    encoding: "utf-8",
    timeout: 30_000,
    env: { ...process.env, LK_NO_INSTALL: "1" },
  });
  if (verify.status !== 0) {
    return {
      ok: false,
      reason: `kit warmed but a CLI did not resolve: ${lastLines(verify.stderr) || `exit ${verify.status}`}`,
    };
  }
  return { ok: true };
}

/** The loud, specific warning for a failed toolkit download at create time (W3). */
export function kitWarmWarning(projectDir: string, reason?: string): string {
  return (
    `The Consort toolkit didn't finish downloading during setup: ${reason ?? "unknown reason"}. ` +
    "It's a one-time download; commit-time schema diff stays unavailable until it completes. " +
    `Finish it now: (cd ${projectDir} && ./scripts/lk --refresh). ` +
    "If it fails again, check network access to github.com / npm."
  );
}

export interface RollbackOptions {
  projectId: string;
  host?: string;
  report?: (step: string, detail?: string) => void;
  /** Injectable for tests; defaults to the real deleteLakebaseProject. */
  deleteProject?: (a: { projectId: string; host?: string }) => Promise<void>;
}

/**
 * W9: run `fn`; if it throws, delete the just-created Lakebase project so its
 * slug isn't orphaned (a retry with the same name would otherwise collide with
 * the reserved/soft-deleted slug), then rethrow with rollback context. The
 * delete is best-effort with a short retry; a "not found" is treated as already
 * gone. Use ONLY to wrap the steps that run AFTER createLakebaseProject.
 */
export async function withLakebaseRollback<T>(opts: RollbackOptions, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const del = opts.deleteProject ?? deleteLakebaseProject;
    const report = opts.report ?? (() => {});
    report(`Create failed; rolling back Lakebase project ${opts.projectId}...`);
    let rolledBack = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await del({ projectId: opts.projectId, host: opts.host });
        rolledBack = true;
        break;
      } catch (delErr) {
        const m = delErr instanceof Error ? delErr.message : String(delErr);
        if (/not.?found/i.test(m)) {
          rolledBack = true;
          break;
        }
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1_000 * attempt));
      }
    }
    const base = err instanceof Error ? err.message : String(err);
    const suffix = rolledBack
      ? ` (rolled back the Lakebase project "${opts.projectId}"; its slug is now SOFT-deleted, so a same-name retry` +
        ` collides with "already exists" , retry with a DIFFERENT project name, or purge the soft-deleted slug first)`
      : ` (WARNING: could not roll back the Lakebase project "${opts.projectId}"; delete it with` +
        ` \`databricks postgres delete-project ${opts.projectId}\`, then retry with a DIFFERENT name , the` +
        ` soft-deleted slug blocks reusing this one until it is purged)`;
    const wrapped = err instanceof Error ? err : new Error(base);
    wrapped.message = `${base}${suffix}`;
    throw wrapped;
  }
}

export interface RollbackStep {
  label: string;
  undo: () => Promise<void> | void;
}

export interface RollbackLedger {
  /** Record a teardown for a resource the moment it is created. */
  register(label: string, undo: () => Promise<void> | void): void;
  /** The steps, in registration order (teardown runs them REVERSED). */
  steps(): readonly RollbackStep[];
}

/** A created-resources ledger for the full create flow (A3). */
export function createRollbackLedger(): RollbackLedger {
  const steps: RollbackStep[] = [];
  return {
    register: (label, undo) => {
      steps.push({ label, undo });
    },
    steps: () => steps,
  };
}

export interface CreateRollbackOptions {
  report?: (step: string, detail?: string) => void;
}

/**
 * A3: run `fn`; on a throw, tear down EVERY resource the ledger recorded, in
 * REVERSE order (last-created first), then rethrow with a summary of what was
 * and wasn't cleaned up.
 *
 * Unlike {@link withLakebaseRollback} (Lakebase project only), this undoes the
 * GitHub repo, the self-hosted runner, the local dir, AND the Lakebase project
 * together — so a genuine provisioning fault leaves a clean "name is free" state
 * instead of orphaning three of the four artifacts (the exact 4-artifact manual
 * cleanup the cold-download incident caused). A step's own failure is captured +
 * reported, never thrown, so one stuck teardown can't block the others; a
 * "not found" teardown counts as already-gone. The caller registers a step the
 * instant each resource is created, so a failure anywhere inside `fn` rolls back
 * exactly what existed at that point.
 */
export async function withCreateRollback<T>(
  ledger: RollbackLedger,
  opts: CreateRollbackOptions,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const report = opts.report ?? (() => {});
    const steps = [...ledger.steps()].reverse();
    const rolledBack: string[] = [];
    const failed: string[] = [];
    if (steps.length > 0) report(`Create failed; rolling back ${steps.length} created resource(s)...`);
    for (const s of steps) {
      try {
        report(`  rolling back: ${s.label}`);
        await s.undo();
        rolledBack.push(s.label);
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        if (/not.?found/i.test(m)) {
          rolledBack.push(s.label);
          continue;
        }
        failed.push(`${s.label} (${m})`);
      }
    }
    const base = err instanceof Error ? err.message : String(err);
    const parts: string[] = [];
    if (rolledBack.length) parts.push(`rolled back: ${rolledBack.join(", ")}`);
    if (failed.length) {
      parts.push(
        `COULD NOT roll back: ${failed.join("; ")} , clean these up by hand before retrying the same name`,
      );
    }
    const suffix = parts.length ? ` (${parts.join("; ")})` : "";
    const wrapped = err instanceof Error ? err : new Error(base);
    wrapped.message = `${base}${suffix}`;
    throw wrapped;
  }
}
