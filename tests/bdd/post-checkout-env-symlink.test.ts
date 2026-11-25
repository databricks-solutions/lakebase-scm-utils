import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  symlinkSync,
  lstatSync,
  readlinkSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Anti-recurrence guard: the scaffolded post-checkout hook's update_env must
// keep a symlinked .env a symlink. With a workspace-root .env -> app/.env (the
// layout the scm extension uses), `mv .env.tmp .env` replaced the link with a
// regular file on every checkout: the root file got the new branch while the
// app's .env (what the app reads) stayed on the previous one.
//
// Runs the REAL update_env, extracted from the template, under bash in a
// throwaway directory.

const HOOK = path.resolve(
  __dirname,
  "..",
  "..",
  "templates",
  "project",
  "common",
  "scripts",
  "post-checkout.sh",
);

function runUpdateEnv(cwd: string): void {
  const script = `
set -e
eval "$(sed -n '/^update_env() {/,/^}/p' "$HOOK")"
PROJ_ID=proj-x PGAPPNAME=test DB_NAME=app
update_env new.host user@example.com tok new-branch
`;
  execFileSync("bash", ["-c", script], { cwd, env: { ...process.env, HOOK } });
}

describe("post-checkout update_env keeps a symlinked .env a symlink", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "pc-env-"));
    mkdirSync(path.join(dir, "app"));
    writeFileSync(
      path.join(dir, "app", ".env"),
      "KEEP_ME=1\nLAKEBASE_BRANCH_ID=old-branch\n",
    );
  });

  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("relative link: stays a link and the target gets the new branch", () => {
    symlinkSync("app/.env", path.join(dir, ".env"));
    runUpdateEnv(dir);
    expect(lstatSync(path.join(dir, ".env")).isSymbolicLink()).toBe(true);
    expect(readlinkSync(path.join(dir, ".env"))).toBe("app/.env");
    const env = readFileSync(path.join(dir, "app", ".env"), "utf8");
    expect(env).toContain("LAKEBASE_BRANCH_ID=new-branch");
    expect(env).not.toContain("old-branch");
    expect(env).toContain("KEEP_ME=1");
    expect(existsSync(path.join(dir, ".env.tmp"))).toBe(false);
  });

  it("absolute link: stays a link and the target gets the new branch", () => {
    symlinkSync(path.join(dir, "app", ".env"), path.join(dir, ".env"));
    runUpdateEnv(dir);
    expect(lstatSync(path.join(dir, ".env")).isSymbolicLink()).toBe(true);
    expect(readFileSync(path.join(dir, "app", ".env"), "utf8")).toContain(
      "LAKEBASE_BRANCH_ID=new-branch",
    );
  });

  it("plain .env (no link): still rewritten in place", () => {
    writeFileSync(path.join(dir, ".env"), "LAKEBASE_BRANCH_ID=old-branch\n");
    runUpdateEnv(dir);
    expect(lstatSync(path.join(dir, ".env")).isSymbolicLink()).toBe(false);
    expect(readFileSync(path.join(dir, ".env"), "utf8")).toContain(
      "LAKEBASE_BRANCH_ID=new-branch",
    );
  });
});
