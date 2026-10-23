#!/usr/bin/env node

// scripts/lakebase/scm-park-feature.cli.ts
import * as path2 from "path";

// scripts/util/cli-entry.ts
import { realpathSync } from "fs";
import { fileURLToPath } from "url";
function isCliEntry(importMetaUrl) {
  const invokedRaw = process.argv[1];
  if (!invokedRaw) return false;
  let invokedResolved;
  let moduleResolved;
  try {
    invokedResolved = realpathSync(invokedRaw);
  } catch {
    return false;
  }
  try {
    moduleResolved = realpathSync(fileURLToPath(importMetaUrl));
  } catch {
    return false;
  }
  return invokedResolved === moduleResolved;
}

// scripts/util/exec.ts
import * as cp from "child_process";
function shq(s) {
  return `'${s.replace(/'/g, "'\\''")}'`;
}
function exec2(command, opts = {}) {
  return new Promise((resolve2, reject) => {
    const options = {
      cwd: opts.cwd,
      timeout: opts.timeout ?? 6e4
    };
    if (opts.env) {
      options.env = { ...process.env, ...opts.env };
    }
    cp.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        const msg = String(stderr || err.message);
        reject(new Error(`${command}: ${msg}`));
        return;
      }
      resolve2(String(stdout).trim());
    });
  });
}

// scripts/git/inspect.ts
async function getCurrentBranch(args) {
  try {
    const name = await exec2("git rev-parse --abbrev-ref HEAD", {
      cwd: args.cwd
    });
    return name === "HEAD" ? "" : name;
  } catch {
    return "";
  }
}

// scripts/git/status.ts
async function isDirty(args) {
  try {
    const ignore = args.ignore ?? [];
    const untrackedFlag = args.untracked === false ? " --untracked-files=no" : "";
    let command = `git status --porcelain${untrackedFlag}`;
    if (ignore.length > 0) {
      const excludes = ignore.map((p) => shq(`:(exclude)${p.replace(/\/+$/, "")}`)).join(" ");
      command = `git status --porcelain${untrackedFlag} -- . ${excludes}`;
    }
    const out = await exec2(command, { cwd: args.cwd });
    return out.trim().length > 0;
  } catch {
    return false;
  }
}

