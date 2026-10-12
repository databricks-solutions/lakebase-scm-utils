// EF Core runner for .NET projects.
//
// Shells to the `dotnet ef` CLI (pinned per project in
// .config/dotnet-tools.json and restored on first use). Output is read with
// `--json --prefix-output`, where the JSON payload is the set of lines
// prefixed `data:`, which gives a stable parse target independent of build
// and logging noise.
//
// Connection: the target branch DSN is passed in the child's DATABASE_URL
// environment variable, never on the command line, so the credential does
// not appear in `ps`. The project's IDesignTimeDbContextFactory must read
// DATABASE_URL (the kit's template does). Projects that cannot can set
// LAKEBASE_EFCORE_CONNECTION_ARG=1 to pass `--connection` instead (the
// password is then visible to other local users via `ps`).
//
// History lives in "__EFMigrationsHistory" ("MigrationId" = <timestamp>_<Name>).
// The kit-facing version is the 14-digit timestamp prefix, matching the
// timestamp versions used for Flyway, Alembic, and Knex.

import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { Client } from "pg";
import { EF_DESIGN_PACKAGE, findEfCoreProject, type EfCoreProject } from "../dotnet-project.js";
import { connectionApplicationName } from "../get-connection.js";
import {
  SchemaMigrationError,
  type ApplySchemaMigrationsResult,
  type AppliedSchemaMigration,
  type PendingSchemaMigration,
  type RollbackSchemaMigrationResult,
  type SchemaMigrationStatusResult,
} from "../schema-migrate.js";

export interface EfCoreCtx {
  projectDir: string;
  dsn: string;
  /**
   * Reads applied migration ids from "__EFMigrationsHistory" (ascending), or
   * null when the table does not exist. Defaults to a direct query; tests
   * inject a fake.
   */
  readHistory?: (dsn: string) => Promise<string[] | null>;
}

/** One migration as reported by `dotnet ef migrations list --json`. */
export interface EfMigrationEntry {
  id: string;
  name: string;
  /** true/false with a connection; null with --no-connect. */
  applied: boolean | null;
}

const MIGRATION_ID = /^(\d{14})_(.+)$/;

/** Kit version for an EF migration id: its timestamp prefix. */
export function efVersion(id: string): string {
  return MIGRATION_ID.exec(id)?.[1] ?? id;
}

/** Human description for an EF migration id ("AddMemberPhone" -> "Add Member Phone"). */
export function efDescription(id: string): string {
  const name = MIGRATION_ID.exec(id)?.[2] ?? id;
  return name.replace(/_/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

/** Convert a postgresql:// DSN into an Npgsql connection string. */
export function dsnToNpgsql(dsn: string): string {
  const u = new URL(dsn);
  const parts: string[] = [
    `Host=${u.hostname}`,
    `Port=${u.port || "5432"}`,
    `Database=${decodeURIComponent(u.pathname.replace(/^\//, "")) || "databricks_postgres"}`,
  ];
  if (u.username) parts.push(`Username=${decodeURIComponent(u.username)}`);
  if (u.password) parts.push(`Password=${decodeURIComponent(u.password)}`);
  const sslmode = (u.searchParams.get("sslmode") ?? "require").toLowerCase();
  const ssl: Record<string, string> = {
    disable: "Disable",
    allow: "Allow",
    prefer: "Prefer",
    require: "Require",
    "verify-ca": "VerifyCA",
    "verify-full": "VerifyFull",
  };
  parts.push(`SSL Mode=${ssl[sslmode] ?? "Require"}`);
  const app = u.searchParams.get("application_name");
  if (app) parts.push(`Application Name=${app}`);
  return parts.map((p) => p.replace(/;/g, "")).join(";");
}

/** Extract the JSON payload from `--prefix-output` output (lines starting `data:`). */
export function parseEfJson<T>(stdout: string): T {
  const body = stdout
    .split(/\r?\n/)
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.slice("data:".length))
    .join("\n")
    .trim();
  if (!body) {
    throw new SchemaMigrationError(`dotnet ef returned no JSON payload: ${stdout.slice(0, 400)}`);
  }
  try {
    return JSON.parse(body) as T;
  } catch (err) {
    throw new SchemaMigrationError(
      `dotnet ef JSON parse failed: ${err instanceof Error ? err.message : String(err)}.\n` +
        `Body (first 400 chars): ${body.slice(0, 400)}`
    );
  }
}

function requireProject(projectDir: string): EfCoreProject {
  const project = findEfCoreProject(projectDir);
  if (!project) {
    throw new SchemaMigrationError(
      `No EF Core project found under ${projectDir}. Expected a *.csproj that references ${EF_DESIGN_PACKAGE}.`
    );
  }
  return project;
}

function spawnDotnet(
  projectDir: string,
  args: string[],
  env: NodeJS.ProcessEnv
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn("dotnet", args, {
      cwd: projectDir,
      env: { ...process.env, DOTNET_NOLOGO: "1", DOTNET_CLI_TELEMETRY_OPTOUT: "1", ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (err) => {
      reject(
        new SchemaMigrationError(
          `Could not spawn dotnet. Is the .NET SDK installed and on PATH? ${err.message}`,
          err
        )
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          new SchemaMigrationError(
            `dotnet ${args.join(" ")} exited with code ${code}.\nstdout: ${stdout}\nstderr: ${stderr}`
          )
        );
      }
    });
  });
}

