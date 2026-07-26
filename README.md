# @databricks-solutions/lakebase-scm-utils

The Lakebase SCM + substrate engine. This package is the portable core extracted from
`consort`: it owns database branching, the paired-branch SCM workflow state
machine, connection + credential minting, schema migration, project scaffold + deploy
primitives, and the shared git / github / util layer.

It ships two consumption surfaces:

- **Library API** (for the VS Code extension `lakebase-scm-extension` and the SFTDD
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
`consort` alongside the SFTDD orchestration. They are extracted here so both
the IDE extension and the SFTDD kit can depend on a single, versioned engine, for easier
consumption and portability. The SFTDD orchestration stays in `consort` and
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
