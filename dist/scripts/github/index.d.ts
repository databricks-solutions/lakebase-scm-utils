export { C as CreatePullRequestArgs, a as CreateRepoOptions, F as FastForwardBranchArgs, G as GitHubPullRequestError, b as GitHubRepoError, c as GitHubScopeStatus, M as MergePairedPullRequestArgs, d as MergePairedPullRequestResult, e as MergePullRequestArgs, f as MergePullRequestResult, P as PullRequestCheck, g as PullRequestFile, h as PullRequestInfo, i as PullRequestReview, W as WorkflowRunSummary, j as checkGitHubScopes, k as createPullRequest, l as createRepo, m as deleteRepo, n as fastForwardBranch, o as getActionsEnabled, p as getCurrentUser, q as getPullRequest, r as getPullRequestComments, s as getPullRequestFiles, t as getPullRequestReviews, u as getRepoFullName, v as listIssueComments, w as listWorkflowRuns, x as mergePairedPullRequest, y as mergePullRequest, z as repoExists } from '../../pr-D-eayWyJ.js';

/** OAuth scopes the workflow ops collectively need. */
declare const GITHUB_SCOPES: readonly ["repo", "workflow", "delete_repo"];
/**
 * Resolve a GitHub token through the unified fallback chain.
 *
 * Non-interactive – never prompts. For the interactive sign-in UX
 * (`createIfNone: true`), the extension's `ensureGitHubAuth()` wrapper
 * calls `tryVsCodeSession({ createIfNone: true })` directly.
 *
 * @param scopes optional override of GITHUB_SCOPES (rare – most callers use the default)
 */
declare function resolveGitHubToken(scopes?: readonly string[]): Promise<string>;
interface VsCodeSessionOptions {
    /** Defaults to GITHUB_SCOPES. */
    scopes?: readonly string[];
    /**
     * When true and no session exists, VS Code prompts the user to sign in.
     * Only meaningful inside the extension host; ignored elsewhere.
     * Default: false (silent).
     */
    createIfNone?: boolean;
}
/**
 * Resolve a token from the VS Code GitHub session, or undefined when:
 *   - We're not inside the extension host (`vscode` module unresolvable)
 *   - No session exists and `createIfNone` is false
 *   - Any error in the session call
 */
declare function tryVsCodeSession(opts?: VsCodeSessionOptions): Promise<string | undefined>;
/**
 * Resolve a token by shelling out to `gh auth token`. Returns undefined if
 * gh isn't installed, isn't authenticated, or any other failure.
 */
declare function tryGhAuthToken(): string | undefined;
/**
 * Diagnostic helper. Reports which sources are configured / would
 * succeed, without revealing the token itself. Used by the CLI's
 * `--diagnose` flag and by tests.
 */
declare function diagnoseGitHubAuth(): Promise<GitHubAuthDiagnosis>;
type GitHubAuthSource = "env" | "vscode" | "gh";
interface GitHubAuthDiagnosis {
    /** Sources that returned a usable token, in fallback order. */
    sources: GitHubAuthSource[];
    /** First source `resolveGitHubToken` would use, or undefined if none. */
    primary?: GitHubAuthSource;
    scopes: string[];
}

declare class GitHubRunnerError extends Error {
    readonly status?: number;
    constructor(message: string, status?: number);
}
interface RepoRunner {
    id: number;
    name: string;
    status: string;
}
/**
 * Create a short-lived registration token for `config.sh`. Surfaces a
 * clear error when the signed-in user cannot see the repo (404 / SAML).
 */
declare function createRegistrationToken(ownerRepo: string): Promise<string>;
/** List all self-hosted runners registered on the repo. */
declare function listRepoRunners(ownerRepo: string): Promise<RepoRunner[]>;
/** Find a runner by name on the repo; returns undefined if not present. */
declare function getRunnerIdByName(ownerRepo: string, runnerName: string): Promise<number | undefined>;
/** Get the GitHub-reported status of a runner by name. */
declare function getRunnerStatus(ownerRepo: string, runnerName: string): Promise<string | undefined>;
/** Deregister a runner from the repo (best-effort – failures are swallowed). */
declare function deleteRunner(ownerRepo: string, runnerId: number): Promise<void>;

declare class GitHubSecretsError extends Error {
    readonly status?: number;
    constructor(message: string, status?: number);
}
/** Create or update a single GitHub Actions repository secret. */
declare function setRepoSecret(ownerRepo: string, secretName: string, secretValue: string): Promise<void>;
/**
 * Set multiple repository secrets in sequence. Fail-fast: validates all
 * values are non-empty BEFORE making any API call (so a bad input doesn't
 * leave some secrets written and others not).
 */
declare function setRepoSecrets(ownerRepo: string, secrets: Record<string, string>): Promise<void>;
/** List configured secret names (returns empty array on any error). */
declare function listSecretNames(ownerRepo: string): Promise<string[]>;

export { GITHUB_SCOPES, type GitHubAuthDiagnosis, type GitHubAuthSource, GitHubRunnerError, GitHubSecretsError, type RepoRunner, type VsCodeSessionOptions, createRegistrationToken, deleteRunner, diagnoseGitHubAuth, getRunnerIdByName, getRunnerStatus, listRepoRunners, listSecretNames, resolveGitHubToken, setRepoSecret, setRepoSecrets, tryGhAuthToken, tryVsCodeSession };