const restored = new Set<string>();

/**
 * Once per project per process: `dotnet tool restore` (when a tool manifest
 * exists) and `dotnet restore` of the EF project. `dotnet ef` reads project
 * metadata before it builds, which fails on a fresh clone without restored
 * assets.
 */
async function ensureRestored(projectDir: string, csproj: string): Promise<void> {
  if (restored.has(projectDir)) return;
  if (fs.existsSync(path.join(projectDir, ".config", "dotnet-tools.json"))) {
    await spawnDotnet(projectDir, ["tool", "restore"], {});
  }
  await spawnDotnet(projectDir, ["restore", csproj], {});
  restored.add(projectDir);
}

/**
 * Run `dotnet ef <args>` against the project's EF Core project. `noBuild`
 * skips the implicit build, for follow-up calls in the same operation.
 */
async function runEf(
  projectDir: string,
  args: string[],
  dsn?: string,
  opts: { noBuild?: boolean } = {}
): Promise<{ stdout: string; stderr: string }> {
  const project = requireProject(projectDir);
  const csproj = path.relative(projectDir, project.csproj) || project.csproj;
  await ensureRestored(projectDir, csproj);
  const full = ["ef", ...args, "--project", csproj, "--prefix-output"];
  if (opts.noBuild) full.push("--no-build");
  const env: NodeJS.ProcessEnv = {};
  if (dsn) {
    env.DATABASE_URL = dsn;
    if (process.env.LAKEBASE_EFCORE_CONNECTION_ARG === "1") full.push("--connection", dsnToNpgsql(dsn));
  }
  return spawnDotnet(projectDir, full, env);
}

/**
 * List migrations with their applied state on the target database. EF reports
 * `applied: null` when it cannot reach the database (exit code 0), so that is
 * an error here rather than "nothing applied".
 */
export async function listEfMigrations(
  ctx: EfCoreCtx,
  opts: { noBuild?: boolean } = {}
): Promise<EfMigrationEntry[]> {
  const { stdout, stderr } = await runEf(ctx.projectDir, ["migrations", "list", "--json"], ctx.dsn, opts);
  const entries = parseEfJson<EfMigrationEntry[]>(stdout);
  if (ctx.dsn && entries.some((e) => e.applied === null)) {
    const warning = stdout
      .split(/\r?\n/)
      .filter((l) => /^(warn|error):/.test(l))
      .join("\n");
    throw new SchemaMigrationError(
      `dotnet ef could not read migration state from the database (check connectivity and credentials).\n${warning || stderr}`.trim()
    );
  }
  return entries;
}

