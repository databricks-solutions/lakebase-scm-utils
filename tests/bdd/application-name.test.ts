// The Postgres `application_name` the substrate stamps on its connections is
// `<brand>/<version>` , a transparent label (visible to the instance owner in their own
// pg_stat_activity) reflecting WHO opened the connection:
//   - `consort/<consort-version>` when the work comes from Consort (CONSORT_VERSION set);
//   - `scm-utils/<scm-utils-version>` when scm-utils is invoked directly (extension / bare CLI).
// Each carries its OWN version. These assert both branches + that the direct-use version
// resolves from the real package.json (so a shipped build is never `scm-utils/unknown`).

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

  it("direct use (no CONSORT_VERSION) => `scm-utils/<scm-utils-version>`", () => {
    delete process.env.CONSORT_VERSION;
    expect(connectionApplicationName()).toBe(`scm-utils/${PKG_VERSION}`);
  });

  it("under a Consort run (CONSORT_VERSION set) => `consort/<consort-version>`", () => {
    process.env.CONSORT_VERSION = "0.3.59";
    expect(connectionApplicationName()).toBe("consort/0.3.59");
  });

  it("a blank/whitespace CONSORT_VERSION is ignored (falls back to scm-utils brand)", () => {
    process.env.CONSORT_VERSION = "   ";
    expect(connectionApplicationName()).toBe(`scm-utils/${PKG_VERSION}`);
  });

  it("stays within Postgres's 63-byte application_name limit", () => {
    delete process.env.CONSORT_VERSION;
    expect(Buffer.byteLength(connectionApplicationName(), "utf8")).toBeLessThanOrEqual(63);
    process.env.CONSORT_VERSION = "0.3.59";
    expect(Buffer.byteLength(connectionApplicationName(), "utf8")).toBeLessThanOrEqual(63);
  });
});
