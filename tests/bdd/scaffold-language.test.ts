import { describe, it, expect, afterEach, beforeEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { deployLanguageProject } from "../../scripts/lakebase/scaffold-language.js";

const tmpDirs: string[] = [];
afterEach(() => {
  while (tmpDirs.length) {
    const dir = tmpDirs.pop();
    if (dir) try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* */ }
  }
});
function mkTmp(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbscm-lang-"));
  tmpDirs.push(dir);
  return dir;
}

describe("deployLanguageProject – python path (static copy)", () => {
  it("copies the python template tree into targetDir", async () => {
    const dir = mkTmp();
    await deployLanguageProject({ targetDir: dir, language: "python", projectName: "py-test" });
    // Python template ships app/main.py, pyproject.toml, alembic/, etc.
    expect(fs.existsSync(path.join(dir, "pyproject.toml"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "app", "main.py"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "alembic", "env.py"))).toBe(true);
    // Should NOT copy .gitignore.extra (skipped by copyDirSubstituted)
    expect(fs.existsSync(path.join(dir, ".gitignore.extra"))).toBe(false);
  });

  it("substitutes {{PROJECT_NAME}} placeholders", async () => {
    const dir = mkTmp();
    await deployLanguageProject({ targetDir: dir, language: "python", projectName: "my-cool-app" });
    // Spot-check pyproject.toml or any other file with placeholders
    const pyproject = fs.readFileSync(path.join(dir, "pyproject.toml"), "utf-8");
    expect(pyproject).not.toMatch(/\{\{PROJECT_NAME\}\}/);
  });

  it("scaffolds a `make run` that honors the deploy-injected $PORT (not a hardcoded :8000)", async () => {
    // Regression (pm22): the run target used to be `uvicorn app.main:app` with NO --port,
    // so uvicorn always bound its default :8000 and IGNORED the $PORT the deploy/verify
    // injects when it relocates off a busy port — nothing listened on the relocated port
    // (:8001, because :8000 was squatted by a neighbor project) → "not reachable after 60s".
    // The deploy-targets.yaml contract requires `run` to bind $PORT; the app is otherwise
    // healthy. It also binds 127.0.0.1 to match the base_url (no localhost->::1 stall).
    const dir = mkTmp();
    await deployLanguageProject({ targetDir: dir, language: "python", projectName: "port-test" });
    const mk = fs.readFileSync(path.join(dir, "Makefile"), "utf-8");
    const runRecipe = mk.split("\n").find((l) => l.includes("uvicorn app.main:app")) ?? "";
    expect(runRecipe).toMatch(/--port \$\$\{PORT:-8000\}/); // honors injected PORT, defaults to 8000
    expect(runRecipe).toMatch(/--host 127\.0\.0\.1/);
    expect(mk).not.toMatch(/uvicorn app\.main:app\s*$/m); // never the portless form that hardcodes :8000
    // pm23 root cause: a SINGLE `$` makes `make` read `${PORT:-8000}` as a make-variable
    // named `PORT:-8000` (undefined -> empty), so uvicorn gets `--port ` with no argument
    // ("Option '--port' requires an argument") and never boots -> the verify polls the
    // relocated port for 60s and false-negatives. The `$` MUST be doubled (`$$`) so make
    // passes `${PORT:-8000}` to the shell, which does the default-value expansion.
    expect(runRecipe, "the $ must be doubled ($$) or make eats it before the shell sees it")
      .not.toMatch(/(?<!\$)\$\{PORT:-8000\}/);
  });
});

describe("deployLanguageProject – nodejs path", () => {
  it("copies the nodejs template tree into targetDir", async () => {
    const dir = mkTmp();
    await deployLanguageProject({ targetDir: dir, language: "nodejs", projectName: "node-test" });
    expect(fs.existsSync(path.join(dir, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "src", "index.js"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "knexfile.js"))).toBe(true);
  });
});

describe("deployLanguageProject – java/kotlin path (Initializr w/ fallback)", () => {
  const originalFlag = process.env.LAKEBASE_SCAFFOLD_FALLBACK;
  beforeEach(() => { process.env.LAKEBASE_SCAFFOLD_FALLBACK = "1"; });
  afterEach(() => {
    if (originalFlag === undefined) delete process.env.LAKEBASE_SCAFFOLD_FALLBACK;
    else process.env.LAKEBASE_SCAFFOLD_FALLBACK = originalFlag;
  });

  it("routes java -> Spring fallback when flag set", async () => {
    const dir = mkTmp();
    await deployLanguageProject({ targetDir: dir, language: "java", projectName: "java-test" });
    expect(fs.existsSync(path.join(dir, "pom.xml"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "mvnw"))).toBe(true);
  });

  it("routes kotlin -> Spring fallback when flag set", async () => {
    const dir = mkTmp();
    await deployLanguageProject({ targetDir: dir, language: "kotlin", projectName: "kotlin-test" });
    expect(fs.existsSync(path.join(dir, "pom.xml"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "mvnw"))).toBe(true);
  });
});