// scripts/lakebase/scm-workflow-state.ts
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
function isGitTracked(projectDir, rel) {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", "--", rel], { cwd: projectDir, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function ensureWorkflowStateUntracked(projectDir) {
  const rel = ".lakebase/workflow-state.json";
  try {
    if (isGitTracked(projectDir, rel)) {
      execFileSync("git", ["rm", "--cached", "--quiet", "--ignore-unmatch", "--", rel], { cwd: projectDir, stdio: "ignore" });
    }
  } catch {
  }
  try {
    const gitignore = path.join(projectDir, ".gitignore");
    const existing = fs.existsSync(gitignore) ? fs.readFileSync(gitignore, "utf8") : "";
    if (!existing.split("\n").some((l) => l.trim() === rel)) {
      const sep = existing === "" || existing.endsWith("\n") ? "" : "\n";
      fs.appendFileSync(
        gitignore,
        `${sep}# Runtime SCM claim state (per working tree): a branch checkout must never restore
# a stale committed claim over the live one (issue #203 / Finding 28).
${rel}
`
      );
    }
  } catch {
  }
}
var SCM_STATES = [
  "scaffold-complete",
  "feature-claimed",
  "pr-ready",
  "ci-green",
  "merged"
];
var STATE_INDEX = SCM_STATES.reduce(
  (acc, s, i) => ({ ...acc, [s]: i }),
  {}
);
var STATE_FILE_REL = ".lakebase/workflow-state.json";
function stateFilePath(projectDir) {
  return path.join(projectDir, STATE_FILE_REL);
}
function readWorkflowState(projectDir) {
  const p = stateFilePath(projectDir);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `Failed to parse ${STATE_FILE_REL}: ${e.message}`
    );
  }
  const result = validateWorkflowState(parsed);
  if (!result.ok) {
    const summary = result.errors.map((e) => `  - ${e.path}: ${e.message}`).join("\n");
    throw new Error(
      `Invalid ${STATE_FILE_REL}:
${summary}

Fix the file or delete it to re-init.`
    );
  }
  return result.value;
}
function writeWorkflowState(projectDir, state) {
  const result = validateWorkflowState(state);
  if (!result.ok) {
    const summary = result.errors.map((e) => `  - ${e.path}: ${e.message}`).join("\n");
    throw new Error(`Refusing to write invalid SCM state:
${summary}`);
  }
  ensureWorkflowStateUntracked(projectDir);
  const dir = path.join(projectDir, ".lakebase");
  fs.mkdirSync(dir, { recursive: true });
  const target = stateFilePath(projectDir);
  const tmp = `${target}.tmp`;
  const ordered = orderForOutput(result.value);
  fs.writeFileSync(tmp, `${JSON.stringify(ordered, null, 2)}
`, "utf8");
  fs.renameSync(tmp, target);
}
function validateWorkflowState(value) {
  const errors = [];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      ok: false,
      errors: [{ path: "$", message: "must be an object" }]
    };
  }
  const v = value;
  if (v.version !== 1) {
    errors.push({ path: "version", message: `must be 1, got ${String(v.version)}` });
  }
  if (typeof v.state !== "string" || !SCM_STATES.includes(v.state)) {
    errors.push({
      path: "state",
      message: `must be one of ${SCM_STATES.join(" | ")}`
    });
  }
  if (v.tier_topology !== 1 && v.tier_topology !== 2 && v.tier_topology !== 3) {
    errors.push({
      path: "tier_topology",
      message: "must be 1, 2, or 3"
    });
  }
  if (typeof v.project_id !== "string" || v.project_id.length === 0) {
    errors.push({
      path: "project_id",
      message: "must be a non-empty string"
    });
  }
  const stringFields = [
    "feature_id",
    "branch",
    "parent_branch",
    "lakebase_branch_uid",
    "claimed_at",
    "pr_url",
    "pushed_at",
    "ci_run_url",
    "ci_green_at",
    "merged_at",
    "migrate_run_url",
    "migrate_completed_at",
    "$schema"
  ];
  for (const key of stringFields) {
    if (v[key] === void 0) continue;
    if (typeof v[key] !== "string" || v[key].length === 0) {
      errors.push({
        path: key,
        message: "must be a non-empty string when present"
      });
    }
  }
  const requiredForState = {
    "scaffold-complete": [],
    "feature-claimed": [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at"
    ],
    "pr-ready": [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at",
      "pr_url",
      "pushed_at"
    ],
    "ci-green": [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at",
      "pr_url",
      "pushed_at",
      "ci_run_url",
      "ci_green_at"
    ],
    merged: [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at",
      "pr_url",
      "pushed_at",
      "ci_run_url",
      "ci_green_at",
      "merged_at"
    ]
  };
  if (typeof v.state === "string" && SCM_STATES.includes(v.state)) {
    for (const key of requiredForState[v.state]) {
      if (v[key] === void 0) {
        errors.push({
          path: key,
          message: `required when state is "${v.state}"`
        });
      }
    }
  }
  const allowedKeys = /* @__PURE__ */ new Set([
    "$schema",
    "version",
    "state",
    "tier_topology",
    "project_id",
    "feature_id",
    "branch",
    "parent_branch",
    "lakebase_branch_uid",
    "claimed_at",
    "pr_url",
    "pushed_at",
    "ci_run_url",
    "ci_green_at",
    "merged_at",
    "migrate_run_url",
    "migrate_completed_at"
  ]);
  for (const key of Object.keys(v)) {
    if (!allowedKeys.has(key)) {
      errors.push({ path: key, message: "unknown property" });
    }
  }
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: v };
}
function orderForOutput(state) {
  const keyOrder = [
    "$schema",
    "version",
    "state",
    "tier_topology",
    "project_id",
    "feature_id",
    "branch",
    "parent_branch",
    "lakebase_branch_uid",
    "claimed_at",
    "pr_url",
    "pushed_at",
    "ci_run_url",
    "ci_green_at",
    "merged_at",
    "migrate_run_url",
    "migrate_completed_at"
  ];
  const out = {};
  for (const k of keyOrder) {
    if (state[k] !== void 0) {
      out[k] = state[k];
    }
  }
  return out;
}

// scripts/lakebase/scm-release-claim.ts
var ScmReleaseError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmReleaseError";
  }
  code;
};
async function prepareClaimRelease(args, verb) {
  const current = readWorkflowState(args.projectDir);
  if (!current) {
    throw new ScmReleaseError(
      `No SCM workflow state found at ${args.projectDir}/.lakebase/workflow-state.json.`,
      "no-state-file"
    );
  }
  if (current.state !== "feature-claimed") {
    throw new ScmReleaseError(
      `${verb} refuses state "${current.state}". Only feature-claimed is ${verb}able; later states must complete or be reverted via gh.`,
      "bad-precondition"
    );
  }
  if (!current.feature_id || !current.branch || !current.parent_branch || !current.lakebase_branch_uid) {
    throw new ScmReleaseError(
      `feature-claimed row is missing required invariants. Cannot ${verb} safely; consider re-adopting state first.`,
      "missing-claim-fields"
    );
  }
  if (!args.force) {
    const dirty = await isDirty({ cwd: args.projectDir });
    if (dirty) {
      throw new ScmReleaseError(
        `Working tree has uncommitted changes; refusing to ${verb} (switching HEAD off the feature branch would strand them). Commit / stash / discard first, or pass --force.`,
        "dirty-working-tree"
      );
    }
  }
  const switchTo = args.switchTo ?? current.parent_branch;
  const warnings = [];
  const headBranch = await getCurrentBranch({ cwd: args.projectDir });
  if (headBranch === current.branch) {
    try {
      await exec2(`git checkout ${JSON.stringify(switchTo)}`, {
        cwd: args.projectDir,
        timeout: 1e4
      });
    } catch (err) {
      warnings.push(
        `git checkout ${switchTo} failed: ${err instanceof Error ? err.message : String(err)}. Local branch state may be left on the feature branch.`
      );
    }
  }
  return { current, switchTo, warnings };
}
function resetToScaffoldComplete(projectDir, current) {
  const reset = {
    $schema: current.$schema,
    version: 1,
    state: "scaffold-complete",
    tier_topology: current.tier_topology,
    project_id: current.project_id
  };
  writeWorkflowState(projectDir, reset);
  return reset;
}

