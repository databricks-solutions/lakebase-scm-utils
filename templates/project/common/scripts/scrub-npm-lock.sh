#!/usr/bin/env bash
# scrub-npm-lock.sh , make an npm lockfile installable OFF the Databricks network.
#
# The Databricks npm proxy (npm-proxy.cloud.databricks.com) is a faithful npmjs MIRROR: identical
# package paths and identical tarballs. When deps are locked on a Databricks machine (whose npm
# registry is that proxy), npm bakes the proxy HOST into every `resolved` URL. `npm ci` then fetches
# those exact URLs verbatim , which HANGS for anyone off the Databricks network (the proxy host is
# unreachable). This rewrites the proxy host to the PUBLIC registry so:
#   - external clones install directly from registry.npmjs.org;
#   - Databricks machines still reach those public URLs through their HTTP_PROXY (unchanged);
#   - `integrity` hashes stay valid (they hash the TARBALL, not the URL, and the mirror serves the
#     same bytes) , so no re-resolve, no version drift, `npm ci` still works.
# No-op when the file is absent or already public. Sourced by run-tests.sh + run-dev.sh so the
# proxy-host list lives in ONE place.
scrub_npm_proxy_lock() {
  local lock="$1"
  [ -f "$lock" ] || return 0
  grep -q "npm-proxy.cloud.databricks.com" "$lock" 2>/dev/null || return 0
  perl -i -pe 's#https://npm-proxy\.cloud\.databricks\.com/#https://registry.npmjs.org/#g' "$lock" \
    && echo "scrub-npm-lock: rewrote internal npm-proxy host in $lock -> public registry"
}
