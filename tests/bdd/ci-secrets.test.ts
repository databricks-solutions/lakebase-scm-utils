import { describe, it, expect, vi, beforeEach } from "vitest";

// missingCiSecrets is the VERIFY primitive behind the create-time check + the
// lakebase-sync-ci-secrets repair: it reports which required CI secrets a repo still lacks,
// so a dropped PAT / failed `gh secret set` is caught instead of silently leaving CI unauthed.
// listSecretNames + setRepoSecrets hit octokit; runDatabricks shells out — stub all three.
const listSecretNames = vi.fn<(ownerRepo: string) => Promise<string[]>>();
const setRepoSecrets = vi.fn<(ownerRepo: string, secrets: Record<string, string>) => Promise<void>>();
vi.mock("../../scripts/github/secrets.js", () => ({
  listSecretNames: (ownerRepo: string) => listSecretNames(ownerRepo),
  setRepoSecrets: (ownerRepo: string, secrets: Record<string, string>) => setRepoSecrets(ownerRepo, secrets),
}));

const runDatabricks = vi.fn<(args: string[], opts?: unknown) => Promise<string>>();
vi.mock("../../scripts/lakebase/databricks-cli.js", () => ({
  runDatabricks: (args: string[], opts?: unknown) => runDatabricks(args, opts),
}));

import {
  missingCiSecrets,
  REQUIRED_CI_SECRETS,
  ciTokenComment,
  ciTokenExpiry,
  ensureCiSecretsFresh,
  CI_TOKEN_LIFETIME_SECONDS,
} from "../../scripts/util/ci-secrets.js";

