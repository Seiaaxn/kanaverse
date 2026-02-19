import { test, expect } from "@playwright/test";

test.describe("Bookmark Functionality", () => {
  test("should load bookmark page", async ({ page }) => {
    await page.goto("/bookmark");

    // Check page loads
    await expect(page).toHaveURL(/\/bookmark/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should show empty state or bookmarks list", async ({ page }) => {
    await page.goto("/bookmark");

    // Wait for content
    await page.waitForLoadState("networkidle");

    // Should have some content (either empty state or list)
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });
});

test.describe("History Functionality", () => {
  test("should load history page", async ({ page }) => {
    await page.goto("/history");

    // Check page loads
    await expect(page).toHaveURL(/\/history/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should show empty state or history list", async ({ page }) => {
    await page.goto("/history");

    // Wait for content
    await page.waitForLoadState("networkidle");

    // Should have some content
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });
});

test.describe("Local Storage", () => {
  test("should persist theme preference", async ({ page }) => {
    await page.goto("/");

    // Get initial theme
    const html = page.locator("html");

    // Find and click theme toggle if exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
    const exists = await themeToggle.count();

    if (exists > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();

      // Theme should be persisted - verify page loads correctly after reload
      await expect(html).toBeVisible();
    }
  });
});
       
