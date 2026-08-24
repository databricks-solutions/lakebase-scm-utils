import { test, expect } from "@playwright/test";

// The one behavior a fresh scaffold can prove end-to-end: the SPA loads, calls
// the backend /health through the Vite proxy, and shows the result as an
// explicit state (never a blank page). Grow this into your feature's flows.
//
// STARTER SPEC , DELETE WHEN THE HOME ROUTE IS REBUILT. This asserts the
// PLACEHOLDER home page's `status-badge`. The first story that replaces this
// placeholder with a real home page (and ships its own routed E2E covering `/`)
// SUPERSEDES this spec , the Navigator flags it and the Driver deletes it. Left
// in place it asserts UI the build removed and fails CI (and now the local
// deploy-verify) forever with "element not found: status-badge".
test("home page loads and shows backend health", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("status-badge")).toContainText("Backend", {
    timeout: 15_000,
  });
});
