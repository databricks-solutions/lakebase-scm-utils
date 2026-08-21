// Hermetic tests for the cleanup/destroy bin. Inject listBranches/deleteBranch/
// deleteProject so no real Lakebase is touched. Covers classification, dry-run
// default, tier+trunk protection, project double-confirm, and partial failure.

import { describe, it, expect } from "vitest";
import { runCleanup, ScmCleanupError } from "../../scripts/lakebase/scm-cleanup.js";
import type { LakebaseBranchInfo } from "../../scripts/lakebase/branch-utils.js";

function mkBranch(nameLeaf: string, o: Partial<LakebaseBranchInfo> = {}): LakebaseBranchInfo {
  return { nameLeaf, name: `projects/p/branches/${nameLeaf}`, uid: `br-${nameLeaf}`, state: "READY", ...o } as unknown as LakebaseBranchInfo;
}

const BRANCHES: LakebaseBranchInfo[] = [
  mkBranch("production", { isDefault: true }),
  mkBranch("staging"), // long-running tier (no expireTime)
  mkBranch("feature-x", { expireTime: "2026-09-01T00:00:00Z" }), // ephemeral
  mkBranch("spike-y", { expireTime: "2026-09-01T00:00:00Z" }), // ephemeral
];

function harness() {
  const deleted: string[] = [];
  const projectsDeleted: string[] = [];
  return {
    deleted,
    projectsDeleted,
    listBranches: async () => BRANCHES,
    deleteBranch: async (a: { branch: string }) => { deleted.push(a.branch); },
    deleteProject: async (a: { projectId: string }) => { projectsDeleted.push(a.projectId); },
  };
}

describe("runCleanup", () => {
  it("list classifies trunk/tier/ephemeral and deletes nothing", async () => {
    const h = harness();
    const r = await runCleanup("list", { instance: "p", ...h });
    expect(r.dryRun).toBe(true);
    expect(r.counts).toEqual({ trunk: 1, tiers: 1, ephemeral: 2 });
    expect(h.deleted).toEqual([]);
    const byRes = Object.fromEntries(r.actions.map((a) => [a.resource, a]));
    expect(byRes["production"].kind).toBe("trunk");
    expect(byRes["staging"].kind).toBe("tier");
    expect(byRes["feature-x"].action).toBe("delete");
    expect(byRes["staging"].action).toBe("skip");
  });

  it("branches (dry-run) plans ephemeral deletes but calls delete for none", async () => {
    const h = harness();
    const r = await runCleanup("branches", { instance: "p", ...h }); // apply defaults false
    expect(r.dryRun).toBe(true);
    expect(h.deleted).toEqual([]);
    const planned = r.actions.filter((a) => a.action === "delete").map((a) => a.resource).sort();
    expect(planned).toEqual(["feature-x", "spike-y"]);
  });

  it("branches --yes deletes ONLY ephemeral; trunk + tiers protected", async () => {
    const h = harness();
    const r = await runCleanup("branches", { instance: "p", apply: true, ...h });
    expect(h.deleted.sort()).toEqual(["feature-x", "spike-y"]);
    expect(h.deleted).not.toContain("production");
    expect(h.deleted).not.toContain("staging");
    expect(r.applied).toBe(true);
  });

  it("branches respects isProtected on an ephemeral branch", async () => {
    const h = harness();
    h.listBranches = async () => [mkBranch("feature-locked", { expireTime: "2026-09-01T00:00:00Z", isProtected: true })];
    const r = await runCleanup("branches", { instance: "p", apply: true, ...h });
    expect(h.deleted).toEqual([]);
    expect(r.actions[0].action).toBe("skip");
    expect(r.actions[0].reason).toBe("isProtected");
  });

  it("branches --yes reports partial failure and keeps going (non-applied)", async () => {
    const h = harness();
    h.deleteBranch = async (a: { branch: string }) => {
      if (a.branch === "feature-x") throw new Error("boom");
      h.deleted.push(a.branch);
    };
    const r = await runCleanup("branches", { instance: "p", apply: true, ...h });
    expect(h.deleted).toEqual(["spike-y"]); // still attempted the other one
    expect(r.applied).toBe(false);
    const failed = r.actions.find((a) => a.resource === "feature-x")!;
    expect(failed.ok).toBe(false);
    expect(failed.error).toContain("boom");
  });

  it("project WITHOUT a matching --confirm refuses to delete", async () => {
    const h = harness();
    await expect(
      runCleanup("project", { instance: "p", apply: true, confirmProjectId: "wrong", ...h })
    ).rejects.toBeInstanceOf(ScmCleanupError);
    expect(h.projectsDeleted).toEqual([]);
  });

  it("project WITH matching --confirm deletes the project", async () => {
    const h = harness();
    const r = await runCleanup("project", { instance: "p", apply: true, confirmProjectId: "p", ...h });
    expect(h.projectsDeleted).toEqual(["p"]);
    expect(r.applied).toBe(true);
    expect(r.actions.some((a) => a.kind === "project" && a.ok === true)).toBe(true);
  });

  it("project dry-run plans the destroy without confirm and deletes nothing", async () => {
    const h = harness();
    const r = await runCleanup("project", { instance: "p", ...h }); // apply false
    expect(r.dryRun).toBe(true);
    expect(h.projectsDeleted).toEqual([]);
    expect(r.actions.some((a) => a.kind === "project" && a.action === "delete")).toBe(true);
  });
});
