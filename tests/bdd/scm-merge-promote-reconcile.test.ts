// reconcilePromoteRunState clears a promotion-merge conflict that is ONLY the per-feature
// pipeline.json ledger — by merging the base into the PR head and keeping the ledger at the RUN
// (head) side — so the PR goes mergeable WITHOUT untracking the ledger (it stays the durable,
// tracked run-state). A conflict on any non-ledger path must surface, not auto-resolve.

import { describe, it, expect, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { reconcilePromoteRunState, ScmMergeError } from "../../scripts/lakebase/scm-merge.js";

const LEDGER = ".consort/features/F1-x/pipeline.json";
const tmp: string[] = [];
afterEach(() => { while (tmp.length) { try { fs.rmSync(tmp.pop()!, { recursive: true, force: true }); } catch { /* best effort */ } } });
function mk(): string { const d = fs.mkdtempSync(path.join(os.tmpdir(), "promote-rec-")); tmp.push(d); return d; }
function git(cwd: string, args: string[]): string { return execFileSync("git", args, { cwd, encoding: "utf8" }).trim(); }
function cfg(dir: string): void {
  git(dir, ["config", "user.email", "t@e.com"]); git(dir, ["config", "user.name", "t"]);
  git(dir, ["config", "core.hooksPath", "/dev/null"]); // keep machine hooks out of the fixture
}
function write(dir: string, rel: string, body: string): void { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), body); }
function commit(dir: string, rel: string, body: string, msg: string): void { write(dir, rel, body); git(dir, ["add", rel]); git(dir, ["commit", "-m", msg]); }

/** A bare origin with `staging` + a feature branch forked from it; `extraStagingFile` lets a case
 *  diverge a NON-ledger file on staging too (to prove a real conflict surfaces). Returns the work
 *  clone checked out on the feature branch, ready for reconcilePromoteRunState(work, "staging"). */
function fixture(opts: { divergeLedger: boolean; divergeApp?: boolean }): string {
  const origin = mk(); git(origin, ["init", "--bare", "-b", "staging"]);
  const seed = mk(); git(seed, ["clone", origin, "."]); cfg(seed);
  commit(seed, LEDGER, '{"v":1}\n', "base ledger");
  commit(seed, "app.py", "# base\n", "base app");
  git(seed, ["push", "origin", "staging"]);
  git(seed, ["checkout", "-b", "feature-x"]);
  commit(seed, LEDGER, '{"v":"feature"}\n', "feature advances ledger"); // run side
  if (opts.divergeApp) commit(seed, "app.py", "# feature edit\n", "feature edits app"); // real divergence
  git(seed, ["push", "origin", "feature-x"]);
  git(seed, ["checkout", "staging"]);
  if (opts.divergeLedger) commit(seed, LEDGER, '{"v":"staging"}\n', "staging diverges ledger");
  if (opts.divergeApp) commit(seed, "app.py", "# staging edit\n", "staging diverges app"); // conflicts with feature's
  git(seed, ["push", "origin", "staging"]);
  const work = mk(); git(work, ["clone", "--branch", "feature-x", origin, "."]); cfg(work);
  return work;
}

describe("reconcilePromoteRunState", () => {
  it("resolves a ledger-only promotion conflict to the RUN side + keeps it tracked", async () => {
    const work = fixture({ divergeLedger: true });
    const r = await reconcilePromoteRunState(work, "staging");
    expect(r.reconciled).toBe(true);
    // The feature (run) ledger is kept…
    expect(fs.readFileSync(path.join(work, LEDGER), "utf8")).toBe('{"v":"feature"}\n');
    // …and it is still TRACKED (never untracked).
    expect(git(work, ["ls-files", "--", LEDGER])).toBe(LEDGER);
    // A merge commit now contains staging, so the PR is no longer conflicting.
    expect(git(work, ["rev-list", "--count", "--merges", "HEAD~1..HEAD"])).toBe("1");
    expect(git(work, ["merge-base", "--is-ancestor", "origin/staging", "HEAD"]) === "" ).toBe(true); // staging is an ancestor now
  });

  it("aborts and surfaces when a NON-ledger path also conflicts (real divergence isn't auto-resolved)", async () => {
    const work = fixture({ divergeLedger: true, divergeApp: true });
    await expect(reconcilePromoteRunState(work, "staging")).rejects.toMatchObject({ code: "promote-conflict" });
    // The merge was aborted — tree clean, no half-merge left behind.
    expect(git(work, ["status", "--porcelain"])).toBe("");
  });

  it("is a no-op when there is no conflict (clean promote needs no merge commit)", async () => {
    const work = fixture({ divergeLedger: false }); // staging unchanged since the fork
    const before = git(work, ["rev-parse", "HEAD"]);
    const r = await reconcilePromoteRunState(work, "staging");
    expect(r.reconciled).toBe(false);
    expect(git(work, ["rev-parse", "HEAD"])).toBe(before); // no merge commit added
  });

  it("checkpoints a dirty .consort/ tree before merging, but refuses on dirty non-run-state files", async () => {
    const work = fixture({ divergeLedger: true });
    fs.writeFileSync(path.join(work, "app.py"), "# uncommitted app edit\n"); // dirty, NOT .consort
    await expect(reconcilePromoteRunState(work, "staging")).rejects.toMatchObject({ code: "promote-conflict" });
    expect(ScmMergeError).toBeTruthy();
  });
});
