// EfCoreAdapter: SchemaMigrationAdapter implementation for .NET projects
// using EF Core migrations.
//
// Wraps scripts/lakebase/schema-migrate-runners/efcore.ts in the cross-tool
// adapter contract from ADR-0005. Supports rollback (EF generates Down()) and
// stamp (writes "__EFMigrationsHistory" rows without running migrations).
// collapseHeads is omitted: EF history is linear (flat-list, like Flyway).

import * as path from "node:path";

import { getConnection } from "../get-connection.js";
import { findEfCoreProject, isDotnetProject } from "../dotnet-project.js";
import {
  applyEfcore,
  createEfcoreMigration,
  efDescription,
  efVersion,
  localEfMigrationIds,
  rollbackEfcore,
  stampEfcore,
  statusEfcore,
} from "../schema-migrate-runners/efcore.js";
import type { AppliedSchemaMigration, PendingSchemaMigration, SchemaMigrationFile } from "../schema-migrate.js";
import {
  registerSchemaMigrationAdapter,
  type ApplyArgs,
  type ApplyResult,
  type ListArgs,
  type ListResult,
  type NewMigrationArgs,
  type NewMigrationResult,
  type RollbackArgs,
  type RollbackResult,
  type SchemaMigrationAdapter,
  type StampArgs,
  type StampResult,
  type StatusArgs,
  type StatusResult,
} from "../schema-migration-adapter.js";

async function buildDsn(args: {
  instance: string;
  branch: string;
  database?: string;
  endpointName?: string;
}): Promise<string> {
  const result = await getConnection({
    output: "dsn",
    instance: args.instance,
    branch: args.branch,
    database: args.database,
    endpointName: args.endpointName,
  });
  return result.url;
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Migration files in apply order: Migrations/<timestamp>_<Name>.cs (not .Designer.cs / the snapshot). */
export function listEfCoreFiles(projectDir: string): SchemaMigrationFile[] {
  return localEfMigrationIds(projectDir).map((id) => ({
    version: efVersion(id),
    filename: `${id}.cs`,
    description: efDescription(id),
    type: "CSharp" as const,
    tool: "efcore" as const,
  }));
}

export const EfCoreAdapter: SchemaMigrationAdapter = {
  id: "efcore",
  languages: ["dotnet"],

  /** A .NET project (root marker) with a *.csproj that references Microsoft.EntityFrameworkCore.Design. */
  detect(projectDir: string): boolean {
    return isDotnetProject(projectDir) && findEfCoreProject(projectDir) !== null;
  },

  async apply(args: ApplyArgs): Promise<ApplyResult> {
    try {
      const dsn = await buildDsn(args);
      const r = await applyEfcore({ projectDir: args.projectDir, dsn });
      return {
        applied_migrations: r.applied,
        status: r.alreadyAtLatest ? "noop" : "ok",
        tool_specific: { alreadyAtLatest: r.alreadyAtLatest, tool: r.tool },
      };
    } catch (err) {
      return { applied_migrations: [], status: "error", error: errMsg(err) };
    }
  },

  async rollback(args: RollbackArgs): Promise<RollbackResult> {
    try {
      const dsn = await buildDsn(args);
      const r = await rollbackEfcore({ projectDir: args.projectDir, dsn, target: args.target });
      return {
        rolled_back: r.rolledBack as AppliedSchemaMigration[],
        status: r.rolledBack.length === 0 ? "noop" : "ok",
        tool_specific: { tool: r.tool },
      };
    } catch (err) {
      return { rolled_back: [], status: "error", error: errMsg(err) };
    }
  },

  async stamp(args: StampArgs): Promise<StampResult> {
    try {
      const dsn = await buildDsn(args);
      const stamped = await stampEfcore({ projectDir: args.projectDir, dsn, revision: args.revision });
      return { status: "ok", stamped_revision: stamped, tool_specific: { tool: "efcore" } };
    } catch (err) {
      return { status: "error", stamped_revision: null, error: errMsg(err) };
    }
  },

  async status(args: StatusArgs): Promise<StatusResult> {
    try {
      const dsn = await buildDsn(args);
      const r = await statusEfcore({ projectDir: args.projectDir, dsn });
      return {
        applied_version: r.current ?? null,
        pending: r.pending as PendingSchemaMigration[],
        applied: [],
        status: "ok",
        tool_specific: { tool: r.tool },
      };
    } catch (err) {
      return { applied_version: null, pending: [], applied: [], status: "error", error: errMsg(err) };
    }
  },

  async list(args: ListArgs): Promise<ListResult> {
    return { files: listEfCoreFiles(args.projectDir) };
  },

  // baseline: use stamp (EF has no separate baseline concept).

  async newMigration(args: NewMigrationArgs): Promise<NewMigrationResult> {
    // `dotnet ef migrations add` always generates from the model diff, so
    // autogenerate is implicit and needs no database connection.
    try {
      const created = await createEfcoreMigration({ projectDir: args.projectDir, slug: args.slug });
      return {
        status: "ok",
        version: efVersion(created.id),
        filename: path.basename(created.path),
        path: created.path,
      };
    } catch (err) {
      return { status: "error", version: "", filename: "", path: "", error: errMsg(err) };
    }
  },
};

registerSchemaMigrationAdapter(EfCoreAdapter);
