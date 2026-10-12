// EF Core adapter + runner tests, and .NET language/layout detection.
//
// The runner is exercised end to end against a fake `dotnet` executable on
// PATH (the same approach as the alembic runner test), so argument building,
// JSON parsing, and the env-only credential hand-off are covered without a
// .NET SDK or a live database.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { EfCoreAdapter, listEfCoreFiles } from "../../scripts/lakebase/adapters/efcore-adapter.js";
import { FlywayAdapter } from "../../scripts/lakebase/adapters/flyway-adapter.js";
import {
  findCsprojFiles,
  findEfCoreProject,
  flywayMigrationsDir,
  isDotnetFlywayProject,
} from "../../scripts/lakebase/dotnet-project.js";
import { detectLanguageAt, resolveMigrationLayout } from "../../scripts/lakebase/migration-layout.js";
import {
  detectLanguage,
  listSchemaMigrations,
  toolForLanguage,
} from "../../scripts/lakebase/schema-migrate.js";
import {
  applyEfcore,
  dsnToNpgsql,
  efDescription,
  efMigrationName,
  efVersion,
  parseEfJson,
  resolveEfTarget,
  rollbackEfcore,
  statusEfcore,
} from "../../scripts/lakebase/schema-migrate-runners/efcore.js";

const EF_CSPROJ = `<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="10.0.3" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.4" />
  </ItemGroup>
</Project>`;
const PLAIN_CSPROJ = `<Project Sdk="Microsoft.NET.Sdk.Web"></Project>`;
const DSN = "postgresql://dev%40example.com:s3cret@ep-x.database.cloud.databricks.com:5432/databricks_postgres?sslmode=require";

const tmpDirs: string[] = [];
let savedPath: string | undefined;

beforeEach(() => {
  savedPath = process.env.PATH;
});

