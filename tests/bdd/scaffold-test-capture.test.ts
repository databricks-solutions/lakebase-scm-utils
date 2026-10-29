// Coverage for the root per-test capture modules (consort-capture.ts +
// consort-test-reporter.ts) and their deploy seam deployTestCaptureRoot.
//
// Regression: these two files shipped in templates/project/common/ from v0.3.4
// but NO scaffold step copied them to the project root, so every React scaffold
// was born with dangling imports — client/vite.config.ts wires
// setupFiles+reporter that import `../../consort-capture` / `../consort-capture`,
// and client/playwright.config.ts names `../consort-test-reporter.ts`. Without
// the pair at the root `vitest run` can't start and Playwright can't load (the
// scaffold-defect halt). Pure filesystem; no live Lakebase, no git.

import { describe, it, expect, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execSync } from "node:child_process";
import {
  deployTestCaptureRoot,
  deployClientProject,
  scaffoldAll,
  TEST_CAPTURE_ROOT_FILES,
} from "../../scripts/lakebase/scaffold.js";

// installHooks (called by scaffoldStaticAll inside scaffoldAll) requires a real
// git repo, not just a bare .git/ dir.
function gitInit(dir: string): void {
  execSync("git init -q", { cwd: dir, stdio: "pipe" });
}

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATES = path.join(REPO_ROOT, "templates", "project");

const tmpDirs: string[] = [];
afterEach(() => {
  while (tmpDirs.length) {
    const dir = tmpDirs.pop();
    if (dir) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        // ignore
      }
    }
  }
});

function mkTarget(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-capture-"));
  tmpDirs.push(dir);
  return dir;
}

function read(dir: string, rel: string): string {
  return fs.readFileSync(path.join(dir, rel), "utf8");
}

describe("deployTestCaptureRoot", () => {
  it("writes both root capture modules so vitest + Playwright can load", () => {
    const target = mkTarget();
    const written = deployTestCaptureRoot(target, { templatesDir: TEMPLATES });

    expect(written).toEqual([...TEST_CAPTURE_ROOT_FILES]);
    for (const f of TEST_CAPTURE_ROOT_FILES) {
      expect(fs.existsSync(path.join(target, f)), `${f} should be at the project root`).toBe(true);
    }
  });

  it("deploys the pair so consort-test-reporter's `./consort-capture` import resolves", () => {
    // consort-test-reporter.ts imports from "./consort-capture" — the two files
    // are a pair and must land side-by-side at the root.
    const target = mkTarget();
    deployTestCaptureRoot(target, { templatesDir: TEMPLATES });
    const reporter = read(target, "consort-test-reporter.ts");
    expect(reporter).toMatch(/from "\.\/consort-capture"/);
    expect(fs.existsSync(path.join(target, "consort-capture.ts"))).toBe(true);
  });

  it("satisfies the client test surface's reach-up imports (../ and ../../consort-capture)", () => {
    // Deploy the client AND the root capture pair into the same target, then
    // confirm every root path the client references now exists — the exact
    // wiring that was dangling before the deploy step was added.
    const target = mkTarget();
    deployClientProject(target, "demoapp", { templatesDir: TEMPLATES });
    deployTestCaptureRoot(target, { templatesDir: TEMPLATES });

    // client/vite.config.ts wires setupFiles + the consort vitest reporter.
    const vite = read(target, "client/vite.config.ts");
    expect(vite).toMatch(/setupFiles:\s*"\.\/tests\/setup\.ts"/);
    expect(vite).toMatch(/consort-vitest-reporter\.ts/);
    // setup.ts reaches two dirs up to the root consort-capture.
    expect(read(target, "client/tests/setup.ts")).toMatch(/from "\.\.\/\.\.\/consort-capture"/);
    // the client vitest reporter reaches one dir up to the root consort-capture.
    expect(read(target, "client/consort-vitest-reporter.ts")).toMatch(/from "\.\.\/consort-capture"/);
    // client playwright names the root consort-test-reporter as a reporter.
    expect(read(target, "client/playwright.config.ts")).toMatch(/\.\.\/consort-test-reporter\.ts/);

    // Every one of those reach-up targets now resolves to a real root file.
    expect(fs.existsSync(path.join(target, "consort-capture.ts"))).toBe(true);
    expect(fs.existsSync(path.join(target, "consort-test-reporter.ts"))).toBe(true);
  });

  it("throws a clear kit-packaging error when a source template is missing", () => {
    const emptyTemplates = mkTarget();
    fs.mkdirSync(path.join(emptyTemplates, "common"), { recursive: true });
    const target = mkTarget();
    expect(() => deployTestCaptureRoot(target, { templatesDir: emptyTemplates })).toThrow(
      /Kit template missing/
    );
  });
});

describe("scaffoldAll wires the root capture pair by test surface", () => {
  it("lays the root capture files for a Python backend + React client (the escalation shape)", async () => {
    const dir = mkTarget();
    gitInit(dir);
    const result = await scaffoldAll({
      targetDir: dir,
      databricksHost: "https://h",
      lakebaseProjectId: "demoapp",
      language: "python",
      clientFramework: "react",
      runnerType: "github-hosted",
    });
    expect(result.testCapture).toEqual([...TEST_CAPTURE_ROOT_FILES]);
    // The exact files the client's vitest + playwright reach up to now exist.
    expect(fs.existsSync(path.join(dir, "consort-capture.ts"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "consort-test-reporter.ts"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "client", "consort-vitest-reporter.ts"))).toBe(true);
  });

  it("lays the root capture files for a Node backend (its root playwright config names them)", async () => {
    const dir = mkTarget();
    gitInit(dir);
    const result = await scaffoldAll({
      targetDir: dir,
      databricksHost: "https://h",
      lakebaseProjectId: "demoapp",
      language: "nodejs",
      clientFramework: "none",
      runnerType: "github-hosted",
    });
    expect(result.testCapture).toEqual([...TEST_CAPTURE_ROOT_FILES]);
    expect(fs.existsSync(path.join(dir, "consort-capture.ts"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "consort-test-reporter.ts"))).toBe(true);
  });

  it("skips them for a Python backend with no React client (conftest.py captures, no .ts imports)", async () => {
    const dir = mkTarget();
    gitInit(dir);
    const result = await scaffoldAll({
      targetDir: dir,
      databricksHost: "https://h",
      lakebaseProjectId: "demoapp",
      language: "python",
      clientFramework: "none",
      runnerType: "github-hosted",
    });
    expect(result.testCapture).toBeUndefined();
    expect(fs.existsSync(path.join(dir, "consort-capture.ts"))).toBe(false);
    expect(fs.existsSync(path.join(dir, "consort-test-reporter.ts"))).toBe(false);
  });
});