describe("REQUIRED_CI_SECRETS", () => {
  it("is exactly the three CI needs to provision a per-PR Lakebase branch", () => {
    expect([...REQUIRED_CI_SECRETS]).toEqual(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID", "DATABRICKS_TOKEN"]);
  });
});

describe("missingCiSecrets", () => {
  beforeEach(() => listSecretNames.mockReset());

  it("returns [] when all three are present", async () => {
    listSecretNames.mockResolvedValue(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID", "DATABRICKS_TOKEN", "OTHER"]);
    expect(await missingCiSecrets("o/r")).toEqual([]);
  });

  it("names the token when the PAT mint dropped it (the fail-soft create case)", async () => {
    listSecretNames.mockResolvedValue(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID"]);
    expect(await missingCiSecrets("o/r")).toEqual(["DATABRICKS_TOKEN"]);
  });

  it("names ALL three when the whole sync failed (the empty-repo case we hit)", async () => {
    listSecretNames.mockResolvedValue([]);
    expect(await missingCiSecrets("o/r")).toEqual(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID", "DATABRICKS_TOKEN"]);
  });
});

describe("ciTokenComment", () => {
  it("derives the canonical project-scoped comment from owner/name", () => {
    expect(ciTokenComment("kevin-hartman/my-stockflow-8")).toBe("GitHub Actions (my-stockflow-8)");
  });
  it("tolerates a bare repo name", () => {
    expect(ciTokenComment("my-stockflow-8")).toBe("GitHub Actions (my-stockflow-8)");
  });
});

describe("ciTokenExpiry", () => {
  beforeEach(() => runDatabricks.mockReset());
  const args = { projectDir: ".", databricksHost: "https://h", ownerRepo: "o/repo" };
  // canonical comment for o/repo is "GitHub Actions (repo)"

  it("returns the latest expiry among tokens matching the canonical comment", async () => {
    runDatabricks.mockResolvedValue(
      JSON.stringify([
        { comment: "GitHub Actions (repo)", expiry_time: 1000 },
        { comment: "GitHub Actions (repo)", expiry_time: 3000 },
        { comment: "some other token", expiry_time: 9999 },
      ]),
    );
    expect(await ciTokenExpiry(args)).toBe(3000);
  });

  it("returns null when no live token carries the canonical comment (expired tokens are absent from the list)", async () => {
    runDatabricks.mockResolvedValue(JSON.stringify([{ comment: "GitHub Actions (other-repo)", expiry_time: 5000 }]));
    expect(await ciTokenExpiry(args)).toBeNull();
  });

  it("treats a no-expiry token (expiry_time -1) as never-expiring", async () => {
    runDatabricks.mockResolvedValue(JSON.stringify([{ comment: "GitHub Actions (repo)", expiry_time: -1 }]));
    expect(await ciTokenExpiry(args)).toBe(Number.POSITIVE_INFINITY);
  });

  it("fail-soft: a non-token / unparseable CLI result returns null (→ the preflight re-mints, the safe direction)", async () => {
    // Both failure shapes (`tokens list` erroring, or emitting non-array/garbage) land in the same
    // contract: expiry is unknowable → return null → the caller re-mints (fail-closed to a fresh
    // token). Exercising the parse-catch here; the CLI-throw catch is the same null outcome.
    runDatabricks.mockResolvedValue("not json");
    expect(await ciTokenExpiry(args)).toBeNull();
  });
});

describe("ensureCiSecretsFresh", () => {
  const NOW = 1_000_000_000_000; // fixed clock
  const base = {
    projectDir: ".",
    databricksHost: "https://h",
    lakebaseProjectId: "proj",
    ownerRepo: "o/repo",
    now: () => NOW,
  };

  beforeEach(() => {
    listSecretNames.mockReset();
    setRepoSecrets.mockReset().mockResolvedValue(undefined);
    runDatabricks.mockReset().mockImplementation(async (a: string[]) => {
      if (a[0] === "tokens" && a[1] === "create") return JSON.stringify({ token_value: "fresh-pat" });
      if (a[0] === "auth" && a[1] === "token") return JSON.stringify({ access_token: "oauth-fallback" });
      return "[]"; // default tokens-list stub; overridden per test
    });
  });

  it("provisions when a required secret is missing (name absent)", async () => {
    listSecretNames.mockResolvedValue(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID"]); // DATABRICKS_TOKEN missing
    const r = await ensureCiSecretsFresh(base);
    expect(r.action).toBe("provisioned");
    expect(setRepoSecrets).toHaveBeenCalledWith("o/repo", expect.objectContaining({ DATABRICKS_TOKEN: "fresh-pat" }));
  });

  it("leaves a current token untouched (ok, no sync)", async () => {
    listSecretNames.mockResolvedValue([...REQUIRED_CI_SECRETS]);
    runDatabricks.mockImplementation(async (a: string[]) => {
      if (a[0] === "tokens" && a[1] === "list")
        return JSON.stringify([{ comment: "GitHub Actions (repo)", expiry_time: NOW + 90 * 86_400_000 }]);
      return JSON.stringify({ token_value: "fresh-pat" });
    });
    const r = await ensureCiSecretsFresh(base);
    expect(r.action).toBe("ok");
    expect(setRepoSecrets).not.toHaveBeenCalled();
  });

  it("re-mints when no live canonical token exists (secret present but expired)", async () => {
    listSecretNames.mockResolvedValue([...REQUIRED_CI_SECRETS]);
    runDatabricks.mockImplementation(async (a: string[]) => {
      if (a[0] === "tokens" && a[1] === "list") return "[]"; // none live
      return JSON.stringify({ token_value: "fresh-pat" });
    });
    const r = await ensureCiSecretsFresh(base);
    expect(r.action).toBe("reminted");
    expect(setRepoSecrets).toHaveBeenCalled();
  });

  it("re-mints when the live token expires within the margin", async () => {
    listSecretNames.mockResolvedValue([...REQUIRED_CI_SECRETS]);
    runDatabricks.mockImplementation(async (a: string[]) => {
      if (a[0] === "tokens" && a[1] === "list")
        return JSON.stringify([{ comment: "GitHub Actions (repo)", expiry_time: NOW + 3_600_000 }]); // ~1h, inside 24h margin
      return JSON.stringify({ token_value: "fresh-pat" });
    });
    const r = await ensureCiSecretsFresh(base);
    expect(r.action).toBe("reminted");
  });

  it("falls back to an OAuth token when the PAT mint fails", async () => {
    listSecretNames.mockResolvedValue(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID"]); // force a sync
    runDatabricks.mockImplementation(async (a: string[]) => {
      if (a[0] === "tokens" && a[1] === "create") throw new Error("PATs disabled");
      if (a[0] === "auth" && a[1] === "token") return JSON.stringify({ access_token: "oauth-fallback" });
      return "[]";
    });
    await ensureCiSecretsFresh(base);
    expect(setRepoSecrets).toHaveBeenCalledWith("o/repo", expect.objectContaining({ DATABRICKS_TOKEN: "oauth-fallback" }));
  });

  it("mints with the canonical 90-day lifetime by default", async () => {
    listSecretNames.mockResolvedValue(["DATABRICKS_HOST", "LAKEBASE_PROJECT_ID"]);
    await ensureCiSecretsFresh(base);
    const createCall = runDatabricks.mock.calls.find((c) => c[0][0] === "tokens" && c[0][1] === "create");
    expect(createCall?.[0]).toContain(String(CI_TOKEN_LIFETIME_SECONDS));
  });
});
