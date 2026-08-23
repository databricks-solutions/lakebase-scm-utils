#!/usr/bin/env node
// CLI: cut a long-running tier branch (staging / dev / uat / ...).
//
//   lakebase-cut-tier --name <tier> [--fork-from <branch>] [flags]
//     --name <tier>       tier to cut (git + Lakebase branch name), e.g. staging   [required]
//     --fork-from <b>     parent git branch to fork from (default: main)
//     --instance <id>     Lakebase project id (defaults to LAKEBASE_PROJECT_ID in the .env)
//     --host <url>        DATABRICKS_HOST override (defaults to DATABRICKS_HOST in the .env)
//     --project-dir <d>   work tree + .env source (default: cwd)
//     --help
//
// Recovery counterpart to `lakebase-create-project`'s `--tiers` step: when a tier
// cut failed at create time (e.g. an auth hiccup), this cuts the missing tier
// WITHOUT re-running the whole create. It creates BOTH sides via the substrate's
// createLongRunningBranch primitive (Lakebase no_expiry branch + git branch pushed
// to origin), threading the workspace host so it runs against the right workspace.

import * as path from "node:path";
import { isCliEntry } from "../util/cli-entry.js";
import { readEnvVar } from "./env-file.js";
import { createLongRunningBranch } from "./long-running-branch.js";

interface ParsedArgs {
  name?: string;
  forkFrom?: string;
  instance?: string;
  host?: string;
  projectDir?: string;
  help?: boolean;
}

const HELP = `lakebase-cut-tier , cut a long-running tier branch (recovery for a failed create tier step)

Usage:
  lakebase-cut-tier --name <tier> [--fork-from <branch>] [--instance <id>] [--host <url>] [--project-dir <dir>]

  --name <tier>      Tier to cut (git + Lakebase branch name), e.g. staging   [required]
  --fork-from <b>    Parent git branch to fork from (default: main)
  --instance <id>    Lakebase project id (default: LAKEBASE_PROJECT_ID in the .env)
  --host <url>       DATABRICKS_HOST override (default: DATABRICKS_HOST in the .env)
  --project-dir <d>  Work tree + .env source (default: cwd)
  --help

Creates both the Lakebase branch (no-expiry) and the git branch (pushed to origin).
`;

export function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = {};
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--name": out.name = argv[++i]; break;
      case "--fork-from": out.forkFrom = argv[++i]; break;
      case "--instance": out.instance = argv[++i]; break;
      case "--host": out.host = argv[++i]; break;
      case "--project-dir": out.projectDir = argv[++i]; break;
      case "--help": case "-h": out.help = true; break;
      default: break;
    }
  }
  return out;
}

/** Instance + host from the project's .env, so this runs from inside a scaffold
 *  without re-specifying them (explicit flags still win). */
export function resolveFromEnv(projectDir: string): { instance?: string; host?: string } {
  const envPath = path.join(projectDir, ".env");
  return {
    instance: readEnvVar(envPath, "LAKEBASE_PROJECT_ID"),
    host: readEnvVar(envPath, "DATABRICKS_HOST"),
  };
}

async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (!args.name) {
    process.stderr.write(`Error: --name <tier> is required.\n\n${HELP}`);
    return 2;
  }
  const projectDir = args.projectDir ?? process.cwd();
  const env = resolveFromEnv(projectDir);
  const instance = args.instance ?? env.instance;
  const host = args.host ?? env.host;
  const forkFrom = args.forkFrom ?? "main";
  if (!instance) {
    process.stderr.write(
      `Error: no Lakebase project id (pass --instance or set LAKEBASE_PROJECT_ID in ${path.join(projectDir, ".env")}).\n\n${HELP}`,
    );
    return 2;
  }

  process.stderr.write(
    `Cutting tier '${args.name}' off '${forkFrom}' in project ${instance}${host ? ` (host ${host})` : ""}...\n`,
  );
  const result = await createLongRunningBranch({
    name: args.name,
    forkFromBranch: forkFrom,
    projectId: instance,
    workTreeDir: projectDir,
    databricksHost: host,
  });
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  return 0;
}

if (isCliEntry(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
      process.exit(1);
    },
  );
}
