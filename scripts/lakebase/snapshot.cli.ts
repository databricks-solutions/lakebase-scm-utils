#!/usr/bin/env node
// CLI for Lakebase SNAPSHOTS: `lakebase-snapshot <create|delete|list> ...`.
//
// A snapshot is an immutable point-in-time copy of a branch. Capture the
// committed schema once, then branch copy-on-write from it per verify cycle
// (`lakebase-branch create --from-snapshot <id>`) instead of re-running
// `alembic upgrade head`. Prints JSON on stdout, errors on stderr.
//   0 = success   1 = runtime error   2 = usage error
import { createSnapshot, deleteSnapshot, listSnapshots } from "./snapshot.js";

interface Args {
  subcommand?: string;
  instance?: string;
  snapshot?: string;
  branch?: string;
  atTime?: string;
  atLsn?: string;
  ttl?: string;
  noExpiry?: boolean;
  host?: string;
  pretty?: boolean;
  help?: boolean;
}

function parseArgs(argv: string[]): Args {
  const out: Args = {};
  let i = 0;
  if (argv[0] && !argv[0].startsWith("-")) {
    out.subcommand = argv[0];
    i = 1;
  }
  for (; i < argv.length; i++) {
    switch (argv[i]) {
      case "--instance": out.instance = argv[++i]; break;
      case "--snapshot": out.snapshot = argv[++i]; break;
      case "--branch": out.branch = argv[++i]; break;
      case "--at-time": out.atTime = argv[++i]; break;
      case "--at-lsn": out.atLsn = argv[++i]; break;
      case "--ttl": out.ttl = argv[++i]; break;
      case "--no-expiry": out.noExpiry = true; break;
      case "--host": out.host = argv[++i]; break;
      case "--pretty": out.pretty = true; break;
      case "--help": case "-h": out.help = true; break;
    }
  }
  return out;
}

const USAGE = `usage: lakebase-snapshot <create|delete|list> --instance <project> [flags]
  create  --snapshot <id> --branch <src> [--at-time <iso> | --at-lsn <lsn>] [--ttl <s> | --no-expiry]
  delete  --snapshot <id>
  list
Then branch from it: lakebase-branch create --branch <v> --from-snapshot <id> --instance <project>`;

function out(result: unknown, pretty: boolean): void {
  process.stdout.write(JSON.stringify(result, null, pretty ? 2 : undefined) + "\n");
}
function need(a: Args, keys: (keyof Args)[]): boolean {
  const missing = keys.filter((k) => a[k] === undefined || a[k] === "");
  if (missing.length) {
    process.stderr.write(`missing ${missing.map((k) => "--" + String(k)).join(", ")}\n${USAGE}\n`);
    return false;
  }
  return true;
}

async function main(): Promise<number> {
  const a = parseArgs(process.argv.slice(2));
  if (a.help || !a.subcommand) {
    process.stderr.write(USAGE + "\n");
    return a.help ? 0 : 2;
  }
  switch (a.subcommand) {
    case "create": {
      if (!need(a, ["instance", "snapshot", "branch"])) return 2;
      const raw = await createSnapshot({
        instance: a.instance!,
        snapshot: a.snapshot!,
        sourceBranch: a.branch!,
        sourceBranchTime: a.atTime,
        sourceBranchLsn: a.atLsn,
        ttl: a.ttl,
        noExpiry: a.noExpiry,
        host: a.host,
      });
      out({ created: a.snapshot, raw: raw.trim() || undefined }, !!a.pretty);
      return 0;
    }
    case "delete": {
      if (!need(a, ["instance", "snapshot"])) return 2;
      await deleteSnapshot({ instance: a.instance!, snapshot: a.snapshot!, host: a.host });
      out({ deleted: a.snapshot }, !!a.pretty);
      return 0;
    }
    case "list": {
      if (!need(a, ["instance"])) return 2;
      const raw = await listSnapshots({ instance: a.instance!, host: a.host });
      try {
        out(JSON.parse(raw), !!a.pretty);
      } catch {
        process.stdout.write(raw);
      }
      return 0;
    }
    default:
      process.stderr.write(`unknown subcommand '${a.subcommand}'\n${USAGE}\n`);
      return 2;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(String(err instanceof Error ? err.message : err) + "\n");
    process.exit(1);
  },
);
