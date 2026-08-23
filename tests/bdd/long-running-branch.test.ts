// createLongRunningBranch must forward the workspace host to the Lakebase branch
// create , without it, the tier-cut resolved auth ambiently and fell back to the
// DEFAULT profile, so a `--tiers 2` create silently failed to cut staging.

import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  createBranch: vi.fn(),
  execSync: vi.fn(),
}));

vi.mock("../../scripts/lakebase/branch-create.js", () => ({ createBranch: h.createBranch }));
vi.mock("node:child_process", () => ({ execSync: h.execSync, default: { execSync: h.execSync } }));

import { createLongRunningBranch } from "../../scripts/lakebase/long-running-branch.js";

beforeEach(() => {
  h.createBranch.mockReset();
  h.execSync.mockReset();
  h.createBranch.mockResolvedValue({ name: "projects/p/branches/staging", state: "READY" });
});

describe("createLongRunningBranch", () => {
  it("forwards the workspace host (+ instance/branch/noExpiry) to the Lakebase branch create", async () => {
    await createLongRunningBranch({
      name: "staging",
      forkFromBranch: "main",
      projectId: "proj-123",
      workTreeDir: "/tmp/wt",
      databricksHost: "https://ecparr.example.com",
    });
    expect(h.createBranch).toHaveBeenCalledTimes(1);
    const arg = h.createBranch.mock.calls[0][0];
    expect(arg.host).toBe("https://ecparr.example.com"); // the fix: host is threaded
    expect(arg.instance).toBe("proj-123");
    expect(arg.branch).toBe("staging");
    expect(arg.noExpiry).toBe(true);
  });

  it("cuts the git side off forkFromBranch and pushes it", async () => {
    await createLongRunningBranch({
      name: "staging",
      forkFromBranch: "main",
      projectId: "proj-123",
      workTreeDir: "/tmp/wt",
      databricksHost: "https://h",
    });
    const cmds = h.execSync.mock.calls.map((c) => String(c[0])).join("\n");
    expect(cmds).toContain("git branch -f staging main");
    expect(cmds).toContain("git push -u origin staging");
  });
});
