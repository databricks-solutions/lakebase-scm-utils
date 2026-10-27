// Fast verify-branch provisioning: branch copy-on-write from a snapshot
// (source_snapshot) or from a branch at a point-in-time (source_branch +
// source_branch_time/lsn), instead of fork + `alembic upgrade head`. These
// assert the create-branch / create-snapshot REQUEST SPEC is built correctly
// (the Lakebase API's mutually-exclusive source groups) — hermetic, CLI mocked.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { LakebaseBranchInfo } from "../../scripts/lakebase/branch-utils.js";
import { buildSnapshotSpec } from "../../scripts/lakebase/snapshot.js";

describe("buildSnapshotSpec (pure)", () => {
  it("captures a branch with source_branch + default no_expiry", () => {
    // NB: projectPath is mocked file-wide to a constant, so the instance folds to test-project.
    const spec = buildSnapshotSpec({ instance: "proj", snapshot: "snap-1", sourceBranch: "staging" });
    expect(spec).toEqual({ source_branch: "projects/test-project/branches/staging", no_expiry: true });
  });
  it("adds source_branch_time for a PITR snapshot (and keeps ttl over no_expiry)", () => {
    const spec = buildSnapshotSpec({
      instance: "proj",
      snapshot: "s",
      sourceBranch: "projects/proj/branches/production",
      sourceBranchTime: "2026-10-20T15:04:05Z",
      ttl: "604800s",
    });
    expect(spec).toEqual({
      source_branch: "projects/proj/branches/production",
      source_branch_time: "2026-10-20T15:04:05Z",
      ttl: "604800s",
    });
  });
  it("rejects time + lsn together, and ttl + noExpiry together", () => {
    expect(() => buildSnapshotSpec({ instance: "p", snapshot: "s", sourceBranch: "b", sourceBranchTime: "t", sourceBranchLsn: "0/1" })).toThrow(/mutually exclusive/);
    expect(() => buildSnapshotSpec({ instance: "p", snapshot: "s", sourceBranch: "b", ttl: "1s", noExpiry: true })).toThrow(/mutually exclusive/);
  });
});

// ─── createBranch source variants (spec capture via mocked CLI) ───────────────
const mockGetBranchByName = vi.fn();
const mockExecFile = vi.fn();

vi.mock("node:child_process", async () => {
  const actual = await vi.importActual<typeof import("node:child_process")>("node:child_process");
  return { ...actual, execFile: (...args: unknown[]) => mockExecFile(...args) };
});
vi.mock("../../scripts/lakebase/branch-utils.js", async () => {
  const actual = await vi.importActual<typeof import("../../scripts/lakebase/branch-utils.js")>("../../scripts/lakebase/branch-utils.js");
  return { ...actual, getBranchByName: (...a: unknown[]) => mockGetBranchByName(...a), projectPath: () => "projects/test-project" };
});

const { createBranch } = await import("../../scripts/lakebase/branch-create.js");

function readyBranch(leaf: string): LakebaseBranchInfo {
  return { name: `projects/test-project/branches/${leaf}`, nameLeaf: leaf, uid: `br-${leaf}`, state: "READY", isDefault: false } as unknown as LakebaseBranchInfo;
}
function okExecFile() {
  return (...args: unknown[]) => {
    const cb = args[args.length - 1] as (e: Error | null, v?: { stdout: string; stderr: string }) => void;
    cb(null, { stdout: "", stderr: "" });
  };
}
/** The spec sent on the (only) create-branch CLI invocation. */
function capturedSpec(): Record<string, unknown> {
  const call = mockExecFile.mock.calls.find((c) => Array.isArray(c[1]) && (c[1] as string[]).includes("create-branch"));
  const argv = call![1] as string[];
  return JSON.parse(argv[argv.indexOf("--json") + 1]).spec;
}

beforeEach(() => {
  mockGetBranchByName.mockReset();
  mockExecFile.mockReset().mockImplementation(okExecFile());
});
afterEach(() => vi.restoreAllMocks());

describe("createBranch – snapshot / PITR source variants", () => {
  it("fromSnapshot sets spec.source_snapshot and NO source_branch", async () => {
    let made = false;
    mockGetBranchByName.mockImplementation((n: string) => Promise.resolve(n === "v-snap" && made ? readyBranch("v-snap") : (n === "v-snap" ? ((made = true), undefined) : undefined)));
    await createBranch({ instance: "test-project", branch: "v-snap", fromSnapshot: "snap-base" });
    const spec = capturedSpec();
    expect(spec.source_snapshot).toBe("projects/test-project/snapshots/snap-base");
    expect(spec.source_branch).toBeUndefined();
    expect(spec.no_expiry).toBe(true);
  });

  it("parentBranch + sourceBranchTime sets source_branch + source_branch_time (PITR from the higher env)", async () => {
    let made = false;
    mockGetBranchByName.mockImplementation((n: string) => {
      if (n === "staging") return Promise.resolve(readyBranch("staging"));
      if (n === "v-pitr") return Promise.resolve(made ? readyBranch("v-pitr") : ((made = true), undefined));
      return Promise.resolve(undefined);
    });
    await createBranch({ instance: "test-project", branch: "v-pitr", parentBranch: "staging", sourceBranchTime: "2026-10-20T15:04:05Z" });
    const spec = capturedSpec();
    expect(spec.source_branch).toBe("projects/test-project/branches/staging");
    expect(spec.source_branch_time).toBe("2026-10-20T15:04:05Z");
    expect(spec.source_snapshot).toBeUndefined();
  });

  it("refuses fromSnapshot combined with a source_branch field (API mutual exclusion)", async () => {
    await expect(createBranch({ instance: "test-project", branch: "x", fromSnapshot: "s", parentBranch: "staging" })).rejects.toThrow(/mutually exclusive/);
  });
});
