// Finding 26 (FEIP-8051): run-tests.sh SFTDD_CLIENT_ONLY runs ONLY the client
// Vitest block and skips the backend suite, so the build's honest-GREEN verify can
// gate on the SAME client tests the deploy feature-verify runs (the marked pytest
// two-pass short-circuits before the client block). Functional: a real bash run
// against a stub `client` npm test, no uv/pytest/vitest needed.

import { describe, it, expect, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUN_TESTS_SRC = path.resolve(
  __dirname, "..", "..", "templates", "project", "common", "scripts", "run-tests.sh",
);

const tmpDirs: string[] = [];
afterEach(() => {
  while (tmpDirs.length) {
    const d = tmpDirs.pop();
    if (d) try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* */ }
  }
});

/** A Python + client project tree with the real run-tests.sh installed and a stub
 *  client `npm test` that echoes a marker. No backend tooling (uv/pytest) present,
 *  so a run that does NOT skip the backend would fail loudly. */
function scaffold(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "run-tests-client-"));
  tmpDirs.push(root);
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.copyFileSync(RUN_TESTS_SRC, path.join(root, "scripts", "run-tests.sh"));
  fs.writeFileSync(path.join(root, ".env"), "LAKEBASE_PROJECT_ID=x\n");
  // A Python backend marker: without SFTDD_CLIENT_ONLY the script would try to run
  // `uv run alembic upgrade head` (absent here) and fail.
  fs.writeFileSync(path.join(root, "pyproject.toml"), "[project]\nname = 'x'\n");
  // Client workspace with a stub test script + a present node_modules so the
  // script's auto-install branch is skipped.
  const client = path.join(root, "client");
  fs.mkdirSync(path.join(client, "node_modules"), { recursive: true });
  fs.writeFileSync(
    path.join(client, "package.json"),
    JSON.stringify({ name: "client", scripts: { test: "echo CLIENT_VITEST_RAN" } }) + "\n",
  );
  return root;
}

