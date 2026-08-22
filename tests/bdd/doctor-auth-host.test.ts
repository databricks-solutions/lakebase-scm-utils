// Hermetic test for the doctor's auth-host threading + host->profile resolution.
//
// The bug: when a caller pins the TARGET workspace host (create-project's
// --databricks-host) but no explicit profile, runDoctor left the profile unset,
// so `databricks auth token` fell back to the DEFAULT profile (whose token may be
// stale) and the doctor failed spuriously. The fix resolves the profile that
// matches the pinned host up front AND threads the host (sets DATABRICKS_HOST)
// into the auth + identity checks.
//
// We mock the three seams runDoctor talks to (databricks-cli / -profile / -host)
// so no real CLI runs, and assert both halves of the fix. checkPrerequisites runs
// real local tool-version probes (node/python/etc.) but hits none of these mocks
// and does not affect the assertions.

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

const h = vi.hoisted(() => ({
  calls: [] as { args: string[]; opts: Record<string, unknown> | undefined }[],
  resolveProfileForHost: vi.fn(async (_host: string) => "resolved-prof"),
  resolveDatabricksHost: vi.fn(async () => "https://target.example.com"),
}));

vi.mock("../../scripts/lakebase/databricks-cli.js", () => ({
  runDatabricks: vi.fn(async (args: string[], opts?: Record<string, unknown>) => {
    h.calls.push({ args, opts });
    const j = args.join(" ");
    if (j.includes("--version")) return "Databricks CLI v1.10.0";
    if (j.includes("auth token")) return JSON.stringify({ access_token: "x" });
    if (j.includes("auth describe"))
      return JSON.stringify({ details: { host: opts?.host ?? "https://target.example.com" } });
    if (j.includes("current-user me")) return JSON.stringify({ userName: "me@example.com" });
    if (j.includes("list-database-instances")) return "[]";
    return "{}";
  }),
}));

vi.mock("../../scripts/lakebase/databricks-profile.js", () => ({
  resolveProfileForHost: h.resolveProfileForHost,
}));

vi.mock("../../scripts/lakebase/databricks-host.js", () => ({
  resolveDatabricksHost: h.resolveDatabricksHost,
}));

import { runDoctor } from "../../scripts/lakebase/doctor.js";

const TARGET = "https://target.example.com";

describe("runDoctor auth-host threading", () => {
  let projectDir: string;
  beforeEach(() => {
    h.calls.length = 0;
    h.resolveProfileForHost.mockClear();
    projectDir = fs.mkdtempSync(path.join(os.tmpdir(), "doctor-host-"));
  });

  const authTokenCall = () =>
    h.calls.find((c) => c.args.join(" ").includes("auth token"));

  it("resolves the profile from the pinned host and threads host+profile into the auth check", async () => {
    await runDoctor({ host: TARGET, projectDir });

    // half 1: host -> profile resolution ran against the pinned host
    expect(h.resolveProfileForHost).toHaveBeenCalledWith(TARGET);

    // half 2: the auth-token check runs against the target workspace, not the
    // DEFAULT profile fallback
    const auth = authTokenCall();
    expect(auth).toBeDefined();
    expect(auth!.opts?.host).toBe(TARGET);
    expect(auth!.opts?.profile).toBe("resolved-prof");
  });

  it("does NOT resolve a profile when the caller already pinned one (explicit profile wins)", async () => {
    await runDoctor({ host: TARGET, profile: "explicit-prof", projectDir });

    expect(h.resolveProfileForHost).not.toHaveBeenCalled();
    const auth = authTokenCall();
    expect(auth!.opts?.host).toBe(TARGET);
    expect(auth!.opts?.profile).toBe("explicit-prof");
  });
});
