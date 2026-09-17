#!/usr/bin/env bash
# resolve-scm-bin.sh , run a substrate (lakebase-scm-utils) CLI the way this
# project ACTUALLY resolves it: through ./scripts/lk, never a root node_modules.
#
# This layout has no root package.json / node_modules. The substrate is installed
# by ./scripts/lk into a shared, version-keyed cache
# (~/.cache/lakebase-scm-utils/<ref>) and run via `node dist/...`; lk owns that
# resolution AND auto-installs a cold cache on first use, so deferring to it is
# the single source of truth and works on a bare clone. The old per-script
# preamble probed `$WORK_TREE/node_modules/.bin/lakebase-branch` , a path this
# layout never creates , and on the miss printed "Run 'npm install'", pointing at
# a bootstrap the kit no longer uses (there is no root package.json to install).
# That is the ENOENT trap this helper centralizes away: one door, through lk.
#
# Sourced by the scaffolded substrate scripts (refresh-token.sh,
# connect-main-branch.sh, delete-lakebase-branches.sh, set-production-db-secrets.sh,
# sanitize-branch-name.sh) so the resolution lives in ONE place (mirrors
# scrub-npm-lock.sh). Usage:
#   # shellcheck source=/dev/null
#   source "$(dirname "${BASH_SOURCE[0]}")/resolve-scm-bin.sh"
#   run_scm_bin lakebase-branch sync-env --cwd "$WORK_TREE"

# Locate the lk shim next to THIS helper (both scaffolded into scripts/), so it
# resolves correctly regardless of the caller's cwd.
_RESOLVE_SCM_BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run a substrate CLI by its registered bin name via the lk shim. lk resolves the
# shared cache, auto-installs a cold one (its own progress + any resolution error
# go to stderr, and it never suggests `npm install`), and execs `node dist/...`.
# Returns the CLI's own exit code. If lk itself is missing, say so with the
# correct remediation , NEVER `npm install` (this project has no root package.json).
run_scm_bin() {
  local bin="${1:?run_scm_bin: <bin-name> required}"; shift
  local lk="$_RESOLVE_SCM_BIN_DIR/lk"
  if [ ! -f "$lk" ]; then
    echo "resolve-scm-bin: kit shim './scripts/lk' not found at '$lk'. This project runs substrate CLIs through lk (there is no root node_modules); restore scripts/lk or re-run the kit setup , do NOT 'npm install'." >&2
    return 1
  fi
  bash "$lk" "$bin" "$@"
}
