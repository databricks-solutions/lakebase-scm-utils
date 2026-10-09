// The ONE home for the repo's CI auth: mint/refresh the Databricks credential and sync
// DATABRICKS_HOST + LAKEBASE_PROJECT_ID + DATABRICKS_TOKEN to the GitHub repo's Actions
// secrets. create-project, the lakebase-sync-ci-secrets repair CLI, the seed rehydrate
// (setup.sh Step 7g), the scaffolded pre-push hook, and the prepare-pr / scm-merge expiry
// preflight all funnel through here, so there is exactly ONE CI-token identity:
//   comment  = `GitHub Actions (<repo>)`  (project-scoped, matchable in `databricks tokens list`)
//   lifetime = 90 days                    (durable: a CI rerun / downstream migrate that fires
//                                           hours after the push still authenticates — FEIP-8020)
// A workspace with PATs disabled falls back to a short-lived (~1h) OAuth session token.
//
// Caller passes host + project-id directly (create-project no longer writes .env; the only
// on-disk .env is created later by the post-checkout hook, after CI secrets need to be set).

import * as path from "node:path";
import { runDatabricks } from "../lakebase/databricks-cli.js";
import { readEnvVar } from "../lakebase/env-file.js";
import { setRepoSecrets, listSecretNames } from "../github/secrets.js";
import { getOwnerRepo } from "../git/remote.js";

/** The repo Actions secrets CI needs to provision a per-PR Lakebase branch. Missing ANY of
 *  these leaves CI unable to produce a DATABASE_URL, so the test step aborts — the failure
 *  that otherwise only surfaces at promotion, an entire feature after creation. */
export const REQUIRED_CI_SECRETS = ["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID", "DATABRICKS_TOKEN"] as const;

/** The canonical CI-token lifetime: 90 days. Durable so a CI rerun / downstream migrate that
 *  fires long after the push still authenticates (the ~1h OAuth session expiry bug, FEIP-8020). */
export const CI_TOKEN_LIFETIME_SECONDS = 7_776_000;

/** Default margin: re-mint when the live CI token expires within this window of now, so the
 *  about-to-fire CI run gets a token that comfortably outlives it (and a 24h bootstrap token
 *  is upgraded to the durable one at the first preflight). */
export const CI_TOKEN_REMINT_MARGIN_SECONDS = 86_400;

/** The ONE CI-token comment, project-scoped so it is matchable in `databricks tokens list`
 *  (the expiry probe) and distinct per repo. `ownerRepo` is `owner/name`; the repo NAME is used
 *  (matching the scaffolded create-token-and-sync-secrets.sh convention). */
export function ciTokenComment(ownerRepo: string): string {
  const repoName = ownerRepo.includes("/") ? ownerRepo.slice(ownerRepo.lastIndexOf("/") + 1) : ownerRepo;
  return `GitHub Actions (${repoName})`;
}

/** Which required CI secrets are NOT present on the repo (empty = fully provisioned). Used to
 *  VERIFY a sync landed — a `databricks tokens create` or `gh secret set` that fails must be
 *  caught here, not swallowed, so CI-auth is never silently absent. NOTE: this checks the secret
 *  NAME exists, not whether the token behind it is still valid — expiry is {@link ciTokenExpiry}. */
export async function missingCiSecrets(ownerRepo: string): Promise<string[]> {
  const present = new Set(await listSecretNames(ownerRepo));
  return REQUIRED_CI_SECRETS.filter((n) => !present.has(n));
}

export interface SyncCiSecretsArgs {
  /** Project root (used to resolve ownerRepo from `git remote` when not given,
   *  and as the cwd for the `databricks tokens create` call). */
  projectDir: string;
  /** Workspace host (DATABRICKS_HOST secret). Required. */
  databricksHost: string;
  /** Lakebase project id (LAKEBASE_PROJECT_ID secret). Required. */
  lakebaseProjectId: string;
  /** Token comment for `databricks tokens create`. Default: the canonical {@link ciTokenComment}. */
  comment?: string;
  /** Token lifetime in seconds. Default: {@link CI_TOKEN_LIFETIME_SECONDS} (90 days). */
  lifetimeSeconds?: number;
  /** Override the auto-detected ownerRepo (defaults to origin remote). */
  ownerRepo?: string;
}

/** Mint the CI credential: a durable PAT with the canonical comment + lifetime, falling back to
 *  a short-lived (~1h) OAuth session token where the workspace disables PATs. Returns the token
 *  value, or "" if neither path produced one (caller then ships HOST/PROJECT_ID only). */
