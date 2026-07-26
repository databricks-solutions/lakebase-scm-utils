// The scaffolded CI workflows baked the substrate version into a LITERAL
// `#v<ver>` pin at every call site, so bumping `.lakebase/scm-utils-ref` (which
// the runtime substrate follows via scripts/lk) never took effect in CI: every
// run executed the stale substrate.
//
// The fix drives the CI substrate ref from the SAME source as the runtime
// substrate: a "Resolve substrate ref" step reads `.lakebase/scm-utils-ref`
// (falling back to the version this project was scaffolded from) and exports
// SCM_UTILS_REF, and every call site uses `#"${SCM_UTILS_REF}"`. A ref bump now
// takes effect in CI with no YAML edit.

import { describe, it, expect, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { deployWorkflows } from "../../scripts/lakebase/scaffold.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tmpDirs: string[] = [];
afterEach(() => {
  while (tmpDirs.length) {
    const dir = tmpDirs.pop();
    if (dir) try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* */ }
  }
});

function mkTmp(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-scmref-"));
  tmpDirs.push(dir);
  return dir;
}

function substrateVersion(): string {
  return (
    JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf-8")) as {
      version: string;
    }
  ).version;
}

async function scaffoldWorkflow(name: "pr.yml" | "merge.yml"): Promise<string> {
  const dir = mkTmp();
  await deployWorkflows(dir);
  return fs.readFileSync(path.join(dir, ".github", "workflows", name), "utf-8");
}

describe.each(["pr.yml", "merge.yml"] as const)(
  "CI substrate ref follows .lakebase/scm-utils-ref: %s",
  (name) => {
    it("resolves SCM_UTILS_REF from .lakebase/scm-utils-ref, falling back to the scaffolded version", async () => {
      const yaml = await scaffoldWorkflow(name);
      // A resolve step reads the ref file and exports SCM_UTILS_REF to the job env.
      expect(yaml).toMatch(/\.lakebase\/scm-utils-ref/);
      expect(yaml).toMatch(/SCM_UTILS_REF=.*>>\s*"?\$GITHUB_ENV"?/);
      // The fallback is the version this project was scaffolded from (git tag form).
      expect(yaml).toContain(`v${substrateVersion()}`);
    });

    it("uses #\"${SCM_UTILS_REF}\" at every call site (no hardcoded #v<ver> pin)", async () => {
      const yaml = await scaffoldWorkflow(name);
      const callSites = [
        ...yaml.matchAll(/github:databricks-solutions\/lakebase-scm-utils#(\S+)/g),
      ];
      expect(callSites.length).toBeGreaterThan(0);
      for (const m of callSites) {
        // The ref must be the resolved variable, never a baked literal version.
        expect(m[1]).toMatch(/^"?\$\{?SCM_UTILS_REF\}?"?$/);
      }
      // No leftover literal-version pin anywhere in the invocation lines.
      expect(yaml).not.toMatch(/lakebase-scm-utils#v\d/);
      // And no lingering reference to the kit package in CI (all bins are substrate).
      expect(yaml).not.toMatch(/consort/);
    });
  },
);
