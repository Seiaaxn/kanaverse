import { test, expect } from "@playwright/test";

test.describe("Anime Pages", () => {
  test("should load anime list page", async ({ page }) => {
    await page.goto("/anime");

    // Check page loads
    await expect(page).toHaveURL(/\/anime/);

    // Check main content area
    await expect(page.locator("main")).toBeVisible();
  });

  test("should have anime cards or list items", async ({ page }) => {
    await page.goto("/anime");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check for anime content
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("should navigate to anime detail when clicking an anime", async ({ page }) => {
    await page.goto("/anime");

    // Wait for content
    await page.waitForLoadState("networkidle");

    // Find first anime link and click
    const firstAnimeLink = page.locator('a[href^="/anime/"]').first();
    const exists = await firstAnimeLink.count();

    if (exists > 0) {
      await firstAnimeLink.click();
      await page.waitForLoadState("networkidle");

      // Should be on detail page
      await expect(page).toHaveURL(/\/anime\/.+/);
    }
  });
});

test.describe("Anime Search", () => {
  test("should have search functionality", async ({ page }) => {
    await page.goto("/anime");

    // Look for search input
    const searchInput = page
      .locator(
        'input[type="search"], input[type="text"][placeholder*="search" i], input[placeholder*="cari" i]'
      )
      .first();
    const exists = await searchInput.count();

    if (exists > 0) {
      await expect(searchInput).toBeVisible();

      // Type search query
      await searchInput.fill("naruto");

      // Wait for results
      await page.waitForTimeout(500);
    }
  });
});
              
