// .NET project discovery shared by language detection, the Flyway adapter
// (dotnet layout), and the EF Core adapter. Pure filesystem scans; no
// `dotnet` invocation, so detection stays fast and runtime-light.
//
// Layout the kit scaffolds (templates/project/dotnet*):
//   App.sln
//   src/App/App.csproj            <- application project
//   src/App/Migrations/           <- EF Core migrations (efcore variant)
//   db/migrations/V1__*.sql       <- Flyway migrations (flyway variant)
//   tests/App.Tests/App.Tests.csproj
//
// A .NET project is identified by a *.sln / *.slnx / *.csproj at the ROOT
// (the same rule language detection uses, so the kit never half-recognizes a
// repo). Once identified, the EF Core project may live up to two levels down
// (src/<Name>/, <Name>/).

import * as fs from "node:fs";
import * as path from "node:path";

/** Package whose reference marks a project as the EF Core migrations owner. */
export const EF_DESIGN_PACKAGE = "Microsoft.EntityFrameworkCore.Design";

/** Flyway migrations directory for .NET projects (relative to the project root). */
export const DOTNET_FLYWAY_DIR = path.join("db", "migrations");

const SKIP_DIRS = new Set(["bin", "obj", "node_modules", ".git", "client", "tests", "test"]);

function safeReaddir(dir: string): fs.Dirent[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

/** True when `dir` itself carries a .NET marker (*.sln, *.slnx, *.csproj). */
export function hasDotnetMarker(dir: string): boolean {
  return safeReaddir(dir).some(
    (e) => e.isFile() && /\.(sln|slnx|csproj)$/i.test(e.name),
  );
}

/**
 * Find *.csproj files at the root and up to two directory levels below it,
 * skipping build output and test folders. Sorted for deterministic results.
 */
export function findCsprojFiles(projectDir: string): string[] {
  const found: string[] = [];
  const walk = (dir: string, depth: number) => {
    for (const e of safeReaddir(dir)) {
      const full = path.join(dir, e.name);
      if (e.isFile() && e.name.toLowerCase().endsWith(".csproj")) {
        found.push(full);
      } else if (e.isDirectory() && depth < 2 && !SKIP_DIRS.has(e.name.toLowerCase()) && !e.name.startsWith(".")) {
        walk(full, depth + 1);
      }
    }
  };
  walk(projectDir, 0);
  return found.sort();
}

export interface EfCoreProject {
  /** Absolute path to the .csproj that references EF Core Design. */
  csproj: string;
  /** Directory containing the .csproj. */
  projectDir: string;
  /** Absolute path to the project's Migrations/ directory (may not exist yet). */
  migrationsDir: string;
}

/** Locate the project that owns EF Core migrations, or null. */
export function findEfCoreProject(projectDir: string): EfCoreProject | null {
  for (const csproj of findCsprojFiles(projectDir)) {
    let content = "";
    try {
      content = fs.readFileSync(csproj, "utf-8");
    } catch {
      continue;
    }
    if (content.includes(EF_DESIGN_PACKAGE)) {
      const dir = path.dirname(csproj);
      return { csproj, projectDir: dir, migrationsDir: path.join(dir, "Migrations") };
    }
  }
  return null;
}

/** True for a .NET repo: a *.sln / *.slnx / *.csproj at the root. */
export function isDotnetProject(projectDir: string): boolean {
  return hasDotnetMarker(projectDir);
}

/** True for a .NET repo that uses Flyway SQL migrations under db/migrations/. */
export function isDotnetFlywayProject(projectDir: string): boolean {
  return isDotnetProject(projectDir) && fs.existsSync(path.join(projectDir, DOTNET_FLYWAY_DIR));
}

/** Maven/Spring Flyway layout (Java/Kotlin). */
export const MAVEN_FLYWAY_DIR = path.join("src", "main", "resources", "db", "migration");

/**
 * Absolute Flyway migrations directory for a project: the Maven layout for
 * Java/Kotlin (and as the historical default), or `db/migrations` for a .NET
 * project that uses Flyway.
 */
export function flywayMigrationsDir(projectDir: string): string {
  const maven = path.join(projectDir, MAVEN_FLYWAY_DIR);
  if (fs.existsSync(maven) || fs.existsSync(path.join(projectDir, "pom.xml"))) return maven;
  if (isDotnetFlywayProject(projectDir)) return path.join(projectDir, DOTNET_FLYWAY_DIR);
  return maven;
}
