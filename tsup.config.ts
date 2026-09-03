import { defineConfig, type Options } from "tsup";
import { readFileSync } from "node:fs";

// This package's version, read at build time and inlined into the bundle via esbuild `define`
// (consumed by scripts/lakebase/self-version.ts) so the connection application_name label survives
// bundling (a webpacked extension host can't locate our package.json at runtime).
const SELF_VERSION = (JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as { version: string }).version;

// Dual-format build: emit both ESM (.js, since package.json type=module) and
// CJS (.cjs) so the lakebase-scm-extension (CommonJS + webpack) can consume
// without ESM-interop pain on default imports of CJS deps like tweetsodium.
//
// Output structure mirrors the source so the package.json exports map keeps
// stable paths like ./dist/scripts/lakebase/index.{js,cjs}.

const entry = {
  "scripts/index": "scripts/index.ts",
  "scripts/github/index": "scripts/github/index.ts",
  "scripts/lakebase/index": "scripts/lakebase/index.ts",
  "scripts/git/index": "scripts/git/index.ts",
  "scripts/util/index": "scripts/util/index.ts",
  "scripts/github/auth.cli": "scripts/github/auth.cli.ts",
  "scripts/github/pr.cli": "scripts/github/pr.cli.ts",
  "scripts/lakebase/get-connection.cli": "scripts/lakebase/get-connection.cli.ts",
  "scripts/lakebase/schema-diff.cli": "scripts/lakebase/schema-diff.cli.ts",
  "scripts/lakebase/schema-migrate.cli": "scripts/lakebase/schema-migrate.cli.ts",
  "scripts/lakebase/new-migration.cli": "scripts/lakebase/new-migration.cli.ts",
  "scripts/lakebase/collapse-heads.cli": "scripts/lakebase/collapse-heads.cli.ts",
  "scripts/lakebase/infra-runner.cli": "scripts/lakebase/infra-runner.cli.ts",
  "scripts/lakebase/cut-backup.cli": "scripts/lakebase/cut-backup.cli.ts",
  "scripts/lakebase/cut-tier.cli": "scripts/lakebase/cut-tier.cli.ts",
  "scripts/lakebase/detect-language.cli": "scripts/lakebase/detect-language.cli.ts",
  "scripts/lakebase/resolve-profile.cli": "scripts/lakebase/resolve-profile.cli.ts",
  "scripts/lakebase/ci-app-endpoint.cli": "scripts/lakebase/ci-app-endpoint.cli.ts",
  "scripts/lakebase/ci-resolve-branch.cli": "scripts/lakebase/ci-resolve-branch.cli.ts",
  "scripts/lakebase/branch.cli": "scripts/lakebase/branch.cli.ts",
  "scripts/lakebase/doctor.cli": "scripts/lakebase/doctor.cli.ts",
  "scripts/lakebase/scm-state.cli": "scripts/lakebase/scm-state.cli.ts",
  "scripts/lakebase/scm-claim-feature.cli": "scripts/lakebase/scm-claim-feature.cli.ts",
  "scripts/lakebase/scm-adopt-state.cli": "scripts/lakebase/scm-adopt-state.cli.ts",
  "scripts/lakebase/scm-abandon-feature.cli": "scripts/lakebase/scm-abandon-feature.cli.ts",
  "scripts/lakebase/scm-prepare-pr.cli": "scripts/lakebase/scm-prepare-pr.cli.ts",
  "scripts/lakebase/scm-wait-ci.cli": "scripts/lakebase/scm-wait-ci.cli.ts",
  "scripts/lakebase/scm-merge.cli": "scripts/lakebase/scm-merge.cli.ts",
  "scripts/lakebase/scm-reconcile-tier.cli": "scripts/lakebase/scm-reconcile-tier.cli.ts",
  "scripts/lakebase/scm-recover-orphans.cli": "scripts/lakebase/scm-recover-orphans.cli.ts",
  "scripts/lakebase/scm-doctor.cli": "scripts/lakebase/scm-doctor.cli.ts",
  "scripts/lakebase/scm-feature-branch.cli": "scripts/lakebase/scm-feature-branch.cli.ts",
  "scripts/lakebase/scm-cleanup.cli": "scripts/lakebase/scm-cleanup.cli.ts",
};

