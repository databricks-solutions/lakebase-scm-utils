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

  /** Put fake executables on PATH; each records argv (and selected env) to a log. */
  function fakeBin(dir: string, name: string, body: string): string {
    const bin = path.join(dir, ".fakebin");
    fs.mkdirSync(bin, { recursive: true });
    fs.writeFileSync(path.join(bin, name), `#!/usr/bin/env bash\n${body}\n`);
    fs.chmodSync(path.join(bin, name), 0o755);
    return bin;
  }

  it("flyway-migrate.sh (DATABASE_URL, EF Core) skips `dotnet tool restore` without a tool manifest", () => {
    const dir = project("App.sln");
    fs.mkdirSync(path.join(dir, "src", "App"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "src", "App", "App.csproj"),
      '<Project><ItemGroup><PackageReference Include="Microsoft.EntityFrameworkCore.Design" /></ItemGroup></Project>',
    );
    const log = path.join(dir, "dotnet.log");
    const bin = fakeBin(dir, "dotnet", `echo "$*" >> "${log}"; [ "$1" = "tool" ] && exit 1; exit 0`);
    const r = spawnSync("bash", [path.join(dir, "scripts", "flyway-migrate.sh")], {
      cwd: dir,
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, DATABASE_URL: "postgresql://u:p@h:5432/db" },
      encoding: "utf-8",
    });
    expect(r.status).toBe(0);
    const calls = fs.readFileSync(log, "utf-8");
    expect(calls).not.toMatch(/^tool restore/m);
    expect(calls).toMatch(/^ef database update --project \.\/src\/App\/App\.csproj/m);
  });

  it("flyway-migrate.sh (DATABASE_URL, Flyway) decodes only %XX: '+' and backslashes stay literal", () => {
    const dir = project("App.sln");
    fs.mkdirSync(path.join(dir, "db", "migrations"), { recursive: true });
    const log = path.join(dir, "flyway.log");
    const bin = fakeBin(dir, "flyway", `printf 'USER=%s\\nPASS=%s\\nURL=%s\\n' "$FLYWAY_USER" "$FLYWAY_PASSWORD" "$FLYWAY_URL" > "${log}"`);
    const r = spawnSync("bash", [path.join(dir, "scripts", "flyway-migrate.sh")], {
      cwd: dir,
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        DATABASE_URL: "postgresql://ci+bot%40corp.com:p%5Cnw%2Bx@h:5432/db?sslmode=require",
      },
      encoding: "utf-8",
    });
    expect(r.status).toBe(0);
    const out = fs.readFileSync(log, "utf-8");
    expect(out).toContain("USER=ci+bot@corp.com");
    expect(out).toContain("PASS=p\\nw+x");
    expect(out).toContain("URL=jdbc:postgresql://h:5432/db?sslmode=require");
  });
});
