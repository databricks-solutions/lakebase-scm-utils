// BDD coverage for reconcileTierToOrigin: the local tier ref fast-forwards to
// origin/<tier> after a remote merge WITHOUT needing a checkout, so a promote
// interrupted after the remote merge can't leave the local tier behind (the
// stockflow F1 case: local staging missed the merge, the next push rejected
// non-fast-forward).

import { describe, it, expect, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { reconcileTierToOrigin } from "../../scripts/lakebase/scm-merge.js";

const tmpDirs: string[] = [];
function mkTmp(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tier-reconcile-"));
  tmpDirs.push(dir);
  return dir;
}
afterEach(() => {
  while (tmpDirs.length) {
    const dir = tmpDirs.pop();
    if (dir) {
      try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ }
    }
  }
});

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}
function initGit(dir: string, args?: string[]): void {
  git(dir, ["init", "-b", "main"]);
  git(dir, ["config", "user.email", "test@example.com"]);
  git(dir, ["config", "user.name", "test"]);
  // Hermetic: keep the machine's global git hooks (a user-level core.hooksPath
  // with secret-scanning/pre-push hooks) OUT of the fixture repos.
  git(dir, ["config", "core.hooksPath", "/dev/null"]);
}
function commitFile(dir: string, rel: string, body: string, msg: string): string {
  fs.writeFileSync(path.join(dir, rel), body);
  git(dir, ["add", rel]);
  git(dir, ["commit", "-m", msg]);
  return git(dir, ["rev-parse", "HEAD"]);
}

/** origin (bare) + a seed clone (pushes commits) + a work clone (the local tier). */
function fixture(): { origin: string; seed: string; work: string } {
  const origin = mkTmp();
  git(origin, ["init", "--bare", "-b", "main"]);
  const seed = mkTmp();
  git(seed, ["clone", origin, "."]);
  initGit(seed);
  git(seed, ["checkout", "-b", "staging"]);
  commitFile(seed, "app.py", "# v1\n", "v1");
  git(seed, ["push", "origin", "staging"]);
  // Point origin's HEAD at staging so clones land on a real branch (not an
  // unborn main), giving the work clone a resolvable HEAD.
  git(origin, ["symbolic-ref", "HEAD", "refs/heads/staging"]);
  const work = mkTmp();
  git(work, ["clone", origin, "."]);
  initGit(work);
  return { origin, seed, work };
}

describe("reconcileTierToOrigin", () => {
  it("fast-forwards the local tier ref to origin without a checkout (HEAD on another branch)", async () => {
    const { seed, work } = fixture();
    git(work, ["checkout", "-b", "feature/f1"]);
    // The "remote merge": origin/staging advances past the work clone's staging.
    const merged = commitFile(seed, "app.py", "# v2 (merged)\n", "merge F1");
    git(seed, ["push", "origin", "staging"]);
    expect(git(work, ["rev-parse", "staging"])).not.toBe(merged);

    const warning = await reconcileTierToOrigin({ cwd: work, tier: "staging" });

    expect(warning).toBeNull();
    expect(git(work, ["rev-parse", "staging"])).toBe(merged);
    expect(git(work, ["rev-parse", "--abbrev-ref", "HEAD"])).toBe("feature/f1"); // HEAD untouched
  });

  it("syncs via pull --ff-only when HEAD IS the tier (ref + working tree)", async () => {
    const { seed, work } = fixture();
    git(work, ["checkout", "staging"]);
    const merged = commitFile(seed, "app.py", "# v2 (merged)\n", "merge F1");
    git(seed, ["push", "origin", "staging"]);

    const warning = await reconcileTierToOrigin({ cwd: work, tier: "staging" });

    expect(warning).toBeNull();
    expect(git(work, ["rev-parse", "staging"])).toBe(merged);
    expect(fs.readFileSync(path.join(work, "app.py"), "utf8")).toContain("v2 (merged)");
  });

  it("returns a warning (never throws) when the local tier has diverged (not a fast-forward)", async () => {
    const { seed, work } = fixture();
    git(work, ["checkout", "staging"]);
    commitFile(work, "local.txt", "local sprint plan\n", "sprint-2 plan commit");
    const localTip = git(work, ["rev-parse", "staging"]);
    commitFile(seed, "app.py", "# v2 (merged)\n", "merge F1");
    git(seed, ["push", "origin", "staging"]);

    const warning = await reconcileTierToOrigin({ cwd: work, tier: "staging" });

    expect(warning).toMatch(/local reconcile of staging to origin\/staging failed/);
    expect(git(work, ["rev-parse", "staging"])).toBe(localTip); // unchanged, no destructive ff
  });
});
