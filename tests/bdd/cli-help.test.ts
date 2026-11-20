// Hermetic CLI help checks: `--help` must print usage and exit 0 without
// reaching any DB / Databricks / git side effect. Runs the source CLIs through
// tsx (a devDependency) so no build is required.

import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));

function runCli(script: string, args: string[]) {
  return spawnSync(
    process.execPath,
    ["--import", "tsx", `scripts/lakebase/${script}`, ...args],
    { cwd: REPO_ROOT, encoding: "utf8", timeout: 20_000 /* under vitest's 30 s testTimeout: spawnSync blocks the loop */ },
  );
}

describe("lakebase-schema-migrate --help", () => {
  it.each([["--help"], ["-h"]])("top-level %s prints usage, exit 0, no 'Unknown subcommand'", (flag) => {
    const res = runCli("schema-migrate.cli.ts", [flag]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Subcommands:");
    expect(res.stdout).toContain("apply-tier");
    expect(res.stderr).not.toMatch(/Unknown subcommand/);
  });

  it("<subcommand> --help prints usage and exit 0 without running the subcommand", () => {
    // With no --instance/--branch, a real `apply` would exit 2 on its required-flag
    // check; exit 0 + usage proves the help short-circuit ran first.
    const res = runCli("schema-migrate.cli.ts", ["apply-tier", "--help"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Subcommands:");
    expect(res.stderr).not.toMatch(/required/);
  });
});

describe("lakebase-branch <subcommand> --help", () => {
  it("delete --help prints usage, exit 0, and does not attempt a delete", () => {
    // A real delete with no --instance/--branch exits 2 ("missing required flag").
    // Exit 0 with usage proves the help short-circuit ran before the switch.
    const res = runCli("branch.cli.ts", ["delete", "--help"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Subcommands:");
    expect(res.stderr).not.toMatch(/missing required/);
  });
});
