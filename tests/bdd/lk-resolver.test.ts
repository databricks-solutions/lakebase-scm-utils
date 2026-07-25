// The `lk` resolver shim (scaffolded into every project's scripts/) kills the
// npx tax: instead of `npx --package=github#ref <bin>` (~3.5s, re-resolves the
// ref every call), it resolves a package ONCE per ref into a shared cache and
// `node`-execs the bin (~0.09s). These hermetic tests drive its contract via a
// fake package dir + a pre-seeded cache, so they never hit the network/npm.
//
// Two packages back a scaffolded project and lk routes each bin to its owner:
// `lakebase-sftdd-*` / `lakebase-tdd-*` -> the SFTDD kit (lakebase-app-dev-kit);
// everything else -> the substrate (lakebase-scm-utils). The sftdd-bin tests
// below therefore exercise the KIT route (LAKEBASE_KIT_DIR / kit-ref / kit cache),
// and a dedicated block exercises the default substrate route.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, chmodSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, "..", "..");
const LK = join(REPO_ROOT, "templates", "project", "common", "scripts", "lk");

const PKG = "@databricks-solutions/lakebase-app-dev-kit";
const SCM_PKG = "@databricks-solutions/lakebase-scm-utils";

let work: string;
beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), "lk-"));
});
afterEach(() => rmSync(work, { recursive: true, force: true }));

/** Lay out a fake kit install (package.json bin map + a dist stub that echoes
 *  its argv as JSON) so we can assert resolution + exec without a real kit.
 *  Uses an sftdd bin so lk routes it to the kit. */
function fakeKitDir(dir: string): string {
  mkdirSync(join(dir, "dist"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: PKG, bin: { "lakebase-sftdd-log": "dist/echo.js" } }),
  );
  writeFileSync(join(dir, "dist", "echo.js"), "process.stdout.write(JSON.stringify(process.argv.slice(2)));\n");
  return dir;
}

/** Fake substrate (scm-utils) install with a non-sftdd bin, which lk routes to
 *  the substrate rather than the kit. */
function fakeScmUtilsDir(dir: string): string {
  mkdirSync(join(dir, "dist"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: SCM_PKG, bin: { "lakebase-scm-doctor": "dist/echo.js" } }),
  );
  writeFileSync(join(dir, "dist", "echo.js"), "process.stdout.write(JSON.stringify(process.argv.slice(2)));\n");
  return dir;
}

function runLk(args: string[], env: Record<string, string>, cwd = work) {
  return spawnSync("bash", [LK, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...env },
    // Hermetic: every path is dir-override or pre-seeded cache. A timeout keeps an
    // accidental network install (a misrouted ref) failing loud instead of hanging.
    timeout: 30000,
  });
}

