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
