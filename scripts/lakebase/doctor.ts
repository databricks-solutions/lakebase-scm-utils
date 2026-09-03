// lakebase-doctor health checks (P0.4). Mirrors the
// extension's Health Check at the CLI / agent boundary so headless
// users can run a single "what's wrong?" command before tail-chasing
// .env drift / token-scope issues by hand.

import * as fs from "node:fs";
import * as path from "node:path";
import * as cp from "node:child_process";
import { exec } from "../util/exec.js";
import { runDatabricks } from "./databricks-cli.js";
import { resolveDatabricksHost } from "./databricks-host.js";
import { resolveProfileForHost } from "./databricks-profile.js";
import { listBranches } from "./branch-utils.js";
import { verifyHooks } from "./project-verify.js";
import { detectLanguage } from "./schema-migrate.js";
import { detectWorkflowDrift } from "./workflow-drift.js";

export type CheckStatus = "ok" | "warn" | "fail" | "skip";

export interface CheckResult {
  name: string;
  status: CheckStatus;
  /** Single-line summary for human-readable output. */
  message: string;
  /** Detailed payload for --json consumers (e.g. version string, file paths). */
  detail?: unknown;
  /** Suggested remediation when status is warn/fail. */
  hint?: string;
}

export interface DoctorArgs {
  /** Project directory to inspect. Default: process.cwd(). */
  projectDir?: string;
  /** Databricks CLI profile. Default: process.env.DATABRICKS_CONFIG_PROFILE. */
  profile?: string;
  /** Override host (skip resolveDatabricksHost). */
  host?: string;
}

export interface DoctorReport {
  /** Worst status across all checks. */
  overall: CheckStatus;
  checks: CheckResult[];
}

