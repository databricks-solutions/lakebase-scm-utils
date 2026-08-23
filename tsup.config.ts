import { defineConfig } from "tsup";

// Dual-format build: emit both ESM (.js, since package.json type=module) and
// CJS (.cjs) so the lakebase-scm-extension (CommonJS + webpack) can consume
// without ESM-interop pain on default imports of CJS deps like tweetsodium.
//
// Output structure mirrors the source so the package.json exports map keeps
// stable paths like ./dist/scripts/lakebase/index.{js,cjs}.

export default defineConfig({
  entry: {
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
  },
  outDir: "dist",
  format: ["esm", "cjs"],
  target: "node20",
  dts: true,
  clean: true,
  // BUNDLE octokit (+ its @octokit graph) instead of externalizing it. octokit v4
  // is ESM-ONLY (package.json type:module, no CJS main), so the default-externalized
  // `require("octokit")` in the CJS build throws ERR_REQUIRE_ESM in a CommonJS host
  // , which is exactly the lakebase-scm-extension (Electron) extension host, aborting
  // its activation ("failed to load its substrate dependency" -> no views/commands).
  // esbuild transpiles octokit's ESM bundle to CJS inline, so the CJS output is
  // self-contained + require-able. Keep this until octokit is consumed via a dynamic
  // import() or the extension host guarantees require-of-ESM.
  noExternal: [/^octokit$/, /^@octokit\//],
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
});
