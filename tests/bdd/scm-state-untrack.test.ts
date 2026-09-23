// BDD coverage for the runtime SCM claim-state untracking (issue #203 / Finding 28):
// a git-tracked .lakebase/workflow-state.json gets a branch-committed STALE claim
// restored over the live one by every checkout/reset, blocking the next feature's
// claim until a manual abandon+reclaim. writeWorkflowState now self-heals on every
// write: untrack the file (index-only) + cover it in .gitignore, so the live claim
// survives checkouts. The committed kit-ref / scm-utils-ref stay tracked.

import { describe, it, expect, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  writeWorkflowState,
  isGitTracked,
  type ScmWorkflowState,
} from "../../scripts/lakebase/scm-workflow-state.js";

const tmpDirs: string[] = [];
function mkRepo(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "scm-untrack-"));
  tmpDirs.push(dir);
  const git = (args: string[]) => execFileSync("git", args, { cwd: dir, stdio: "ignore" });
  git(["init", "-b", "main"]);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "test"]);
  fs.writeFileSync(path.join(dir, "app.py"), "# app\n");
  git(["add", "-A"]);
  git(["commit", "-m", "base"]);
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

const STATE: ScmWorkflowState = {
  version: 1,
  state: "merged",
  tier_topology: 2,
  project_id: "stockflow-x",
  feature_id: "F1",
  branch: "feature/f1",
  parent_branch: "staging",
  lakebase_branch_uid: "br-abc123",
  claimed_at: "2026-09-22T10:00:00Z",
  pr_url: "https://github.com/o/r/pull/1",
  pushed_at: "2026-09-22T11:00:00Z",
  ci_run_url: "https://github.com/o/r/actions/runs/1",
  ci_green_at: "2026-09-22T12:00:00Z",
  merged_at: "2026-09-22T13:00:00Z",
} as ScmWorkflowState;

const REL = ".lakebase/workflow-state.json";

function trackFile(dir: string, rel: string, body: string): void {
  const abs = path.join(dir, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
  execFileSync("git", ["add", rel], { cwd: dir, stdio: "ignore" });
}

describe("writeWorkflowState: self-heals a git-tracked claim state (issue #203)", () => {
  it("untracks a tracked workflow-state.json + covers it in .gitignore, still writing the state", () => {
    const dir = mkRepo();
    trackFile(dir, REL, '{"state":"feature-claimed"}\n');
    execFileSync("git", ["commit", "-m", "track the claim state"], { cwd: dir, stdio: "ignore" });
    expect(isGitTracked(dir, REL)).toBe(true);

    writeWorkflowState(dir, STATE);

    expect(isGitTracked(dir, REL)).toBe(false);
    const written = JSON.parse(fs.readFileSync(path.join(dir, REL), "utf8")) as ScmWorkflowState;
    expect(written.state).toBe("merged");
    const gitignore = fs.readFileSync(path.join(dir, ".gitignore"), "utf8");
    expect(gitignore).toContain(".lakebase/workflow-state.json");
  });

  it("leaves the committed pins (kit-ref / scm-utils-ref) tracked", () => {
    const dir = mkRepo();
    trackFile(dir, REL, '{"state":"feature-claimed"}\n');
    trackFile(dir, ".lakebase/kit-ref", "v0.3.97\n");
    execFileSync("git", ["commit", "-m", "track state + pin"], { cwd: dir, stdio: "ignore" });

    writeWorkflowState(dir, STATE);

    expect(isGitTracked(dir, REL)).toBe(false);
    expect(isGitTracked(dir, ".lakebase/kit-ref")).toBe(true);
  });

  it("is idempotent: a second write does not duplicate the .gitignore entry", () => {
    const dir = mkRepo();
    writeWorkflowState(dir, STATE);
    writeWorkflowState(dir, STATE);
    const gitignore = fs.readFileSync(path.join(dir, ".gitignore"), "utf8");
    const entries = gitignore.split("\n").filter((l) => l.trim() === ".lakebase/workflow-state.json");
    expect(entries).toHaveLength(1);
  });

  it("lands the write even outside a git repo (advisory, never blocks the state machine)", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "scm-untrack-nogit-"));
    tmpDirs.push(dir);
    writeWorkflowState(dir, STATE);
    const written = JSON.parse(fs.readFileSync(path.join(dir, REL), "utf8")) as ScmWorkflowState;
    expect(written.state).toBe("merged");
  });
});

describe(".gitignore.base template", () => {
  it("ignores the runtime claim state so new scaffolds are untracked from birth", () => {
    const template = fs.readFileSync(
      path.join(__dirname, "..", "..", "templates", "project", "common", ".gitignore.base"),
      "utf8",
    );
    expect(template).toContain(".lakebase/workflow-state.json");
    // And keeps the committed pins tracked (only the .local overrides are ignored).
    expect(template).toContain(".lakebase/kit-ref.local");
    expect(template).not.toMatch(/^\.lakebase\/kit-ref$/m);
  });
});