/** Applied migration ids from "__EFMigrationsHistory", ascending; null when the table is absent. */
export async function readEfHistory(dsn: string): Promise<string[] | null> {
  const client = new Client({ connectionString: dsn, application_name: connectionApplicationName() });
  await client.connect();
  try {
    const exists = await client.query(`SELECT to_regclass('"__EFMigrationsHistory"') IS NOT NULL AS present`);
    if (!exists.rows[0]?.present) return null;
    const r = await client.query(`SELECT "MigrationId" FROM "__EFMigrationsHistory" ORDER BY "MigrationId"`);
    return r.rows.map((row: { MigrationId: string }) => row.MigrationId);
  } finally {
    await client.end();
  }
}

function toApplied(entries: EfMigrationEntry[]): AppliedSchemaMigration[] {
  return entries.map((e) => ({ version: efVersion(e.id), description: efDescription(e.id) }));
}

/**
 * `current` comes from "__EFMigrationsHistory" itself, not from
 * `migrations list` (which only knows migrations compiled into the project),
 * so a database that is ahead of the code reports its real head and the
 * kit's orphan check can see it.
 */
export async function statusEfcore(ctx: EfCoreCtx): Promise<SchemaMigrationStatusResult> {
  const entries = await listEfMigrations(ctx);
  const history = await (ctx.readHistory ?? readEfHistory)(ctx.dsn);
  const current = history && history.length > 0 ? efVersion(history[history.length - 1]) : undefined;
  const pending: PendingSchemaMigration[] = entries
    .filter((e) => e.applied !== true)
    .map((e) => ({ version: efVersion(e.id), filename: `${e.id}.cs`, description: efDescription(e.id) }));
  return { current, pending, tool: "efcore" };
}

export async function applyEfcore(ctx: EfCoreCtx): Promise<ApplySchemaMigrationsResult> {
  const before = new Set((await listEfMigrations(ctx)).filter((e) => e.applied).map((e) => e.id));
  await runEf(ctx.projectDir, ["database", "update"], ctx.dsn, { noBuild: true });
  const after = await listEfMigrations(ctx, { noBuild: true });
  const applied = toApplied(after.filter((e) => e.applied && !before.has(e.id)));
  return { applied, alreadyAtLatest: applied.length === 0, tool: "efcore" };
}

/**
 * Resolve a rollback target to an EF migration id (or "0" for an empty
 * database). Accepts "0", a relative step ("-1", "-2"), a full migration id,
 * its timestamp version, or its name.
 */
export function resolveEfTarget(target: string, applied: EfMigrationEntry[]): string {
  const t = target.trim();
  if (t === "0") return "0";
  const rel = /^-(\d+)$/.exec(t);
  if (rel) {
    const steps = Number(rel[1]);
    if (steps < 1) throw new SchemaMigrationError(`Invalid rollback step: ${target}`);
    const index = applied.length - 1 - steps;
    if (index < -1) {
      throw new SchemaMigrationError(`Cannot roll back ${steps} migration(s); only ${applied.length} applied.`);
    }
    return index === -1 ? "0" : applied[index].id;
  }
  const match = applied.find((e) => e.id === t || efVersion(e.id) === t || e.name === t);
  if (!match) throw new SchemaMigrationError(`Rollback target '${target}' is not an applied migration.`);
  return match.id;
}

export async function rollbackEfcore(ctx: EfCoreCtx & { target: string }): Promise<RollbackSchemaMigrationResult> {
  const beforeEntries = (await listEfMigrations(ctx)).filter((e) => e.applied);
  const targetId = resolveEfTarget(ctx.target, beforeEntries);
  await runEf(ctx.projectDir, ["database", "update", targetId], ctx.dsn, { noBuild: true });
  const stillApplied = new Set((await listEfMigrations(ctx, { noBuild: true })).filter((e) => e.applied).map((e) => e.id));
  return { rolledBack: toApplied(beforeEntries.filter((e) => !stillApplied.has(e.id)).reverse()), tool: "efcore" };
}