async function mintCiToken(args: {
  databricksHost: string;
  projectDir: string;
  comment: string;
  lifetimeSeconds: number;
}): Promise<string> {
  // Prefer a durable PAT so reruns past the ~1h OAuth session don't silently fail auth.
  try {
    const raw = await runDatabricks(
      ["tokens", "create", "--comment", args.comment, "--lifetime-seconds", String(args.lifetimeSeconds), "-o", "json"],
      { host: args.databricksHost, cwd: args.projectDir, timeout: 30_000 },
    );
    const parsed = JSON.parse(raw.slice(Math.max(0, raw.indexOf("{"))));
    const token = parsed.token_value || parsed.token || "";
    if (token) return token;
  } catch {
    // PAT mint failed (often: workspace disables PAT creation) — fall through to OAuth.
  }
  // Fallback: OAuth session token (~1h). The pre-push hook re-mints on every push; a rerun that
  // fires >1h after the last push will fail — PATs are strongly preferred where allowed.
  try {
    const raw = await runDatabricks(["auth", "token", "-o", "json"], {
      host: args.databricksHost,
      cwd: args.projectDir,
      timeout: 30_000,
    });
    const parsed = JSON.parse(raw.slice(Math.max(0, raw.indexOf("{"))));
    return parsed.access_token || "";
  } catch {
    return "";
  }
}

/** Synchronize Databricks + Lakebase CI secrets to the repo's Actions secrets. Mints a fresh
 *  canonical CI credential; a dropped mint is fail-soft (HOST/PROJECT_ID still ship) — the caller
 *  verifies via {@link missingCiSecrets} and surfaces the gap. */
export async function syncCiSecrets(args: SyncCiSecretsArgs): Promise<void> {
  const ownerRepo = args.ownerRepo ?? (await getOwnerRepo(args.projectDir));
  if (!ownerRepo) {
    throw new Error("Could not resolve GitHub repository from git remote");
  }
  if (!args.databricksHost) {
    throw new Error("syncCiSecrets: databricksHost is required");
  }
  if (!args.lakebaseProjectId) {
    throw new Error("syncCiSecrets: lakebaseProjectId is required");
  }

  const lifetime = args.lifetimeSeconds ?? CI_TOKEN_LIFETIME_SECONDS;
  const comment = args.comment ?? ciTokenComment(ownerRepo);

  const secrets: Record<string, string> = {
    DATABRICKS_HOST: args.databricksHost,
    LAKEBASE_PROJECT_ID: args.lakebaseProjectId,
  };

  const token = await mintCiToken({
    databricksHost: args.databricksHost,
    projectDir: args.projectDir,
    comment,
    lifetimeSeconds: lifetime,
  });
  if (token) secrets.DATABRICKS_TOKEN = token;

  await setRepoSecrets(ownerRepo, secrets);
}

export interface CiTokenExpiryArgs {
  /** Project root (cwd for the CLI call + .env-based profile resolution). */
  projectDir: string;
  /** Workspace host the tokens live on. */
  databricksHost: string;
  /** ownerRepo (`owner/name`) — selects the canonical comment to match. */
  ownerRepo: string;
}

/** The latest expiry (epoch ms) of a LIVE canonical CI token for this repo, or null if none.
 *  `databricks tokens list` returns ONLY valid (unexpired) tokens, so an expired one simply does
 *  not appear → null. A no-expiry token (expiry_time -1) reads as Infinity. Fail-soft: any CLI /
 *  parse error returns null (→ the preflight re-mints, the safe direction). */
