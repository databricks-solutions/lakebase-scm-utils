// The Postgres `application_name` the substrate stamps on its connections is ALWAYS
// `consort/<version>` , one uniform product brand + a version (visible to the instance
// owner in their own pg_stat_activity). The version is the running Consort version
// (CONSORT_VERSION) under a Consort run, else this package's own SemVer when used directly
// (extension / bare CLI) , still branded `consort`. These assert the brand is always
// consort + that the direct-use version resolves from the real package.json (never
// `consort/unknown` in-tree).

import { describe, it, expect, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { substrateSelfVersion } from "../../scripts/lakebase/self-version.js";
import { connectionApplicationName } from "../../scripts/lakebase/get-connection.js";

const PKG_VERSION = (
  JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as { version: string }
).version;

describe("connection application_name label", () => {
  const prev = process.env.CONSORT_VERSION;
  afterEach(() => {
    if (prev === undefined) delete process.env.CONSORT_VERSION;
    else process.env.CONSORT_VERSION = prev;
  });

  it("substrateSelfVersion() resolves to this package's version (never 'unknown' in-tree)", () => {
    expect(substrateSelfVersion()).toBe(PKG_VERSION);
    expect(substrateSelfVersion()).not.toBe("unknown");
  });

  it("direct use (no CONSORT_VERSION) => `consort/<package-version>` (consort brand, own version)", () => {
    delete process.env.CONSORT_VERSION;
    expect(connectionApplicationName()).toBe(`consort/${PKG_VERSION}`);
  });

  it("under a Consort run (CONSORT_VERSION set) => `consort/<consort-version>`", () => {
    process.env.CONSORT_VERSION = "0.3.59";
    expect(connectionApplicationName()).toBe("consort/0.3.59");
  });

  it("a blank/whitespace CONSORT_VERSION is ignored (falls back to the package version, still consort)", () => {
    process.env.CONSORT_VERSION = "   ";
    expect(connectionApplicationName()).toBe(`consort/${PKG_VERSION}`);
  });

  it("stays within Postgres's 63-byte application_name limit", () => {
    delete process.env.CONSORT_VERSION;
    expect(Buffer.byteLength(connectionApplicationName(), "utf8")).toBeLessThanOrEqual(63);
    process.env.CONSORT_VERSION = "0.3.59";
    expect(Buffer.byteLength(connectionApplicationName(), "utf8")).toBeLessThanOrEqual(63);
  });
});
