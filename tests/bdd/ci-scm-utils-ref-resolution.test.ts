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

    it("resolves every npx call site via SCM_UTILS_NPX_PKG (no hardcoded #v<ver> pin)", async () => {
      const yaml = await scaffoldWorkflow(name);
      // Every npx invocation consumes the resolved package spec.
      const callSites = [
        ...yaml.matchAll(/--package="\$\{SCM_UTILS_NPX_PKG\}"/g),
      ];
      expect(callSites.length).toBeGreaterThan(0);
      // The resolve step computes the registry candidate for version tags (v
      // stripped), PROBES the tarball (npm view + curl), and falls back to the
      // GitHub source form when the registry can't serve it yet (a freshly-published
      // version is blocked by the proxy's same-day screen for ~24h; branch/SHA refs
      // only ever have GitHub).
      expect(yaml).toContain(
        'SPEC="@databricks-solutions/lakebase-scm-utils@${SCM_UTILS_REF#v}"',
      );
      expect(yaml).toContain('npm view "${SPEC}" dist.tarball');
      expect(yaml).toContain('curl -fsSI --max-time 15 "$TARBALL_URL"');
      expect(yaml).toContain(
        'SPEC="github:databricks-solutions/lakebase-scm-utils#${SCM_UTILS_REF}"',
      );
      expect(yaml).toContain('echo "SCM_UTILS_NPX_PKG=${SPEC}" >> "$GITHUB_ENV"');
      // No leftover literal-version pin anywhere in the invocation lines.
      expect(yaml).not.toMatch(/lakebase-scm-utils#v\d/);
      // And no lingering reference to the kit package in CI (all bins are substrate).
      expect(yaml).not.toMatch(/consort/);
    });
  },
);
