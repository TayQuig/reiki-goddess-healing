import { test, expect } from "@playwright/test";

test.describe("Basic navigation", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page has loaded
    expect(page.url()).toContain("/");

    // Basic accessibility check
    await expect(page).toHaveTitle(/Reiki/i);
  });

  test("should be accessible", async ({ page }) => {
    await page.goto("/");

    // Basic accessibility checks
    const locator = page.locator("body");
    await expect(locator).toBeVisible();

    // Check for basic landmarks
    const main = page.locator("main, [role='main']");
    if ((await main.count()) > 0) {
      await expect(main.first()).toBeVisible();
    }
  });
});