describe("lk resolver shim", () => {
  it("execs the bin's dist JS and forwards args (LAKEBASE_KIT_DIR override)", () => {
    const kit = fakeKitDir(join(work, "kit"));
    const r = runLk(["lakebase-sftdd-log", "--read", "--feature", "F1"], { LAKEBASE_KIT_DIR: kit });
    expect(r.status, r.stderr).toBe(0);
    // The stub echoes its received args, proving node ran the mapped dist file
    // with everything after the bin name forwarded.
    expect(JSON.parse(r.stdout)).toEqual(["--read", "--feature", "F1"]);
  });

  it("resolves the kit from the shared per-ref cache without installing (LAKEBASE_KIT_REF)", () => {
    const cache = join(work, "cache");
    const kit = fakeKitDir(join(cache, "lakebase-app-dev-kit", "myref", "node_modules", PKG));
    void kit;
    const r = runLk(["lakebase-sftdd-log", "--x"], { XDG_CACHE_HOME: cache, LAKEBASE_KIT_REF: "myref" });
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(["--x"]);
  });

  it("reads the pinned ref from .lakebase/kit-ref when no env is set", () => {
    const cache = join(work, "cache");
    fakeKitDir(join(cache, "lakebase-app-dev-kit", "fileref", "node_modules", PKG));
    const proj = join(work, "proj");
    mkdirSync(join(proj, ".lakebase"), { recursive: true });
    writeFileSync(join(proj, ".lakebase", "kit-ref"), "fileref\n");
    const r = runLk(["lakebase-sftdd-log"], { XDG_CACHE_HOME: cache, LAKEBASE_KIT_REF: "" }, proj);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual([]);
  });

  it("reads .lakebase/kit-ref.local with precedence over the committed .lakebase/kit-ref (Finding 28)", () => {
    // The gitignored run pin (.local) survives branch checkouts and must win over
    // the committed kit-ref (which a fork-from-origin checkout can revert). Only the
    // .local ref's cache is seeded, so resolving succeeds ONLY if .local is read;
    // reading the committed ref would miss the cache and attempt a (failing) install.
    const cache = join(work, "cache");
    fakeKitDir(join(cache, "lakebase-app-dev-kit", "localref", "node_modules", PKG));
    const proj = join(work, "proj");
    mkdirSync(join(proj, ".lakebase"), { recursive: true });
    writeFileSync(join(proj, ".lakebase", "kit-ref"), "committedref\n");
    writeFileSync(join(proj, ".lakebase", "kit-ref.local"), "localref\n");
    const r = runLk(["lakebase-sftdd-log", "--pinned"], { XDG_CACHE_HOME: cache, LAKEBASE_KIT_REF: "" }, proj);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(["--pinned"]);
  });

  it("self-heals a lost cache for a local-only ref from .lakebase/kit-local-dir (offline)", () => {
    // A local-only ref (e.g. a capture pinned to a working tree) exists nowhere
    // on GitHub, so if its cache symlink is lost mid-run lk cannot re-resolve it
    // and would hard-fail. With .lakebase/kit-local-dir recorded, lk recovers the
    // kit path from the hint, re-plants the cache symlink, and runs the bin , all
    // without touching the network (the doomed GitHub install is skipped).
    const cache = join(work, "cache");
    const kitLocal = fakeKitDir(join(work, "kitlocal"));
    const proj = join(work, "proj");
    mkdirSync(join(proj, ".lakebase"), { recursive: true });
    writeFileSync(join(proj, ".lakebase", "kit-ref"), "sftdd-capture-local\n");
    writeFileSync(join(proj, ".lakebase", "kit-local-dir"), `${kitLocal}\n`);
    // Cache is COLD (never seeded) for this ref.
    const r = runLk(["lakebase-sftdd-log", "--z"], { XDG_CACHE_HOME: cache, LAKEBASE_KIT_REF: "" }, proj);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(["--z"]);
    expect(r.stderr).toMatch(/recovered from .*kit-local-dir/);
    // Re-planted the cache symlink so later calls hit the fast path.
    expect(existsSync(join(cache, "lakebase-app-dev-kit", "sftdd-capture-local", "node_modules", PKG))).toBe(true);
  });

  it("exits non-zero for an unknown bin", () => {
    // An sftdd-prefixed name routes to the (overridden) kit so resolution succeeds
    // and the failure is the bin-map lookup, not a network install.
    const kit = fakeKitDir(join(work, "kit"));
    const r = runLk(["lakebase-sftdd-not-a-bin"], { LAKEBASE_KIT_DIR: kit });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/unknown/i);
  });

  it("--warm resolves without running a bin (cache pre-populate)", () => {
    // --warm always warms the substrate and, when this project uses SFTDD, the kit
    // too; dir overrides make both no-ops, so nothing installs and no bin runs.
    const kit = fakeKitDir(join(work, "kit"));
    const scm = fakeScmUtilsDir(join(work, "scm"));
    const r = runLk(["--warm"], { LAKEBASE_KIT_DIR: kit, LAKEBASE_SCM_UTILS_DIR: scm });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toBe(""); // no bin ran
  });

  it("errors with a usage message when no bin is given", () => {
    const kit = fakeKitDir(join(work, "kit"));
    const r = runLk([], { LAKEBASE_KIT_DIR: kit });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/usage/i);
  });
});

describe("lk substrate routing (default, non-sftdd bins)", () => {
  it("routes a non-sftdd bin to scm-utils (LAKEBASE_SCM_UTILS_DIR override)", () => {
    const scm = fakeScmUtilsDir(join(work, "scm"));
    const r = runLk(["lakebase-scm-doctor", "--json"], { LAKEBASE_SCM_UTILS_DIR: scm });
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(["--json"]);
  });

  it("resolves the substrate from the shared per-ref cache without installing (LAKEBASE_SCM_UTILS_REF)", () => {
    const cache = join(work, "cache");
    fakeScmUtilsDir(join(cache, "lakebase-scm-utils", "myref", "node_modules", SCM_PKG));
    const r = runLk(["lakebase-scm-doctor", "--x"], { XDG_CACHE_HOME: cache, LAKEBASE_SCM_UTILS_REF: "myref" });
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(["--x"]);
  });

  it("reads the pinned substrate ref from .lakebase/scm-utils-ref.local over the committed ref", () => {
    const cache = join(work, "cache");
    fakeScmUtilsDir(join(cache, "lakebase-scm-utils", "localref", "node_modules", SCM_PKG));
    const proj = join(work, "proj");
    mkdirSync(join(proj, ".lakebase"), { recursive: true });
    writeFileSync(join(proj, ".lakebase", "scm-utils-ref"), "committedref\n");
    writeFileSync(join(proj, ".lakebase", "scm-utils-ref.local"), "localref\n");
    const r = runLk(["lakebase-scm-doctor"], { XDG_CACHE_HOME: cache, LAKEBASE_SCM_UTILS_REF: "" }, proj);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual([]);
  });

  it("self-heals a lost substrate cache from .lakebase/scm-utils-local-dir (offline)", () => {
    const cache = join(work, "cache");
    const scmLocal = fakeScmUtilsDir(join(work, "scmlocal"));
    const proj = join(work, "proj");
    mkdirSync(join(proj, ".lakebase"), { recursive: true });
    writeFileSync(join(proj, ".lakebase", "scm-utils-ref"), "scm-capture-local\n");
    writeFileSync(join(proj, ".lakebase", "scm-utils-local-dir"), `${scmLocal}\n`);
    const r = runLk(["lakebase-scm-doctor", "--z"], { XDG_CACHE_HOME: cache, LAKEBASE_SCM_UTILS_REF: "" }, proj);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(["--z"]);
    expect(r.stderr).toMatch(/recovered from .*scm-utils-local-dir/);
    expect(existsSync(join(cache, "lakebase-scm-utils", "scm-capture-local", "node_modules", SCM_PKG))).toBe(true);
  });
});
