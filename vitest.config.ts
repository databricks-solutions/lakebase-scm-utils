import { defineConfig } from "vitest/config";

// Tests in templates/** are scaffolded artifacts that ship with USER
// projects. They're meant to run AFTER scaffold, not as part of our suite.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.js"],
    exclude: ["templates/**", "node_modules/**", "dist/**"],
    // The git-fixture tests (git-*, github-*) are hermetic but spawn CHAINS
    // of real git subprocesses against tempdir bare repos. Under parallel
    // workers a single test can cross a tight timeout; 30s gives headroom.
    testTimeout: 30_000,
  },
});
