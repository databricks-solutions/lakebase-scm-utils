// This package's OWN SemVer, resolved at runtime from its package.json. Used to stamp
// `application_name=consort/<version>` on the substrate's Postgres connections, so an
// instance owner's pg_stat_activity shows not just the tool but WHICH build connected.
//
// Walks up from the compiled module location looking for THIS package's package.json
// (matched by name, so a nested dependency's package.json can never be mistaken for ours).
// Works from src/ under tsx and from dist/ under tsc; tsup `shims: true` injects a working
// `import.meta.url` into the CJS bundle too, so it resolves in a CJS consumer (the extension
// host) as well as an ESM one (consort). A leaf module (node builtins only) so the low-level
// connection layer can read the version without pulling in the scaffold subsystem.
//
// Never throws: a version LABEL must not be able to break a database connection, so any
// failure (no import.meta.url, fs error, unreadable package.json) falls back to "unknown".

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const PKG_NAME = "@databricks-solutions/lakebase-scm-utils";
let cached: string | undefined;

/** This package's version (e.g. "0.2.16"), or "unknown" if it cannot be resolved. Cached. */
export function substrateSelfVersion(): string {
  if (cached !== undefined) return cached;
  cached = "unknown";
  try {
    let dir = path.dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 8; i++) {
      const pkgPath = path.join(dir, "package.json");
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { name?: unknown; version?: unknown };
          // Only OUR package.json counts , keep walking past a nested/other one.
          if (pkg.name === PKG_NAME && typeof pkg.version === "string" && pkg.version.length > 0) {
            cached = pkg.version;
            return cached;
          }
        } catch {
          /* a malformed / non-matching package.json is not ours , keep walking */
        }
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch {
    /* import.meta.url unavailable or fs error , fall through to "unknown" */
  }
  return cached;
}
