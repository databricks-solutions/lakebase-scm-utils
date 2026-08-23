#!/usr/bin/env node
interface ParsedArgs {
    name?: string;
    forkFrom?: string;
    instance?: string;
    host?: string;
    projectDir?: string;
    help?: boolean;
}
declare function parseArgs(argv: string[]): ParsedArgs;
/** Instance + host from the project's .env, so this runs from inside a scaffold
 *  without re-specifying them (explicit flags still win). */
declare function resolveFromEnv(projectDir: string): {
    instance?: string;
    host?: string;
};

export { parseArgs, resolveFromEnv };
