import { describe, it, expect, vi, beforeEach } from "vitest";

// missingCiSecrets is the VERIFY primitive behind the create-time check + the
// lakebase-sync-ci-secrets repair: it reports which required CI secrets a repo still lacks,
// so a dropped PAT / failed `gh secret set` is caught instead of silently leaving CI unauthed.
// listSecretNames hits octokit, so stub it.
const listSecretNames = vi.fn<(ownerRepo: string) => Promise<string[]>>();
vi.mock("../../scripts/github/secrets.js", () => ({
  listSecretNames: (ownerRepo: string) => listSecretNames(ownerRepo),
  // syncCiSecrets imports setRepoSecrets from the same module; keep a no-op so the import resolves.
  setRepoSecrets: vi.fn(),
}));

import { missingCiSecrets, REQUIRED_CI_SECRETS } from "../../scripts/util/ci-secrets.js";

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
