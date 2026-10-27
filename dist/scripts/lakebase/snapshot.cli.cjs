#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// scripts/lakebase/databricks-cli.ts
var import_node_child_process2 = require("child_process");
var import_node_util = require("util");
var import_node_path = require("path");

// scripts/lakebase/kit-config.ts
function intFromEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}
var DAY_MS = 24 * 60 * 60 * 1e3;
var KIT_TIMEOUTS = {
  cliDefault: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_DEFAULT_MS", 3e4),
  cliCreateProject: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_CREATE_PROJECT_MS", 18e4),
  cliCreateBranch: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_CREATE_BRANCH_MS", 6e4),
  cliCreateEndpoint: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_CREATE_ENDPOINT_MS", 6e4),
  readyWait: intFromEnv("LAKEBASE_KIT_TIMEOUT_READY_WAIT_MS", 12e4),
  readyPoll: intFromEnv("LAKEBASE_KIT_TIMEOUT_READY_POLL_MS", 5e3),
  pgConnect: intFromEnv("LAKEBASE_KIT_TIMEOUT_PG_CONNECT_MS", 1e4),
  pgStatement: intFromEnv("LAKEBASE_KIT_TIMEOUT_PG_STATEMENT_MS", 15e3),
  gitDefault: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_DEFAULT_MS", 5e3),
  gitCheckout: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_CHECKOUT_MS", 1e4),
  gitNetwork: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_NETWORK_MS", 15e3),
  gitPush: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_PUSH_MS", 3e4),
  cliLong: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_LONG_MS", 6e4),
  cmdShort: intFromEnv("LAKEBASE_KIT_TIMEOUT_CMD_SHORT_MS", 5e3),
  initializrCacheTtl: intFromEnv("LAKEBASE_KIT_INITIALIZR_CACHE_TTL_MS", 10 * 60 * 1e3),
  featureBranchTtlMs: intFromEnv("LAKEBASE_KIT_FEATURE_BRANCH_TTL_MS", 30 * DAY_MS),
  testBranchTtlMs: intFromEnv("LAKEBASE_KIT_TEST_BRANCH_TTL_MS", 14 * DAY_MS),
  uatBranchTtlMs: intFromEnv("LAKEBASE_KIT_UAT_BRANCH_TTL_MS", 14 * DAY_MS),
  perfBranchTtlMs: intFromEnv("LAKEBASE_KIT_PERF_BRANCH_TTL_MS", 7 * DAY_MS)
};
function urlFromEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw.replace(/\/+$/, "");
}
var KIT_REGISTRIES = {
  mavenCentral: urlFromEnv("LAKEBASE_KIT_REGISTRY_MAVEN_CENTRAL", "https://repo1.maven.org/maven2"),
  springInitializr: urlFromEnv("LAKEBASE_KIT_REGISTRY_SPRING_INITIALIZR", "https://start.spring.io")
};

// scripts/lakebase/databricks-profile.ts
var fs = __toESM(require("fs"), 1);
var import_node_child_process = require("child_process");

// scripts/util/exec.ts
var cp = __toESM(require("child_process"), 1);

// scripts/lakebase/databricks-profile.ts
function normalizeHost(host) {
  return host.trim().replace(/\/+$/, "").toLowerCase();
}
function selectProfileForHost(profilesJson, host) {
  const target = normalizeHost(host);
  if (!target) return void 0;
  const start = profilesJson.indexOf("{");
  if (start < 0) return void 0;
  let parsed;
  try {
    parsed = JSON.parse(profilesJson.slice(start));
  } catch {
    return void 0;
  }
  const profiles = parsed.profiles;
  if (!Array.isArray(profiles)) return void 0;
  const names = profiles.filter((p) => {
    if (!p || typeof p !== "object") return false;
    const rec = p;
    return typeof rec.name === "string" && typeof rec.host === "string" && rec.valid === true && normalizeHost(rec.host) === target;
  }).map((p) => p.name);
  const distinct = Array.from(new Set(names));
  return distinct.length === 1 ? distinct[0] : void 0;
}
function resolveProfileForHostSync(host, timeoutMs = KIT_TIMEOUTS.cliDefault) {
  if (!normalizeHost(host)) return void 0;
  let out2;
  try {
    out2 = (0, import_node_child_process.execFileSync)("databricks", ["auth", "profiles", "-o", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: timeoutMs
    });
  } catch {
    return void 0;
  }
  return selectProfileForHost(out2, host);
}

