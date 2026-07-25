// Resolve the GIT base branch for a feature's SCM parent.
//
// A feature claim records `parent_branch` = the Lakebase parent it forked from
// (resolveParentBranch: tier-1 = the project's Lakebase default branch name, e.g.
// "production"; tier-2 = "staging"; tier-3 = "dev"). prepare-pr and scm-merge
// then need a GIT branch for the PR base / commits-ahead / checkout / ff-merge /
// downstream-migrate wait.
//
// For tier-2/3 the parent IS a real git branch (staging / dev), so it is used
// directly. For tier-1 the Lakebase default name can DIFFER from the git trunk
// (git "main" vs Lakebase "production"); there is no git branch named
// "production", so the git base is the repository's default branch. This is the
// one place the git side and the Lakebase side are reconciled, so every git
// operation targets a real branch regardless of how the workspace named the
// Lakebase default.

import { gitBranchExists, resolveDefaultBranch } from "../git/inspect.js";

/**
 * The git branch to use as the base/target for a feature whose Lakebase parent
 * is `parentBranch`. Returns `parentBranch` when it is a real git branch;
 * otherwise the repo's default (trunk) branch.
 */
export async function resolveGitBase(parentBranch: string, cwd: string): Promise<string> {
  if (parentBranch && (await gitBranchExists({ cwd, branch: parentBranch }))) {
    return parentBranch;
  }
  return resolveDefaultBranch({ cwd });
}
