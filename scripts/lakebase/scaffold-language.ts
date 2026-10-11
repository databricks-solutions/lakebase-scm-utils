// Language-specific scaffold router. Mirrors ScaffoldService.deployLanguageProject:
//   - java / kotlin   → Spring Initializr (with bundled fallback)
//   - python / nodejs → static template copy with {{PROJECT_NAME}} substitution
//   - dotnet          → static template copy (dotnet/) + a migration-tool
//                       overlay (dotnet-efcore/ or dotnet-flyway/)

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { copyDirSubstituted } from "../util/copy-dir-substituted.js";
import {
  deploySpringStarter,
  SpringJvmLanguage,
  SpringInitializrClient,
  ScaffoldReportFn,
} from "./spring-initializr.js";

export type ProjectLanguage = "java" | "kotlin" | "python" | "nodejs" | "dotnet";

/** Migration tool for a .NET project. EF Core is the default. */
export type DotnetMigrationTool = "efcore" | "flyway";

/**
 * The frontend the project ships. "react" scaffolds the first-class SPA client
 * under `client/` (templates/project/client); "none" leaves the boundary to
 * render server-side (e.g. Jinja2) or be a pure JSON/CLI backend. A UI project
 * (uiTrack) defaults to "react" so a single-page app is the path of least
 * resistance rather than a build-from-scratch fight.
 */
export type ClientFramework = "react" | "none";

export interface DeployLanguageProjectArgs {
  targetDir: string;
  language: ProjectLanguage;
  projectName?: string;
  /** .NET only: which migration tool the scaffold is set up for (default "efcore"). */
  migrationTool?: DotnetMigrationTool;
  /** Override templates dir (tests). */
  templatesDir?: string;
  /** Override Initializr client (tests). */
  initializrClient?: SpringInitializrClient;
  report?: ScaffoldReportFn;
}

let cachedTemplatesDir: string | undefined;
function findTemplatesDir(): string {
  if (cachedTemplatesDir) return cachedTemplatesDir;
  const here = path.dirname(fileURLToPath(import.meta.url));
  let dir = here;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "templates", "project");
    if (fs.existsSync(path.join(candidate, "common", ".gitignore.base"))) {
      cachedTemplatesDir = candidate;
      return cachedTemplatesDir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Could not locate templates/project tree");
}

export async function deployLanguageProject(args: DeployLanguageProjectArgs): Promise<void> {
  if (args.language === "java" || args.language === "kotlin") {
    await deploySpringStarter({
      targetDir: args.targetDir,
      language: args.language as SpringJvmLanguage,
      projectName: args.projectName,
      templatesDir: args.templatesDir,
      initializrClient: args.initializrClient,
      report: args.report,
    });
    return;
  }

  // Python / Node.js / .NET – static template copy with placeholder substitution.
  const templatesDir = args.templatesDir ?? findTemplatesDir();
  if (args.language === "dotnet") {
    const tool = args.migrationTool ?? "efcore";
    if (tool !== "efcore" && tool !== "flyway") {
      throw new Error(`Unsupported .NET migration tool: ${String(tool)} (expected efcore or flyway)`);
    }
    const base = path.join(templatesDir, "dotnet");
    const overlay = path.join(templatesDir, `dotnet-${tool}`);
    if (!fs.existsSync(base) || !fs.existsSync(overlay)) {
      throw new Error(`No template found for language: dotnet (${tool})`);
    }
    copyDirSubstituted(base, args.targetDir, { projectName: args.projectName });
    copyDirSubstituted(overlay, args.targetDir, { projectName: args.projectName });
    return;
  }
  const langSrc = path.join(templatesDir, args.language);
  if (!fs.existsSync(langSrc)) {
    throw new Error(`No template found for language: ${args.language}`);
  }
  copyDirSubstituted(langSrc, args.targetDir, { projectName: args.projectName });
}
