#!/usr/bin/env bash
# Sanitize a git branch name into a Lakebase-compatible branch ID.
#
# Substrate-only: delegates to `lakebase-branch sanitize-name` (TS) so
# the kit's canonical sanitizer is the single source of truth. The shell
# stays for backward compatibility with callers that source it from
# their PATH (CI YAML, ad-hoc dev scripts).
#
# Usage:
#   ./scripts/sanitize-branch-name.sh "feature/My-Branch_Name"
#   # Output: feature-my-branch-name
#
#   SANITIZED=$(./scripts/sanitize-branch-name.sh "$GIT_BRANCH")
set -euo pipefail

INPUT="${1:?Usage: sanitize-branch-name.sh <git-branch-name>}"

WORK_TREE="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$WORK_TREE" ]; then
  # Fallback: no git context (CI step before clone), resolve relative
  # to this script's directory which the scaffold installs alongside
  # the kit's node_modules.
  WORK_TREE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

# Resolve + run lakebase-branch through ./scripts/lk (single source of truth; this
# project has no root node_modules , a node_modules/.bin probe never resolves here).
# shellcheck source=/dev/null
source "$(dirname "${BASH_SOURCE[0]}")/resolve-scm-bin.sh"
run_scm_bin lakebase-branch sanitize-name "$INPUT"
