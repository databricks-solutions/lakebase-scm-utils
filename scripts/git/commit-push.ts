// Initial commit + (optional) push for a freshly-scaffolded project.
//
// Mirrors the tail of ProjectCreationService.createProject. The
// workflow-scope error message is preserved verbatim: the raw remote
// rejection ("without `workflow` scope") is opaque if you haven't seen it.
//
// The general-purpose `commit` / `commitAll` / `commitAmend` / etc.
// primitives live in ./commits.ts. This module's surface is now
// strictly the project-scaffold + push flow.

import { exec } from "../util/exec.js";

export interface CommitAndPushArgs {
  projectDir: string;
  message: string;
  /** Push to "origin main" after commit. Default: true. */
  push?: boolean;
  /** Remote name. Default: "origin". */
  remote?: string;
  /** Branch name. Default: "main". */
  branch?: string;
}

export class WorkflowScopeError extends Error {
  constructor(projectDir: string) {
    super(
      `Push rejected: GitHub token lacks the \`workflow\` OAuth scope required for ` +
        `commits touching \`.github/workflows/*\`. The project on disk is fine; ` +
        `only the initial push failed.\n\n` +
        `To finish:\n` +
        `  1. Re-sign in to GitHub in VS Code and grant the workflow scope (or set ` +
        `     GITHUB_TOKEN to a token with workflow scope)\n` +
        `  2. Then from the project dir:  cd ${projectDir} && git push -u origin main`
    );
    this.name = "WorkflowScopeError";
  }
}

/**
 * Commit and (by default) push to origin/main with -u. Stages
 * everything first (`git add -A`), then commits with the given message,
 * then pushes. Throws {@link WorkflowScopeError} when the remote
 * rejects due to the GitHub token lacking the `workflow` OAuth scope.
 *
 * For non-initial-commit flows, prefer the primitives in ./commits.ts.
 */
export async function commitAndPush(args: CommitAndPushArgs): Promise<void> {
  await commitInitial(args.projectDir, args.message);
  if (args.push === false) return;
  await pushInitial({ projectDir: args.projectDir, remote: args.remote, branch: args.branch });
}

/** Stage everything and make the initial commit (no push). */
export async function commitInitial(projectDir: string, message: string): Promise<void> {
  await exec("git add -A", { cwd: projectDir });
  await exec(`git commit -m ${JSON.stringify(message)}`, {
    cwd: projectDir,
    timeout: 30_000,
  });
}

export interface PushInitialArgs {
  projectDir: string;
  /** Remote name. Default: "origin". */
  remote?: string;
  /** Branch name. Default: "main". */
  branch?: string;
  /**
   * Total push attempts (>= 1). Default 1 (preserves commitAndPush's behavior).
   * The create flow passes 2: the FIRST push fires the project's pre-push hook,
   * which triggers the one-time cold download of the Consort toolkit — that race
   * can fail the push, but the toolkit is CACHED afterward, so a single retry then
   * sails through (the cold-download incident). A `workflow`-scope rejection is a
   * real auth gap, never retried.
   */
  attempts?: number;
  /** Delay between attempts (ms). Default 1500. Injected in tests. */
  delayMs?: number;
  /** Injectable sleep (tests). */
  sleep?: (ms: number) => Promise<void>;
  /** Injectable runner (tests); defaults to the real `git push`. */
  run?: (cmd: string, cwd: string) => Promise<void>;
}

/**
 * Push the initial branch with `-u`, retrying a transient failure up to
 * `attempts` times. Maps the GitHub `workflow`-scope rejection to
 * {@link WorkflowScopeError} (thrown immediately, never retried). Throws the last
 * error after the final attempt.
 */
export async function pushInitial(args: PushInitialArgs): Promise<void> {
  const remote = args.remote ?? "origin";
  const branch = args.branch ?? "main";
  const attempts = Math.max(1, args.attempts ?? 1);
  const sleep = args.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const run =
    args.run ??
    ((cmd: string, cwd: string) => exec(cmd, { cwd, timeout: 30_000 }).then(() => undefined));
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      await run(`git push -u ${remote} ${branch}`, args.projectDir);
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/without `?workflow`? scope|workflow scope/i.test(msg)) {
        throw new WorkflowScopeError(args.projectDir);
      }
      lastErr = err;
      if (i < attempts) await sleep(args.delayMs ?? 1500);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