// scripts/lakebase/env-file.ts
var fs2 = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
function readEnvVar(envPath, key) {
  if (!fs2.existsSync(envPath)) return void 0;
  let value;
  for (const line of fs2.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#") || !trimmed.startsWith(`${key}=`)) continue;
    value = trimmed.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
  }
  return value && value.length > 0 ? value : void 0;
}

// scripts/lakebase/databricks-cli.ts
var execFileP = (0, import_node_util.promisify)(import_node_child_process2.execFile);
var DatabricksCliError = class extends Error {
  constructor(message, profile, stderr) {
    super(message);
    this.profile = profile;
    this.stderr = stderr;
    this.name = "DatabricksCliError";
  }
  profile;
  stderr;
};
var DatabricksAuthError = class extends DatabricksCliError {
  constructor(profile, detail) {
    const login = `databricks auth login${profile ? ` --profile ${profile}` : ""}`;
    super(
      `Databricks authentication failed${profile ? ` for profile "${profile}"` : ""}: the cached token is missing or expired. Re-authenticate, then re-run:
  ${login}
${detail}`,
      profile,
      detail
    );
    this.name = "DatabricksAuthError";
  }
};
var profileByHost = /* @__PURE__ */ new Map();
var profileByEnvFile = /* @__PURE__ */ new Map();
var hostByEnvFile = /* @__PURE__ */ new Map();
function envFileHost(cwd) {
  if (hostByEnvFile.has(cwd)) return hostByEnvFile.get(cwd);
  const v = readEnvVar((0, import_node_path.join)(cwd, ".env"), "DATABRICKS_HOST");
  hostByEnvFile.set(cwd, v);
  return v;
}
function effectiveHost(opts) {
  const base = opts.env ?? process.env;
  const cwd = opts.cwd ?? process.cwd();
  const h = opts.host ?? base.DATABRICKS_HOST ?? envFileHost(cwd);
  return h?.trim() || void 0;
}
function isAuthFailure(text) {
  return /refresh token is invalid|auth login|could not be retrieved because|not authenticated|no valid.*(credential|token)|invalid.*(access token|credential)|\b401\b|unauthorized/i.test(
    text
  );
}
function resolveProfile(opts) {
  const base = opts.env ?? process.env;
  if (opts.profile) return opts.profile;
  const envProfile = base.DATABRICKS_CONFIG_PROFILE?.trim();
  if (envProfile) return envProfile;
  const cwd = opts.cwd ?? process.cwd();
  let fromEnvFile;
  if (profileByEnvFile.has(cwd)) {
    fromEnvFile = profileByEnvFile.get(cwd);
  } else {
    fromEnvFile = readEnvVar((0, import_node_path.join)(cwd, ".env"), "DATABRICKS_CONFIG_PROFILE");
    profileByEnvFile.set(cwd, fromEnvFile);
  }
  if (fromEnvFile) return fromEnvFile;
  const host = effectiveHost(opts);
  if (!host) return void 0;
  if (profileByHost.has(host)) return profileByHost.get(host);
  const resolved = resolveProfileForHostSync(host, opts.timeout);
  profileByHost.set(host, resolved);
  return resolved;
}
function buildInvocation(args, opts) {
  const base = opts.env ?? process.env;
  const trimmedHost = effectiveHost(opts)?.replace(/\/+$/, "");
  const env = { ...base };
  if (trimmedHost) env.DATABRICKS_HOST = trimmedHost;
  delete env.DATABRICKS_WORKSPACE_ID;
  const profile = resolveProfile(opts);
  const argv = profile && !opts.noProfile && !args.includes("--profile") ? [...args, "--profile", profile] : args;
  return { argv, env, profile };
}
function classifyDatabricksError(err, argv, profile) {
  const e = err;
  const asText = (v) => typeof v === "string" ? v : Buffer.isBuffer(v) ? v.toString("utf8") : "";
  const stderr = asText(e.stderr).trim();
  const stdout = asText(e.stdout).trim();
  const haystack = `${e.message ?? ""}
${stderr}
${stdout}`;
  if (isAuthFailure(haystack)) {
    return new DatabricksAuthError(profile, stderr || stdout || (e.message ?? ""));
  }
  const killed = e.killed === true;
  const signal = e.signal ?? void 0;
  const detail = stderr ? `
stderr: ${stderr}` : stdout ? `
stdout: ${stdout}` : killed || signal ? `
(no output; the CLI was killed${signal ? ` by ${signal}` : ""}, likely a TIMEOUT; raise the budget via the matching LAKEBASE_KIT_TIMEOUT_* env var)` : e.code !== void 0 ? `
(no stderr/stdout; exit ${e.code})` : "";
  return new DatabricksCliError(
    `databricks ${argv.join(" ")} failed: ${e.message}${detail}`,
    profile,
    stderr || stdout
  );
}
async function runDatabricks(args, opts = {}) {
  const { argv, env, profile } = buildInvocation(args, opts);
  const timeout = opts.timeout ?? KIT_TIMEOUTS.cliDefault;
  try {
    if (opts.input !== void 0) {
      return await execDatabricksWithStdin(argv, opts.input, env, timeout);
    }
    const { stdout } = await execFileP("databricks", argv, { env, timeout });
    return stdout.toString();
  } catch (err) {
    throw classifyDatabricksError(err, argv, profile);
  }
}
function execDatabricksWithStdin(argv, input, env, timeout) {
  return new Promise((resolve, reject) => {
    const child = (0, import_node_child_process2.execFile)("databricks", argv, { env, timeout }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = String(stdout ?? "");
        err.stderr = String(stderr ?? "");
        reject(err);
        return;
      }
      resolve(String(stdout ?? ""));
    });
    child.stdin?.on("error", () => {
    });
    child.stdin?.end(input);
  });
}

