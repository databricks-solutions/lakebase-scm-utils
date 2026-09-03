// Guard: copyDirSubstituted replaces {{LAKEBASE_SCM_UTILS_VERSION}} with this package's real
// SemVer, so a scaffolded project's connection application_name resolves to scm-utils/<version>
// (never the hardcoded literal it replaced). Language templates (python database.py, node
// knexfile.js, the java Spring fallback) all flow through this single door.

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { copyDirSubstituted } from "../../scripts/util/copy-dir-substituted.js";
import { substrateSelfVersion } from "../../scripts/lakebase/self-version.js";

describe("copyDirSubstituted: {{LAKEBASE_SCM_UTILS_VERSION}} -> real scm-utils SemVer", () => {
  let src: string;
  let dest: string;
  beforeEach(() => {
    src = mkdtempSync(join(tmpdir(), "cds-src-"));
    dest = mkdtempSync(join(tmpdir(), "cds-dest-"));
  });
  afterEach(() => {
    rmSync(src, { recursive: true, force: true });
    rmSync(dest, { recursive: true, force: true });
  });

  it("substitutes the version placeholder (and never leaves it literal)", () => {
    writeFileSync(join(src, "knexfile.js"), "const a = 'scm-utils/{{LAKEBASE_SCM_UTILS_VERSION}}';\n");
    copyDirSubstituted(src, dest, { projectName: "demo" });
    const out = readFileSync(join(dest, "knexfile.js"), "utf8");
    expect(out).toContain(`scm-utils/${substrateSelfVersion()}`);
    expect(out).not.toContain("{{LAKEBASE_SCM_UTILS_VERSION}}");
  });

  it("resolves the real version in-repo (proves the label is not 'unknown' where the package is present)", () => {
    // In this repo the package.json is reachable, so the fallback carries a real SemVer , the exact
    // gap this closes: the placeholder replaces the previously hardcoded scm-utils/unknown literal.
    expect(substrateSelfVersion()).not.toBe("unknown");
    expect(substrateSelfVersion()).toMatch(/^\d+\.\d+\.\d+/);
  });
});