// scripts/lakebase/scm-park-feature.ts
async function parkFeatureBranch(args) {
  const { current, switchTo, warnings } = await prepareClaimRelease(
    { projectDir: args.projectDir, force: args.force, switchTo: args.switchTo },
    "park"
  );
  const reset = resetToScaffoldComplete(args.projectDir, current);
  return {
    state: reset,
    keptBranch: current.branch,
    parkedFeatureId: current.feature_id,
    switchedTo: switchTo,
    warnings
  };
}

// scripts/lakebase/scm-park-feature.cli.ts
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--project-dir":
      case "--cwd":
        out.projectDir = argv[++i];
        break;
      case "--switch-to":
        out.switchTo = argv[++i];
        break;
      case "--force":
        out.force = true;
        break;
      case "--json":
        out.json = true;
        break;
      case "--pretty":
        out.pretty = true;
        break;
      case "--help":
      case "-h":
        out.help = true;
        break;
    }
  }
  return out;
}
var HELP = `lakebase-scm-park-feature (phase B+)

Release a feature claim but KEEP its paired branch: switch HEAD to the parent
tier, reset workflow-state to scaffold-complete, leave the Lakebase + git
branch intact. Frees the single SCM claim so another feature can be claimed
and driven; resume the parked feature later with
'lakebase-scm-claim-feature-branch <feature>' (it reuses the kept branch).

Usage:
  lakebase-scm-park-feature [flags]

Flags:
  --project-dir <dir>   Project root (default: cwd)
  --switch-to <branch>  Branch to checkout after releasing (default: parent_branch)
  --force               Allow park even with a dirty working tree
                        (edits are kept but stranded on the feature branch)
  --json                Machine-readable JSON output
  --pretty              Pretty-print JSON (only with --json)
  -h, --help            Show this help

Exit codes:
  0 = parked (claim freed, branch kept, state reset to scaffold-complete)
  1 = no state file
  2 = precondition refused (wrong state, dirty tree without --force, missing fields)
  3 = substrate failure
`;
function renderHuman(report) {
  if (!report.ok) {
    return `lakebase-scm-park-feature: ${report.error?.code}

  ${report.error?.message}`;
  }
  const r = report.result;
  const lines = ["Feature parked (branch kept):"];
  lines.push(`  state          : ${r.state.state}`);
  lines.push(`  parked_feature : ${r.parkedFeatureId}`);
  lines.push(`  kept_branch    : ${r.keptBranch}`);
  lines.push(`  switched_to    : ${r.switchedTo}`);
  lines.push("");
  lines.push(`  resume with    : lakebase-scm-claim-feature-branch ${r.parkedFeatureId}`);
  if (r.warnings.length > 0) {
    lines.push("");
    lines.push("warnings:");
    for (const w of r.warnings) lines.push(`  - ${w}`);
  }
  return lines.join("\n");
}
function exitCodeForError(err) {
  if (err instanceof ScmReleaseError) {
    if (err.code === "no-state-file") return 1;
    return 2;
  }
  return 3;
}
async function runScmParkFeatureCli(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(`${HELP}
`);
    return 0;
  }
  const projectDir = path2.resolve(args.projectDir ?? process.cwd());
  try {
    const result = await parkFeatureBranch({
      projectDir,
      switchTo: args.switchTo,
      force: args.force
    });
    const report = { ok: true, result };
    if (args.json) {
      const indent = args.pretty ? 2 : 0;
      process.stdout.write(`${JSON.stringify(report, null, indent)}
`);
    } else {
      process.stdout.write(`${renderHuman(report)}
`);
    }
    return 0;
  } catch (e) {
    const err = e;
    const code = err instanceof ScmReleaseError ? err.code : "substrate-failure";
    const report = { ok: false, error: { code, message: err.message } };
    if (args.json) {
      const indent = args.pretty ? 2 : 0;
      process.stdout.write(`${JSON.stringify(report, null, indent)}
`);
    } else {
      process.stderr.write(`${renderHuman(report)}
`);
    }
    return exitCodeForError(err);
  }
}
if (isCliEntry(import.meta.url)) {
  void runScmParkFeatureCli(process.argv.slice(2)).then((c) => process.exit(c));
}
export {
  runScmParkFeatureCli
};
