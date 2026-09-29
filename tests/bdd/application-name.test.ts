// The Postgres `application_name` the substrate stamps on its connections is
// `<brand>/<version>` , a transparent label (visible to the instance owner in their own
// pg_stat_activity) reflecting WHO opened the connection:
//   - ANY consumer's generic self-brand via LAKEBASE_SCM_CLIENT="<brand>/<version>" (e.g. the VS
//     Code / Cursor extension sets `scm-extension/<v>`) — adding a consumer needs no scm-utils change;
//   - `consort/<consort-version>` back-compat when Consort sets CONSORT_VERSION;
//   - `scm-utils/<scm-utils-version>` when nothing is set (a bare CLI).
// Precedence: LAKEBASE_SCM_CLIENT > CONSORT_VERSION > scm-utils. These assert every branch, the
// sanitizer, and that the direct-use version resolves from the real package.json (never `unknown`).

import { describe, it, expect, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { substrateSelfVersion } from "../../scripts/lakebase/self-version.js";
import { connectionApplicationName } from "../../scripts/lakebase/get-connection.js";

const PKG_VERSION = (
  JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as { version: string }
).version;

describe("connection application_name label", () => {
  const prev = process.env.CONSORT_VERSION;
  const prevClient = process.env.LAKEBASE_SCM_CLIENT;
  afterEach(() => {
    if (prev === undefined) delete process.env.CONSORT_VERSION;
    else process.env.CONSORT_VERSION = prev;
    if (prevClient === undefined) delete process.env.LAKEBASE_SCM_CLIENT;
    else process.env.LAKEBASE_SCM_CLIENT = prevClient;
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

  it("a consumer self-brand (LAKEBASE_SCM_CLIENT set) is used verbatim, e.g. the extension => `scm-extension/<v>`", () => {
    delete process.env.CONSORT_VERSION;
    process.env.LAKEBASE_SCM_CLIENT = "scm-extension/0.6.24";
    expect(connectionApplicationName()).toBe("scm-extension/0.6.24");
  });

  it("a future consumer needs no scm-utils change — any brand label flows through", () => {
    delete process.env.CONSORT_VERSION;
    process.env.LAKEBASE_SCM_CLIENT = "some-new-tool/1.2.3";
    expect(connectionApplicationName()).toBe("some-new-tool/1.2.3");
  });

  it("precedence: LAKEBASE_SCM_CLIENT wins over CONSORT_VERSION back-compat when both are set", () => {
    process.env.CONSORT_VERSION = "0.3.59";
    process.env.LAKEBASE_SCM_CLIENT = "scm-extension/0.6.24";
    expect(connectionApplicationName()).toBe("scm-extension/0.6.24");
  });

  it("sanitizes a consumer label: strips control chars/whitespace and caps at 63 bytes", () => {
    delete process.env.CONSORT_VERSION;
    process.env.LAKEBASE_SCM_CLIENT = "scm-extension/0.6.24\n; DROP";
    const out = connectionApplicationName();
    expect(out).not.toMatch(/[\n\r]/);
    expect(Buffer.byteLength(out, "utf8")).toBeLessThanOrEqual(63);
  });

  it("a blank LAKEBASE_SCM_CLIENT is ignored (falls back to scm-utils brand)", () => {
    delete process.env.CONSORT_VERSION;
    process.env.LAKEBASE_SCM_CLIENT = "  ";
    expect(connectionApplicationName()).toBe(`scm-utils/${PKG_VERSION}`);
  });

  it("stays within Postgres's 63-byte application_name limit", () => {
    delete process.env.CONSORT_VERSION;
    expect(Buffer.byteLength(connectionApplicationName(), "utf8")).toBeLessThanOrEqual(63);
    process.env.CONSORT_VERSION = "0.3.59";
    expect(Buffer.byteLength(connectionApplicationName(), "utf8")).toBeLessThanOrEqual(63);
  });
});
