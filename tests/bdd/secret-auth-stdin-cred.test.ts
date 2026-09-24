// A credential must NOT be passed as a command-line argument
// (visible in `ps` / process-accounting). `runDatabricks({ input })` feeds the
// value on STDIN instead. These tests use a FAKE `databricks` on PATH that records
// its argv + stdin, proving (a) the secret never reaches argv, (b) it arrives on
// stdin, (c) the JSON uses `string_value` (not the bytes_value the bare-stdin trap
// would produce), and (d) the stdin write is guarded (a child that ignores stdin
// must not crash the process with an uncaught EPIPE).

import { describe, it, expect, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { runDatabricks } from "../../scripts/lakebase/databricks-cli.js";

const SECRET = "PAT-super-secret-90day-value-DO-NOT-LEAK";
const tmpDirs: string[] = [];
let origPath: string | undefined;

/** Install a fake `databricks` on PATH. `mode`:
 *  - "capture": record argv + stdin to files, exit 0.
 *  - "ignore-stdin": exit 0 immediately WITHOUT reading stdin (exercises the EPIPE guard). */
function fakeDatabricks(mode: "capture" | "ignore-stdin"): { argvFile: string; stdinFile: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fake-databricks-"));
  tmpDirs.push(dir);
  const argvFile = path.join(dir, "argv.txt");
  const stdinFile = path.join(dir, "stdin.txt");
  const script =
    mode === "capture"
      ? `#!/bin/sh\nprintf '%s\\n' "$*" > ${JSON.stringify(argvFile)}\ncat > ${JSON.stringify(stdinFile)}\nexit 0\n`
      : `#!/bin/sh\nexit 0\n`;
  fs.writeFileSync(path.join(dir, "databricks"), script, { mode: 0o755 });
  origPath = process.env.PATH;
  process.env.PATH = `${dir}:${process.env.PATH}`;
  return { argvFile, stdinFile };
}

afterEach(() => {
  if (origPath !== undefined) process.env.PATH = origPath;
  origPath = undefined;
  while (tmpDirs.length) {
    const d = tmpDirs.pop();
    if (d) { try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* best effort */ } }
  }
});

describe("runDatabricks({ input }) keeps a credential off the command line", () => {
  it("the secret is fed on STDIN, never in argv", async () => {
    const { argvFile, stdinFile } = fakeDatabricks("capture");
    await runDatabricks(["secrets", "put-secret", "--json", "@/dev/stdin"], {
      noProfile: true,
      input: JSON.stringify({ scope: "s", key: "k", string_value: SECRET }),
    });
    const argv = fs.readFileSync(argvFile, "utf8");
    const stdin = fs.readFileSync(stdinFile, "utf8");

    // The credential must NOT appear on the command line (the whole point).
    expect(argv).not.toContain(SECRET);
    // argv is the safe, credential-free shape.
    expect(argv).toContain("--json");
    expect(argv).toContain("@/dev/stdin");
    // The secret arrives on stdin, as string_value (NOT bytes_value — the bare-stdin trap).
    expect(stdin).toContain(SECRET);
    expect(JSON.parse(stdin)).toMatchObject({ scope: "s", key: "k", string_value: SECRET });
    expect(stdin).not.toContain("bytes_value");
  });

  it("guards the stdin write: a child that ignores stdin resolves, no uncaught EPIPE", async () => {
    fakeDatabricks("ignore-stdin");
    // A large body makes an unguarded write far more likely to EPIPE before drain.
    await expect(
      runDatabricks(["secrets", "put-secret", "--json", "@/dev/stdin"], {
        noProfile: true,
        input: JSON.stringify({ scope: "s", key: "k", string_value: SECRET.repeat(20000) }),
      }),
    ).resolves.toBeTypeOf("string");
  });
});
