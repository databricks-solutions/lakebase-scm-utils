#!/usr/bin/env node
// CLI: cleanup / destroy a project's Lakebase SCM resources.
//
//   lakebase-scm-cleanup <mode> --instance <id> [flags]
//     modes:  list (default) | branches | project
//     --instance <id>     Lakebase project id (required)
//     --host <url>        DATABRICKS_HOST override
//     --yes               actually delete (default is dry-run: plan only)
//     --confirm <id>      required for `project`: must equal --instance
//     --json | --pretty   output format
//     --help
//
// Safe by default: without --yes nothing is deleted; tiers and the trunk branch
// are never deleted; `project` needs a matching --confirm. See
// docs/design/cleanup-destroy-bin.md.

import * as path from "node:path";
import { isCliEntry } from "../util/cli-entry.js";
import { readEnvVar } from "./env-file.js";
import {
  ScmCleanupError,
  runCleanup,
  type CleanupMode,
  type CleanupResult,
} from "./scm-cleanup.js";

interface ParsedArgs {
  mode: CleanupMode;
  instance?: string;
  host?: string;
  projectDir: string;
  apply: boolean;
  confirm?: string;
  json: boolean;
  pretty: boolean;
  help: boolean;
}

const MODES = new Set<CleanupMode>(["list", "branches", "project"]);

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = { mode: "list", projectDir: process.cwd(), apply: false, json: false, pretty: false, help: false };
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--instance": out.instance = argv[++i]; break;
      case "--host": out.host = argv[++i]; break;
      case "--project-dir": out.projectDir = argv[++i]; break;
      case "--yes": out.apply = true; break;
      case "--confirm": out.confirm = argv[++i]; break;
      case "--json": out.json = true; break;
      case "--pretty": out.pretty = true; break;
      case "-h":
      case "--help": out.help = true; break;
      default: rest.push(a);
    }
  }
  if (rest.length && MODES.has(rest[0] as CleanupMode)) out.mode = rest[0] as CleanupMode;
  else if (rest.length) throw new ScmCleanupError(`unknown mode "${rest[0]}" (expected: list | branches | project)`);
  return out;
}

const HELP = `lakebase-scm-cleanup: tear down a project's Lakebase SCM resources

Usage:
  lakebase-scm-cleanup <mode> --instance <id> [flags]

Modes:
  list       (default) classify branches (trunk / tiers / ephemeral); deletes nothing
  branches   delete the EPHEMERAL branches (feature/test/uat/perf/spike); tiers + trunk protected
  project    DESTROY the whole project (all branches + the project) - needs --confirm <id>

Flags:
  --instance <id>   Lakebase project id. Optional: defaults to LAKEBASE_PROJECT_ID
                    from the project .env (what create-project recorded), so it can be
                    run from inside a scaffolded project without re-specifying it.
  --host <url>      DATABRICKS_HOST override (defaults to DATABRICKS_HOST in the .env)
  --project-dir <d> where to read the .env from (default: cwd)
  --yes             actually delete (default: dry-run, plan only)
  --confirm <id>    required for 'project'; must equal --instance
  --json | --pretty output format
`;

/** Resolve the instance + host from a project's .env (what create-project recorded),
 *  so cleanup pairs with create-project: run from a project dir, no need to re-specify.
 *  Returns undefined for a key the .env lacks (or when there is no .env). Pure read. */
export function resolveFromEnv(projectDir: string): { instance?: string; host?: string } {
  const envPath = path.join(projectDir, ".env");
  return {
    instance: readEnvVar(envPath, "LAKEBASE_PROJECT_ID"),
    host: readEnvVar(envPath, "DATABRICKS_HOST"),
  };
}

function render(r: CleanupResult): string {
  const head =
    `cleanup ${r.mode} on ${r.instance} ${r.dryRun ? "(DRY RUN - nothing deleted)" : r.applied ? "(applied)" : "(FAILED - see below)"}\n` +
    `  branches: ${r.counts.trunk} trunk, ${r.counts.tiers} tier(s), ${r.counts.ephemeral} ephemeral\n`;
  const lines = r.actions.map((a) => {
    const mark = a.action === "skip" ? "  -" : a.ok === false ? "  ✗" : a.ok ? "  ✓" : "  •";
    const note = a.reason ? ` (${a.reason})` : a.error ? ` ERROR: ${a.error}` : "";
    return `${mark} ${a.action} ${a.kind} ${a.resource}${note}`;
  });
  return head + lines.join("\n");
}

export async function runCleanupCli(argv: string[]): Promise<number> {
  let args: ParsedArgs;
  try {
    args = parseArgs(argv);
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n\n${HELP}`);
    return 2;
  }
  if (args.help) {
    process.stdout.write(HELP);
    return 0;
  }
  // Pair with create-project: default the instance + host from the project .env
  // (LAKEBASE_PROJECT_ID / DATABRICKS_HOST) so this runs from inside a scaffolded
  // project without re-typing them. Explicit flags always win.
  const fromEnv = resolveFromEnv(args.projectDir);
  if (!args.instance) args.instance = fromEnv.instance;
  if (!args.host) args.host = fromEnv.host;
  if (!args.instance) {
    process.stderr.write(
      `--instance <project-id> is required (or run from a project dir whose .env has ` +
        `LAKEBASE_PROJECT_ID)\n\n${HELP}`,
    );
    return 2;
  }
  try {
    const result = await runCleanup(args.mode, {
      instance: args.instance,
      host: args.host,
      apply: args.apply,
      confirmProjectId: args.confirm,
    });
    if (args.json) process.stdout.write(JSON.stringify(result, null, args.pretty ? 2 : 0) + "\n");
    else process.stdout.write(render(result) + "\n");
    // Non-zero when we tried to apply and something failed.
    return !result.dryRun && !result.applied ? 1 : 0;
  } catch (err) {
    process.stderr.write(`cleanup failed: ${(err as Error).message}\n`);
    return 1;
  }
}

if (isCliEntry(import.meta.url)) {
  runCleanupCli(process.argv.slice(2)).then((code) => process.exit(code));
}
