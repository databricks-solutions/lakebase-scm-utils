// Every connection this kit's DSN opens must be labeled with application_name, so a
// Lakebase owner can see in pg_stat_activity which tool + version connected. The DSN is
// the single door for all non-pool consumers (the scaffolded app's uvicorn/psycopg
// runtime, alembic, pytest, knex, psql) , each opens its OWN connection from the DSN, so
// the label has to live IN the DSN (a libpq + node-postgres connection-URI parameter),
// not only on the kit's three direct pg.Client/pool sites. Regression guard for the gap
// where buildPostgresUrl emitted host/port/db/user/password + sslmode but no application_name.

import { describe, it, expect, afterEach } from "vitest";
import { buildPostgresUrl, connectionApplicationName } from "../../scripts/lakebase/get-connection.js";

const parts = { host: "ep-x.database.example.com", port: 5432, database: "databricks_postgres", user: "u@d.com", password: "tok" };

const savedConsortVersion = process.env.CONSORT_VERSION;
afterEach(() => {
  if (savedConsortVersion === undefined) delete process.env.CONSORT_VERSION;
  else process.env.CONSORT_VERSION = savedConsortVersion;
});

describe("buildPostgresUrl stamps application_name into the DSN (every consumer is labeled)", () => {
  it("includes application_name as a connection-URI parameter alongside sslmode", () => {
    const u = new URL(buildPostgresUrl(parts));
    expect(u.searchParams.get("sslmode")).toBe("require");
    const appName = u.searchParams.get("application_name");
    expect(appName).toBeTruthy();
    expect(appName).toBe(connectionApplicationName());
  });

  it("labels the DSN consort/<version> when running under a Consort drive (CONSORT_VERSION set)", () => {
    process.env.CONSORT_VERSION = "0.3.99";
    const appName = new URL(buildPostgresUrl(parts)).searchParams.get("application_name");
    expect(appName).toBe("consort/0.3.99");
  });

  it("labels the DSN consort/<version> when used directly (no CONSORT_VERSION) , consort brand always", () => {
    delete process.env.CONSORT_VERSION;
    const appName = new URL(buildPostgresUrl(parts)).searchParams.get("application_name") ?? "";
    expect(appName.startsWith("consort/")).toBe(true);
  });
});
