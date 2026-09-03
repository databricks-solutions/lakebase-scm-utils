// Anti-recurrence guard: no tracked package-lock.json may pin the Databricks npm proxy.
//
// This package is consumed as a `github:` dependency (consort, lakebase-scm-extension). When npm
// installs a github dependency it runs `npm install` against THAT package's OWN package-lock.json
// and, for a package with a build/prepare step, installs its dependency tree first. If a lockfile's
// "resolved" URLs point at npm-proxy.cloud.databricks.com, a cold install on any machine outside the
// Databricks network hangs indefinitely (the host resolves but never accepts a TCP connection).
// Every resolved URL must therefore come from the public registry (registry.npmjs.org).
//
// The fix, when this guard fails, is a pure host-swap of the "resolved" lines
// (npm-proxy.cloud.databricks.com -> registry.npmjs.org); integrity hashes are unchanged because the
// proxy is a passthrough mirror of the same tarballs.

import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const PROXY_HOST = "npm-proxy.cloud.databricks.com";

/** Every tracked package-lock.json (git-tracked, so node_modules is excluded by construction). */
function trackedLockfiles(): string[] {
  return execFileSync("git", ["ls-files", "*package-lock.json"], { cwd: REPO_ROOT, encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}

describe("lockfiles resolve from the public npm registry (no Databricks proxy pins)", () => {
  const lockfiles = trackedLockfiles();

  it("tracks at least one package-lock.json (guard is actually covering something)", () => {
    expect(lockfiles.length).toBeGreaterThan(0);
  });

  it.each(lockfiles)("%s pins no %s resolved hosts", (lf) => {
    const content = readFileSync(join(REPO_ROOT, lf), "utf8");
    const hits = content.split("\n").filter((l) => l.includes(PROXY_HOST)).length;
    expect(
      hits,
      `${lf} has ${hits} ${PROXY_HOST} reference(s); a github: install would hang off the Databricks ` +
        `network. Host-swap the "resolved" lines to https://registry.npmjs.org/ (integrity unchanged).`,
    ).toBe(0);
  });
});
