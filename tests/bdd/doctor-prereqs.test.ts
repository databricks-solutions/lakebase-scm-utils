// Hermetic unit tests for the cold-start prerequisite checks and the
// lakebase-enabled probe added to lakebase-doctor. These exercise the exported
// check functions directly with injected runners, so no real Node/Python/JDK/gh
// or Databricks workspace is touched. The live end-to-end confirmation lives in
// lakebase-doctor-cli-live.test.ts and the freshly-scaffolded-project harness.

import { describe, it, expect } from "vitest";
import {
  checkPrerequisites,
  checkLakebaseEnabled,
  type VersionRunner,
} from "../../scripts/lakebase/doctor.js";

// A VersionRunner backed by a fixed map of cmd -> version string; any cmd not
// in the map throws (simulating "not on PATH").
function fakeRunner(versions: Record<string, string>): VersionRunner {
  return async (cmd) => {
    if (cmd in versions) return versions[cmd];
    throw new Error(`${cmd}: command not found`);
  };
}

describe("checkPrerequisites (cold-start Node/Python/JDK/gh/npm)", () => {
  it("reports ok for every prerequisite when all satisfy the version floor", async () => {
    const run = fakeRunner({
      node: "v20.11.0",
      npm: "10.2.4",
      python3: "Python 3.11.7",
      java: 'openjdk version "17.0.9" 2023-10-17',
      gh: "gh version 2.40.1 (2023-12-13)",
    });
    const results = await checkPrerequisites(run);

    // Every new prereq check is present and emits the {name,status,message,hint}
    // shape (hint is only required when not ok).
    expect(results.map((r) => r.name).sort()).toEqual(
      ["gh", "jdk", "node", "npm", "python"].sort()
    );
    for (const r of results) {
      expect(r.status).toBe("ok");
      expect(typeof r.name).toBe("string");
      expect(typeof r.message).toBe("string");
    }
  });

  it("warns (not fails) when a tool is present but below the version floor", async () => {
    const run = fakeRunner({
      node: "v18.19.0", // below 20
      npm: "9.6.7",
      python3: "Python 3.9.6", // below 3.10 major line is still 3, so ok on major
      java: 'openjdk version "11.0.21"', // below 17
      gh: "gh version 2.40.1",
    });
    const results = await checkPrerequisites(run);
    const byName = Object.fromEntries(results.map((r) => [r.name, r]));

    expect(byName.node.status).toBe("warn");
    expect(byName.node.message).toContain("20+");
    expect(byName.node.hint).toBeTruthy();

    expect(byName.jdk.status).toBe("warn");
    expect(byName.jdk.message).toContain("17+");
    expect(byName.jdk.hint).toBeTruthy();
  });

  it("fails with a fix hint when a required tool is missing from PATH", async () => {
    // Only node present; python3/java/gh/npm absent.
    const run = fakeRunner({ node: "v20.11.0" });
    const results = await checkPrerequisites(run);
    const byName = Object.fromEntries(results.map((r) => [r.name, r]));

    for (const missing of ["npm", "python", "jdk", "gh"]) {
      expect(byName[missing].status).toBe("fail");
      expect(byName[missing].message).toContain("not found");
      expect(byName[missing].hint).toBeTruthy(); // every failure carries remediation
    }
    expect(byName.node.status).toBe("ok");
  });

  it("recovers a version from stderr-style output (java -version)", async () => {
    // java prints to stderr; exec rejects with the text attached. The check must
    // parse the version out of the error rather than declaring java absent.
    const run: VersionRunner = async (cmd) => {
      if (cmd === "java") {
        throw new Error(
          'java -version: openjdk version "17.0.9" 2023-10-17\nOpenJDK Runtime Environment'
        );
      }
      return "v20.0.0";
    };
    const results = await checkPrerequisites(run);
    const jdk = results.find((r) => r.name === "jdk")!;
    expect(jdk.status).toBe("ok");
    expect(jdk.message).toContain("17");
  });

  it("does NOT report ok for a version-floored tool when the version can't be read (fail-closed)", async () => {
    // Regression: real `java -version` writes to stderr and exits 0, so a
    // stdout-only runner resolved "" -> parseVersion(null) -> the gate
    // `minMajor && version && ...` short-circuited on `&& version` and reported
    // jdk OK on ANY JDK. A present-but-unreadable version for a floored tool must
    // fail closed (warn), never pass silently.
    const run = fakeRunner({
      node: "v20.11.0",
      npm: "10.2.4",
      python3: "Python 3.11.7",
      java: "", // present but empty output (the exec-drops-stderr symptom)
      gh: "gh version 2.40.1",
    });
    const results = await checkPrerequisites(run);
    const jdk = results.find((r) => r.name === "jdk")!;
    expect(jdk.status).not.toBe("ok");
    expect(jdk.status).toBe("warn");
    expect(jdk.message).toContain("17+");
    expect(jdk.hint).toBeTruthy();
  });
});

describe("checkLakebaseEnabled (workspace has Lakebase turned on)", () => {
  it("reports ok and counts instances when the API lists them", async () => {
    const res = await checkLakebaseEnabled(undefined, async () =>
      JSON.stringify([{ name: "proj-a" }, { name: "proj-b" }])
    );
    expect(res.name).toBe("lakebase-enabled");
    expect(res.status).toBe("ok");
    expect(res.message).toContain("2 database instances");
  });

  it("reports ok with zero instances (feature on, none created yet)", async () => {
    const res = await checkLakebaseEnabled(undefined, async () => "[]");
    expect(res.status).toBe("ok");
    expect(res.message).toContain("0 database instances");
  });

  it("handles the {database_instances:[...]} envelope shape", async () => {
    const res = await checkLakebaseEnabled(undefined, async () =>
      JSON.stringify({ database_instances: [{ name: "x" }] })
    );
    expect(res.status).toBe("ok");
    expect(res.message).toContain("1 database instance");
  });

  it("FAILS with a fix hint when the workspace does not have Lakebase enabled", async () => {
    const res = await checkLakebaseEnabled(undefined, async () => {
      throw new Error(
        "databricks database list-database-instances failed: feature not available on this workspace"
      );
    });
    expect(res.status).toBe("fail");
    expect(res.message).toContain("does not have Lakebase enabled");
    expect(res.hint).toBeTruthy();
    expect(res.hint).toContain("Lakebase");
  });
});