afterEach(() => {
  process.env.PATH = savedPath;
  delete process.env.LAKEBASE_EFCORE_CONNECTION_ARG;
  while (tmpDirs.length) {
    const dir = tmpDirs.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function mkTmp(prefix = "lbscm-efcore-"): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tmpDirs.push(dir);
  return dir;
}

function write(p: string, content = ""): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

/** .NET EF Core project in the kit's layout (App.sln + src/App/App.csproj). */
function efProject(migrations: string[] = []): string {
  const dir = mkTmp();
  write(path.join(dir, "App.sln"));
  write(path.join(dir, "src", "App", "App.csproj"), EF_CSPROJ);
  write(path.join(dir, "tests", "App.Tests", "App.Tests.csproj"), PLAIN_CSPROJ);
  for (const id of migrations) {
    write(path.join(dir, "src", "App", "Migrations", `${id}.cs`));
    write(path.join(dir, "src", "App", "Migrations", `${id}.Designer.cs`));
  }
  if (migrations.length) write(path.join(dir, "src", "App", "Migrations", "AppDbContextModelSnapshot.cs"));
  return dir;
}

/** .NET Flyway project (db/migrations/). */
function flywayProject(files: string[] = []): string {
  const dir = mkTmp();
  write(path.join(dir, "App.sln"));
  write(path.join(dir, "src", "App", "App.csproj"), PLAIN_CSPROJ);
  fs.mkdirSync(path.join(dir, "db", "migrations"), { recursive: true });
  for (const f of files) write(path.join(dir, "db", "migrations", f), "select 1;");
  return dir;
}

/**
 * Install a fake `dotnet` that simulates `dotnet ef`. Applied state lives in
 * <state>/applied (one id per line). Every invocation's argv and the
 * DATABASE_URL it saw are appended to <state>/calls.
 */
function fakeDotnet(state: string, migrationIds: string[]): void {
  const bin = mkTmp("lbscm-fake-dotnet-");
  const ids = migrationIds.join(" ");
  write(
    path.join(bin, "dotnet"),
    `#!/usr/bin/env bash
set -e
STATE="${state}"
touch "$STATE/applied"
printf '%s|DATABASE_URL=%s\\n' "$*" "$DATABASE_URL" >> "$STATE/calls"
ALL="${ids}"
if [ "$1" = "tool" ] || [ "$1" = "restore" ]; then exit 0; fi
[ -f "$STATE/unreachable" ] && [ "$3" = "list" ] && echo "warn:    An error occurred while accessing the database. Continuing without the information provided by the database."
if [ "$2" = "migrations" ] && [ "$3" = "list" ]; then
  echo "info:    Build started..."
  echo "data:    ["
  first=1
  for id in $ALL; do
    if [ -f "$STATE/unreachable" ]; then a=null; elif grep -qx "$id" "$STATE/applied"; then a=true; else a=false; fi
    [ $first = 1 ] || echo "data:    ,"
    first=0
    echo "data:      {\\"id\\": \\"$id\\", \\"name\\": \\"\${id#*_}\\", \\"safeName\\": \\"\${id#*_}\\", \\"applied\\": $a}"
  done
  echo "data:    ]"
  exit 0
fi
if [ "$2" = "database" ] && [ "$3" = "update" ]; then
  target="$4"
  case "$target" in --*|"") target="" ;; esac
  : > "$STATE/applied"
  for id in $ALL; do
    if [ -n "$target" ] && [ "$target" != "0" ] && [[ "$id" > "$target" ]]; then break; fi
    if [ "$target" = "0" ]; then break; fi
    echo "$id" >> "$STATE/applied"
  done
  exit 0
fi
echo "unexpected: $*" >&2
exit 2
`,
  );
  fs.chmodSync(path.join(bin, "dotnet"), 0o755);
  process.env.PATH = `${bin}${path.delimiter}${savedPath}`;
}

/** History reader backed by the fake dotnet's state file (what the DB holds). */
function stateHistory(state: string, extra: string[] = []) {
  return async () => {
    const f = path.join(state, "applied");
    const ids = fs.existsSync(f) ? fs.readFileSync(f, "utf-8").split("\n").filter(Boolean) : [];
    return [...ids, ...extra].sort();
  };
}

describe(".NET project discovery", () => {
  it("finds csproj files at depth <= 2 and skips tests/, bin/, obj/", () => {
    const dir = efProject();
    write(path.join(dir, "src", "App", "bin", "Debug", "Stale.csproj"), PLAIN_CSPROJ);
    const found = findCsprojFiles(dir).map((p) => path.relative(dir, p));
    expect(found).toEqual([path.join("src", "App", "App.csproj")]);
  });

  it("identifies the EF Core project by its Microsoft.EntityFrameworkCore.Design reference", () => {
    const dir = efProject();
    const ef = findEfCoreProject(dir);
    expect(ef?.migrationsDir).toBe(path.join(dir, "src", "App", "Migrations"));
    expect(findEfCoreProject(flywayProject())).toBeNull();
  });

  it("detects language 'dotnet' from a root *.sln or *.csproj, ahead of package.json", () => {
    const dir = efProject();
    write(path.join(dir, "package.json"), "{}");
    expect(detectLanguageAt(dir)).toBe("dotnet");
    expect(detectLanguage(dir)).toBe("dotnet");

    const csprojOnly = mkTmp();
    write(path.join(csprojOnly, "Api.csproj"), PLAIN_CSPROJ);
    expect(detectLanguageAt(csprojOnly)).toBe("dotnet");
  });

  it("requires a root marker in every check, so a nested-only repo is consistently not .NET", () => {
    const dir = mkTmp();
    write(path.join(dir, "src", "Api", "Api.csproj"), EF_CSPROJ);
    expect(detectLanguageAt(dir)).toBe("unknown");
    expect(EfCoreAdapter.detect(dir)).toBe(false);
    write(path.join(dir, "Api.sln"));
    expect(detectLanguageAt(dir)).toBe("dotnet");
    expect(EfCoreAdapter.detect(dir)).toBe(true);
  });

  it("still detects Java and Python before .NET markers", () => {
    const dir = mkTmp();
    write(path.join(dir, "pom.xml"), "<project/>");
    write(path.join(dir, "Tool.csproj"), PLAIN_CSPROJ);
    expect(detectLanguageAt(dir)).toBe("java");
  });
});

describe(".NET migration tool selection", () => {
  it("chooses EF Core for an EF project and Flyway when db/migrations/ exists", () => {
    expect(toolForLanguage("dotnet", efProject())).toBe("efcore");
    expect(toolForLanguage("dotnet", flywayProject())).toBe("flyway");
    expect(toolForLanguage("dotnet")).toBe("efcore");
  });

  it("routes Flyway to db/migrations/ for .NET and keeps the Maven layout for Java", () => {
    const dn = flywayProject(["V1__init.sql"]);
    expect(isDotnetFlywayProject(dn)).toBe(true);
    expect(flywayMigrationsDir(dn)).toBe(path.join(dn, "db", "migrations"));
    expect(FlywayAdapter.detect(dn)).toBe(true);
    expect(FlywayAdapter.languages).toContain("dotnet");

    const java = mkTmp();
    write(path.join(java, "pom.xml"), "<project/>");
    expect(flywayMigrationsDir(java)).toBe(path.join(java, "src", "main", "resources", "db", "migration"));
  });

  it("does not auto-route an EF project to Flyway", () => {
    expect(FlywayAdapter.detect(efProject())).toBe(false);
    expect(EfCoreAdapter.detect(flywayProject())).toBe(false);
  });

  it("lists .NET Flyway migrations from db/migrations/ in version order", () => {
    const dn = flywayProject(["V2__add_email.sql", "V1__init.sql", "README.md"]);
    const files = listSchemaMigrations({ projectDir: dn });
    expect(files.map((f) => f.version)).toEqual(["1", "2"]);
    expect(files.every((f) => f.tool === "flyway")).toBe(true);
  });

  it("resolves the EF Core layout to the project's Migrations/ dir", () => {
    const layout = resolveMigrationLayout({ projectDir: efProject() });
    expect(layout.language).toBe("dotnet");
    expect(layout.migrationPath).toBe("src/App/Migrations");
    expect(layout.migrationPattern.test("20261011225448_InitialCreate.cs")).toBe(true);
    expect(layout.migrationPattern.test("20261011225448_InitialCreate.Designer.cs")).toBe(false);
    expect(layout.migrationPattern.test("AppDbContextModelSnapshot.cs")).toBe(false);

    const fw = resolveMigrationLayout({ projectDir: flywayProject() });
    expect(fw.migrationPath).toBe("db/migrations");
  });
});

describe("EfCoreAdapter: static surface", () => {
  it("has id='efcore', languages=['dotnet'], and the optional capabilities EF supports", () => {
    expect(EfCoreAdapter.id).toBe("efcore");
    expect(EfCoreAdapter.languages).toEqual(["dotnet"]);
    expect(typeof EfCoreAdapter.rollback).toBe("function");
    expect(typeof EfCoreAdapter.stamp).toBe("function");
    expect(typeof EfCoreAdapter.newMigration).toBe("function");
    expect(typeof EfCoreAdapter.collapseHeads).toBe("undefined");
  });

  it("lists migrations in apply order, excluding .Designer.cs and the model snapshot", () => {
    const dir = efProject(["20261012090000_AddMemberPhone", "20261011225448_InitialCreate"]);
    const files = listEfCoreFiles(dir);
    expect(files.map((f) => f.filename)).toEqual([
      "20261011225448_InitialCreate.cs",
      "20261012090000_AddMemberPhone.cs",
    ]);
    expect(files[1]).toMatchObject({
      version: "20261012090000",
      description: "Add Member Phone",
      type: "CSharp",
      tool: "efcore",
    });
    expect(listSchemaMigrations({ projectDir: dir }).length).toBe(2);
  });
});

describe("EF Core runner helpers", () => {
  it("converts a postgresql:// DSN to an Npgsql connection string", () => {
    const cs = dsnToNpgsql(`${DSN}&application_name=scm-utils/1.0`);
    expect(cs).toContain("Host=ep-x.database.cloud.databricks.com");
    expect(cs).toContain("Username=dev@example.com");
    expect(cs).toContain("Password=s3cret");
    expect(cs).toContain("Database=databricks_postgres");
    expect(cs).toContain("SSL Mode=Require");
    expect(cs).toContain("Application Name=scm-utils/1.0");
  });

  it("parses the data: payload of --prefix-output and ignores log lines", () => {
    const out = 'info:    Build started...\ndata:    [\ndata:      {"id": "1_A", "applied": true}\ndata:    ]\n';
    expect(parseEfJson<Array<{ id: string }>>(out)[0].id).toBe("1_A");
    expect(() => parseEfJson("info: nothing")).toThrow(/no JSON payload/);
  });

  it("derives version, description, and a valid C# migration name", () => {
    expect(efVersion("20261011225448_InitialCreate")).toBe("20261011225448");
    expect(efDescription("20261011225448_InitialCreate")).toBe("Initial Create");
    expect(efMigrationName("add member phone")).toBe("AddMemberPhone");
    expect(efMigrationName("2fa-codes")).toBe("M2faCodes");
    expect(() => efMigrationName("--")).toThrow();
  });

  it("resolves rollback targets: relative steps, 0, id, version, or name", () => {
    const applied = [
      { id: "20260101000000_A", name: "A", applied: true },
      { id: "20260102000000_B", name: "B", applied: true },
      { id: "20260103000000_C", name: "C", applied: true },
    ];
    expect(resolveEfTarget("-1", applied)).toBe("20260102000000_B");
    expect(resolveEfTarget("-3", applied)).toBe("0");
    expect(resolveEfTarget("0", applied)).toBe("0");
    expect(resolveEfTarget("20260101000000", applied)).toBe("20260101000000_A");
    expect(resolveEfTarget("B", applied)).toBe("20260102000000_B");
    expect(() => resolveEfTarget("-4", applied)).toThrow(/only 3 applied/);
    expect(() => resolveEfTarget("Z", applied)).toThrow(/not an applied migration/);
  });
});

describe("EF Core runner against a fake dotnet ef", () => {
  const ids = ["20260101000000_Init", "20260102000000_AddEmail"];

  it("applies pending migrations, reports what changed, and passes the DSN only via DATABASE_URL", async () => {
    const dir = efProject(ids);
    const state = mkTmp("lbscm-ef-state-");
    fakeDotnet(state, ids);

    const before = await statusEfcore({ projectDir: dir, dsn: DSN, readHistory: stateHistory(state) });
    expect(before.current).toBeUndefined();
    expect(before.pending.map((p) => p.version)).toEqual(["20260101000000", "20260102000000"]);

    const r = await applyEfcore({ projectDir: dir, dsn: DSN });
    expect(r.applied.map((a) => a.version)).toEqual(["20260101000000", "20260102000000"]);
    expect(r.alreadyAtLatest).toBe(false);

    const again = await applyEfcore({ projectDir: dir, dsn: DSN });
    expect(again.alreadyAtLatest).toBe(true);

    const calls = fs.readFileSync(path.join(state, "calls"), "utf-8");
    // Builds once per operation: the update and the second list skip the build.
    expect(calls).toContain(`ef database update --project ${path.join("src", "App", "App.csproj")} --prefix-output --no-build`);
    expect(calls).toContain(`DATABASE_URL=${DSN}`);
    expect(calls).not.toContain("--connection");
    expect(calls).not.toMatch(/\bs3cret\b.*\|/); // password never in argv (left of the '|')
  });

  it("rolls back to a relative target and reports the reverted migrations newest-first", async () => {
    const dir = efProject(ids);
    const state = mkTmp("lbscm-ef-state-");
    fakeDotnet(state, ids);
    await applyEfcore({ projectDir: dir, dsn: DSN });

    const r = await rollbackEfcore({ projectDir: dir, dsn: DSN, target: "-1" });
    expect(r.rolledBack.map((m) => m.version)).toEqual(["20260102000000"]);
    const status = await statusEfcore({ projectDir: dir, dsn: DSN, readHistory: stateHistory(state) });
    expect(status.current).toBe("20260101000000");
  });

  it("adds --connection only when LAKEBASE_EFCORE_CONNECTION_ARG=1", async () => {
    const dir = efProject(ids);
    const state = mkTmp("lbscm-ef-state-");
    fakeDotnet(state, ids);
    process.env.LAKEBASE_EFCORE_CONNECTION_ARG = "1";
    await statusEfcore({ projectDir: dir, dsn: DSN, readHistory: stateHistory(state) });
    expect(fs.readFileSync(path.join(state, "calls"), "utf-8")).toContain("--connection Host=ep-x");
  });

  it("fails clearly when no EF Core project exists", async () => {
    await expect(statusEfcore({ projectDir: flywayProject(), dsn: DSN })).rejects.toThrow(
      /No EF Core project found/,
    );
  });

  it("reports an error, not 'nothing applied', when dotnet ef cannot reach the database", async () => {
    const dir = efProject(ids);
    const state = mkTmp("lbscm-ef-state-");
    fakeDotnet(state, ids);
    fs.writeFileSync(path.join(state, "unreachable"), "");
    await expect(statusEfcore({ projectDir: dir, dsn: DSN, readHistory: stateHistory(state) })).rejects.toThrow(
      /could not read migration state from the database/,
    );
    await expect(applyEfcore({ projectDir: dir, dsn: DSN })).rejects.toThrow(/could not read migration state/);
  });

  it("reports the database's real head from __EFMigrationsHistory, so an orphan is visible", async () => {
    const dir = efProject(ids);
    const state = mkTmp("lbscm-ef-state-");
    fakeDotnet(state, ids);
    await applyEfcore({ projectDir: dir, dsn: DSN });
    // The DB also holds a newer migration whose file was git-reset away.
    const status = await statusEfcore({
      projectDir: dir,
      dsn: DSN,
      readHistory: stateHistory(state, ["20260109000000_GoneFromCode"]),
    });
    expect(status.current).toBe("20260109000000");
    expect(listEfCoreFiles(dir).map((f) => f.version)).not.toContain(status.current);
  });
});
