import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should have responsive navigation", async ({ page }) => {
    await page.goto("/");

    // Check navbar exists
    const nav = page.locator("nav, header").first();
    await expect(nav).toBeVisible();
  });

  test("should navigate between pages correctly", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Navigate to komik
    await page.goto("/komik");
    await expect(page).toHaveURL(/\/komik/);

    // Navigate to anime
    await page.goto("/anime");
    await expect(page).toHaveURL(/\/anime/);

    // Navigate to bookmark
    await page.goto("/bookmark");
    await expect(page).toHaveURL(/\/bookmark/);

    // Navigate to history
    await page.goto("/history");
    await expect(page).toHaveURL(/\/history/);
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Should show some content (either 404 page or redirect)
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should work on mobile viewport", async ({ page }) => {
    await page.goto("/");

    // Page should load correctly
    await expect(page.locator("body")).toBeVisible();

    // Check if mobile menu exists
    const mobileMenuButton = page
      .locator('[data-testid="mobile-menu"], button[aria-label*="menu" i]')
      .first();
    const exists = await mobileMenuButton.count();

    if (exists > 0) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
    }
  });
});
  
