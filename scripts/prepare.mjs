#!/usr/bin/env node
// npm prepare lifecycle dispatcher.
//
// `npm prepare` fires in two very different contexts:
//
//   1. Package development clone   (.git/ present)
//   2. Consumer install via npx    (github:databricks-solutions/lakebase-
//      scm-utils#<tag>) extracts into a tmpdir with no .git/
//
// In context (1) we want the full chain:
//   - npm run build      (tsup; emit dist/)
//   - husky              (install local git hooks)
//
// In context (2), only the build matters, and devDependencies are NOT
// installed, so `npm run build` (tsup) would fail with `tsup: not found`.
// The package ships pre-built dist/ on every tagged release (force-added to
// git despite .gitignore), so consumers don't need to build. We instead
// verify every declared bin is present in the shipped dist/ and fail loud if
// a release shipped an incomplete dist/.

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

function log(msg) {
  process.stderr.write(`[prepare] ${msg}\n`);
}

function run(label, cmd, args) {
  log(`>>> ${label}: ${cmd} ${args.join(" ")}`);
  const t0 = Number(process.hrtime.bigint() / 1000000n);
  const r = spawnSync(cmd, args, {
    cwd: REPO_ROOT,
    stdio: ["ignore", "inherit", "inherit"],
    shell: process.platform === "win32",
  });
  const elapsed = Number(process.hrtime.bigint() / 1000000n) - t0;
  log(`<<< ${label}: exit=${r.status} elapsed=${elapsed}ms`);
  if (r.status !== 0) {
    log(`FAIL: ${label}`);
    process.exit(r.status ?? 1);
  }
}

const isDevClone = existsSync(join(REPO_ROOT, ".git"));
log(`starting; isDevClone=${isDevClone} cwd=${REPO_ROOT}`);
log(`node=${process.version} platform=${process.platform} arch=${process.arch}`);

if (isDevClone) {
  log("dev clone path: build + husky");
  run("npm-build", "npm", ["run", "build"]);
  run("husky", "npx", ["--no-install", "husky"]);
} else {
  // Consumer install: skip build; verify the shipped dist/ carries every bin.
  const pkg = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8"));
  const missing = Object.entries(pkg.bin ?? {})
    .filter(([, rel]) => !existsSync(join(REPO_ROOT, rel)))
    .map(([name, rel]) => `${name} -> ${rel}`);
  if (missing.length > 0) {
    log(`FAIL: consumer install is missing ${missing.length}/${Object.keys(pkg.bin).length} pre-built bin(s):`);
    for (const m of missing) log(`  ${m}`);
    log("This is a release-pipeline gap: the tag must ship a COMPLETE dist/");
    log("(rebuild + `git add -f` the dist bin targets).");
    process.exit(1);
  }
  log(`consumer install path: skipping build (all ${Object.keys(pkg.bin).length} bins present in shipped dist/)`);
}

log("done");
