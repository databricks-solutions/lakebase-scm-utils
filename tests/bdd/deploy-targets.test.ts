import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
import {
  parseTargetsYaml,
  readTargets,
  writeTargets,
  getTargetNames,
  type DeployTargetsConfig,
} from "../../scripts/lakebase/deploy-targets";

let workspace: string;

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), "deploy-targets-"));
});

afterEach(() => {
  rmSync(workspace, { recursive: true, force: true });
});

const MINIMAL_YAML = `targets:
  dev:
    workspace_profile: DEFAULT
    workspace_path: /Users/me/apps/my-app
    app_name: my-app-dev
    lakebase_project: proj-checkout
    lakebase_branch: feature-add-orders
`;

const FULL_YAML = `targets:
  dev:
    workspace_profile: DEFAULT
    workspace_path: /Users/me/apps/my-app
    app_name: my-app-dev
    lakebase_project: proj-checkout
    lakebase_branch: feature-add-orders
    uc_catalog: my_catalog
    uc_schema: my_schema
    uc_volume: my_volume
    lakebase_secret_scope: my-scope
    lakebase_secret_key: db-pat
    ai_model: claude-opus-4-7
  prod:
    workspace_profile: PROD
    workspace_path: /Workspaces/prod/my-app
    app_name: my-app
    lakebase_project: proj-checkout
    lakebase_branch: production
`;

describe("parseTargetsYaml", () => {
  it("parses a minimal single target with required fields only", () => {
    const config = parseTargetsYaml(MINIMAL_YAML);
    expect(Object.keys(config.targets)).toEqual(["dev"]);
    expect(config.targets.dev).toEqual({
      workspace_profile: "DEFAULT",
      workspace_path: "/Users/me/apps/my-app",
      app_name: "my-app-dev",
      lakebase_project: "proj-checkout",
      lakebase_branch: "feature-add-orders",
    });
  });

  it("parses optional UC + secret + ai_model fields when present", () => {
    const config = parseTargetsYaml(FULL_YAML);
    expect(config.targets.dev.uc_catalog).toBe("my_catalog");
    expect(config.targets.dev.uc_schema).toBe("my_schema");
    expect(config.targets.dev.uc_volume).toBe("my_volume");
    expect(config.targets.dev.lakebase_secret_scope).toBe("my-scope");
    expect(config.targets.dev.lakebase_secret_key).toBe("db-pat");
    expect(config.targets.dev.ai_model).toBe("claude-opus-4-7");
  });

  it("parses multiple targets in one file", () => {
    const config = parseTargetsYaml(FULL_YAML);
    expect(Object.keys(config.targets).sort()).toEqual(["dev", "prod"]);
    expect(config.targets.prod.workspace_profile).toBe("PROD");
    expect(config.targets.prod.lakebase_branch).toBe("production");
    // prod is minimal — no optional fields.
    expect(config.targets.prod.uc_catalog).toBeUndefined();
  });

  it("ignores comments and blank lines", () => {
    const config = parseTargetsYaml(`# top comment
targets:
  # before target
  dev:
    # inside target
    workspace_profile: DEFAULT
    workspace_path: /tmp/x
    app_name: x
    lakebase_project: p
    lakebase_branch: b

# trailing
`);
    expect(config.targets.dev.workspace_profile).toBe("DEFAULT");
  });

  it("tolerates double-quoted values", () => {
    const config = parseTargetsYaml(`targets:
  dev:
    workspace_profile: "DEFAULT"
    workspace_path: "/Users/me/apps/x"
    app_name: "x"
    lakebase_project: "p"
    lakebase_branch: "b"
`);
    expect(config.targets.dev.workspace_profile).toBe("DEFAULT");
    expect(config.targets.dev.workspace_path).toBe("/Users/me/apps/x");
  });

  it("returns an empty targets object when input has no targets", () => {
    const config = parseTargetsYaml(`targets:\n`);
    expect(config.targets).toEqual({});
  });
});

describe("readTargets", () => {
  it("returns null when the workspace has no deploy-targets.yaml", () => {
    expect(readTargets(workspace)).toBeNull();
  });

  it("reads + parses an existing deploy-targets.yaml", () => {
    writeFileSync(join(workspace, "deploy-targets.yaml"), MINIMAL_YAML);
    const config = readTargets(workspace);
    expect(config?.targets.dev.app_name).toBe("my-app-dev");
  });
});

describe("writeTargets", () => {
  it("writes a config that round-trips through readTargets", () => {
    const original: DeployTargetsConfig = parseTargetsYaml(FULL_YAML);
    writeTargets(original, workspace);
    const round = readTargets(workspace);
    expect(round?.targets).toEqual(original.targets);
  });

  it("only emits optional fields when they have a value", () => {
    writeTargets(parseTargetsYaml(MINIMAL_YAML), workspace);
    const written = readFileSync(join(workspace, "deploy-targets.yaml"), "utf-8");
    expect(written).not.toContain("uc_catalog");
    expect(written).not.toContain("ai_model");
    expect(written).toContain("workspace_profile: DEFAULT");
  });
});

describe("getTargetNames", () => {
  it("returns the target names from a real file", () => {
    writeFileSync(join(workspace, "deploy-targets.yaml"), FULL_YAML);
    expect(getTargetNames(workspace).sort()).toEqual(["dev", "prod"]);
  });

  it("returns an empty array when no file exists", () => {
    expect(getTargetNames(workspace)).toEqual([]);
  });
});

describe("the shipped deploy-targets.yaml template", () => {
  it("uses 127.0.0.1 (not localhost) for the local base_url so the reachability poll matches the IPv4-bound app", () => {
    // Regression guard for the localhost->::1 stall: the deploy/verify probe fetches
    // base_url; on macOS `localhost` resolves to IPv6 ::1 first, but the app binds IPv4
    // (uvicorn default 127.0.0.1), so a localhost base_url reports "not reachable after
    // 60s" against a perfectly healthy app.
    const tpl = readFileSync(
      join(__dirname, "..", "..", "templates", "project", "common", "deploy-targets.yaml"),
      "utf-8",
    );
    expect(tpl).toMatch(/base_url:\s*http:\/\/127\.0\.0\.1:8000/);
    expect(tpl).not.toMatch(/base_url:\s*http:\/\/localhost:/);
  });

  it("probes /health, not / (which is the SPA catch-all that 404s when client/dist is unbuilt)", () => {
    // Regression (pm23): health_path "/" hit the React SPA catch-all, which mounts only when
    // client/dist exists — so in the build lane "/" 404s and readiness false-negatives even
    // though the app is healthy. /health answers 200 in every lane.
    const tpl = readFileSync(
      join(__dirname, "..", "..", "templates", "project", "common", "deploy-targets.yaml"),
      "utf-8",
    );
    expect(tpl).toMatch(/health_path:\s*\/health\b/);
    expect(tpl).not.toMatch(/health_path:\s*\/\s*$/m); // never a bare "/"
  });
});
