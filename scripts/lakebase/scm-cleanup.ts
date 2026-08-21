// Cleanup / destroy for a project's Lakebase SCM resources — the throwaway half
// of the scaffold/spike story. Safe by design: dry-run unless `apply`, tiers and
// the default (trunk) branch are never deleted, idempotent, and every action is
// reported (no summary-only success). See docs/design/cleanup-destroy-bin.md.
//
// Modes:
//   list      classify branches (trunk / tiers / ephemeral); delete nothing.
//   branches  delete the EPHEMERAL branches (feature/test/uat/perf/spike — the
//             ones with a TTL / expireTime); tiers + trunk are protected.
//   project   DESTROY the whole Lakebase project (all branches + the project),
//             guarded by an explicit project-id confirmation.
//
// Git-branch / local-worktree cleanup is intentionally left to the caller that
// knows the project dir (consort / the extension); this module owns the Lakebase
// side, which is where the irreversible resource lives.

import {
  listBranches as defaultListBranches,
  type LakebaseBranchInfo,
} from "./branch-utils.js";
import { deleteBranch as defaultDeleteBranch } from "./branch-delete.js";
import { deleteLakebaseProject as defaultDeleteProject } from "./lakebase-project.js";

export class ScmCleanupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScmCleanupError";
  }
}

export type CleanupMode = "list" | "branches" | "project";

export interface CleanupOptions {
  /** Lakebase instance / project id. */
  instance: string;
  /** Override host. */
  host?: string;
  /** false (default) = dry-run: plan only, delete nothing. true = perform deletes. */
  apply?: boolean;
  /** Required for `project` mode: must equal `instance` (guard against fat-finger). */
  confirmProjectId?: string;
  // ---- injectables (tests) ----
  listBranches?: (opts: { instance: string; host?: string }) => Promise<LakebaseBranchInfo[]>;
  deleteBranch?: (args: { branch: string; instance: string; host?: string; allowDefault?: boolean }) => Promise<void>;
  deleteProject?: (args: { projectId: string; host?: string }) => Promise<void>;
}

/** One planned/performed action on a resource. */
export interface CleanupAction {
  /** Branch leaf name, or the project id for the project-delete step. */
  resource: string;
  kind: "trunk" | "tier" | "ephemeral" | "project";
  /** "delete" (targeted) or "skip" (protected / not in scope). */
  action: "delete" | "skip";
  /** Why it was skipped (protected tier / trunk). */
  reason?: string;
  /** Set when apply=true: whether the delete actually succeeded. */
  ok?: boolean;
  error?: string;
}

export interface CleanupResult {
  mode: CleanupMode;
  instance: string;
  dryRun: boolean;
  counts: { trunk: number; tiers: number; ephemeral: number };
  actions: CleanupAction[];
  /** true when apply=true and every attempted delete succeeded. */
  applied: boolean;
}

/** trunk = default branch; tier = long-running (no TTL, not default); ephemeral = has a TTL. */
function classify(b: LakebaseBranchInfo): CleanupAction["kind"] {
  if (b.isDefault) return "trunk";
  if (b.expireTime) return "ephemeral";
  return "tier";
}

export async function runCleanup(mode: CleanupMode, opts: CleanupOptions): Promise<CleanupResult> {
  if (!opts.instance) throw new ScmCleanupError("cleanup requires an instance (project id).");
  const list = opts.listBranches ?? defaultListBranches;
  const del = opts.deleteBranch ?? defaultDeleteBranch;
  const delProject = opts.deleteProject ?? defaultDeleteProject;
  const dryRun = opts.apply !== true;

  const branches = await list({ instance: opts.instance, host: opts.host });
  const kinds = branches.map((b) => ({ b, kind: classify(b) }));
  const counts = {
    trunk: kinds.filter((k) => k.kind === "trunk").length,
    tiers: kinds.filter((k) => k.kind === "tier").length,
    ephemeral: kinds.filter((k) => k.kind === "ephemeral").length,
  };
  const actions: CleanupAction[] = [];

  if (mode === "list") {
    for (const { b, kind } of kinds) {
      actions.push({
        resource: b.nameLeaf,
        kind,
        action: kind === "ephemeral" ? "delete" : "skip",
        reason: kind === "ephemeral" ? undefined : `protected ${kind}`,
      });
    }
    return { mode, instance: opts.instance, dryRun: true, counts, actions, applied: false };
  }

  if (mode === "branches") {
    let allOk = true;
    for (const { b, kind } of kinds) {
      if (kind !== "ephemeral" || b.isProtected) {
        actions.push({ resource: b.nameLeaf, kind, action: "skip", reason: b.isProtected ? "isProtected" : `protected ${kind}` });
        continue;
      }
      if (dryRun) {
        actions.push({ resource: b.nameLeaf, kind, action: "delete" });
        continue;
      }
      try {
        await del({ branch: b.nameLeaf, instance: opts.instance, host: opts.host, allowDefault: false });
        actions.push({ resource: b.nameLeaf, kind, action: "delete", ok: true });
      } catch (err) {
        allOk = false;
        actions.push({ resource: b.nameLeaf, kind, action: "delete", ok: false, error: (err as Error).message });
      }
    }
    return { mode, instance: opts.instance, dryRun, counts, actions, applied: !dryRun && allOk };
  }

  // mode === "project": destroy the whole project (all branches + the project).
  if (!dryRun && opts.confirmProjectId !== opts.instance) {
    throw new ScmCleanupError(
      `project destroy requires --confirm ${opts.instance} (got ${opts.confirmProjectId ?? "nothing"}). ` +
        `This deletes the entire Lakebase project and every branch.`
    );
  }
  // Plan: every branch goes away with the project; the project delete is the act.
  for (const { b, kind } of kinds) {
    actions.push({ resource: b.nameLeaf, kind, action: "delete", ...(dryRun ? {} : { ok: undefined }) });
  }
  if (dryRun) {
    actions.push({ resource: opts.instance, kind: "project", action: "delete" });
    return { mode, instance: opts.instance, dryRun: true, counts, actions, applied: false };
  }
  try {
    await delProject({ projectId: opts.instance, host: opts.host });
    actions.push({ resource: opts.instance, kind: "project", action: "delete", ok: true });
    return { mode, instance: opts.instance, dryRun: false, counts, actions, applied: true };
  } catch (err) {
    actions.push({ resource: opts.instance, kind: "project", action: "delete", ok: false, error: (err as Error).message });
    return { mode, instance: opts.instance, dryRun: false, counts, actions, applied: false };
  }
}
