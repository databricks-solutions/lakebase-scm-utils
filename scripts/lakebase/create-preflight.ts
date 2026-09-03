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
