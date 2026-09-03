// Copy a directory recursively, substituting {{PROJECT_NAME}} + {{LAKEBASE_SCM_UTILS_VERSION}}
// placeholders in text files. Ported from ScaffoldService.copyDirWithSubstitution.
//
// {{LAKEBASE_SCM_UTILS_VERSION}} is the substrate's own SemVer, so every language template
// (python database.py, node knexfile.js, the java/kotlin Spring fallback + overlay) resolves the
// connection application_name to a REAL scm-utils/<version> label , the same substitution the
// common/scripts already get via substituteScmUtilsVersion , instead of a hardcoded "unknown".
//
// Skips entries that are extension-only metadata (`.gitignore.extra`) or
// fallback subdirs that shouldn't bleed into the destination scaffold.

import * as fs from "node:fs";
import * as path from "node:path";
import { substrateSelfVersion } from "../lakebase/self-version.js";

const SKIP_ENTRIES = new Set([".gitignore.extra", "fallback"]);

export interface CopyDirSubstitutedArgs {
  projectName?: string;
  /** Entry names to skip at the top level (defaults to ".gitignore.extra" and "fallback"). */
  skipEntries?: Set<string>;
}

export function copyDirSubstituted(
  srcDir: string,
  destDir: string,
  args: CopyDirSubstitutedArgs = {}
): void {
  const skip = args.skipEntries ?? SKIP_ENTRIES;
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (skip.has(file)) continue;
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    if (fs.statSync(srcPath).isDirectory()) {
      // Subdirs use a fresh empty skip set – we only filter at the top level.
      copyDirSubstituted(srcPath, destPath, { projectName: args.projectName, skipEntries: new Set() });
    } else {
      let content = fs.readFileSync(srcPath, "utf-8");
      if (args.projectName) {
        content = content.replace(/\{\{PROJECT_NAME\}\}/g, args.projectName);
      }
      content = content.replace(/\{\{LAKEBASE_SCM_UTILS_VERSION\}\}/g, substrateSelfVersion());
      fs.writeFileSync(destPath, content);
    }
  }
}
