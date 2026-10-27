// Lakebase SNAPSHOT primitives — the fast verify-branch substrate.
//
// A snapshot is an immutable point-in-time copy of a branch's data. Capture the
// committed schema ONCE (create), then branch copy-on-write from it per verify
// cycle (createBranch({ fromSnapshot })) instead of forking + `alembic upgrade
// head` every time. Because the snapshot is a fixed point, the per-cycle branch
// never goes stale. "Restore" is not an in-place op in Lakebase — you restore by
// branching from the snapshot (see createBranch's fromSnapshot path).
//
// API (verified): POST .../snapshots?snapshot_id=<id> with spec.source_branch
// (+ optional source_branch_time | source_branch_lsn for PITR, + one of
// no_expiry | ttl | expire_time). Mirrors the one-databricks-CLI-wrapper rule.
import { runDatabricks } from "./databricks-cli.js";
import { projectPath } from "./branch-utils.js";
import { KIT_TIMEOUTS } from "./kit-config.js";

/** Full branch resource path from a bare leaf or an already-full path. */
function branchResource(instance: string, branch: string): string {
  return branch.includes("/") ? branch : `${projectPath(instance)}/branches/${branch}`;
}

/** Full snapshot resource path from a bare id or an already-full path. */
function snapshotResource(instance: string, snapshot: string): string {
  return snapshot.includes("/") ? snapshot : `${projectPath(instance)}/snapshots/${snapshot}`;
}

export interface SnapshotSpec {
  source_branch: string;
  source_branch_time?: string;
  source_branch_lsn?: string;
  no_expiry?: boolean;
  ttl?: string;
}

export interface CreateSnapshotArgs {
  instance: string;
  /** Client-chosen snapshot id (becomes the resource leaf). */
  snapshot: string;
  /** Branch to snapshot — bare leaf (e.g. "staging") or full path. */
  sourceBranch: string;
  /** PITR: snapshot the branch AS OF this ISO timestamp (source_branch_time). */
  sourceBranchTime?: string;
  /** PITR: snapshot AS OF this LSN (source_branch_lsn). Exclusive with sourceBranchTime. */
  sourceBranchLsn?: string;
  /** TTL string ("604800s"). Mutually exclusive with noExpiry. */
  ttl?: string;
  /** Never auto-expire. Default true when ttl is unset (the API requires one). */
  noExpiry?: boolean;
  host?: string;
}

/** Build the create-snapshot `spec` (pure — unit-testable without the CLI). */
export function buildSnapshotSpec(args: CreateSnapshotArgs): SnapshotSpec {
  if (args.sourceBranchTime && args.sourceBranchLsn) {
    throw new Error("sourceBranchTime and sourceBranchLsn are mutually exclusive — pass at most one point-in-time.");
  }
  if (args.ttl && args.noExpiry === true) {
    throw new Error(`Cannot set both ttl ("${args.ttl}") and noExpiry: true — they are mutually exclusive.`);
  }
  const spec: SnapshotSpec = { source_branch: branchResource(args.instance, args.sourceBranch) };
  if (args.sourceBranchTime) spec.source_branch_time = args.sourceBranchTime;
  else if (args.sourceBranchLsn) spec.source_branch_lsn = args.sourceBranchLsn;
  if (args.ttl) spec.ttl = args.ttl;
  else if (args.noExpiry ?? true) spec.no_expiry = true;
  return spec;
}

/** Create an immutable snapshot of a branch (waits for the operation to complete). */
export async function createSnapshot(args: CreateSnapshotArgs): Promise<string> {
  const spec = buildSnapshotSpec(args);
  return runDatabricks(
    ["postgres", "create-snapshot", projectPath(args.instance), args.snapshot, "--json", JSON.stringify({ spec })],
    { host: args.host, timeout: KIT_TIMEOUTS.cliCreateBranch },
  );
}

export async function deleteSnapshot(args: { instance: string; snapshot: string; host?: string }): Promise<string> {
  return runDatabricks(["postgres", "delete-snapshot", snapshotResource(args.instance, args.snapshot)], {
    host: args.host,
  });
}

export async function listSnapshots(args: { instance: string; host?: string }): Promise<string> {
  return runDatabricks(["postgres", "list-snapshots", projectPath(args.instance), "-o", "json"], { host: args.host });
}
