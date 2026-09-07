import { test, expect } from "@playwright/test";

for (const slug of ["portable-espresso-machine-private-label-buying-guide", "25-bar-portable-coffee-machine-buying-checklist"]) {
  test(`reviewed guide: ${slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/resources/${slug}`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('time[datetime="2026-09-07"]')).toContainText("Updated");
    const faq = page.locator(".buyer-guide-faq details");
    await expect(faq).toHaveCount(6);
    await faq.first().locator("summary").click();
    await expect(faq.first()).toHaveAttribute("open", "");
    const result = await page.evaluate(() => {
      const schemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).flatMap((node) => JSON.parse(node.textContent || "{}"));
      const article = schemas.find((schema) => schema["@type"] === "BlogPosting");
      const questions = schemas.find((schema) => schema["@type"] === "FAQPage");
      return { updated: article?.dateModified, faqCount: questions?.mainEntity?.length, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    expect(result).toEqual({ updated: "2026-09-07", faqCount: 6, overflow: false });
    await expect(page.locator(".buyer-guide-visual img")).toBeVisible();
    expect(await page.locator(".buyer-guide-visual img").evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
}