const common: Options = {
  entry,
  outDir: "dist",
  target: "node20",
  // tsup compiles TS only; copy *.schema.json runtime assets into dist/ so
  // consumer installs (which ship pre-built dist/ and never rebuild) can read
  // them. Without this, schema-loader / scm-workflow-state hit ENOENT.
  onSuccess: "node scripts/copy-build-assets.mjs",
  sourcemap: true,
  splitting: false,
  // `shims: true` makes esbuild inject pathToFileURL(__filename).href for
  // `import.meta.url` in the CJS build (and the inverse for ESM). Without
  // it, `import.meta.url` is undefined at runtime in the CJS bundle, which
  // breaks scaffold.ts's findTemplatesDir + sibling helpers when called
  // from a CJS consumer like lakebase-scm-extension. Required for dual-
  // format reach.
  shims: true,
  // Inline this package's version so substrateSelfVersion() resolves it without a filesystem
  // package.json lookup (which a webpack bundle in the extension host defeats).
  define: { __LAKEBASE_SCM_UTILS_VERSION__: JSON.stringify(SELF_VERSION) },
};

// Which ESM-only deps to inline (`noExternal`) is FORMAT-SPECIFIC , this is the
// crux of the dual-format build:
//
// - octokit v4 + its @octokit/* graph are ESM-only (package.json type:module,
//   no CJS entry). In the CJS build the default-externalized `require("octokit")`
//   throws ERR_REQUIRE_ESM in a CommonJS host (the lakebase-scm-extension
//   Electron extension host), aborting activation. esbuild inlines octokit's
//   self-contained ESM bundle as CJS, so it's require-able. In the ESM build
//   octokit is imported normally , esbuild's octokit inline is clean ESM too,
//   so bundling it there is harmless , but it needn't be bundled.
// - @databricks/* (@databricks/lakebase -> @databricks/sdk-experimental) is the
//   asymmetric one. It ALSO must be bundled for the CJS/extension host (ESM-only,
//   same ERR_REQUIRE_ESM). But it must NOT be bundled into the ESM output:
//   sdk-experimental does a runtime `require("https")` (a Node built-in), and
//   esbuild's ESM shim for a bundled CJS module turns that into a `__require`
//   that throws "Dynamic require of \"https\" is not supported" the moment an
//   ESM CONSUMER (consort imports scm-utils as ESM) loads the barrel. Left
//   EXTERNAL in the ESM build, Node's own ESM loader resolves @databricks/*
//   fine (it can import the package), so consort works. Hence: bundle
//   @databricks/* in CJS ONLY, keep it external in ESM.
const octokitBundle = [/^octokit$/, /^@octokit\//];

export default defineConfig([
  // ESM (.js) , the format consort imports. Keep @databricks/* EXTERNAL here so
  // no "Dynamic require of https" lands in the ESM output. clean: true wipes
  // dist/ once, at the start; dts emits the .d.ts.
  {
    ...common,
    format: ["esm"],
    dts: true,
    clean: true,
    noExternal: octokitBundle,
  },
  // CJS (.cjs) , the format the extension's Electron host require()s. Bundle
  // BOTH octokit AND @databricks/* so the .cjs output is self-contained and
  // has ZERO require() of any ESM-only dep. clean: false so it appends to the
  // ESM output rather than wiping it; dts emits the .d.cts.
  {
    ...common,
    format: ["cjs"],
    dts: true,
    clean: false,
    noExternal: [...octokitBundle, /^@databricks\//],
  },
]);