/** C# identifier for `migrations add` ("add member phone" -> "AddMemberPhone"). */
export function efMigrationName(slug: string): string {
  const name = slug
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  if (!name) throw new SchemaMigrationError(`Cannot derive a migration name from '${slug}'.`);
  return /^[0-9]/.test(name) ? `M${name}` : name;
}

/**
 * `dotnet ef migrations add <Name>`: EF generates the migration from the
 * model diff (the EF equivalent of Alembic autogenerate). No DB needed.
 */
export async function createEfcoreMigration(opts: {
  projectDir: string;
  slug: string;
}): Promise<{ id: string; path: string }> {
  const project = requireProject(opts.projectDir);
  const name = efMigrationName(opts.slug);
  const existing = new Set(fs.existsSync(project.migrationsDir) ? fs.readdirSync(project.migrationsDir) : []);
  await runEf(opts.projectDir, ["migrations", "add", name]);
  const created = fs
    .readdirSync(project.migrationsDir)
    .filter((f) => !existing.has(f) && MIGRATION_ID.test(f.replace(/\.cs$/, "")) && !f.endsWith(".Designer.cs"));
  if (created.length !== 1) {
    throw new SchemaMigrationError(`Expected one new migration file for ${name}, found: ${created.join(", ") || "none"}`);
  }
  return { id: created[0].replace(/\.cs$/, ""), path: path.join(project.migrationsDir, created[0]) };
}

/** Local EF migration ids in apply order (from Migrations/*.cs, no build). */
export function localEfMigrationIds(projectDir: string): string[] {
  const project = findEfCoreProject(projectDir);
  if (!project || !fs.existsSync(project.migrationsDir)) return [];
  return fs
    .readdirSync(project.migrationsDir)
    .filter((f) => f.endsWith(".cs") && !f.endsWith(".Designer.cs") && MIGRATION_ID.test(f.slice(0, -3)))
    .map((f) => f.slice(0, -3))
    .sort();
}

/** EF Core version recorded in "ProductVersion" when stamping. */
function efProductVersion(project: EfCoreProject): string {
  try {
    const csproj = fs.readFileSync(project.csproj, "utf-8");
    const m = new RegExp(`${EF_DESIGN_PACKAGE.replace(/\./g, "\\.")}"\\s+Version="([^"]+)"`).exec(csproj);
    if (m) return m[1];
  } catch {
    /* fall through */
  }
  return "unknown";
}

/**
 * Set "__EFMigrationsHistory" to exactly the local migrations up to
 * `revision` ("head" = all local) WITHOUT running them: rows for those ids are
 * added and every other row (newer migrations, or orphans whose files are
 * gone) is removed, matching Alembic's stamp. Used to adopt a database whose
 * schema already matches, and by reconcile for a database ahead of code. EF
 * has no native stamp command, so this writes the table in one transaction.
 */
export async function stampEfcore(ctx: EfCoreCtx & { revision: string }): Promise<string> {
  const project = requireProject(ctx.projectDir);
  const ids = localEfMigrationIds(ctx.projectDir);
  if (ids.length === 0) throw new SchemaMigrationError("No local EF Core migrations to stamp.");
  const rev = ctx.revision.trim();
  const end = rev === "head" ? ids.length - 1 : ids.findIndex((id) => id === rev || efVersion(id) === rev);
  if (end < 0) throw new SchemaMigrationError(`Stamp revision '${ctx.revision}' is not a local migration.`);
  const toStamp = ids.slice(0, end + 1);
  const productVersion = efProductVersion(project);

  const client = new Client({ connectionString: ctx.dsn, application_name: connectionApplicationName() });
  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
         "MigrationId" character varying(150) NOT NULL,
         "ProductVersion" character varying(32) NOT NULL,
         CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId"))`
    );
    await client.query(`DELETE FROM "__EFMigrationsHistory" WHERE NOT ("MigrationId" = ANY($1::text[]))`, [toStamp]);
    for (const id of toStamp) {
      await client.query(
        `INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ($1, $2)
         ON CONFLICT ("MigrationId") DO NOTHING`,
        [id, productVersion]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    await client.end();
  }
  return efVersion(toStamp[toStamp.length - 1]);
}
