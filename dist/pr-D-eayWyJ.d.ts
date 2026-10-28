declare class GitHubRepoError extends Error {
    readonly status?: number;
    constructor(message: string, status?: number);
}
/** Returns the GitHub login of the currently authenticated user. */
declare function getCurrentUser(): Promise<string>;
interface GitHubScopeStatus {
    /** Granted OAuth scopes, or null when the token exposes NONE — a fine-grained
     *  PAT or GitHub App token carries no OAuth scope header; its permissions
     *  aren't a scope set, so callers MUST treat null as "unknown", never a miss. */
    granted: string[] | null;
    /** Required scopes absent from `granted` (empty when `granted` is null). */
    missing: string[];
}
/**
 * Read the authenticated token's granted OAuth scopes from the GitHub API
 * `x-oauth-scopes` response header and diff them against `required`. A classic
 * OAuth/PAT token returns a (possibly empty) comma-separated header; a
 * fine-grained PAT / GitHub App token omits it entirely → `granted: null`.
 * Reading your own user needs no special scope, so this succeeds for any VALID
 * token regardless of scopes (and throws, like the other ops, on a bad token /
 * network error — callers decide whether that is blocking).
 */
declare function checkGitHubScopes(required?: readonly string[]): Promise<GitHubScopeStatus>;
interface CreateRepoOptions {
    /** Make the repo private. Default: true. */
    private?: boolean;
    description?: string;
}
/**
 * Create a new GitHub repository. Accepts either bare name (creates for the
 * authenticated user) or "owner/name" (creates in org if owner != login).
 *
 * @returns the repo HTML URL.
 */
declare function createRepo(name: string, opts?: CreateRepoOptions): Promise<string>;
/** Delete a GitHub repository. Requires the `delete_repo` OAuth scope. */
declare function deleteRepo(name: string): Promise<void>;
/** True iff the repository exists and is visible to the authenticated user. */
declare function repoExists(name: string): Promise<boolean>;
/**
 * Whether GitHub Actions is enabled for `ownerRepo`. `GET .../actions/permissions`
 * returns `enabled:false` both when a repo admin disabled Actions AND when an org
 * policy disables it for the repo. When Actions is off, the kit's CI workflows
 * (pr.yml / merge.yml) silently never run, which presents as "CI didn't follow
 * the kit workflow". Returns:
 *   - true / false  : the determined state
 *   - undefined     : couldn't determine (no token, repo invisible, API error) ,
 *                     callers must treat this as "unknown", never as disabled,
 *                     so a missing token never produces a false alarm.
 */
declare function getActionsEnabled(ownerRepo: string): Promise<boolean | undefined>;
/**
 * Resolve the canonical `owner/repo` slug. Used by create-project to poll
 * until a freshly-created repo is visible (SAML / propagation delays).
 */
declare function getRepoFullName(name: string): Promise<string>;

