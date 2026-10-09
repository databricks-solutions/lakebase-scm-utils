#!/usr/bin/env node
// CLI: (re)provision the repo's CI auth secrets — the standalone repair path.
//
// create-project runs syncCiSecrets ONCE, fail-soft (a failed PAT mint or `gh secret set` is
// swallowed as a warning), and there was no way to retry without recreating the whole project.
// So a repo could sit with ZERO CI secrets until a promotion CI run failed an entire feature
// later (empty DATABRICKS_* → no DATABASE_URL → the test step aborts). This bin mints a fresh
// CI PAT and sets DATABRICKS_HOST / LAKEBASE_PROJECT_ID / DATABRICKS_TOKEN, then VERIFIES all
// three landed — exiting non-zero (naming the gaps) instead of leaving CI silently broken.

import * as path from "node:path";
import { isCliEntry } from "../util/cli-entry.js";
import { readEnvVar } from "./env-file.js";
import { getOwnerRepo } from "../git/remote.js";
import { syncCiSecrets, missingCiSecrets, REQUIRED_CI_SECRETS } from "../util/ci-secrets.js";

interface ParsedArgs {
  projectDir?: string;
  host?: string;
  projectId?: string;
  repo?: string;
  lifetimeSec?: number;
  comment?: string;
  help?: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--project-dir":
      case "--cwd": out.projectDir = argv[++i]; break;
      case "--host": out.host = argv[++i]; break;
      case "--project-id": out.projectId = argv[++i]; break;
      case "--repo": out.repo = argv[++i]; break;
      case "--lifetime-sec": out.lifetimeSec = Number.parseInt(argv[++i], 10); break;
      case "--comment": out.comment = argv[++i]; break;
      case "--help": case "-h": out.help = true; break;
    }
  }
  return out;
}

const HELP = `lakebase-sync-ci-secrets

(Re)provision the GitHub repo's CI auth: mint a fresh Databricks CI PAT and set
DATABRICKS_HOST, LAKEBASE_PROJECT_ID, and DATABRICKS_TOKEN as repo Actions secrets,
then verify all three are present. The standalone repair for the create-time
"CI auth setup failed" warning — run it from the project, no recreate needed.

Usage:
  lakebase-sync-ci-secrets [flags]

Flags:
  --project-dir <dir>   Project root (default: cwd); resolves host/project-id from its .env
  --host <url>          DATABRICKS_HOST (default: .env DATABRICKS_HOST)
  --project-id <id>     LAKEBASE_PROJECT_ID (default: .env LAKEBASE_PROJECT_ID)
  --repo <owner/name>   Target repo (default: origin remote)
  --lifetime-sec <n>    CI PAT lifetime (default: 7776000 = 90d, the canonical durable lifetime)
  --comment <text>      Token comment (default: canonical "GitHub Actions (<repo>)")
  -h, --help            Show this help

Exit codes:
  0 = all three secrets present after sync
  2 = could not resolve host / project-id / repo
  3 = sync ran but a required secret is still missing (e.g. PAT mint failed)
`;

export async function runSyncCiSecretsCli(argv: string[]): Promise<number> {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(`${HELP}\n`);
    return 0;
  }
  const projectDir = path.resolve(args.projectDir ?? process.cwd());
  const envPath = path.join(projectDir, ".env");
  const host = args.host ?? readEnvVar(envPath, "DATABRICKS_HOST");
  const projectId = args.projectId ?? readEnvVar(envPath, "LAKEBASE_PROJECT_ID");
  const ownerRepo = args.repo ?? (await getOwnerRepo(projectDir));

  if (!ownerRepo) {
    process.stderr.write("lakebase-sync-ci-secrets: no GitHub repo (pass --repo or run inside a repo with an origin remote).\n");
    return 2;
  }
  if (!host || !projectId) {
    process.stderr.write(
      `lakebase-sync-ci-secrets: missing ${!host ? "DATABRICKS_HOST" : ""}${!host && !projectId ? " and " : ""}${!projectId ? "LAKEBASE_PROJECT_ID" : ""}` +
        ` — not in ${envPath}; pass --host / --project-id.\n`,
    );
    return 2;
  }

  process.stdout.write(`Provisioning CI auth for ${ownerRepo} (host ${host}, project ${projectId})…\n`);
  await syncCiSecrets({
    projectDir,
    databricksHost: host,
    lakebaseProjectId: projectId,
    ownerRepo,
    ...(args.comment ? { comment: args.comment } : {}),
    ...(args.lifetimeSec ? { lifetimeSeconds: args.lifetimeSec } : {}),
  });

  // VERIFY — the whole point of the repair. A silently-dropped PAT (the create-time failure
  // mode) leaves DATABRICKS_TOKEN absent; catch it here and exit non-zero rather than report success.
  const missing = await missingCiSecrets(ownerRepo);
  if (missing.length > 0) {
    process.stderr.write(
      `lakebase-sync-ci-secrets: sync ran but these secrets are still MISSING on ${ownerRepo}: ${missing.join(", ")}.\n` +
        (missing.includes("DATABRICKS_TOKEN")
          ? `  DATABRICKS_TOKEN missing usually means 'databricks tokens create' failed — check your auth for ${host} (e.g. 'databricks auth login --host ${host}'), then re-run.\n`
          : ""),
    );
    return 3;
  }
  process.stdout.write(`CI auth ready: ${REQUIRED_CI_SECRETS.join(", ")} set on ${ownerRepo}.\n`);
  return 0;
}

if (isCliEntry(import.meta.url)) {
  void runSyncCiSecretsCli(process.argv.slice(2)).then((c) => process.exit(c));
}