function run(root: string, env: NodeJS.ProcessEnv): { ok: boolean; out: string } {
  try {
    const out = execFileSync("bash", ["scripts/run-tests.sh"], {
      cwd: root, encoding: "utf8", env: { ...process.env, ...env },
    });
    return { ok: true, out };
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return { ok: false, out: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

describe("run-tests.sh SFTDD_CLIENT_ONLY (Finding 26)", () => {
  it("runs only the client suite and skips the backend", () => {
    const root = scaffold();
    const { ok, out } = run(root, { SFTDD_CLIENT_ONLY: "1" });
    expect(ok).toBe(true);
    expect(out).toMatch(/Client-only pass/);
    expect(out).toMatch(/CLIENT_VITEST_RAN/);
    // The backend suite must NOT run (no Alembic migration step).
    expect(out).not.toMatch(/Running Alembic migrations/);
  });

  it("propagates a client test failure as a non-zero exit (refuses GREEN)", () => {
    const root = scaffold();
    // Make the stub client test fail.
    fs.writeFileSync(
      path.join(root, "client", "package.json"),
      JSON.stringify({ name: "client", scripts: { test: "exit 1" } }) + "\n",
    );
    const { ok } = run(root, { SFTDD_CLIENT_ONLY: "1" });
    expect(ok).toBe(false);
  });
});

/** scaffold() + a client Playwright E2E surface: a playwright config, an e2e spec, a `test:e2e`
 *  script, and a STUB `playwright` bin so `./node_modules/.bin/playwright install chromium` is an
 *  offline no-op in the test (no real browser download). */
function scaffoldWithClientE2e(opts: { e2eScript?: string; withConfig?: boolean } = {}): string {
  const root = scaffold();
  const client = path.join(root, "client");
  fs.writeFileSync(
    path.join(client, "package.json"),
    JSON.stringify({
      name: "client",
      scripts: { test: "echo CLIENT_VITEST_RAN", "test:e2e": opts.e2eScript ?? "echo CLIENT_E2E_RAN" },
    }) + "\n",
  );
  fs.mkdirSync(path.join(client, "tests", "e2e"), { recursive: true });
  fs.writeFileSync(path.join(client, "tests", "e2e", "S1.spec.ts"), "// client e2e spec\n");
  if (opts.withConfig !== false) {
    fs.writeFileSync(path.join(client, "playwright.config.ts"), "export default {};\n");
  }
  const binDir = path.join(client, "node_modules", ".bin");
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(path.join(binDir, "playwright"), "#!/bin/sh\nexit 0\n");
  fs.chmodSync(path.join(binDir, "playwright"), 0o755);
  return root;
}

describe("run-tests.sh client Playwright E2E (runs in the LOCAL loop, not CI-only)", () => {
  it("runs the client E2E under SFTDD_CLIENT_ONLY (the false-green gap: it used to be deferred to CI)", () => {
    const root = scaffoldWithClientE2e();
    const { ok, out } = run(root, { SFTDD_CLIENT_ONLY: "1" });
    expect(ok).toBe(true);
    expect(out).toMatch(/CLIENT_VITEST_RAN/); // unit suite still runs
    expect(out).toMatch(/Running client E2E \(Playwright\)/);
    expect(out).toMatch(/CLIENT_E2E_RAN/); // the E2E ACTUALLY runs now
  });

  it("propagates a client E2E failure as non-zero (refuses GREEN - the Driver gets its RED)", () => {
    const root = scaffoldWithClientE2e({ e2eScript: "exit 1" });
    const { ok } = run(root, { SFTDD_CLIENT_ONLY: "1" });
    expect(ok).toBe(false);
  });

  it("HARD STOP: client E2E specs present but NO playwright config - refuses a hollow pass", () => {
    const root = scaffoldWithClientE2e({ withConfig: false });
    const { ok, out } = run(root, { SFTDD_CLIENT_ONLY: "1" });
    expect(ok).toBe(false);
    expect(out).toMatch(/refusing a hollow pass/);
    expect(out).toMatch(/S1\.spec\.ts/); // names the spec that could not run
  });

  // COST GATE: the slow client E2E runs only when RELEVANT to the cycle. The drive passes the
  // open cycle's layer as CONSORT_CYCLE_LAYER; a non-E2E (backend/API) cycle SKIPS the E2E so
  // every per-cycle re-verify does not re-pay it. Vitest still runs (fast). FAIL-SAFE: unset or
  // E2E => run (the deploy gate + E2E cycles); only an explicit non-E2E layer skips.
  it("SKIPS the client E2E on a non-E2E cycle (CONSORT_CYCLE_LAYER=API) - Vitest still runs", () => {
    const root = scaffoldWithClientE2e();
    const { ok, out } = run(root, { SFTDD_CLIENT_ONLY: "1", CONSORT_CYCLE_LAYER: "API" });
    expect(ok).toBe(true);
    expect(out).toMatch(/CLIENT_VITEST_RAN/); // the fast client unit suite still runs
    expect(out).not.toMatch(/Running client E2E \(Playwright\)/); // the slow E2E is skipped
    expect(out).not.toMatch(/CLIENT_E2E_RAN/);
  });

  it("RUNS the client E2E on an E2E-layer cycle (CONSORT_CYCLE_LAYER=E2E)", () => {
    const root = scaffoldWithClientE2e();
    const { ok, out } = run(root, { SFTDD_CLIENT_ONLY: "1", CONSORT_CYCLE_LAYER: "E2E" });
    expect(ok).toBe(true);
    expect(out).toMatch(/Running client E2E \(Playwright\)/);
    expect(out).toMatch(/CLIENT_E2E_RAN/);
  });

  it("FAIL-SAFE: an UNSET layer (deploy-verify gate) still runs the full client E2E", () => {
    const root = scaffoldWithClientE2e();
    // No CONSORT_CYCLE_LAYER: the deploy feature-verify + any un-scoped full run. Must NOT skip.
    const { ok, out } = run(root, { SFTDD_CLIENT_ONLY: "1" });
    expect(ok).toBe(true);
    expect(out).toMatch(/Running client E2E \(Playwright\)/);
    expect(out).toMatch(/CLIENT_E2E_RAN/);
  });
});

/** Base fixture: run-tests.sh + .env only. Callers add the pieces each case needs.
 *  The false-GREEN guard runs FAIL-FAST (before language detection / any backend),
 *  so these cases need no backend tooling to exercise it. */
function scaffoldBare(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "run-tests-orphan-"));
  tmpDirs.push(root);
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.copyFileSync(RUN_TESTS_SRC, path.join(root, "scripts", "run-tests.sh"));
  fs.writeFileSync(path.join(root, ".env"), "LAKEBASE_PROJECT_ID=x\n");
  return root;
}

describe("run-tests.sh false-GREEN guard: client tests present with no client scaffold", () => {
  it("FAILS fast when client test files exist but there is no client/package.json", () => {
    const root = scaffoldBare();
    // A client SPA was never scaffolded (no client/package.json), yet a client-owned
    // test was authored against it , the false-GREEN condition.
    fs.mkdirSync(path.join(root, "client", "tests", "pages"), { recursive: true });
    fs.writeFileSync(
      path.join(root, "client", "tests", "pages", "StockList.test.tsx"),
      "// orphan client test , no client/package.json exists to run it\n",
    );
    const { ok, out } = run(root, {});
    expect(ok).toBe(false); // refuses to report a hollow pass
    expect(out).toMatch(/no client\/package\.json to run them/);
    expect(out).toMatch(/false GREEN/);
    expect(out).toMatch(/StockList\.test\.tsx/); // names the orphan file
  });

  it("also catches an orphaned e2e *.spec.ts (not only *.test.tsx)", () => {
    const root = scaffoldBare();
    fs.mkdirSync(path.join(root, "client", "tests", "e2e"), { recursive: true });
    fs.writeFileSync(
      path.join(root, "client", "tests", "e2e", "S1-file-stock-record.spec.ts"),
      "// orphan e2e spec, no client scaffold\n",
    );
    const { ok, out } = run(root, {});
    expect(ok).toBe(false);
    expect(out).toMatch(/no client\/package\.json to run them/);
  });

  it("does NOT trip a backend-only project (no client/ dir at all)", () => {
    const root = scaffoldBare();
    // A valid backend marker so this is a real project; no client/ dir exists.
    fs.writeFileSync(path.join(root, "pyproject.toml"), "[project]\nname = 'x'\n");
    const { out } = run(root, {});
    // The guard must be absent regardless of whether the (untooled) backend then runs.
    expect(out).not.toMatch(/no client\/package\.json to run them/);
  });

  it("does NOT trip a real client project (client/package.json present)", () => {
    const root = scaffoldBare();
    const client = path.join(root, "client");
    fs.mkdirSync(path.join(client, "tests"), { recursive: true });
    fs.writeFileSync(path.join(client, "package.json"), JSON.stringify({ name: "client", scripts: { test: "echo ok" } }) + "\n");
    fs.writeFileSync(path.join(client, "tests", "x.test.tsx"), "// real client test\n");
    const { out } = run(root, {});
    expect(out).not.toMatch(/no client\/package\.json to run them/);
  });
});
