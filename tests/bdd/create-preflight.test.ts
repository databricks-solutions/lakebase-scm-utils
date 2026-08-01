// Hermetic coverage for the create-project preflight + cleanup helpers
// (W5 auth precondition, W3 warm+verify, W9 rollback). Each is unit-testable
// without running the full createProject orchestration or touching a workspace.

import { describe, it, expect, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  warmAndVerifyKit,
  kitWarmWarning,
  databricksAuthPrereqMessage,
  withLakebaseRollback,
  validateCreateInputs,
  dirIsEmpty,
  checkDatabricksAuth,
} from "../../scripts/lakebase/create-preflight.js";

const tmpDirs: string[] = [];
afterEach(() => {
  while (tmpDirs.length) {
    const dir = tmpDirs.pop();
    if (dir) try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* */ }
  }
});

function mkProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-preflight-"));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, "scripts"));
  return dir;
}

// A stub `scripts/lk` whose `--warm` and bin runs exit with a chosen status,
// emitting a marker on stderr so the helper's reason capture is observable.
function writeStubLk(projectDir: string, warmExit: number, verifyExit = 0): void {
  const lk = path.join(projectDir, "scripts", "lk");
  fs.writeFileSync(
    lk,
    [
      "#!/usr/bin/env bash",
      'if [ "$1" = "--warm" ]; then',
      `  echo "stub warm stderr" >&2`,
      `  exit ${warmExit}`,
      "fi",
      `echo "stub verify stderr" >&2`,
      `exit ${verifyExit}`,
      "",
    ].join("\n"),
  );
  fs.chmodSync(lk, 0o755);
}

describe("W3: warmAndVerifyKit", () => {
  it("ok when warm exits 0 and a CLI resolves", () => {
    const dir = mkProject();
    writeStubLk(dir, 0, 0);
    expect(warmAndVerifyKit(dir)).toEqual({ ok: true });
  });

  it("fails with a reason when warm exits nonzero", () => {
    const dir = mkProject();
    writeStubLk(dir, 1);
    const res = warmAndVerifyKit(dir);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/stub warm stderr|exited/);
  });

  it("fails when warm succeeds but the CLI does not resolve", () => {
    const dir = mkProject();
    writeStubLk(dir, 0, 3);
    const res = warmAndVerifyKit(dir);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/did not resolve/);
  });

  it("fails clearly when the lk shim is missing entirely", () => {
    const dir = mkProject();
    const res = warmAndVerifyKit(dir);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/scripts\/lk shim missing/);
  });

  it("kitWarmWarning is specific + actionable", () => {
    const msg = kitWarmWarning("/p", "network down");
    expect(msg).toMatch(/network down/);
    expect(msg).toMatch(/\.\/scripts\/lk --warm/);
  });
});

describe("W5: checkDatabricksAuth exercises the REFRESH token (not the cached access token)", () => {
  it("probes via `auth token --force-refresh`, NOT `current-user me` (which masks an expired refresh token)", async () => {
    const calls: string[][] = [];
    const run = async (args: string[]) => { calls.push(args); return "{}"; };
    const res = await checkDatabricksAuth(undefined, run);
    expect(res.ok).toBe(true);
    // The probe must force a refresh-token exchange; current-user me uses the
    // cached access token and passes even when the refresh token is dead , the
    // exact masking bug that let an expired token spin the drive for hours.
    const probe = calls[0].join(" ");
    expect(probe).toMatch(/auth token/);
    expect(probe).toMatch(/--force-refresh/);
    expect(probe).not.toMatch(/current-user/);
  });

  it("returns ok:false with the auth-login remediation when the refresh token is invalid", async () => {
    const run = async () => {
      const e: Error & { stderr?: string } = new Error("auth failed");
      e.stderr = "A new access token could not be retrieved because the refresh token is invalid. To reauthenticate, run: databricks auth login";
      throw e;
    };
    const res = await checkDatabricksAuth(undefined, run);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/refresh token is invalid|reauthenticate|auth login/i);
  });
});

describe("W5: databricksAuthPrereqMessage", () => {
  it("names the auth-login command and the host", () => {
    const msg = databricksAuthPrereqMessage("https://x.cloud.databricks.com/", "token expired");
    expect(msg).toMatch(/databricks auth login --host https:\/\/x\.cloud\.databricks\.com/);
    expect(msg).toMatch(/token expired/);
  });
});

