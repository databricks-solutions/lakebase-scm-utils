// mergePaired must switch to the merge target even when the disposable
// runtime-artifact churn (.consort/, .lakebase/, ...) is dirty + tracked — the
// per-story experiment accept commits its CODE but deliberately leaves that churn
// uncommitted, and a plain `git checkout <into>` ABORTS on it ("local changes would
// be overwritten"), wedging the merge. The fix force-checks-out past that churn but
// FIRST refuses if a dirty TRACKED file lives OUTSIDE the runtime-artifact ignore
// list, so -f never silently discards real source (same guard as assertCleanForFork).
//
// syncEnv:false keeps mergePaired to pure git (no Lakebase / .env resolution), so
// these run hermetically against a real repo like the fork-point tests.

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mergePaired } from "../../scripts/lakebase/paired-branch.js";

let root: string;
let repo: string;

const git = (cwd: string, ...argv: string[]): string =>
  execFileSync("git", argv, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

function commit(dir: string, file: string, body: string, msg: string): void {
  const abs = join(dir, file);
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, body);
  git(dir, "add", file);
  git(dir, "commit", "-q", "-m", msg);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "pb-merge-"));
  repo = join(root, "repo");
  mkdirSync(repo, { recursive: true });
  git(repo, "init", "-q", "-b", "main");
  git(repo, "config", "user.email", "t@example.com");
  git(repo, "config", "user.name", "Test");
  git(repo, "config", "commit.gpgsign", "false");
  // `into` = the feature branch (has the committed runtime-artifact file).
  commit(repo, "app.py", "print('v1')\n", "feat: base on main");
  commit(repo, ".consort/workflow-state.json", '{"phase":"build"}\n', "chore: seed runtime state");
  git(repo, "checkout", "-q", "-b", "feature");
  // `from` = an experiment branch off feature, with a real code change to merge.
  git(repo, "checkout", "-q", "-b", "experiment");
  commit(repo, "app.py", "print('v2')\n", "feat: experiment change");
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("mergePaired dirty-tree handling", () => {
  it("force-checks-out past dirty runtime-artifact churn and merges (the accept-path fix)", async () => {
    // On the experiment branch, dirty the disposable runtime state (tracked) — the
    // exact condition the accept path leaves behind. A plain checkout would abort.
    writeFileSync(join(repo, ".consort/workflow-state.json"), '{"phase":"awaiting-acceptance"}\n');
    expect(git(repo, "status", "--porcelain")).toContain(".consort/workflow-state.json");

    const res = await mergePaired({ cwd: repo, from: "experiment", into: "feature", syncEnv: false });

    expect(res.merged).toBe(true);
    expect(git(repo, "rev-parse", "--abbrev-ref", "HEAD")).toBe("feature");
    // The experiment's code change landed on feature.
    expect(execFileSync("git", ["show", "HEAD:app.py"], { cwd: repo, encoding: "utf8" })).toContain("v2");
  });

  it("refuses to force-checkout when a dirty TRACKED file lives OUTSIDE runtime artifacts", async () => {
    // A real uncommitted source edit must NOT be silently discarded by -f.
    writeFileSync(join(repo, "app.py"), "print('uncommitted work')\n");
    await expect(
      mergePaired({ cwd: repo, from: "experiment", into: "feature", syncEnv: false }),
    ).rejects.toThrow(/uncommitted changes to tracked files outside runtime artifacts/i);
    // And it left HEAD where it was (no partial switch).
    expect(git(repo, "rev-parse", "--abbrev-ref", "HEAD")).toBe("experiment");
  });
});
