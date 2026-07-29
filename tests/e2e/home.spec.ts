import { expect, test } from "@playwright/test";

test.describe("TK Classic buyer journey", () => {
  test("homepage renders the product carousel and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main.home-shell")).toBeVisible();
    await expect(page.locator(".coffee-ritual-frame")).toBeVisible();
    await expect(page.locator(".coffee-ritual-model-badge strong")).toContainText("DQ-");
    await expect(page.getByRole("link", { name: /request quotation/i }).first()).toBeVisible();
  });

  test("locale-prefixed product route resolves without query parameters", async ({ page }) => {
    await page.goto("/zh/products/dq-010");
    await expect(page.locator("main[lang='zh']")).toBeVisible();
    await expect(page).toHaveURL(/\/zh\/products\/dq-010$/);
    await expect(page.getByText("DQ-010", { exact: false }).first()).toBeVisible();
  });

  test("mobile layout keeps carousel media inside its frame", async ({ page }) => {
    await page.goto("/");
    const frame = page.locator(".coffee-ritual-frame");
    const image = page.locator(".coffee-ritual-media img");
    const frameBox = await frame.boundingBox();
    const imageBox = await image.boundingBox();
    expect(frameBox).not.toBeNull();
    expect(imageBox).not.toBeNull();
    expect(imageBox!.x).toBeGreaterThanOrEqual(frameBox!.x - 1);
    expect(imageBox!.y).toBeGreaterThanOrEqual(frameBox!.y - 1);
    expect(imageBox!.x + imageBox!.width).toBeLessThanOrEqual(frameBox!.x + frameBox!.width + 1);
    expect(imageBox!.y + imageBox!.height).toBeLessThanOrEqual(frameBox!.y + frameBox!.height + 1);
  });
});