describe("validateCreateInputs (fail-fast pure-input validation)", () => {
  const base = {
    projectDir: "/tmp/proj",
    useGithub: true,
    githubOwner: "acme",
    tiers: undefined as 1 | 2 | 3 | undefined,
    dirExists: () => false,
    dirIsEmpty: () => true,
  };

  it("ok for a well-formed GitHub request", () => {
    expect(validateCreateInputs({ ...base })).toEqual({ ok: true });
  });

  it("requires a github owner when creating a repo", () => {
    const res = validateCreateInputs({ ...base, githubOwner: undefined });
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/GitHub owner is required/);
  });

  // F3: tiers 2/3 need a remote; reject the --no-github combo up front.
  it("rejects tiers 2 with --no-github", () => {
    const res = validateCreateInputs({ ...base, useGithub: false, githubOwner: undefined, tiers: 2 });
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/tiers 2 requires a GitHub repository/);
    expect(res.reason).toMatch(/--tiers 1/);
  });

  it("rejects tiers 3 with --no-github", () => {
    const res = validateCreateInputs({ ...base, useGithub: false, githubOwner: undefined, tiers: 3 });
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/tiers 3 requires a GitHub repository/);
  });

  it("allows tiers 1 with --no-github", () => {
    expect(
      validateCreateInputs({ ...base, useGithub: false, githubOwner: undefined, tiers: 1 }),
    ).toEqual({ ok: true });
  });

  it("allows tiers 2 WITH a github repo", () => {
    expect(validateCreateInputs({ ...base, tiers: 2 })).toEqual({ ok: true });
  });

  // F1: a pre-existing EMPTY dir is accepted on the --no-github path.
  it("accepts a pre-existing EMPTY dir on the --no-github path", () => {
    expect(
      validateCreateInputs({
        ...base,
        useGithub: false,
        githubOwner: undefined,
        dirExists: () => true,
        dirIsEmpty: () => true,
      }),
    ).toEqual({ ok: true });
  });

  it("refuses a pre-existing NON-EMPTY dir on the --no-github path", () => {
    const res = validateCreateInputs({
      ...base,
      useGithub: false,
      githubOwner: undefined,
      dirExists: () => true,
      dirIsEmpty: () => false,
    });
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/already exists and is not empty/);
  });

  it("does not probe the dir on the GitHub path (the clone owns it)", () => {
    // dirExists true + non-empty, but useGithub: the check is skipped.
    expect(
      validateCreateInputs({ ...base, dirExists: () => true, dirIsEmpty: () => false }),
    ).toEqual({ ok: true });
  });
});

describe("dirIsEmpty", () => {
  it("true for a nonexistent dir", () => {
    expect(dirIsEmpty(path.join(os.tmpdir(), "lbscm-does-not-exist-" + Date.now()))).toBe(true);
  });

  it("true for an existing empty dir", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-empty-"));
    tmpDirs.push(dir);
    expect(dirIsEmpty(dir)).toBe(true);
  });

  it("false for a dir with contents", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-full-"));
    tmpDirs.push(dir);
    fs.writeFileSync(path.join(dir, "f.txt"), "x");
    expect(dirIsEmpty(dir)).toBe(false);
  });
});

describe("W9: withLakebaseRollback", () => {
  it("returns the value and does NOT delete when fn succeeds", async () => {
    let deleted = false;
    const out = await withLakebaseRollback(
      { projectId: "p1", deleteProject: async () => { deleted = true; } },
      async () => 42,
    );
    expect(out).toBe(42);
    expect(deleted).toBe(false);
  });

  it("deletes the project and rethrows with rollback context when fn throws", async () => {
    const calls: Array<{ projectId: string }> = [];
    await expect(
      withLakebaseRollback(
        { projectId: "p2", deleteProject: async (a) => { calls.push(a); } },
        async () => { throw new Error("scaffold blew up"); },
      ),
    ).rejects.toThrow(/scaffold blew up.*rolled back the Lakebase project "p2"/s);
    expect(calls).toEqual([{ projectId: "p2", host: undefined }]);
  });

  it("treats a not-found delete as already rolled back", async () => {
    await expect(
      withLakebaseRollback(
        { projectId: "p3", deleteProject: async () => { throw new Error("project not found"); } },
        async () => { throw new Error("commit failed"); },
      ),
    ).rejects.toThrow(/rolled back the Lakebase project "p3"/);
  });

  it("warns to purge when rollback delete keeps failing", async () => {
    await expect(
      withLakebaseRollback(
        { projectId: "p4", deleteProject: async () => { throw new Error("500 server error"); } },
        async () => { throw new Error("scaffold failed"); },
      ),
    ).rejects.toThrow(/could not roll back.*delete-project p4/s);
  });
});
