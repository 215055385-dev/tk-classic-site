import { expect, test } from "@playwright/test";

test.describe("TK Classic buyer journey", () => {
  test("homepage renders the product carousel and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main.home-shell")).toBeVisible();
    await expect(page.locator(".tech-product-stage")).toBeVisible();
    await expect(page.locator(".tech-model-kicker")).toContainText("DQ-010");
    await expect(page.getByRole("link", { name: /explore products/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact factory/i }).first()).toBeVisible();
  });

  test("locale-prefixed product route resolves without query parameters", async ({ page }) => {
    await page.goto("/zh/products/dq-010");
    await expect(page.locator("main[lang='zh']")).toBeVisible();
    await expect(page).toHaveURL(/\/zh\/products\/dq-010$/);
    await expect(page.locator("h1")).toContainText("DQ-010");
  });

  test("language switching keeps the page, document language, and chat copy synchronized", async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (/hydration|hydrated/i.test(text) && message.type() === "error") hydrationErrors.push(text);
    });
    await page.goto("/zh/products");
    await page.locator("header .language-switcher summary").click();
    await page.locator("header .language-menu a[href='/fr/products']").click();

    await expect(page).toHaveURL(/\/fr\/products$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator(".site-chat-launcher")).toContainText("Contacter les ventes");

    await page.locator("header .language-switcher summary").click();
    await page.locator("header .language-menu a[href='/ar/products']").click();
    await expect(page).toHaveURL(/\/ar\/products$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".site-chat-launcher")).toContainText("تحدث مع المبيعات");
    expect(hydrationErrors).toEqual([]);
  });

  test("language menu opens above navigation on every main inner page", async ({ page }) => {
    for (const path of ["/accessories", "/oem-odm", "/factory", "/resources", "/contact"]) {
      await page.goto(path);
      const switcher = page.locator("header.site-header .language-switcher");
      await switcher.locator("summary").click();
      await expect(switcher).toHaveAttribute("open", "");
      await expect(switcher.locator(".language-menu a")).toHaveCount(7);
      await expect(switcher.locator(".language-menu")).toBeVisible();
    }
  });

  test("product logistics uses verified model data and localized labels", async ({ page }) => {
    await page.goto("/zh/products/dq-010");
    const logistics = page.locator(".product-logistics");
    await expect(logistics).toContainText("包装与物流");
    await expect(logistics).toContainText("L85 × W85 × H280 mm");
    await expect(logistics).toContainText("17.8 kg");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");
  });

  test("mobile layout keeps hero product media inside its frame", async ({ page }) => {
    await page.goto("/");
    const frame = page.locator(".tech-product-stage");
    const image = frame.locator("img");
    const frameBox = await frame.boundingBox();
    const imageBox = await image.boundingBox();
    expect(frameBox).not.toBeNull();
    expect(imageBox).not.toBeNull();
    // Verify the product stage clips its restrained motion and stays inside
    // the mobile viewport without cropping the image element itself away.
    await expect(frame).toHaveCSS("overflow", "hidden");
    expect(frameBox!.x).toBeGreaterThanOrEqual(0);
    expect(frameBox!.x + frameBox!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
    expect(imageBox!.width).toBeGreaterThan(0);
    expect(imageBox!.height).toBeGreaterThan(0);
  });

  test("US wholesale page exposes buyer guides without horizontal overflow", async ({ page }) => {
    await page.goto("/wholesale/usa");
    await expect(page.getByRole("heading", { name: /Portable espresso for retail/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Prepare the sourcing brief/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Read the buyer guide/i }).first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });

  test("OEM and ODM includes the Coffee Lab configuration workflow without overflow", async ({ page }) => {
    await page.goto("/zh/oem-odm#coffee-lab");
    await expect(page.locator("#oem-lab-title")).toContainText("Coffee Lab");
    await expect(page.getByRole("heading", { name: "创建你的配置" })).toBeVisible();

    const configurator = page.locator("#configurator");
    await expect(configurator.getByRole("tab", { name: "01 咖啡机主体" })).toHaveAttribute("aria-selected", "true");
    await configurator.getByRole("tab", { name: "04 兼容配件" }).click();
    const firstAccessory = configurator.locator(".coffee-lab-compact-accessories > button").first();
    await firstAccessory.click();
    await expect(firstAccessory).toHaveAttribute("aria-pressed", "true");

    await configurator.getByRole("tab", { name: "05 配置摘要" }).click();
    await configurator.getByRole("button", { name: "生成定制效果图" }).click();
    await expect(configurator.locator(".coffee-lab-concept-board img")).toBeVisible();

    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

    const submit = configurator.locator(".coffee-lab-submit");
    await expect(submit).toHaveCSS("background-color", "rgb(101, 203, 232)");
    await expect(submit).toHaveCSS("color", "rgb(8, 11, 15)");

    await page.goto("/ar/oem-odm");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  });

  test("public sections share the outdoor-coffee navigation palette and compact accessory label", async ({ page }) => {
    const headerBackgrounds: string[] = [];
    const headerTops: number[] = [];

    for (const path of [
      "/",
      "/products",
      "/products/dq-001",
      "/resources",
      "/accessories",
      "/oem-odm",
      "/camping-coffee-machine",
      "/wholesale/usa",
    ]) {
      await page.goto(path);
      const header = page.locator("header.site-header");
      await expect(header).toBeVisible();
      headerBackgrounds.push(await header.evaluate((element) => getComputedStyle(element).backgroundColor));
      headerTops.push(await header.evaluate((element) => Math.round(element.getBoundingClientRect().top)));
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    }

    expect(new Set(headerBackgrounds).size).toBe(1);
    expect(Math.max(...headerTops) - Math.min(...headerTops)).toBeLessThanOrEqual(1);
    await page.goto("/products");
    await expect(page.locator(".product-card").first()).toBeVisible();
    await page.goto("/accessories");
    await expect(page.locator(".detail-float-nav")).toContainText("Accessories");
    await expect(page.locator(".detail-float-nav")).not.toContainText("Coffee accessories and add-ons");
    const accessoryShowcase = page.locator(".accessories-hero-showcase");
    await expect(accessoryShowcase).toBeVisible();
    await expect(accessoryShowcase.locator("img")).toHaveCount(3);
    await expect.poll(() => accessoryShowcase.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await expect.poll(() => accessoryShowcase.evaluate((element) => element.getBoundingClientRect().height <= 600)).toBe(true);
    await expect(page.locator(".accessory-card-body small").first()).toHaveCSS("color", "rgb(156, 231, 245)");
    await expect(page.locator(".accessory-card-highlights li").first()).toHaveCSS("color", "rgb(243, 246, 248)");

    await page.goto("/oem-odm");
    await expect(page.locator(".oem-qc-copy > span")).toHaveCSS("color", "rgb(156, 231, 245)");
  });

  test("product collection keeps visible content rendered and eagerly loads its hero stage", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("#product-catalog")).toBeVisible();
    await expect.poll(() => page.locator("#product-catalog").evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    await expect(page.locator(".product-collection-feature img")).toHaveCount(1);
    await expect(page.locator(".product-collection-model-links > a")).toHaveCount(6);
    await expect.poll(() => page.locator(".product-collection-feature img").evaluate((image) => (image as HTMLImageElement).loading)).toBe("eager");
  });

  test("global navigation exposes Home and a compact Resources hub", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.site-header");
    await expect(header.locator(".primary-nav > a[href='/en']")).toHaveAttribute("aria-current", "page");
    await expect(page.locator(".featured-guide-card")).toHaveCount(3);

    if ((page.viewportSize()?.width ?? 0) > 720) {
      await header.locator(".resources-nav-menu summary").click();
      const panel = header.locator(".resources-nav-panel");
      await expect(panel.getByRole("link", { name: "Resources hub" })).toHaveAttribute("href", "/en/resources");
      await expect(panel.getByRole("link", { name: "Buyer guides" })).toHaveAttribute("href", "/en/resources#guides");
      await expect(panel.getByRole("link", { name: "Use scenarios" })).toHaveAttribute("href", "/en/solutions");
      await expect(panel.getByRole("link", { name: "USA wholesale" })).toHaveAttribute("href", "/en/wholesale/usa");
      await panel.getByRole("link", { name: "Resources hub" }).click();
    } else {
      const mobileMenu = header.locator(".mobile-primary-nav");
      await mobileMenu.locator("summary").click();
      const resourcesLink = mobileMenu.locator("a[href='/en/resources']");
      await expect(resourcesLink).toBeVisible();
      await resourcesLink.click();
    }
    await expect(page).toHaveURL(/\/(?:en\/)?resources$/);
    await expect(page.locator(".resource-guide-card").first()).toBeVisible();
    await expect(page.locator(".resources-hero-shortcuts > a")).toHaveCount(3);

    await page.goto("/coffee-lab");
    await expect(page).toHaveURL(/\/oem-odm#coffee-lab$/);

    await page.goto("/accessories");
    await expect(page.locator(".accessories-hero .back-link")).toHaveCount(0);
    await expect(page.locator("header.site-header .primary-nav > a").first()).toHaveAttribute("href", "/en");
    await expect(page.locator("header.site-header .primary-nav")).not.toContainText("Coffee Lab");
  });

  test("factory and exhibition photography share one continuous page", async ({ page }) => {
    await page.goto("/factory");
    await expect(page.locator("#factory-gallery")).toBeVisible();
    await expect(page.locator("#exhibitions")).toBeVisible();
    await expect(page.locator("#factory-gallery img")).toHaveCount(7);
    await expect(page.locator("#exhibitions img")).toHaveCount(7);
    await expect(page.locator(".gallery-truth-note > p:not(.eyebrow)")).toHaveCSS("color", "rgb(203, 211, 218)");

    await page.goto("/exhibitions");
    await expect(page).toHaveURL(/\/factory#exhibitions$/);
    await expect(page.locator("#exhibitions")).toBeVisible();
  });

  test("admin login provides secure quick access without bypassing authentication", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "中文内容管理后台" })).toBeVisible();
    await expect(page.getByRole("button", { name: "复制后台网址" })).toBeVisible();
    await expect(page.getByRole("link", { name: "返回网站首页" })).toHaveAttribute("href", "/");
    await expect(page.getByLabel("管理员密码")).toHaveAttribute("type", "password");
    await expect(page.locator(".admin-cms-shell")).toHaveCount(0);
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    const retryResponse = await page.request.post("/api/admin/inquiries/00000000-0000-4000-8000-000000000000/resend", { data: { target: "failed" } });
    expect(retryResponse.status()).toBe(401);
    const healthResponse = await page.request.get("/api/admin/system?mode=email-health");
    expect(healthResponse.status()).toBe(401);
    const archiveResponse = await page.request.delete("/api/admin/inquiries/00000000-0000-4000-8000-000000000000");
    expect(archiveResponse.status()).toBe(401);
    const restoreResponse = await page.request.post("/api/admin/inquiries/00000000-0000-4000-8000-000000000000");
    expect(restoreResponse.status()).toBe(401);
    const customerUpdate = await page.request.patch("/api/admin/customers", {
      data: { id: "00000000-0000-4000-8000-000000000000", status: "new" },
    });
    expect(customerUpdate.status()).toBe(401);
  });

  test("authenticated admin shows a responsive 30-day inquiry funnel", async ({ page }) => {
    const password = process.env.ADMIN_DASHBOARD_PASSWORD;
    test.skip(!password, "Admin password is only supplied during authenticated verification.");
    await page.goto("/admin");
    await page.getByLabel("管理员密码").fill(password!);
    await page.getByRole("button", { name: "登录后台" }).click();
    await expect(page.getByRole("heading", { name: "今天先处理什么" })).toBeVisible({ timeout: 15_000 });
    await page.locator(".admin-dashboard-disclosure").first().locator("summary").click();
    const funnel = page.locator(".admin-funnel-panel");
    await expect(funnel).toBeVisible();
    await expect(funnel).toContainText("询盘转化漏斗");
    await expect(funnel).toContainText("报价意向");
    await expect(funnel).toContainText("开始填写");
    await expect(funnel).toContainText("成功询盘");
    await expect(funnel).toContainText("表单完成率");
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });

  test("long pages expose lightweight reading progress while admin stays distraction free", async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    await page.goto("/en");
    const progress = page.locator(".front-page-progress");
    await expect(progress).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await expect.poll(() => progress.locator("span").evaluate((element) => getComputedStyle(element).transform)).not.toBe("matrix(0, 0, 0, 1, 0, 0)");

    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    expect(runtimeErrors).toEqual([]);

    await page.goto("/admin");
    await expect(page.locator(".front-page-progress")).toHaveCount(0);
  });
});
