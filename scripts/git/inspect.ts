// Inspection primitives (P6g). Read-only "what's the
// state?" calls that don't fit cleanly into branches.ts, ancestry.ts,
// or log.ts. All return safe empty defaults on failure so callers
// driving status-bar / tree refreshes don't have to wrap every call.

import { exec, shq, type CwdOnly } from "../util/exec.js";

export interface GetFileAtRefArgs {
  cwd: string;
  ref: string;
  filePath: string;
}

/**
 * Current branch name via `git rev-parse --abbrev-ref HEAD`. Returns
 * "" on non-git cwd or detached HEAD (where rev-parse returns the
 * literal "HEAD" string). Note: this swallows the detached-HEAD case
 * by checking for that literal so callers can treat "" uniformly as
 * "no usable current branch".
 */
export async function getCurrentBranch(args: CwdOnly): Promise<string> {
  try {
    const name = await exec("git rev-parse --abbrev-ref HEAD", {
      cwd: args.cwd,
    });
    return name === "HEAD" ? "" : name;
  } catch {
    return "";
  }
}

/**
 * Absolute path of the git repository root (`git rev-parse
 * --show-toplevel`). Returns "" on non-git cwd.
 */
export async function getRepoRoot(args: CwdOnly): Promise<string> {
  try {
    return await exec("git rev-parse --show-toplevel", { cwd: args.cwd });
  } catch {
    return "";
  }
}

/**
 * File contents at a given ref (`git show <ref>:<path>`). Returns ""
 * when the file doesn't exist at that ref (common for newly-added
 * files in a working-tree-vs-trunk diff) or when the call fails.
 */
export async function getFileAtRef(args: GetFileAtRefArgs): Promise<string> {
  try {
    return await exec(
      `git show ${shq(`${args.ref}:${args.filePath}`)}`,
      { cwd: args.cwd }
    );
  } catch {
    return "";
  }
}

/**
 * Whether `branch` resolves to a real git branch, locally or on origin
 * (`git rev-parse --verify`). Distinguishes a git tier branch (staging / dev, or
 * a Lakebase default whose name matches the git trunk) from a Lakebase-only
 * parent name (a tier-1 default like "production" that is NOT a git branch).
 * Returns false on any failure.
 */
export async function gitBranchExists(args: { cwd: string; branch: string }): Promise<boolean> {
  if (!args.branch) return false;
  for (const ref of [`refs/heads/${args.branch}`, `refs/remotes/origin/${args.branch}`]) {
    try {
      await exec(`git rev-parse --verify --quiet ${shq(ref)}`, { cwd: args.cwd });
      return true;
    } catch {
      /* try the next candidate ref */
    }
  }
  return false;
}

/**
 * The repository's default (trunk) branch: origin's HEAD symref
 * (`git rev-parse --abbrev-ref origin/HEAD` -> "origin/main" -> "main"), else a
 * local main / master, else the literal "main". This is the git base a tier-1
 * feature forks from when the Lakebase default branch name differs from the git
 * trunk.
 */
export async function resolveDefaultBranch(args: CwdOnly): Promise<string> {
  try {
    const ref = await exec("git rev-parse --abbrev-ref origin/HEAD", { cwd: args.cwd });
    const name = ref.replace(/^origin\//, "").trim();
    if (name && name !== "HEAD") return name;
  } catch {
    /* fall through to local trunk detection */
  }
  for (const cand of ["main", "master"]) {
    if (await gitBranchExists({ cwd: args.cwd, branch: cand })) return cand;
  }
  return "main";
}

/**
 * List local tag names (`git tag -l`). Returns [] on non-git cwd or
 * when no tags exist.
 */
export async function listTags(args: CwdOnly): Promise<string[]> {
  try {
    const raw = await exec("git tag -l", { cwd: args.cwd });
    return raw ? raw.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}