// scripts/lakebase/branch-utils.ts
function projectPath(instance) {
  return `projects/${instance}`;
}

// scripts/lakebase/snapshot.ts
function branchResource(instance, branch) {
  return branch.includes("/") ? branch : `${projectPath(instance)}/branches/${branch}`;
}
function snapshotResource(instance, snapshot) {
  return snapshot.includes("/") ? snapshot : `${projectPath(instance)}/snapshots/${snapshot}`;
}
function buildSnapshotSpec(args) {
  if (args.sourceBranchTime && args.sourceBranchLsn) {
    throw new Error("sourceBranchTime and sourceBranchLsn are mutually exclusive \u2014 pass at most one point-in-time.");
  }
  if (args.ttl && args.noExpiry === true) {
    throw new Error(`Cannot set both ttl ("${args.ttl}") and noExpiry: true \u2014 they are mutually exclusive.`);
  }
  const spec = { source_branch: branchResource(args.instance, args.sourceBranch) };
  if (args.sourceBranchTime) spec.source_branch_time = args.sourceBranchTime;
  else if (args.sourceBranchLsn) spec.source_branch_lsn = args.sourceBranchLsn;
  if (args.ttl) spec.ttl = args.ttl;
  else if (args.noExpiry ?? true) spec.no_expiry = true;
  return spec;
}
async function createSnapshot(args) {
  const spec = buildSnapshotSpec(args);
  return runDatabricks(
    ["postgres", "create-snapshot", projectPath(args.instance), args.snapshot, "--json", JSON.stringify({ spec })],
    { host: args.host, timeout: KIT_TIMEOUTS.cliCreateBranch }
  );
}
async function deleteSnapshot(args) {
  return runDatabricks(["postgres", "delete-snapshot", snapshotResource(args.instance, args.snapshot)], {
    host: args.host
  });
}
async function listSnapshots(args) {
  return runDatabricks(["postgres", "list-snapshots", projectPath(args.instance), "-o", "json"], { host: args.host });
}