function readEnvFile(projectDir: string): Record<string, string> {
  const envPath = path.join(projectDir, ".env");
  if (!fs.existsSync(envPath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[m[1]] = val;
  }
  return out;
}

async function checkDatabricksCli(): Promise<CheckResult> {
  try {
    // `--version` is a global command; threading `--profile` makes the CLI
    // reject it ("unknown command <profile>"). noProfile keeps this probe
    // working regardless of DATABRICKS_CONFIG_PROFILE.
    const out = await runDatabricks(["--version"], {
      timeout: 5_000,
      noProfile: true,
    });
    const trimmed = out.trim();
    const m = trimmed.match(/v?(\d+)\.(\d+)/);
    if (m) {
      const major = parseInt(m[1], 10);
      if (major < 1) {
        return {
          name: "databricks-cli",
          status: "warn",
          message: `Databricks CLI ${trimmed} - kit expects v1.0+`,
          detail: { version: trimmed },
          hint: "Upgrade via Homebrew or the installer at https://docs.databricks.com/dev-tools/cli/install.html",
        };
      }
    }
    return {
      name: "databricks-cli",
      status: "ok",
      message: `Databricks CLI ${trimmed}`,
      detail: { version: trimmed },
    };
  } catch (err) {
    return {
      name: "databricks-cli",
      status: "fail",
      message: "databricks CLI not found on PATH",
      detail: { error: (err as Error).message },
      hint: "Install via Homebrew (`brew install databricks-cli`) or the official installer.",
    };
  }
}

// ---- Cold-start prerequisite checks (Node / Python / JDK / gh / npm) ----
//
// The README lists these as mandatory, but the doctor historically only
// version-gated the Databricks CLI. A team member on Node 18 or without JDK 17
// passed clean and then failed later in the alembic / Flyway live path or the
// plugin itself. These checks catch a wrong or missing prerequisite up front
// with a fix hint, mirroring checkDatabricksCli's {name,status,message,hint}
// shape exactly.

/** Runs `<cmd> <versionArg>` and returns trimmed stdout, or throws. Injectable
 *  so the prereq checks are hermetically unit-testable without real tools. */
export type VersionRunner = (
  cmd: string,
  args: string[]
) => Promise<string>;

// Version commands are inconsistent about which stream they use: `node --version`
// writes to stdout, but `java -version` writes to STDERR and still exits 0. The
// shared `exec` resolves stdout only, so a stdout-empty tool like java would come
// back "" and slip past the version gate. Capture BOTH streams here (and spawn
// directly, no shell, so the command text can't contaminate parsing). Treat the
// tool as missing only when it produced no output at all AND the spawn failed.
const defaultVersionRunner: VersionRunner = (cmd, args) =>
  new Promise<string>((resolve, reject) => {
    cp.execFile(cmd, args, { timeout: 5_000 }, (err, stdout, stderr) => {
      const combined = `${stdout ?? ""}\n${stderr ?? ""}`.trim();
      if (combined) return resolve(combined);
      if (err) return reject(err);
      resolve("");
    });
  });

/** Parse the first `MAJOR.MINOR` (optionally `MAJOR`) from a version string. */
function parseVersion(s: string): { major: number; minor: number } | null {
  const m = s.match(/v?(\d+)(?:\.(\d+))?/);
  if (!m) return null;
  return { major: parseInt(m[1], 10), minor: m[2] ? parseInt(m[2], 10) : 0 };
}

interface PrereqSpec {
  /** Check name (kebab-case, e.g. "node"). */
  name: string;
  /** Executable to invoke. */
  cmd: string;
  /** Args that print the version (e.g. ["--version"]). */
  versionArgs: string[];
  /** Minimum major version the kit requires, or null for presence-only. */
  minMajor: number | null;
  /** Minimum MINOR version required WHEN the major equals `minMajor` (the floor is
   *  then `minMajor.minMinor`, e.g. Python 3.10). Omit/null when the major line alone
   *  is the floor. Only consulted when `minMajor` is set. */
  minMinor?: number | null;
  /** Human label for messages (e.g. "Node.js"). */
  label: string;
  /** Remediation hint when missing or too old. */
  hint: string;
}

const PREREQS: PrereqSpec[] = [
  {
    name: "node",
    cmd: "node",
    versionArgs: ["--version"],
    minMajor: 20,
    label: "Node.js",
    hint: "Install Node.js 20+ (e.g. `brew install node@20`, nvm, or https://nodejs.org).",
  },
  {
    name: "npm",
    cmd: "npm",
    versionArgs: ["--version"],
    minMajor: null,
    label: "npm",
    hint: "npm ships with Node.js 20+; reinstall Node if it is missing.",
  },
  {
    name: "python",
    cmd: "python3",
    versionArgs: ["--version"],
    minMajor: 3,
    minMinor: 10,
    label: "Python",
    hint: "Install Python 3.10+ (e.g. `brew install python@3.11` or https://www.python.org/downloads).",
  },
  {
    name: "jdk",
    cmd: "java",
    versionArgs: ["-version"],
    minMajor: 17,
    label: "JDK",
    hint: "Install JDK 17+ (e.g. `brew install openjdk@17`); required for the Flyway live path.",
  },
  {
    name: "gh",
    cmd: "gh",
    versionArgs: ["--version"],
    minMajor: null,
    label: "GitHub CLI",
    hint: "Install the GitHub CLI (`brew install gh`) and authenticate with `gh auth login`.",
  },
];

/**
 * Presence + version check for one cold-start prerequisite. The floor is
 * `minMajor` and, when `minMinor` is set, `minMajor.minMinor` (e.g. Python's
 * documented 3.10 floor: `minMajor:3, minMinor:10`). `parseVersion` already
 * extracts `{major, minor}` from the version string, so gating on the minor is
 * reliable for a tool that prints one (python3 prints `Python 3.9.6`); a below-floor
 * minor previously slipped through because only the major was compared, so a 3.9
 * interpreter reported `[doctor] environment ok` despite the hint promising 3.10+.
 * The default runner captures stdout+stderr (some tools, e.g. `java -version`, print
 * the version to stderr and exit 0), so the happy path parses either stream. If the
 * tool is genuinely absent the runner rejects, and we still parse the error text for
 * a version before concluding it is missing.
 */
async function checkPrereq(
  spec: PrereqSpec,
  run: VersionRunner
): Promise<CheckResult> {
  let raw: string;
  try {
    raw = await run(spec.cmd, spec.versionArgs);
  } catch (err) {
    // The runner rejects only when the spawn failed (e.g. ENOENT / not on PATH).
    // Recover a version from the error message before declaring it missing, but
    // ONLY when the text actually reads like version output (contains the word
    // "version"). Otherwise a "command not found" message for a cmd whose name
    // ends in a digit (e.g. `python3`) would be misparsed as a version.
    const errText = (err as Error).message ?? "";
    const recovered = /version/i.test(errText) ? parseVersion(errText) : null;
    if (recovered) {
      raw = errText;
    } else {
      return {
        name: spec.name,
        status: "fail",
        message: `${spec.label} not found on PATH`,
        detail: { error: errText },
        hint: spec.hint,
      };
    }
  }

  const trimmed = raw.trim().split("\n")[0]?.trim() ?? raw.trim();
  const version = parseVersion(trimmed);
  if (spec.minMajor !== null) {
    // The human-readable floor: "3.10+" when a minor floor is set, else "3+".
    const floor = spec.minMinor != null ? `${spec.minMajor}.${spec.minMinor}` : `${spec.minMajor}`;
    if (!version) {
      // Present but no version could be parsed (empty / garbled output). Do NOT
      // fall through to "ok" — that fails OPEN and lets any version past the floor.
      // Fail closed: warn that the floor is unverified, with the remediation hint.
      return {
        name: spec.name,
        status: "warn",
        message: `${spec.label} present but version unreadable - kit expects ${floor}+`,
        detail: { version: trimmed, minMajor: spec.minMajor, minMinor: spec.minMinor ?? null },
        hint: spec.hint,
      };
    }
    // Below the floor if the major is short, OR the major matches and the minor is
    // short (the minMinor gate: Python 3.9 fails a 3.10 floor even though major 3 is met).
    const belowFloor =
      version.major < spec.minMajor ||
      (spec.minMinor != null && version.major === spec.minMajor && version.minor < spec.minMinor);
    if (belowFloor) {
      return {
        name: spec.name,
        status: "warn",
        message: `${spec.label} ${trimmed} - kit expects ${floor}+`,
        detail: { version: trimmed, minMajor: spec.minMajor, minMinor: spec.minMinor ?? null },
        hint: spec.hint,
      };
    }
  }
  return {
    name: spec.name,
    status: "ok",
    message: `${spec.label} ${trimmed}`,
    detail: { version: trimmed },
  };
}

/** All cold-start prerequisite checks, in README order. */
export async function checkPrerequisites(
  run: VersionRunner = defaultVersionRunner
): Promise<CheckResult[]> {
  return Promise.all(PREREQS.map((spec) => checkPrereq(spec, run)));
}

/**
 * Probe whether the resolved workspace actually has Lakebase (database
 * instances) enabled. This is the highest-consequence cold-start gap: auth can
 * succeed and the workspace identity resolve, while the workspace simply does
 * not have Lakebase turned on, which then fails at first provisioning with an
 * opaque error. `databricks database list-database-instances` succeeds (even
 * with an empty list) when the feature is on, and errors when it is off or the
 * account lacks access. `listInstances` is injectable for hermetic tests.
 */
export async function checkLakebaseEnabled(
  profile?: string,
  listInstances?: () => Promise<string>
): Promise<CheckResult> {
  const run =
    listInstances ??
    (() =>
      runDatabricks(["database", "list-database-instances", "-o", "json"], {
        profile,
        timeout: 15_000,
      }));
  try {
    const out = await run();
    let count: number | undefined;
    try {
      const parsed = JSON.parse(out || "[]");
      count = Array.isArray(parsed)
        ? parsed.length
        : Array.isArray(parsed?.database_instances)
          ? parsed.database_instances.length
          : undefined;
    } catch {
      // Non-JSON but non-error output still means the command is available,
      // so Lakebase is enabled; we just cannot count instances.
    }
    return {
      name: "lakebase-enabled",
      status: "ok",
      message:
        count === undefined
          ? "Workspace has Lakebase enabled"
          : `Workspace has Lakebase enabled (${count} database instance${count === 1 ? "" : "s"})`,
      detail: { instanceCount: count },
    };
  } catch (err) {
    return {
      name: "lakebase-enabled",
      status: "fail",
      message: "Workspace does not have Lakebase enabled (or account lacks access)",
      detail: { error: (err as Error).message },
      hint: "Enable Lakebase (Database Instances) on this workspace, or point at a workspace where it is enabled. Consort has no mock mode; a real Lakebase workspace is required.",
    };
  }
}

async function checkAuth(profile?: string, host?: string): Promise<CheckResult> {
  try {
    // `auth token --force-refresh` forces a REFRESH-token exchange, so an EXPIRED
    // refresh token fails HERE. `auth describe` only reads local config and would
    // report "authenticated" on a dead session (the masking bug that let expired
    // creds surface much later as a credential-mint hang). We still best-effort
    // read the host from `auth describe` for the message only.
    //
    // Thread `host` (sets DATABRICKS_HOST): when the caller pins the TARGET workspace
    // (e.g. create-project's --databricks-host) but no explicit profile, this makes the
    // auth check resolve against that workspace instead of falling back to the DEFAULT
    // profile (whose token may be stale) , the false-failure runDoctor's caller now avoids
    // by also resolving the host's profile up front.
    await runDatabricks(["auth", "token", "--force-refresh", "-o", "json"], {
      profile,
      host,
      timeout: 8_000,
    });
    let describedHost: string | undefined;
    try {
      const out = await runDatabricks(["auth", "describe", "-o", "json"], { profile, host, timeout: 5_000 });
      const parsed = JSON.parse(out);
      describedHost = parsed?.details?.host ?? parsed?.host ?? parsed?.host_name;
    } catch {
      // host is cosmetic; the refresh-token exchange above already proved auth.
    }
    const shownHost = describedHost ?? host;
    return {
      name: "databricks-auth",
      status: "ok",
      message: shownHost ? `Authenticated to ${shownHost}` : "Authenticated (refresh token valid)",
      detail: { host: shownHost, profile: profile ?? "default" },
    };
  } catch (err) {
    return {
      name: "databricks-auth",
      status: "fail",
      message: "databricks auth token failed (session expired or not logged in)",
      detail: { error: (err as Error).message },
      hint: "Run `databricks auth login --host <your-workspace>` to re-authenticate (the OAuth refresh token is expired/invalid).",
    };
  }
}

async function checkIdentity(profile?: string, host?: string): Promise<CheckResult> {
  try {
    const out = await runDatabricks(["current-user", "me", "-o", "json"], {
      profile,
      host,
      timeout: 5_000,
    });
    let user: string | undefined;
    try {
      const parsed = JSON.parse(out);
      user = parsed?.userName ?? parsed?.emails?.[0]?.value;
    } catch {
      // ignore
    }
    return {
      name: "workspace-identity",
      status: "ok",
      message: user
        ? `Workspace reachable as ${user}`
        : "Workspace reachable",
      detail: { user },
    };
  } catch (err) {
    return {
      name: "workspace-identity",
      status: "fail",
      message: "Cannot resolve current user from workspace",
      detail: { error: (err as Error).message },
      hint: "Re-authenticate via `databricks auth login` and verify network connectivity.",
    };
  }
}

function checkEnv(projectDir: string): CheckResult {
  const env = readEnvFile(projectDir);
  const required = ["LAKEBASE_PROJECT_ID", "LAKEBASE_BRANCH_ID"];
  const missing = required.filter((k) => !env[k]);
  if (Object.keys(env).length === 0) {
    return {
      name: "env-file",
      status: "warn",
      message: ".env not found",
      detail: { projectDir, envPath: path.join(projectDir, ".env") },
      hint: "Run `lakebase-branch sync-env`, or `git checkout <branch>` so the post-checkout hook writes .env (or copy .env.example). The kit stores connection METADATA only , no DB token (the app mints a short-lived credential at runtime).",
    };
  }
  if (missing.length) {
    return {
      name: "env-file",
      status: "fail",
      message: `.env missing required vars: ${missing.join(", ")}`,
      detail: { presentKeys: Object.keys(env), missing },
      hint: "Re-run `lakebase-branch sync-env` to regenerate .env from the current branch.",
    };
  }
  return {
    name: "env-file",
    status: "ok",
    message: `.env present with required keys (LAKEBASE_PROJECT_ID=${env.LAKEBASE_PROJECT_ID})`,
    detail: { keys: Object.keys(env).length, projectId: env.LAKEBASE_PROJECT_ID },
  };
}

/**
 * Warn when .env carries DATABRICKS_HOST but no DATABRICKS_CONFIG_PROFILE
 * AND exactly one valid CLI profile matches that host. Multi-workspace
 * users hit auth failures in this state because the bare host env var
 * can't be mapped to the cached OAuth token. `lakebase-doctor --fix`
 * pins it. No-op (ok/skip) when already pinned or no unique match exists.
 */
async function checkConfigProfile(env: Record<string, string>): Promise<CheckResult> {
  const host = env.DATABRICKS_HOST;
  if (env.DATABRICKS_CONFIG_PROFILE) {
    return {
      name: "config-profile",
      status: "ok",
      message: `CLI profile pinned: ${env.DATABRICKS_CONFIG_PROFILE}`,
      detail: { profile: env.DATABRICKS_CONFIG_PROFILE },
    };
  }
  if (!host) {
    return {
      name: "config-profile",
      status: "skip",
      message: "Skipped: no DATABRICKS_HOST in .env",
    };
  }
  let resolved: string | undefined;
  try {
    resolved = await resolveProfileForHost(host);
  } catch {
    // best-effort; treat as no unique match
  }
  if (!resolved) {
    return {
      name: "config-profile",
      status: "ok",
      message: "No profile pin needed (no unique CLI profile matches this host)",
      detail: { host },
    };
  }
  return {
    name: "config-profile",
    status: "warn",
    message: `.env has no DATABRICKS_CONFIG_PROFILE; host maps to valid profile "${resolved}"`,
    detail: { host, resolvedProfile: resolved },
    hint: `Run \`lakebase-doctor --fix\` (or add DATABRICKS_CONFIG_PROFILE=${resolved} to .env) so the hooks' auth preflight resolves the cached token.`,
  };
}

async function checkLakebaseProject(
  projectId: string,
  host: string | undefined
): Promise<CheckResult> {
  if (!projectId) {
    return {
      name: "lakebase-project",
      status: "skip",
      message: "Skipped: no LAKEBASE_PROJECT_ID in .env",
    };
  }
  try {
    const branches = await listBranches({ instance: projectId, host });
    return {
      name: "lakebase-project",
      status: "ok",
      message: `Project ${projectId} reachable (${branches.length} branches)`,
      detail: {
        projectId,
        branchCount: branches.length,
        branchNames: branches.map((b) => b.name),
      },
    };
  } catch (err) {
    return {
      name: "lakebase-project",
      status: "fail",
      message: `Cannot list branches on project ${projectId}`,
      detail: { error: (err as Error).message },
      hint: "Verify the project exists and your account has CAN_USE on it.",
    };
  }
}

async function checkGitRemote(projectDir: string): Promise<CheckResult> {
  try {
    const url = (
      await exec("git remote get-url origin", {
        cwd: projectDir,
        timeout: 5_000,
      })
    ).trim();
    if (!url) {
      return {
        name: "git-remote",
        status: "warn",
        message: "No origin remote configured",
      };
    }
    return {
      name: "git-remote",
      status: "ok",
      message: `origin -> ${url}`,
      detail: { url },
    };
  } catch (err) {
    return {
      name: "git-remote",
      status: "warn",
      message: "git remote get-url origin failed",
      detail: { error: (err as Error).message },
      hint: "Run `git remote add origin <url>` if this is a fresh repo.",
    };
  }
}

function checkLanguage(projectDir: string): CheckResult {
  try {
    const lang = detectLanguage(projectDir);
    return {
      name: "detected-language",
      status: "ok",
      message: `Project language: ${lang}`,
      detail: { language: lang },
    };
  } catch (err) {
    return {
      name: "detected-language",
      status: "warn",
      message: "Could not detect project language",
      detail: { error: (err as Error).message },
    };
  }
}

function checkHooks(projectDir: string): CheckResult {
  const v = verifyHooks(projectDir);
  const installed = (Object.entries(v) as [string, boolean][])
    .filter(([, ok]) => ok)
    .map(([k]) => k);
  const missing = (Object.entries(v) as [string, boolean][])
    .filter(([, ok]) => !ok)
    .map(([k]) => k);
  if (missing.length === 0) {
    return {
      name: "git-hooks",
      status: "ok",
      message: `All ${installed.length} project git hooks installed`,
      detail: v,
    };
  }
  return {
    name: "git-hooks",
    status: "warn",
    message: `Missing git hooks: ${missing.join(", ")}`,
    detail: v,
    hint: "Re-run `lakebase-create-project --install-hooks` or copy the hook files from the kit's templates.",
  };
}

function checkWorkflowDrift(projectDir: string): CheckResult {
  try {
    const report = detectWorkflowDrift({ projectDir });
    const drifted = report.files.filter((f) => f.status === "drifted").length;
    const missing = report.files.filter((f) => f.status === "missing").length;
    if (report.overall === "ok") {
      return {
        name: "workflow-drift",
        status: "ok",
        message: "Scaffolded .github/workflows/*.yml match the kit's templates",
        detail: { files: report.files.map((f) => ({ name: f.name, status: f.status })) },
      };
    }
    return {
      name: "workflow-drift",
      status: "warn",
      message: `Scaffolded workflows drift from kit: ${drifted} drifted, ${missing} missing`,
      detail: { files: report.files.map((f) => ({ name: f.name, status: f.status })) },
      hint: "Inspect via the lakebase_workflow_drift MCP tool (or detectWorkflowDrift import). Refresh manually until updateWorkflows lands.",
    };
  } catch (err) {
    return {
      name: "workflow-drift",
      status: "skip",
      message: "Could not run drift check",
      detail: { error: (err as Error).message },
    };
  }
}

function worstOf(statuses: CheckStatus[]): CheckStatus {
  const order: CheckStatus[] = ["ok", "skip", "warn", "fail"];
  return statuses.reduce<CheckStatus>(
    (acc, s) => (order.indexOf(s) > order.indexOf(acc) ? s : acc),
    "ok"
  );
}

/**
 * Run all doctor checks and return a structured report. The CLI prints
 * the report; programmatic consumers can read the structured data and
 * decide what to surface.
 */
export async function runDoctor(args: DoctorArgs = {}): Promise<DoctorReport> {
  const projectDir = args.projectDir ?? process.cwd();
  let profile = args.profile ?? process.env.DATABRICKS_CONFIG_PROFILE;
  let host = args.host;

  // When the caller pinned the TARGET workspace host (e.g. create-project passes
  // --databricks-host) but no explicit profile, resolve the profile that matches THAT
  // host so the auth check runs against the target workspace. Without this, an unset
  // profile makes `databricks auth token` fall back to the DEFAULT profile , whose token
  // may be stale/expired , and the doctor fails spuriously even though the target
  // workspace authenticates fine. The host is also threaded into the checks below.
  if (!profile && host) {
    try {
      profile = await resolveProfileForHost(host);
    } catch {
      // best-effort; host is still threaded into checkAuth (sets DATABRICKS_HOST).
    }
  }

  const cli = await checkDatabricksCli();
  const auth = cli.status === "ok" ? await checkAuth(profile, host) : {
    name: "databricks-auth",
    status: "skip" as CheckStatus,
    message: "Skipped: databricks CLI not available",
  };

  const identity = auth.status === "ok" ? await checkIdentity(profile, host) : {
    name: "workspace-identity",
    status: "skip" as CheckStatus,
    message: "Skipped: auth check failed",
  };

  if (!host && auth.status === "ok") {
    try {
      // resolveDatabricksHost requires a profile string; fall back to
      // "DEFAULT" if the caller hasn't pinned one explicitly. When
      // resolution fails (unknown profile, parse error) the
      // lakebase-project check still works via env-derived host.
      host = await resolveDatabricksHost({ profile: profile ?? "DEFAULT" });
    } catch {
      // best-effort; lakebase-project check will skip if no host
    }
  }

  const env = checkEnv(projectDir);
  const envVars = readEnvFile(projectDir);
  const configProfile = await checkConfigProfile(envVars);
  const lakebaseProject = await checkLakebaseProject(
    envVars.LAKEBASE_PROJECT_ID ?? "",
    host
  );
  const gitRemote = await checkGitRemote(projectDir);
  const language = checkLanguage(projectDir);
  const hooks = checkHooks(projectDir);
  const workflowDrift = checkWorkflowDrift(projectDir);

  // Cold-start prerequisites (Node/Python/JDK/gh/npm): always run, they are
  // local-environment checks with no auth dependency.
  const prereqs = await checkPrerequisites();

  // Lakebase-enabled probe: needs a reachable workspace, so gate on auth like
  // the identity + lakebase-project checks.
  const lakebaseEnabled =
    auth.status === "ok"
      ? await checkLakebaseEnabled(profile)
      : {
          name: "lakebase-enabled",
          status: "skip" as CheckStatus,
          message: "Skipped: auth check failed",
        };

  const checks: CheckResult[] = [
    cli,
    ...prereqs,
    auth,
    identity,
    lakebaseEnabled,
    env,
    configProfile,
    lakebaseProject,
    gitRemote,
    language,
    hooks,
    workflowDrift,
  ];

  return {
    overall: worstOf(checks.map((c) => c.status)),
    checks,
  };
}
