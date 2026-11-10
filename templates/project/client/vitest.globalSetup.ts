// Vitest global setup — boot a REAL backend for the component suite.
//
// Kit principle: never mock when a real counterpart exists. Client component tests must hit the
// REAL backend over the REAL `/api` boundary (which hits the real paired-branch DB), exactly like
// production — the client never gets direct DB access. This mirrors `playwright.config.ts`'s backend
// webServer: migrate the branch, serve the app on a free 127.0.0.1 port, wait for health, and
// publish the base URL to `.consort/.vitest-backend` for the fetch shim in `tests/setup.ts`. Torn
// down after the run. Language-aware (python / node / java), same detection as the Playwright config.
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";

const ROOT = join(process.cwd(), ".."); // vitest runs from client/
const CLIENT = join(ROOT, "client");
const BASE_FILE = join(ROOT, ".consort", ".vitest-backend");

// True iff the project has at least one component test (`*.test.tsx|ts` under client/src or
// client/tests, excluding the Playwright `tests/e2e/` dir). When there are none, booting a backend
// is pure waste and an avoidable failure surface — so the setup is a no-op (returns early). This is
// what keeps a component-less project (e.g. one whose UI is all Playwright E2E) from paying for, or
// failing on, a backend boot it never uses.
function hasComponentTests(): boolean {
  const stack: string[] = [join(CLIENT, "src"), join(CLIENT, "tests")];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const e of entries) {
      const abs = join(dir, e);
      if (abs.replace(/\\/g, "/").includes("/tests/e2e")) continue; // Playwright's, not Vitest's
      let st;
      try {
        st = statSync(abs);
      } catch {
        continue;
      }
      if (st.isDirectory()) stack.push(abs);
      else if (/\.test\.(ts|tsx|js|jsx)$/.test(e)) return true;
    }
  }
  return false;
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      srv.close(() => resolve(port));
    });
  });
}

// migrate-before-serve command + health URL for the detected stack (mirrors the Playwright config).
function backend(port: number): { shell: string; health: string } {
  if (existsSync(join(ROOT, "pom.xml"))) {
    return {
      shell: `./mvnw -q flyway:migrate && ./mvnw -q spring-boot:run -Dspring-boot.run.arguments=--server.port=${port}`,
      health: `http://127.0.0.1:${port}/actuator/health`,
    };
  }
  if (
    existsSync(join(ROOT, "package.json")) &&
    !existsSync(join(ROOT, "pyproject.toml")) &&
    !existsSync(join(ROOT, "requirements.txt"))
  ) {
    return { shell: `npm run migrate && PORT=${port} npm run start`, health: `http://127.0.0.1:${port}/health` };
  }
  return {
    shell: `uv run alembic upgrade head && uv run uvicorn app.main:app --host 127.0.0.1 --port ${port}`,
    health: `http://127.0.0.1:${port}/health`,
  };
}

let proc: ChildProcess | undefined;

export default async function setup(ctx?: { provide?: (k: string, v: unknown) => void }): Promise<() => Promise<void>> {
  if (!hasComponentTests()) {
    // No component tests → nothing to serve a backend for. No-op teardown.
    return async () => {};
  }
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const { shell, health } = backend(port);
  // CAPTURE the backend's stdout+stderr (not stdio:"ignore") so a boot failure — an unauthorized/expired
  // Lakebase token, a migration error, an app-import crash — is SURFACED in the thrown error instead of
  // swallowed into an undiagnosable "did not become healthy within 120s". The captured tail also carries
  // the real cause (e.g. an auth signature) into the vitest output -> the drive's verify summary, so the
  // orchestrator can classify an auth expiry (re-authenticate) rather than mislabel it a test regression.
  const BOOT_CAPTURE_MAX = 4000;
  let bootOutput = "";
  const capture = (d: Buffer): void => {
    bootOutput += d.toString();
    if (bootOutput.length > BOOT_CAPTURE_MAX) bootOutput = bootOutput.slice(-BOOT_CAPTURE_MAX);
  };
  proc = spawn("bash", ["-c", shell], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env } });
  proc.stdout?.on("data", capture);
  proc.stderr?.on("data", capture);
  let exitedCode: number | null = null;
  let exited = false;
  proc.on("exit", (code) => {
    exited = true;
    exitedCode = code;
  });
  const tail = (): string => `\n--- backend boot output (tail) ---\n${bootOutput.trim() || "(no output captured)"}`;

  const deadline = Date.now() + 120_000;
  for (;;) {
    try {
      const r = await fetch(health);
      if (r.ok) break;
    } catch {
      /* backend not up yet */
    }
    // Fail FAST if the backend process died before becoming healthy (migration/import/crash), with its
    // output — instead of waiting out the full 120s for a process that will never answer.
    if (exited) {
      throw new Error(`vitest: backend exited (code ${exitedCode}) before becoming healthy at ${health}.${tail()}`);
    }
    if (Date.now() > deadline) {
      if (proc && !proc.killed) proc.kill("SIGTERM");
      throw new Error(`vitest: backend did not become healthy at ${health} within 120s.${tail()}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  mkdirSync(join(ROOT, ".consort"), { recursive: true });
  writeFileSync(BASE_FILE, base); // the fetch shim reads this (pool-agnostic)
  ctx?.provide?.("consortApiBase", base);

  return async () => {
    try {
      rmSync(BASE_FILE);
    } catch {
      /* already gone */
    }
    if (proc && !proc.killed) proc.kill("SIGTERM");
  };
}
