// resolveGitBase reconciles a feature's Lakebase parent (parent_branch) with a
// real GIT branch for prepare-pr / scm-merge. Tier-2/3 parents (staging/dev) are
// git branches and pass through; a tier-1 Lakebase default name that is NOT a git
// branch (e.g. "production" while the git trunk is "main") falls back to the git
// trunk, so the git ops never target a nonexistent branch. Driven against a real
// temp git repo (no mocks).

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gitBranchExists, resolveDefaultBranch } from "../../scripts/git/inspect.js";
import { resolveGitBase } from "../../scripts/lakebase/scm-git-base.js";

let cwd: string;

function git(...args: string[]): void {
  execFileSync("git", args, { cwd, stdio: "pipe" });
}

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "scm-git-base-"));
  git("init", "-q", "-b", "main");
  git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "init");
  git("branch", "staging");
  git("branch", "dev");
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

describe("gitBranchExists", () => {
  it("is true for a real local branch", async () => {
    expect(await gitBranchExists({ cwd, branch: "main" })).toBe(true);
    expect(await gitBranchExists({ cwd, branch: "staging" })).toBe(true);
  });
  it("is false for a Lakebase-only name that has no git branch", async () => {
    expect(await gitBranchExists({ cwd, branch: "production" })).toBe(false);
  });
  it("is false for an empty branch name", async () => {
    expect(await gitBranchExists({ cwd, branch: "" })).toBe(false);
  });
});

describe("resolveDefaultBranch", () => {
  it("falls back to the local trunk (main) when there is no origin", async () => {
    expect(await resolveDefaultBranch({ cwd })).toBe("main");
  });
  it("finds master when the trunk is master", async () => {
    const c2 = mkdtempSync(join(tmpdir(), "scm-git-base-master-"));
    try {
      execFileSync("git", ["init", "-q", "-b", "master", c2], { stdio: "pipe" });
      execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "i"], { cwd: c2, stdio: "pipe" });
      expect(await resolveDefaultBranch({ cwd: c2 })).toBe("master");
    } finally {
      rmSync(c2, { recursive: true, force: true });
    }
  });
});

describe("resolveGitBase", () => {
  it("tier-2/3: returns the parent when it IS a git branch (staging / dev)", async () => {
    expect(await resolveGitBase("staging", cwd)).toBe("staging");
    expect(await resolveGitBase("dev", cwd)).toBe("dev");
  });

  it("tier-1: falls back to the git trunk when the Lakebase default name is not a git branch", async () => {
    // parent_branch = "production" (the Lakebase default), but the git trunk is
    // "main" and there is no git 'production' branch.
    expect(await resolveGitBase("production", cwd)).toBe("main");
  });

  it("returns the trunk directly when parent already equals it", async () => {
    expect(await resolveGitBase("main", cwd)).toBe("main");
  });
});
