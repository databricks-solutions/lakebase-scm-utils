// Barrel: Lakebase workflow scripts.
//
// The SFTDD-coupled project scaffolders (create-project, adopt-lakebase-project,
// adopt-sftdd) and the SFTDD command updater (update-commands) live in the
// SFTDD kit (lakebase-app-dev-kit), not this package, so they are not
// re-exported here. The canonical owner files (env-file.ts, project-verify.ts)
// still export writeEnvFile / verifyHooks / verifyWorkflows / verifyProject.

export * from "./branch-create.js";
export * from "./branch-delete.js";
export * from "./convention-branches.js";
export * from "./cut-backup.js";
export * from "./databricks-host.js";
export * from "./databricks-profile.js";
export * from "./deploy-app-endpoint.js";
export * from "./deploy-app-yaml.js";
export * from "./deploy-credentials.js";
export * from "./deploy-rollback.js";
export * from "./deploy-targets.js";
export * from "./deploy-validate.js";
export * from "./deploy-workspace-upload.js";
export * from "./long-running-branch.js";
export * from "./release.js";
export * from "./branch-endpoint.js";
export * from "./branch-schema.js";
export * from "./paired-branch.js";
export * from "./branch-utils.js";
export * from "./create-preflight.js";
export * from "./env-file.js";
export * from "./enable-e2e.js";
export * from "./enable-infra.js";
export * from "./get-connection.js";
export * from "./infra-runner.js";
export * from "./install-playwright.js";
export * from "./lakebase-project.js";
export * from "./project-verify.js";
export * from "./scm-workflow-state.js";
export * from "./scm-claim-feature.js";
export * from "./scm-adopt-state.js";
export * from "./scm-abandon-feature.js";
export * from "./scm-prepare-pr.js";
export * from "./scm-wait-ci.js";
export * from "./scm-merge.js";
export * from "./scm-recover-orphans.js";
export * from "./scm-doctor.js";
// The health-check doctor (doctor.ts) and the SCM doctor (scm-doctor.ts) both
// export a `runDoctor`. scm-doctor's is the barrel's plain `runDoctor`; expose
// the health-check one under an unambiguous alias for library consumers (the
// MCP server's lakebase_doctor tool).
export {
  runDoctor as runHealthDoctor,
  type DoctorReport as HealthDoctorReport,
} from "./doctor.js";
export * from "./runner-setup.js";
export * from "./scaffold-language.js";
export * from "./scaffold.js";
export * from "./schema-diff.js";
export * from "./secret-auth.js";
export * from "./workflow-drift.js";
export * from "./spring-initializr.js";
export * from "./uc-resources.js";
export * from "./migration-layout.js";
export {
  applySchemaMigrations,
  rollbackSchemaMigration,
  schemaMigrationStatus,
  listSchemaMigrations,
  detectLanguage,
  toolForLanguage,
  SchemaMigrationError,
  type SchemaMigrationLanguage,
  type SchemaMigrationToolName,
  type SchemaMigrationFile,
  type ApplySchemaMigrationsArgs,
  type ApplySchemaMigrationsResult,
  type RollbackSchemaMigrationArgs,
  type RollbackSchemaMigrationResult,
  type SchemaMigrationStatusArgs,
  type SchemaMigrationStatusResult,
  type ListSchemaMigrationsArgs,
  type AppliedSchemaMigration,
  type PendingSchemaMigration,
} from "./schema-migrate.js";
