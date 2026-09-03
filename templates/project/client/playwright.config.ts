import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";

// End-to-end tests drive the rendered SPA through a real browser against the
// real backend, backed by the paired Lakebase branch. Playwright boots BOTH
// servers: the backend FIRST (so Vite's /api proxy has a target), then Vite.
// Adapt the backend `command`/`url` to your stack if it is not Python/FastAPI.
//
// Resiliency: the ports are env-driven (E2E_BACKEND_PORT / E2E_CLIENT_PORT) with
// the conventional defaults. In CI (reuseExistingServer:false), a stale server
// left on 8000/5173 by a prior run would otherwise make webServer hard-fail with
// "port already used". So CI's E2E step allocates FREE ports (scripts/port-utils.sh,
// the same probe run-dev.sh uses) and hands them in here , the run moves off a
// busy port instead of colliding. The Vite proxy is pointed at the resolved
// backend port via VITE_PROXY_TARGET so /api + /health still reach the backend.
const BACKEND_PORT = process.env.E2E_BACKEND_PORT ?? "8000";
const CLIENT_PORT = process.env.E2E_CLIENT_PORT ?? "5173";
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const CLIENT_URL = `http://localhost:${CLIENT_PORT}`;

// Backend stack detection (mirrors scripts/run-tests.sh): the backend lives at the project root,
// one level up from this client/ config (Playwright runs from client/, hence cwd:".." below). Pick
// the migrate-before-serve command + health URL for the detected stack so E2E boots on ANY language
// , a nodejs scaffold otherwise inherited the Python (alembic/uvicorn) command and could not start.
const ROOT = join(process.cwd(), "..");
function backendWebServer(): { command: string; url: string } {
  if (existsSync(join(ROOT, "pom.xml"))) {
    // Java/Kotlin (Spring): flyway migrate, then boot on the resolved port.
    return {
      command: `../mvnw -q flyway:migrate && ../mvnw -q spring-boot:run -Dspring-boot.run.arguments=--server.port=${BACKEND_PORT}`,
      url: `${BACKEND_URL}/actuator/health`,
    };
  }
  if (
    existsSync(join(ROOT, "package.json")) &&
    !existsSync(join(ROOT, "pyproject.toml")) &&
    !existsSync(join(ROOT, "requirements.txt"))
  ) {
    // Node.js backend: migrate-before-serve, then start on the resolved port.
    return {
      command: `npm --prefix .. run migrate && PORT=${BACKEND_PORT} npm --prefix .. run start`,
      url: `${BACKEND_URL}/health`,
    };
  }
  // Python/FastAPI (default): alembic upgrade, then uvicorn.
  return {
    command: `uv run --project .. alembic upgrade head && uv run --project .. uvicorn app.main:app --port ${BACKEND_PORT}`,
    url: `${BACKEND_URL}/health`,
  };
}
const backend = backendWebServer();

export default defineConfig({
  testDir: "./tests/e2e",
  // Serialize specs when they share real-DB state via a seed/restore step.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: CLIENT_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      // Backend, language-aware (see backendWebServer above): migrate BEFORE serving so the e2e
      // always runs against the CURRENT schema , the write paths a new story adds (e.g. a fresh
      // table) exist. python -> alembic+uvicorn; nodejs -> npm run migrate+start; java/kotlin ->
      // flyway+spring-boot. The stack is detected from the project root's build files.
      command: backend.command,
      url: backend.url,
      cwd: "..",
      // NEVER reuse the backend across e2e runs: a server started before a later story's
      // migration serves a STALE schema (GET succeeds against the old table; a write to the
      // new table 500s), and reuse skips the `alembic upgrade head` above. Always restart so
      // the command re-migrates + serves the current schema. The frontend has no schema, so it
      // keeps reuse for local speed.
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        DATABRICKS_HOST: process.env.DATABRICKS_HOST ?? "",
        DATABRICKS_TOKEN: process.env.DATABRICKS_TOKEN ?? "",
        // Pin the served DB so `alembic upgrade head` (migrate-before-serve) and uvicorn
        // resolve the SAME database. run-tests.sh exports DATABASE_URL (the ephemeral
        // VERIFY_DATABASE_URL when the substrate provides one, else the branch DB); the
        // Playwright webServer command does NOT inherit it unless set here, so alembic could
        // migrate a different DB than uvicorn serves , leaving the served schema missing a
        // story's new table (-> the reconcile 500). Only forward when set (keep the env clean).
        ...(process.env.DATABASE_URL ? { DATABASE_URL: process.env.DATABASE_URL } : {}),
        ...(process.env.VERIFY_DATABASE_URL ? { VERIFY_DATABASE_URL: process.env.VERIFY_DATABASE_URL } : {}),
      },
    },
    {
      command: `npm run dev -- --port ${CLIENT_PORT} --strictPort`,
      url: CLIENT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      // Point the Vite dev proxy at the resolved backend port so /api + /health
      // reach the backend even when it moved off the default 8000.
      env: {
        VITE_PROXY_TARGET: BACKEND_URL,
      },
    },
  ],
});