// scripts/lakebase/snapshot.cli.ts
function parseArgs(argv) {
  const out2 = {};
  let i = 0;
  if (argv[0] && !argv[0].startsWith("-")) {
    out2.subcommand = argv[0];
    i = 1;
  }
  for (; i < argv.length; i++) {
    switch (argv[i]) {
      case "--instance":
        out2.instance = argv[++i];
        break;
      case "--snapshot":
        out2.snapshot = argv[++i];
        break;
      case "--branch":
        out2.branch = argv[++i];
        break;
      case "--at-time":
        out2.atTime = argv[++i];
        break;
      case "--at-lsn":
        out2.atLsn = argv[++i];
        break;
      case "--ttl":
        out2.ttl = argv[++i];
        break;
      case "--no-expiry":
        out2.noExpiry = true;
        break;
      case "--host":
        out2.host = argv[++i];
        break;
      case "--pretty":
        out2.pretty = true;
        break;
      case "--help":
      case "-h":
        out2.help = true;
        break;
    }
  }
  return out2;
}
var USAGE = `usage: lakebase-snapshot <create|delete|list> --instance <project> [flags]
  create  --snapshot <id> --branch <src> [--at-time <iso> | --at-lsn <lsn>] [--ttl <s> | --no-expiry]
  delete  --snapshot <id>
  list
Then branch from it: lakebase-branch create --branch <v> --from-snapshot <id> --instance <project>`;
function out(result, pretty) {
  process.stdout.write(JSON.stringify(result, null, pretty ? 2 : void 0) + "\n");
}
function need(a, keys) {
  const missing = keys.filter((k) => a[k] === void 0 || a[k] === "");
  if (missing.length) {
    process.stderr.write(`missing ${missing.map((k) => "--" + String(k)).join(", ")}
${USAGE}
`);
    return false;
  }
  return true;
}
async function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.help || !a.subcommand) {
    process.stderr.write(USAGE + "\n");
    return a.help ? 0 : 2;
  }
  switch (a.subcommand) {
    case "create": {
      if (!need(a, ["instance", "snapshot", "branch"])) return 2;
      const raw = await createSnapshot({
        instance: a.instance,
        snapshot: a.snapshot,
        sourceBranch: a.branch,
        sourceBranchTime: a.atTime,
        sourceBranchLsn: a.atLsn,
        ttl: a.ttl,
        noExpiry: a.noExpiry,
        host: a.host
      });
      out({ created: a.snapshot, raw: raw.trim() || void 0 }, !!a.pretty);
      return 0;
    }
    case "delete": {
      if (!need(a, ["instance", "snapshot"])) return 2;
      await deleteSnapshot({ instance: a.instance, snapshot: a.snapshot, host: a.host });
      out({ deleted: a.snapshot }, !!a.pretty);
      return 0;
    }
    case "list": {
      if (!need(a, ["instance"])) return 2;
      const raw = await listSnapshots({ instance: a.instance, host: a.host });
      try {
        out(JSON.parse(raw), !!a.pretty);
      } catch {
        process.stdout.write(raw);
      }
      return 0;
    }
    default:
      process.stderr.write(`unknown subcommand '${a.subcommand}'
${USAGE}
`);
      return 2;
  }
}
main().then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(String(err instanceof Error ? err.message : err) + "\n");
    process.exit(1);
  }
);
