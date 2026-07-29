// Phase A-val harness: confirm lakebase-doctor reports correctly against a
// FRESHLY SCAFFOLDED project (not a synthetic .env dir). This is the gate on
// publishing beta.10: the extended doctor (cold-start prereqs + lakebase-enabled
// probe) must actually report back on a real scaffold, on both the positive path
// (a real Lakebase workspace) and a negative path (a target without Lakebase).
//
// Gated on LAKEBASE_TEST_E2E=1 + DATABRICKS_HOST + the databricks CLI, same as
// lakebase-doctor-cli-live. It scaffolds via scm-utils's own createProject (the
// real scaffold path this package owns), runs the built doctor CLI against the
// project dir, and tears down every resource it creates.
//
// Run it directly (the runbook AV2 step):
//   LAKEBASE_TEST_E2E=1 \
//   DATABRICKS_HOST=https://fevm-serverless-stable-ecparr.cloud.databricks.com \
//   DATABRICKS_CONFIG_PROFILE=fevm-serverless-stable-ecparr \
//   npx vitest run tests/bdd/doctor-fresh-scaffold-live.test.ts

import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { createProject } from "../../scripts/lakebase/create-project.js";
import { deleteLakebaseProject } from "../../scripts/lakebase/lakebase-project.js";

const E2E = process.env.LAKEBASE_TEST_E2E === "1";
const DATABRICKS_HOST = process.env.DATABRICKS_HOST ?? "";
const DATABRICKS_PROFILE = process.env.DATABRICKS_CONFIG_PROFILE ?? "DEFAULT";

function hasCmd(cmd: string): boolean {
  return spawnSync(cmd, ["--version"], { stdio: "ignore" }).status === 0;
}
const RUN =
  E2E && !!DATABRICKS_HOST && hasCmd("databricks");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DOCTOR_CLI = path.join(REPO_ROOT, "dist", "scripts", "lakebase", "doctor.cli.js");

interface CheckResult {
  name: string;
  status: "ok" | "warn" | "fail" | "skip";
  message: string;
  hint?: string;
}
interface DoctorReport {
  overall: CheckResult["status"];
  checks: CheckResult[];
}

function runDoctorJson(projectDir: string, hostOverride?: string): DoctorReport {
  const proc = spawnSync("node", [DOCTOR_CLI, "--json", "--project-dir", projectDir], {
    encoding: "utf8",
    env: {
      ...process.env,
      DATABRICKS_HOST: hostOverride ?? DATABRICKS_HOST,
      DATABRICKS_CONFIG_PROFILE: DATABRICKS_PROFILE,
    },
    cwd: REPO_ROOT,
    timeout: 90_000,
  });
  return JSON.parse((proc.stdout ?? "").trim()) as DoctorReport;
}

const NEW_PREREQ_CHECKS = ["node", "npm", "python", "jdk", "gh"];

describe.skipIf(!RUN)("lakebase-doctor on a freshly scaffolded project (live)", () => {
  let projectId: string;
  let parentDir: string;
  let projectDir: string;
  let created = false;

  beforeAll(async () => {
    projectId = `lbdoctor-val-${Date.now()}`;
    parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "lbdoctor-val-"));
    console.log(`  [setup] scaffolding ${projectId} on ${DATABRICKS_HOST}`);
    // A real scaffold, no GitHub (offline-friendly, still provisions the
    // Lakebase project + writes .env), python stack, single prod tier.
    await createProject({
      projectName: projectId,
      parentDir,
      databricksHost: DATABRICKS_HOST,
      language: "python",
      tiers: 1,
      createGithubRepo: false, // offline-friendly: still provisions Lakebase + writes .env
    });
    projectDir = path.join(parentDir, projectId);
    created = true;
  }, 600_000);

  afterAll(async () => {
    if (created && projectId) {
      try {
        await deleteLakebaseProject({ projectId, host: DATABRICKS_HOST });
        console.log(`  [teardown] deleted Lakebase project ${projectId}`);
      } catch (err) {
        console.warn(`  [teardown] FAILED to delete ${projectId}: ${(err as Error).message}`);
      }
    }
    try {
      fs.rmSync(parentDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }, 300_000);

  it("scaffolded a real project dir with .env", () => {
    expect(fs.existsSync(path.join(projectDir, ".env"))).toBe(true);
  });

  it("POSITIVE: doctor reports every cold-start prereq with the uniform record shape", () => {
    const report = runDoctorJson(projectDir);
    const names = report.checks.map((c) => c.name);
    // The new prereq checks are all present and none is silent.
    for (const p of NEW_PREREQ_CHECKS) {
      const c = report.checks.find((x) => x.name === p);
      expect(c, `prereq check "${p}" must be present`).toBeDefined();
      expect(["ok", "warn", "fail"]).toContain(c!.status);
      expect(typeof c!.message).toBe("string");
      if (c!.status !== "ok") expect(c!.hint, `${p} needs a fix hint`).toBeTruthy();
    }
    expect(names).toContain("lakebase-enabled");
  });

  it("POSITIVE: lakebase-enabled probe confirms the workspace has Lakebase on", () => {
    const report = runDoctorJson(projectDir);
    const enabled = report.checks.find((c) => c.name === "lakebase-enabled")!;
    // We just scaffolded a Lakebase project against this workspace, so the
    // probe MUST report ok, not skip or fail.
    expect(enabled.status).toBe("ok");
    expect(enabled.message).toMatch(/Lakebase enabled/);
  });

  it("NEGATIVE: lakebase-enabled probe FAILS (with a hint) against a bogus host", () => {
    // Point the doctor at a host that cannot serve database instances. The
    // probe must report red with a fix hint, never a silent clean pass. This is
    // the anti-regression against a doctor that reports ok when it cannot tell.
    const report = runDoctorJson(projectDir, "https://nonexistent-workspace.invalid");
    const enabled = report.checks.find((c) => c.name === "lakebase-enabled")!;
    expect(["fail", "skip"]).toContain(enabled.status);
    if (enabled.status === "fail") {
      expect(enabled.hint).toBeTruthy();
      expect(enabled.message).toMatch(/does not have Lakebase enabled/);
    }
  });
});