declare class GitHubPullRequestError extends Error {
    readonly status?: number | undefined;
    constructor(message: string, status?: number | undefined);
}
interface PullRequestCheck {
    name: string;
    status: string;
    conclusion: string;
    detailsUrl?: string;
}
interface PullRequestReview {
    author: string;
    state: string;
    body: string;
    submittedAt?: string;
}
interface PullRequestFile {
    path: string;
    status: "added" | "modified" | "deleted" | "renamed";
    additions: number;
    deletions: number;
}
interface PullRequestInfo {
    number: number;
    title: string;
    url: string;
    state: string;
    isDraft: boolean;
    ciStatus: "pending" | "success" | "failure";
    checks: PullRequestCheck[];
    /** GitHub's mergeability triple: true/false/null (null = still computing). */
    mergeable?: boolean | null;
    /** GitHub's `mergeable_state`: `clean`/`unstable`/`behind`/`blocked`/`dirty`/`unknown`.
     *  `dirty` = merge conflict with the base — a `pull_request` CI run can't be dispatched
     *  (there is no mergeable ref), so a waiter must surface this, not poll until timeout. */
    mergeableState?: string;
    headBranch: string;
    baseBranch: string;
    body?: string;
    additions?: number;
    deletions?: number;
    changedFiles?: number;
}
interface WorkflowRunSummary {
    id: number;
    name: string;
    status: string;
    conclusion: string;
    branch: string;
    event: string;
    /** The commit SHA the run executed against (GitHub's `head_sha`). For a
     * `push` run this is the new tip the push created, so it equals the merge
     * commit SHA that `pulls.merge` returned. Matching a downstream migrate run
     * by this SHA is clock-independent, unlike a `createdAt >= mergedAt` window,
     * which false-negatives when the local merge bookkeeping lags GitHub's clock. */
    headSha?: string;
    /** ISO 8601 timestamp from GitHub. Useful for filtering out runs older than
     * a session start time or detecting stuck/orphaned runs whose updated_at
     * lags. May be `undefined` if the API omitted it. */
    createdAt?: string;
    updatedAt?: string;
}
interface CreatePullRequestArgs {
    ownerRepo: string;
    headBranch: string;
    title: string;
    body: string;
    /** Target branch. Omit to use the repo's default branch. */
    baseBranch?: string;
}
/** Create a pull request. Returns the HTML URL. */
declare function createPullRequest(args: CreatePullRequestArgs): Promise<string>;
/** Find the open PR whose head branch matches; returns the full PR info + CI status. */
declare function getPullRequest(ownerRepo: string, headBranch: string): Promise<PullRequestInfo | undefined>;
/** Reviews on a PR (approvals, change requests, comments). */
declare function getPullRequestReviews(ownerRepo: string, pullNumber: number): Promise<PullRequestReview[]>;
/** Files changed in a PR. */
declare function getPullRequestFiles(ownerRepo: string, pullNumber: number): Promise<PullRequestFile[]>;
/** Issue/PR comments (e.g. schema-diff CI bot comments). */
declare function getPullRequestComments(ownerRepo: string, pullNumber: number): Promise<Array<{
    author: string;
    body: string;
}>>;
/** Plain list of issue/PR comment bodies (filtered for non-empty). */
declare function listIssueComments(ownerRepo: string, issueNumber: number): Promise<string[]>;
interface MergePullRequestArgs {
    ownerRepo: string;
    pullNumber: number;
    /** Default: "merge". */
    method?: "merge" | "squash" | "rebase";
    /** Default: true. Delete the remote head branch after merge. */
    deleteRemoteBranch?: boolean;
}
/** The outcome of merging a PR. */
interface MergePullRequestResult {
    /** GitHub's merge confirmation message. */
    message: string;
    /** The SHA of the commit the merge created on the base branch (squash/merge/
     *  rebase all report the new base tip here). This is the `head_sha` the
     *  downstream `push` workflow run will carry, so callers can match that run
     *  by SHA instead of by a merge-timestamp window. `undefined` if the API
     *  omitted it. */
    sha?: string;
}
/** Merge a PR. Optionally deletes the remote head branch. */
declare function mergePullRequest(args: MergePullRequestArgs): Promise<MergePullRequestResult>;
/** Recent workflow runs for a repo. */
declare function listWorkflowRuns(ownerRepo: string, limit?: number): Promise<WorkflowRunSummary[]>;
interface FastForwardBranchArgs {
    /** owner/repo (e.g. "kevin-hartman/ecom-mpk123"). */
    ownerRepo: string;
    /** The branch whose ref will be moved (e.g. "staging"). */
    branch: string;
    /** The SHA or branch name to move it to (e.g. "main"). When passing
     *  a branch name, the latest SHA on that branch is resolved first. */
    toRef: string;
}
/**
 * Fast-forward `branch` to point at `toRef`. Used by `release()` to
 * keep the source tier aligned with the target tier after merge:
 * without this, every staging→main release leaves staging trailing
 * main by one merge commit (tree-identical but graph-divergent), and
 * the gap compounds across releases. Tooling that displays "X behind
 * Y" then misleadingly suggests staging has fallen out of sync when
 * it hasn't.
 *
 * Uses GitHub's `git/refs` PATCH API. Idempotent: calling it twice
 * with the same `toRef` is a no-op on the second call. Will throw if
 * the update is not a fast-forward (i.e. `toRef` is not a descendant
 * of `branch`). For the release-flow case, `toRef` is always the
 * target of the merge we just landed, so it IS a descendant by
 * construction.
 */
declare function fastForwardBranch(args: FastForwardBranchArgs): Promise<void>;
interface MergePairedPullRequestArgs {
    ownerRepo: string;
    pullNumber: number;
    /** Lakebase project id used to clean up the feature branch on merge. */
    lakebaseInstance: string;
    /** Default: "merge". */
    method?: "merge" | "squash" | "rebase";
    /** Delete the remote head git branch. Default: true. */
    deleteRemoteBranch?: boolean;
    /** Delete the matching feature Lakebase branch after merge. Default: true. */
    deleteLakebaseBranch?: boolean;
}
interface MergePairedPullRequestResult {
    /** GitHub merge confirmation message. */
    message: string;
    /** The PR's head branch name (used to resolve the Lakebase feature branch). */
    headBranch: string;
    /** True iff the matching feature Lakebase branch was deleted. */
    lakebaseBranchDeleted: boolean;
    /** The SHA the merge created on the base branch (see MergePullRequestResult.sha).
     *  Downstream migrate-run matching keys on this. `undefined` if the API omitted it. */
    mergeCommitSha?: string;
    warnings: string[];
}
/**
 * Merge a GitHub PR and clean up the matching feature Lakebase branch.
 *
 * The pairing-aware merge operation: once the code change lands in the base
 * git branch, the feature Lakebase branch has served its purpose (CI replays
 * its migrations against the base Lakebase branch automatically). Best-effort
 * delete keeps Lakebase branch counts from growing unbounded.
 *
 * Note: this does NOT auto-apply schema migrations against the base Lakebase
 * branch. That happens via the CI workflow on the base branch's next push.
 * The "parent-matched merge" is structurally: head git → base git, then
 * delete the feature Lakebase (its schema is already in the base via merged
 * migrations).
 */
declare function mergePairedPullRequest(args: MergePairedPullRequestArgs): Promise<MergePairedPullRequestResult>;

export { type CreatePullRequestArgs as C, type FastForwardBranchArgs as F, GitHubPullRequestError as G, type MergePairedPullRequestArgs as M, type PullRequestCheck as P, type WorkflowRunSummary as W, type CreateRepoOptions as a, GitHubRepoError as b, type GitHubScopeStatus as c, type MergePairedPullRequestResult as d, type MergePullRequestArgs as e, type MergePullRequestResult as f, type PullRequestFile as g, type PullRequestInfo as h, type PullRequestReview as i, checkGitHubScopes as j, createPullRequest as k, createRepo as l, deleteRepo as m, fastForwardBranch as n, getActionsEnabled as o, getCurrentUser as p, getPullRequest as q, getPullRequestComments as r, getPullRequestFiles as s, getPullRequestReviews as t, getRepoFullName as u, listIssueComments as v, listWorkflowRuns as w, mergePairedPullRequest as x, mergePullRequest as y, repoExists as z };
