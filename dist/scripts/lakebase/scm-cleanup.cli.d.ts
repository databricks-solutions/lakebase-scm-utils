#!/usr/bin/env node
/** Resolve the instance + host from a project's .env (what create-project recorded),
 *  so cleanup pairs with create-project: run from a project dir, no need to re-specify.
 *  Returns undefined for a key the .env lacks (or when there is no .env). Pure read. */
declare function resolveFromEnv(projectDir: string): {
    instance?: string;
    host?: string;
};
declare function runCleanupCli(argv: string[]): Promise<number>;

export { resolveFromEnv, runCleanupCli };
