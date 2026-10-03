# @databricks-solutions/lakebase-scm-utils

The engine that makes **application code and database schema travel together** through one
SCM workflow. It drives a single state machine (claim a feature branch, prepare a PR, wait
for CI, merge) in which every git branch is paired with its own Lakebase Postgres branch, so
the schema evolves in lockstep with the code and moves through the same gates. On every PR it
forks a database branch, applies migrations, runs the tests against real Postgres, and posts
the schema diff; a red run blocks the merge. On merge it migrates the target tier, then tears
the feature and PR branches down. The same commands run whether a human drives them from the
CLI / VS Code extension or an agent orchestrator (`consort`) drives them headless.

Under the hood it owns database branching, the paired-branch SCM workflow state machine,
connection and credential minting, schema migration, project scaffold and deploy primitives,
and the shared git / github / util layer: the portable substrate core shared by the
`lakebase-scm-extension` IDE extension and the `consort` orchestration kit.

It ships two consumption surfaces:

- **Library API** (for the VS Code extension `lakebase-scm-extension` and the Consort
  orchestration in `consort`): import the substrate from the package barrel
  or a sub-path.
  ```ts
  import { createBranch, getConnection } from "@databricks-solutions/lakebase-scm-utils";
  import { resolveGitHubToken } from "@databricks-solutions/lakebase-scm-utils/github";
  ```
- **CLIs** (for scaffolded projects and CI): the `lakebase-*` and `lakebase-scm-*` bins,
  resolved on PATH by the `lk` shim.

## Why this exists

The SCM workflows and their supporting substrate were originally embedded in
`consort` alongside the Consort orchestration. They are extracted here so both
the IDE extension and the Consort kit can depend on a single, versioned engine, for easier
consumption and portability. The Consort orchestration stays in `consort` and
depends back on this package.

## Install

Consumed via a github ref (npm publish is deferred):

```
npm install github:databricks-solutions/lakebase-scm-utils#v<version>
```

The package ships a pre-built `dist/` on every tagged release, so a consumer install skips
the build.

## Development

```
npm install
npm run typecheck
npm test
npm run build
```