export async function ciTokenExpiry(args: CiTokenExpiryArgs): Promise<number | null> {
  const comment = ciTokenComment(args.ownerRepo);
  let raw: string;
  try {
    raw = await runDatabricks(["tokens", "list", "-o", "json"], {
      host: args.databricksHost,
      cwd: args.projectDir,
      timeout: 30_000,
    });
  } catch {
    return null;
  }
  let infos: Array<{ comment?: string; expiry_time?: number }>;
  try {
    const parsed = JSON.parse(raw.slice(Math.max(0, raw.indexOf("["))));
    infos = Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
  const expiries = infos
    .filter((t) => t.comment === comment)
    .map((t) => (t.expiry_time === -1 ? Number.POSITIVE_INFINITY : Number(t.expiry_time)))
    .filter((n) => Number.isFinite(n) || n === Number.POSITIVE_INFINITY);
  if (expiries.length === 0) return null;
  return Math.max(...expiries);
}

export interface EnsureCiSecretsFreshArgs {
  projectDir: string;
  databricksHost: string;
  lakebaseProjectId: string;
  /** Override the auto-detected ownerRepo (defaults to origin remote). */
  ownerRepo?: string;
  /** Re-mint when the live token expires within this window. Default: {@link CI_TOKEN_REMINT_MARGIN_SECONDS}. */
  marginSeconds?: number;
  /** Injected clock (ms) for tests. Defaults to Date.now. */
  now?: () => number;
}

export interface CiFreshnessResult {
  action: "ok" | "provisioned" | "reminted" | "skipped" | "failed";
  reason: string;
}

/** The expiry-aware preflight: ensure the repo's CI auth is CURRENT before a CI-triggering action
 *  (prepare-pr, scm-merge). Re-mints the canonical token when a required secret is missing, when
 *  no live canonical token exists (expired / never minted), or when the live token expires within
 *  the margin. A fresh token is left untouched. Throws only if a needed re-mint's sync throws;
 *  the caller runs it fail-soft (CI would fail anyway, so a mint failure is a loud warning). */
export async function ensureCiSecretsFresh(args: EnsureCiSecretsFreshArgs): Promise<CiFreshnessResult> {
  const now = args.now ?? Date.now;
  const marginMs = (args.marginSeconds ?? CI_TOKEN_REMINT_MARGIN_SECONDS) * 1000;
  const ownerRepo = args.ownerRepo ?? (await getOwnerRepo(args.projectDir));
  if (!ownerRepo) {
    throw new Error("Could not resolve GitHub repository from git remote");
  }

  const sync = () =>
    syncCiSecrets({
      projectDir: args.projectDir,
      databricksHost: args.databricksHost,
      lakebaseProjectId: args.lakebaseProjectId,
      ownerRepo,
    });

  const missing = await missingCiSecrets(ownerRepo);
  if (missing.length > 0) {
    await sync();
    return { action: "provisioned", reason: `CI secret(s) were missing (${missing.join(", ")}); provisioned.` };
  }

  const expiry = await ciTokenExpiry({ projectDir: args.projectDir, databricksHost: args.databricksHost, ownerRepo });
  if (expiry === null) {
    await sync();
    return { action: "reminted", reason: "no live CI token found (expired or minted under a different identity); re-minted." };
  }
  if (expiry !== Number.POSITIVE_INFINITY && expiry < now() + marginMs) {
    await sync();
    const hrs = Math.max(0, Math.round((expiry - now()) / 3_600_000));
    return { action: "reminted", reason: `CI token expires in ~${hrs}h (within the re-mint margin); re-minted.` };
  }
  return { action: "ok", reason: "CI token is current." };
}

/** The fail-soft entry both CI-dispatch seams (prepare-pr, scm-merge) use: resolve host +
 *  project-id from the project's `.env`, run {@link ensureCiSecretsFresh}, and NEVER throw —
 *  CI auth must never block opening a PR or promoting. Returns a `skipped` result when `.env`
 *  lacks the inputs (e.g. the pre-push hook will still refresh on the push) and a `failed` result
 *  when a needed re-mint's sync throws (surfaced as a loud note, not a block). */
export async function ensureCiSecretsFreshFromEnv(
  projectDir: string,
  opts?: { ownerRepo?: string; marginSeconds?: number },
): Promise<CiFreshnessResult> {
  const envPath = path.join(projectDir, ".env");
  const databricksHost = readEnvVar(envPath, "DATABRICKS_HOST");
  const lakebaseProjectId = readEnvVar(envPath, "LAKEBASE_PROJECT_ID");
  if (!databricksHost || !lakebaseProjectId) {
    return {
      action: "skipped",
      reason: "CI-auth preflight skipped: .env is missing DATABRICKS_HOST / LAKEBASE_PROJECT_ID.",
    };
  }
  try {
    return await ensureCiSecretsFresh({
      projectDir,
      databricksHost,
      lakebaseProjectId,
      ownerRepo: opts?.ownerRepo,
      marginSeconds: opts?.marginSeconds,
    });
  } catch (err) {
    return {
      action: "failed",
      reason: `CI-auth preflight could not re-mint (${err instanceof Error ? err.message : String(err)}); if CI fails on auth, run lakebase-sync-ci-secrets.`,
    };
  }
}
