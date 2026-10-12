// The scaffolded shell scripts must route a .NET project (a root *.sln,
// *.slnx, or *.csproj) to their .NET branch. Regression guard: an `ls a b c`
// marker probe fails when ANY pattern is unmatched, so a repo with only an
// .sln fell through to "Could not detect project language".

import { afterEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

const SCRIPTS = path.resolve(__dirname, "../../templates/project/common/scripts");
const tmpDirs: string[] = [];

afterEach(() => {
  while (tmpDirs.length) fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true });
});

function project(marker: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-dn-scripts-"));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, "scripts"));
  for (const s of ["flyway-migrate.sh", "run-tests.sh"]) {
    fs.copyFileSync(path.join(SCRIPTS, s), path.join(dir, "scripts", s));
    fs.chmodSync(path.join(dir, "scripts", s), 0o755);
  }
  fs.writeFileSync(path.join(dir, marker), "");
  fs.writeFileSync(path.join(dir, ".env"), "");
  return dir;
}

function run(dir: string, script: string) {
  const env = { ...process.env };
  for (const k of ["DATABASE_URL", "LAKEBASE_PROJECT_ID", "LAKEBASE_BRANCH_ID", "SFTDD_CLIENT_ONLY"]) delete env[k];
  return spawnSync("bash", [path.join(dir, "scripts", script)], { cwd: dir, env, encoding: "utf-8" });
}

describe("scaffolded scripts detect .NET projects", () => {
  for (const marker of ["App.sln", "App.slnx", "Api.csproj"]) {
    it(`flyway-migrate.sh takes the .NET branch with only ${marker}`, () => {
      const r = run(project(marker), "flyway-migrate.sh");
      const out = r.stdout + r.stderr;
      expect(out).not.toMatch(/Could not detect project language/);
      expect(out).toMatch(/need scripts\/lk plus LAKEBASE_PROJECT_ID and LAKEBASE_BRANCH_ID/);
    });
  }

  it("run-tests.sh routes a .NET project to the .NET migrate step", () => {
    const r = run(project("App.sln"), "run-tests.sh");
    const out = r.stdout + r.stderr;
    expect(out).not.toMatch(/Could not detect project language/);
    expect(out).toMatch(/Running migrations\.\.\./);
  });
});
