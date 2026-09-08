import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("project documentation describes the TK Classic website", async () => {
  const readme = await readProjectFile("README.md");

  assert.match(readme, /TK Classic Independent Website/);
  assert.match(readme, /Next\.js App Router/);
  assert.doesNotMatch(readme, /vinext-starter/i);
  assert.doesNotMatch(readme, /Your site is taking shape/i);
});

test("brand favicon replaces the legacy blue grid with the TK coffee mark", async () => {
  const favicon = await readProjectFile("public/favicon.svg");
  const manifest = await readProjectFile("app/manifest.ts");

  assert.match(favicon, />TK<\/text>/);
  assert.match(favicon, /#FF7A32/);
  assert.doesNotMatch(favicon, /#0C79D8|#2E9EFF|#68C4FF/);
  assert.match(manifest, /theme_color: "#111817"/);
});

test("core buyer-facing pages and downloads exist", async () => {
  await Promise.all([
    access(new URL("app/page.tsx", root)),
    access(new URL("app/products/[slug]/page.tsx", root)),
    access(new URL("components/InquiryForm.tsx", root)),
    access(new URL("components/ProductAccessorySelector.tsx", root)),
    access(new URL("components/AccessoryCompatibilityMatrix.tsx", root)),
    access(new URL("lib/accessory-data.ts", root)),
    access(new URL("lib/site-data.ts", root)),
    access(new URL("app/llms.txt/route.ts", root)),
    access(new URL("app/resources/[slug]/page.tsx", root)),
    access(new URL("lib/buyer-guides.ts", root)),
    access(new URL("components/SiteStructuredData.tsx", root)),
    access(new URL("public/downloads/product-brochure.pdf", root)),
  ]);
});

test("buyer guides are indexable, evidence-led, and linked into discovery files", async () => {
  const [guides, guidePage, resources, oemPage, commercialCopy, sitemap, llms, siteData] = await Promise.all([
    readProjectFile("lib/buyer-guides.ts"),
    readProjectFile("app/resources/[slug]/page.tsx"),
    readProjectFile("app/resources/page.tsx"),
    readProjectFile("app/oem-odm/page.tsx"),
    readProjectFile("lib/support-page-data.ts"),
    readProjectFile("app/sitemap.ts"),
    readProjectFile("app/llms.txt/route.ts"),
    readProjectFile("lib/site-data.ts"),
  ]);

  for (const slug of [
    "portable-espresso-machine-private-label-buying-guide",
    "25-bar-portable-coffee-machine-buying-checklist",
    "oem-packaging-checklist-portable-coffee-gift-sets",
    "portable-espresso-machine-sample-approval-checklist",
    "portable-espresso-machine-rfq-checklist-us-importers",
  ]) {
    assert.match(guides, new RegExp(`slug: "${slug}"`));
  }

  assert.match(guidePage, /BlogPosting/);
  assert.match(guidePage, /BreadcrumbList/);
  assert.match(guidePage, /FAQPage/);
  assert.match(resources, /buyerGuides/);
  assert.match(oemPage, /commercialCopy/);
  assert.match(commercialCopy, /Pricing & order terms/);
  assert.match(sitemap, /buyerGuides/);
  assert.match(llms, /Buyer guides/);
  assert.match(guides, /What should a portable espresso machine RFQ include\?/);
  assert.match(guides, /Price, MOQ, payment, production and shipping arrangements should then be confirmed/);
  assert.equal((guides.match(/question: "(?:What information does TK Classic need|Are wholesale prices published|Is one MOQ published|Can a US importer request|Which payment methods|How should a buyer request)/g) ?? []).length, 6);
  assert.doesNotMatch(siteData, /OEM à partir de 500 unités/);
  assert.doesNotMatch(siteData, /يبدأ OEM من 500 قطعة/);
  assert.doesNotMatch(siteData, /Quick delivery/);
});

test("public product UI uses quotation prompts instead of published prices", async () => {
  const [priceTag, productPage, home, sitemap] = await Promise.all([
    readProjectFile("components/ProductPriceTag.tsx"),
    readProjectFile("app/products/[slug]/page.tsx"),
    readProjectFile("app/page.tsx"),
    readProjectFile("app/sitemap.ts"),
  ]);

  assert.match(priceTag, /Pricing confirmed for your order/);
  assert.doesNotMatch(priceTag, /formatUsd|Wholesale from|List price/);
  assert.doesNotMatch(productPage, /"@type": "Offer"/);
  assert.doesNotMatch(home, /tools\/savings-calculator/);
  assert.doesNotMatch(sitemap, /"savings-calculator"/);
});

test("inquiry anti-spam validation rejects missing timestamps and zero-value challenges", async () => {
  const inquiryService = await readProjectFile("lib/inquiry-service.ts");

  assert.match(inquiryService, /inquiry\.startedAt <= 0/);
  assert.match(inquiryService, /inquiry\.challengeA < 1/);
  assert.match(inquiryService, /inquiry\.challengeB < 1/);
  assert.match(inquiryService, /\\d\{1,2\}/);
});

test("homepage uses lightweight coffee motion with safe visual fallbacks", async () => {
  const [home, atmosphere, styles] = await Promise.all([
    readProjectFile("app/page.tsx"),
    readProjectFile("components/CoffeeAtmosphere.tsx"),
    readProjectFile("app/styles/editorial-simplify.css"),
  ]);

  assert.match(home, /CoffeeAtmosphere/);
  assert.match(home, /hero-coffee-orbit/);
  assert.match(atmosphere, /aria-hidden="true"/);
  assert.match(atmosphere, /coffee-crema-ring/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /scroll-snap-type: inline mandatory/);
  assert.match(styles, /flex-wrap: nowrap/);
  assert.match(styles, /product-visual-grid \.product-image-link img \{ width: 100%; height: 100%; object-fit: contain/);
});

test("factory and exhibition galleries remain available on focused pages without crowding the homepage", async () => {
  const [gallery, styles, data, localizedGallery, home, factory, exhibitions, sitemap] = await Promise.all([
    readProjectFile("components/CylindricalGallery.tsx"),
    readProjectFile("components/CylindricalGallery.module.css"),
    readProjectFile("lib/gallery-data.ts"),
    readProjectFile("lib/gallery-localization.ts"),
    readProjectFile("app/page.tsx"),
    readProjectFile("app/factory/page.tsx"),
    readProjectFile("app/exhibitions/page.tsx"),
    readProjectFile("app/sitemap.ts"),
  ]);

  assert.match(gallery, /onPointerDown/);
  assert.match(gallery, /requestAnimationFrame/);
  assert.match(gallery, /prefers-reduced-motion/);
  assert.match(gallery, /Close image viewer/);
  assert.match(styles, /perspective:/);
  assert.match(styles, /transform-style: preserve-3d/);
  assert.match(gallery, /rotateY/);
  assert.match(gallery, /translateX/);
  assert.match(gallery, /Math\.sin/);
  assert.equal((data.match(/originalFilename: "/g) ?? []).length, 14);
  assert.doesNotMatch(home, /CylindricalGallery/);
  assert.match(localizedGallery, /View Our Factory/);
  assert.match(localizedGallery, /Explore Exhibitions/);
  assert.match(localizedGallery, /查看工厂/);
  assert.match(factory, /factoryGalleryImages/);
  assert.match(factory, /exhibitionGalleryImages/);
  assert.match(exhibitions, /permanentRedirect/);
  assert.doesNotMatch(sitemap, /\/exhibitions/);
});

test("site content includes required product, SEO, and inquiry signals", async () => {
  const [home, productPage, siteData, inquiryForm, accessorySelector, accessoryData, inquiryService, translationCopy, llms, sitemap, robots, structuredData] = await Promise.all([
    readProjectFile("app/page.tsx"),
    readProjectFile("app/products/[slug]/page.tsx"),
    readProjectFile("lib/site-data.ts"),
    readProjectFile("components/InquiryForm.tsx"),
    readProjectFile("components/ProductAccessorySelector.tsx"),
    readProjectFile("lib/accessory-data.ts"),
    readProjectFile("lib/inquiry-service.ts"),
    readProjectFile("lib/translation-copy.ts"),
    readProjectFile("app/llms.txt/route.ts"),
    readProjectFile("app/sitemap.ts"),
    readProjectFile("app/robots.ts"),
    readProjectFile("components/SiteStructuredData.tsx"),
  ]);

  for (const model of ["DQ-001", "DQ-002", "DQ-005", "DQ-008", "DQ-010", "DQ-011"]) {
    assert.match(siteData, new RegExp(`model: "${model}"`));
  }

  assert.match(home, /Organization/);
  assert.match(home, /FAQPage/);
  assert.match(home, /ItemList/);
  assert.match(home, /languageAlternates/);
  assert.match(productPage, /Product/);
  assert.match(inquiryForm, /\/api\/inquiries/);
  assert.match(inquiryForm, /accessories/);
  assert.match(productPage, /ProductAccessorySelector/);
  assert.match(accessorySelector, /Every listed accessory can be selected for every TK Classic model/);
  assert.match(translationCopy, /Compatible options across every model/);
  assert.equal((accessoryData.match(/slug:\s*"[^"]+"/g) ?? []).length, 8);
  assert.match(accessoryData, /cold-rolled-steel-coffee-stand/);
  assert.match(inquiryService, /Optional accessories/);
  assert.match(inquiryForm, /ui\.form\.quantity/);
  assert.match(llms, /Every listed accessory can be selected/);
  assert.match(llms, /Factual boundaries/);
  assert.match(sitemap, /alternates/);
  assert.match(sitemap, /x-default/);
  assert.match(robots, /GPTBot/);
  assert.match(robots, /\/admin/);
  assert.match(structuredData, /WebSite/);
  assert.match(structuredData, /Organization/);
  assert.doesNotMatch(siteData, /N\/A on archive/);
});

test("GEO entity, solution, product FAQ, and question-led content assets are discoverable", async () => {
  const [productPage, productGeo, guides, solutions, sitemap, llms, structuredData] = await Promise.all([
    readProjectFile("app/products/[slug]/page.tsx"),
    readProjectFile("lib/product-geo.ts"),
    readProjectFile("lib/geo-guides.ts"),
    readProjectFile("lib/solutions.ts"),
    readProjectFile("app/sitemap.ts"),
    readProjectFile("app/llms.txt/route.ts"),
    readProjectFile("components/SiteStructuredData.tsx"),
  ]);

  for (const path of ["app/about/page.tsx", "app/manufacturer/page.tsx", "app/solutions/page.tsx", "app/solutions/[slug]/page.tsx"]) {
    await access(new URL(path, root));
  }

  for (const model of ["DQ-001", "DQ-002", "DQ-005", "DQ-008", "DQ-010", "DQ-011"]) {
    assert.match(productGeo, new RegExp(`"${model}"`));
  }

  for (const slug of [
    "choose-portable-espresso-machine-for-camping",
    "how-to-make-espresso-outdoors",
    "portable-coffee-machine-buying-guide",
    "portable-espresso-machine-vs-traditional-espresso-machine",
    "how-battery-powered-portable-coffee-machine-works",
  ]) {
    assert.match(guides, new RegExp(`slug: "${slug}"`));
  }

  assert.match(productPage, /FAQPage/);
  assert.match(productPage, /VideoObject/);
  assert.match(productPage, /uploadDate: "2026-07-30T16:46:36\+08:00"/);
  assert.match(productPage, /"@type": "Product"/);
  assert.doesNotMatch(productPage, /"@type": "Offer"/);
  assert.match(productPage, /additionalType: "https:\/\/schema\.org\/Product"/);
  assert.match(productPage, /getProductGeo/);
  assert.match(solutions, /travel-coffee/);
  assert.match(sitemap, /\/manufacturer/);
  assert.match(sitemap, /solutions/);
  assert.match(llms, /- About: \$\{company\.siteUrl\}\/about/);
  assert.match(llms, /- Manufacturer: \$\{company\.siteUrl\}\/manufacturer/);
  assert.match(structuredData, /subjectOf/);
  assert.doesNotMatch(productPage, /AggregateRating|Review/);
});

test("revised manuals are the model-specific source for product guidance", async () => {
  const [manuals, siteData, productPage, llms, guides, solutions] = await Promise.all([
    readProjectFile("lib/product-manual-data.ts"),
    readProjectFile("lib/site-data.ts"),
    readProjectFile("app/products/[slug]/page.tsx"),
    readProjectFile("app/llms.txt/route.ts"),
    readProjectFile("lib/geo-guides.ts"),
    readProjectFile("lib/solutions.ts"),
  ]);

  for (const model of ["DQ-001", "DQ-005", "DQ-010"]) {
    assert.match(manuals, new RegExp(`"${model}"`));
  }

  assert.match(siteData, /cup: "300 mL"/);
  assert.match(siteData, /battery: "9600mAh \/ 30Wh"/);
  assert.match(siteData, /About 3 min 30 sec heating; 46 sec extraction/);
  assert.match(productPage, /manual-knowledge/);
  assert.match(productPage, /Manual-verified coffee formats/);
  assert.match(llms, /Model-specific manual knowledge/);
  assert.doesNotMatch(`${guides}\n${solutions}`, /American drip chamber/);
  assert.doesNotMatch(guides, /DQ-005 and DQ-010 list two-hour/);
});

test("outdoor, travel, and road-trip landing pages remain factual and discoverable without homepage duplication", async () => {
  const [scenarioData, scenarioComponent, sitemap, llms, home] = await Promise.all([
    readProjectFile("lib/scenario-pages.ts"),
    readProjectFile("components/ScenarioLandingPage.tsx"),
    readProjectFile("app/sitemap.ts"),
    readProjectFile("app/llms.txt/route.ts"),
    readProjectFile("app/page.tsx"),
  ]);

  for (const slug of ["camping-coffee-machine", "travel-coffee-machine", "car-coffee-machine"]) {
    await access(new URL(`app/${slug}/page.tsx`, root));
    assert.match(scenarioData, new RegExp(`slug: "${slug}"`));
    assert.match(sitemap, new RegExp("scenarioPages"));
    assert.match(llms, new RegExp(slug));
    assert.doesNotMatch(home, new RegExp(`href="/${slug}"`));
  }

  assert.match(scenarioComponent, /FAQPage/);
  assert.match(scenarioComponent, /BreadcrumbList/);
  assert.match(scenarioComponent, /ItemList/);
  assert.match(scenarioData, /do not establish universal in-car charging compatibility/i);
  assert.match(scenarioData, /Confirm the intended outdoor configuration before ordering/i);
});

test("buyer-specific sourcing paths expose commercial boundaries without crowding the homepage", async () => {
  const [solutions, home, productPage, contactPage, procurement, llms] = await Promise.all([
    readProjectFile("lib/solutions.ts"),
    readProjectFile("app/page.tsx"),
    readProjectFile("app/products/[slug]/page.tsx"),
    readProjectFile("app/contact/page.tsx"),
    readProjectFile("components/ProcurementExpectation.tsx"),
    readProjectFile("app/llms.txt/route.ts"),
  ]);

  for (const slug of ["amazon-private-label", "coffee-brand-oem", "outdoor-wholesale"]) {
    assert.match(solutions, new RegExp(`slug: "${slug}"`));
  }

  assert.doesNotMatch(home, /BuyerPathways/);
  assert.match(productPage, /ProcurementExpectation/);
  assert.match(contactPage, /ProcurementExpectation/);
  assert.match(procurement, /Compliance documents/);
  assert.match(procurement, /What happens after you submit/);
  assert.match(solutions, /does not claim Amazon account management, FBA certification or guaranteed marketplace performance/i);
  assert.match(solutions, /Do not assume waterproof, drop or cold-weather ratings/i);
  assert.match(llms, /Marketplace approval, FBA certification and sales performance are not guaranteed/i);
});

test("admin chat can send original text when translation is unavailable", async () => {
  const workspace = await readProjectFile("components/admin/ChatWorkspace.tsx");
  assert.match(workspace, /translationReady && translateReply && selected\.locale !== "zh"/);
  assert.match(workspace, /sendTranslated: shouldTranslate/);
  assert.match(workspace, /翻译服务未配置；当前将按输入原文直接发送/);
});

test("CRM identifies customers by normalized email without deleting activity history", async () => {
  const [service, chatRoute, inquiryService, adminShell] = await Promise.all([
    readProjectFile("lib/customer-service.ts"),
    readProjectFile("app/api/chat/route.ts"),
    readProjectFile("lib/inquiry-service.ts"),
    readProjectFile("components/admin/AdminShell.tsx"),
  ]);
  assert.match(service, /email_normalized text NOT NULL UNIQUE/);
  assert.match(service, /ON CONFLICT \(email_normalized\) DO UPDATE/);
  assert.match(service, /inquiry_count = crm_customers\.inquiry_count \+ EXCLUDED\.inquiry_count/);
  assert.match(service, /chat_count = crm_customers\.chat_count \+ EXCLUDED\.chat_count/);
  assert.match(chatRoute, /activity: "chat"/);
  assert.match(inquiryService, /activity: "inquiry"/);
  assert.match(adminShell, /\/admin\/customers/);
});

test("new leads use a database-backed Bowie and Leo round robin", async () => {
  const assignment = await readProjectFile("lib/lead-assignment.ts");
  const inquiryService = await readProjectFile("lib/inquiry-service.ts");
  const chatRoute = await readProjectFile("app/api/chat/route.ts");
  assert.match(assignment, /salesAssignees = \["Bowie", "Leo"\]/);
  assert.match(assignment, /ON CONFLICT \(key\) DO UPDATE/);
  assert.match(inquiryService, /getNextLeadAssignee/);
  assert.match(chatRoute, /assignedTo/);
});

test("US wholesale acquisition path is factual, private-price, and conversion ready", async () => {
  const [page, quickForm, inquiryRoute, analytics, sitemap, llms, footer, siteData] = await Promise.all([
    readProjectFile("app/wholesale/usa/page.tsx"),
    readProjectFile("components/QuickInquiryForm.tsx"),
    readProjectFile("app/api/inquiries/route.ts"),
    readProjectFile("lib/client-analytics.ts"),
    readProjectFile("app/sitemap.ts"),
    readProjectFile("app/llms.txt/route.ts"),
    readProjectFile("components/SiteFooter.tsx"),
    readProjectFile("lib/site-data.ts"),
  ]);
  assert.match(page, /DQ-001/);
  assert.match(page, /DQ-010/);
  assert.match(page, /No public unit price or fixed MOQ/);
  assert.doesNotMatch(page, /ProductPriceTag|price\.sale|\$25|\$34/);
  assert.match(page, /Which portable espresso machine should a US wholesaler start with/);
  assert.match(page, /Verified model comparison/);
  assert.match(page, /Import planning data/);
  assert.match(page, /342 × 342 × 315 mm/);
  assert.match(page, /360 × 365 × 360 mm/);
  assert.match(page, /additionalProperty: logisticsByModel/);
  assert.match(page, /"@type": "ItemList"/);
  assert.match(page, /faqs\.map/);
  assert.match(quickForm, /formType" type="hidden" value="quick"/);
  assert.match(inquiryRoute, /QUICK_BUYER_TYPES/);
  assert.match(analytics, /NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL/);
  assert.match(sitemap, /\/wholesale\/usa/);
  assert.match(llms, /US wholesale sourcing/);
  assert.match(page, /Buyer research/);
  assert.match(page, /relatedGuides/);
  assert.match(footer, /US importer sourcing/);
  assert.match(siteData, /Portable Espresso Machine Manufacturer & OEM Supplier/);
});

test("organic acquisition reporting and SEO release checks remain available", async () => {
  const [service, dashboard, articleIndex, auditScript] = await Promise.all([
    readProjectFile("lib/admin-service.ts"),
    readProjectFile("components/AdminDashboard.tsx"),
    readProjectFile("app/articles/page.tsx"),
    readProjectFile("scripts/audit-public-seo.mjs"),
  ]);
  assert.match(service, /organicVisitsLast30Days/);
  assert.match(service, /topSearchEngines/);
  assert.match(dashboard, /自然搜索落地页/);
  assert.match(dashboard, /自然询盘转化率/);
  assert.match(articleIndex, /index: false, follow: true/);
  assert.match(articleIndex, /canonical/);
  assert.match(auditScript, /Expected one H1/);
});

test("Resources navigation has one clear menu with a direct hub destination", async () => {
  const [nav, redirect] = await Promise.all([
    readProjectFile("components/PrimaryNav.tsx"),
    readProjectFile("app/coffee-lab/page.tsx"),
  ]);
  assert.match(nav, /className="resources-nav-menu"/);
  assert.match(nav, /resources\.overview\[0\]/);
  assert.match(nav, /navigationPath\("\/resources", lang\)/);
  assert.match(nav, /return `\/en\$\{normalizedPath\}`/);
  assert.match(nav, /className="resources-nav-panel"/);
  assert.match(nav, /resources", lang\)\}#guides/);
  assert.doesNotMatch(nav, /key: "coffee-lab"/);
  assert.match(redirect, /permanentRedirect/);
  assert.match(redirect, /"\/oem-odm"/);
});

test("admin navigation exposes real module labels and uses the unified titanium UI", async () => {
  const [shell, dashboard, styles] = await Promise.all([
    readProjectFile("components/admin/AdminShell.tsx"),
    readProjectFile("components/AdminDashboard.tsx"),
    readProjectFile("app/admin/admin.css"),
  ]);
  assert.match(shell, /const resolvedTitle/);
  assert.match(shell, /aria-label=\{item\.label\}/);
  assert.match(shell, /复制后台地址/);
  assert.match(dashboard, /复制后台网址/);
  assert.match(dashboard, /Ctrl \+ D/);
  assert.doesNotMatch(shell, /<Menu className="admin-cms-menu-icon"/);
  assert.match(styles, /2026 admin UI consolidation/);
  assert.match(styles, /\.cms-primary:hover/);
  assert.match(styles, /box-shadow: inset 0 -3px #65cbe8/);
});

test("admin dashboard preserves lead ownership and exposes operational shortcuts", async () => {
  const [dashboard, styles] = await Promise.all([
    readProjectFile("components/AdminDashboard.tsx"),
    readProjectFile("app/admin/admin.css"),
  ]);
  assert.match(dashboard, /assignedTo: row\.assignedTo/);
  assert.match(dashboard, /今日运营中心/);
  assert.match(dashboard, /进入询盘跟进/);
  assert.match(dashboard, /href="\/admin\/products"/);
  assert.match(dashboard, /href="\/admin\/media"/);
  assert.match(dashboard, /href="\/admin\/articles"/);
  assert.match(dashboard, /href="\/admin\/chats"/);
  assert.match(styles, /\.admin-operations/);
  assert.match(styles, /\.admin-task-grid/);
});

test("front-end refinement keeps featured products consistent and buyer paths visible", async () => {
  const [home, productsPage, resourcesPage, styles, layout] = await Promise.all([
    readProjectFile("app/page.tsx"),
    readProjectFile("app/products/page.tsx"),
    readProjectFile("app/resources/page.tsx"),
    readProjectFile("app/styles/front-refinement.css"),
    readProjectFile("app/layout.tsx"),
  ]);
  assert.match(home, /tech-series-featured[\s\S]*products\/dq-010/);
  assert.match(home, /<strong>DQ-010<\/strong>/);
  assert.match(productsPage, /product-collection-feature/);
  assert.match(productsPage, /product-scenes\/dq-010-1\.webp/);
  assert.match(productsPage, /product-collection-model-links/);
  assert.doesNotMatch(productsPage, /product-collection-item item-/);
  assert.match(resourcesPage, /className="inner-page resources-page"/);
  assert.match(resourcesPage, /resources-hero-shortcuts/);
  assert.doesNotMatch(resourcesPage, /resource-start-section/);
  assert.match(styles, /\.product-collection-feature/);
  assert.match(styles, /\.resources-hero-shortcuts/);
  assert.match(layout, /front-refinement\.css/);
});

test("conversion typography reduces visible copy without removing SEO content", async () => {
  const [layout, typography, resourcesPage, oemPage, oemLab, guides, footer] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("app/styles/conversion-typography.css"),
    readProjectFile("app/resources/page.tsx"),
    readProjectFile("app/oem-odm/page.tsx"),
    readProjectFile("components/OemCoffeeLab.tsx"),
    readProjectFile("components/FeaturedBuyerGuides.tsx"),
    readProjectFile("components/SiteFooter.tsx"),
  ]);
  assert.match(layout, /conversion-typography\.css/);
  assert.match(typography, /-webkit-line-clamp: 3/);
  assert.match(typography, /font-weight: 620/);
  assert.match(typography, /coffee-lab-honeypot/);
  assert.match(typography, /clip-path: inset\(50%\)/);
  assert.match(resourcesPage, /resources\.overview\[0\]/);
  assert.match(resourcesPage, /resources\.overview\[1\]/);
  assert.match(oemPage, /local\.heroLead/);
  assert.match(oemLab, /<h2 id="oem-lab-title">\{copy\.title\}<\/h2>/);
  assert.match(guides, /Buyer guides, made practical\./);
  assert.match(footer, /className="footer-intro"/);
  assert.match(footer, /className="footer-company"/);
  assert.match(footer, /className="footer-resources"/);
  assert.match(typography, /grid-template-columns: minmax\(230px, 1\.2fr\) repeat\(3/);
  assert.match(typography, /\.inner-page\.accessories-page \.accessory-card-body/);
});

test("coffee art direction stays decorative and keeps functional type readable", async () => {
  const [layout, artDirection, packageFile] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("app/styles/coffee-art-direction.css"),
    readProjectFile("package.json"),
  ]);
  assert.match(layout, /@fontsource-variable\/cormorant-garamond\/wght\.css/);
  assert.match(layout, /coffee-art-direction\.css/);
  assert.match(packageFile, /@fontsource-variable\/cormorant-garamond/);
  assert.match(artDirection, /--coffee-display/);
  assert.match(artDirection, /section-heading > span:not\(:has\(svg\)\)::before/);
  assert.match(artDirection, /coffee-art-steam/);
  assert.match(artDirection, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(artDirection, /\.primary-action[\s\S]*font-family: var\(--coffee-display\)/);
});

test("front progress and admin shortcuts improve long-page operations without changing content", async () => {
  const [layout, progress, experience, adminShell, cms, adminStyles] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("components/PageProgress.tsx"),
    readProjectFile("app/styles/experience-polish.css"),
    readProjectFile("components/admin/AdminShell.tsx"),
    readProjectFile("components/admin/CmsManager.tsx"),
    readProjectFile("app/admin/admin.css"),
  ]);
  assert.match(layout, /<PageProgress \/>/);
  assert.match(layout, /experience-polish\.css/);
  assert.match(progress, /requestAnimationFrame/);
  assert.match(progress, /pathname\.startsWith\("\/admin"\)/);
  assert.match(experience, /front-page-progress/);
  assert.match(experience, /prefers-reduced-motion: reduce/);
  assert.match(adminShell, /admin-session-badge/);
  assert.match(cms, /searchRef/);
  assert.match(cms, /Ctrl K/);
  assert.match(cms, /aria-busy=\{loading\}/);
  assert.match(adminStyles, /2026 operations polish/);
  assert.match(adminStyles, /\.cms-toolbar kbd/);
});

test("failed inquiry emails can be retried safely from the authenticated CRM", async () => {
  const retryRoute = await readProjectFile("app/api/admin/inquiries/[id]/resend/route.ts");
  const inquiryService = await readProjectFile("lib/inquiry-service.ts");
  const workspace = await readProjectFile("components/admin/InquiryWorkspace.tsx");
  const adminCss = await readProjectFile("app/admin/admin.css");

  assert.match(retryRoute, /requireAdmin\(true, request\)/);
  assert.match(retryRoute, /claimInquiryEmailRetry/);
  assert.match(retryRoute, /Retry-After/);
  assert.match(retryRoute, /salesEmailSent === true/);
  assert.match(retryRoute, /customerEmailSent === true/);
  assert.match(inquiryService, /interval '15 seconds'/);
  assert.match(retryRoute, /manual-/);
  assert.match(workspace, /重发销售通知/);
  assert.match(workspace, /重发客户回执/);
  assert.match(workspace, /全部重发/);
  assert.match(workspace, /最后尝试/);
  assert.match(adminCss, /\.inquiry-email-actions/);
});

test("admin surfaces Resend domain health before inquiry delivery fails", async () => {
  const health = await readProjectFile("lib/email-health.ts");
  const systemRoute = await readProjectFile("app/api/admin/system/route.ts");
  const inquiries = await readProjectFile("components/admin/InquiryWorkspace.tsx");
  const settings = await readProjectFile("components/admin/SystemWorkspace.tsx");

  assert.match(health, /resend\.domains\.list\(\)/);
  assert.match(health, /domainStatus === "verified"/);
  assert.match(health, /restricted to only send emails/i);
  assert.match(health, /domainStatus: "send_only_key"/);
  assert.match(health, /senderDomain === siteDomain/);
  assert.match(health, /recipientCount > 0/);
  assert.match(systemRoute, /mode === "email-health"/);
  assert.match(systemRoute, /Cache-Control": "private, no-store"/);
  assert.match(inquiries, /邮件服务运行正常/);
  assert.match(inquiries, /邮件服务需要检查/);
  assert.match(inquiries, /真实送达、退信与投诉追踪已启用/);
  assert.match(settings, /询盘邮件基础设施/);
});

test("inquiries use a recoverable admin-only recycle bin instead of destructive deletion", async () => {
  const archiveRoute = await readProjectFile("app/api/admin/inquiries/[id]/route.ts");
  const adminService = await readProjectFile("lib/admin-service.ts");
  const inquiryService = await readProjectFile("lib/inquiry-service.ts");
  const workspace = await readProjectFile("components/admin/InquiryWorkspace.tsx");
  const schema = await readProjectFile("prisma/schema.prisma");

  assert.match(archiveRoute, /requireAdmin\(true, request\)/);
  assert.match(archiveRoute, /export async function DELETE/);
  assert.match(archiveRoute, /export async function POST/);
  assert.match(adminService, /setInquiryArchived/);
  assert.match(adminService, /deleted_at/);
  assert.match(inquiryService, /AND deleted_at IS NULL/);
  assert.match(workspace, /查看回收站/);
  assert.match(workspace, /确认移除/);
  assert.match(workspace, /恢复询盘/);
  assert.match(schema, /deletedAt\s+DateTime\?/);
});

test("customer management supports secure sales follow-up without changing source records", async () => {
  const service = await readProjectFile("lib/customer-service.ts");
  const route = await readProjectFile("app/api/admin/customers/route.ts");
  const workspace = await readProjectFile("components/admin/CustomerWorkspace.tsx");
  const adminCss = await readProjectFile("app/admin/admin.css");

  assert.match(service, /customerStatuses = \["new", "contacted", "follow_up", "qualified", "won", "inactive"\]/);
  assert.match(service, /next_follow_up_at/);
  assert.match(service, /export async function updateCrmCustomer/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /requireAdmin\(true, request\)/);
  assert.match(workspace, /截至现在待跟进/);
  assert.match(workspace, /管理客户/);
  assert.match(workspace, /保存跟进信息/);
  assert.match(workspace, /Bowie/);
  assert.match(workspace, /Leo/);
  assert.match(adminCss, /\.customer-manage-panel/);
  assert.match(adminCss, /\.customer-crm-status\.is-won/);
});

test("product CMS prevents incomplete or duplicate products from being published", async () => {
  const route = await readProjectFile("app/api/admin/cms/[resource]/route.ts");
  const manager = await readProjectFile("components/admin/CmsManager.tsx");
  const productSource = await readProjectFile("lib/cms-products.ts");
  const productPage = await readProjectFile("app/products/[slug]/page.tsx");
  const productList = await readProjectFile("app/products/page.tsx");
  const productPresentation = await readProjectFile("lib/product-presentation.ts");
  const llms = await readProjectFile("app/llms.txt/route.ts");
  const adminCss = await readProjectFile("app/admin/admin.css");

  assert.match(route, /product\.status !== "PUBLISHED"/);
  assert.match(route, /发布前必须选择官方主图/);
  assert.match(route, /发布前至少填写 3 项真实参数/);
  assert.match(route, /产品型号或 URL 路径已经存在/);
  assert.match(route, /INVALID_HERO_MEDIA/);
  assert.match(route, /galleryMediaIds/);
  assert.match(route, /MISSING_PRODUCT_GALLERY/);
  assert.match(route, /INVALID_GALLERY_MEDIA/);
  assert.match(route, /role: "GALLERY"/);
  assert.match(manager, /productPublishIssues/);
  assert.match(manager, /发布前还需补充/);
  assert.match(manager, /保存草稿/);
  assert.match(manager, /前往媒体库上传/);
  assert.match(manager, /当前选择的产品主图预览/);
  assert.match(manager, /产品详情图库/);
  assert.match(manager, /下方顺序就是前台展示顺序/);
  assert.match(manager, /上移/);
  assert.match(manager, /下移/);
  assert.match(productSource, /entry\.role === "GALLERY"/);
  assert.match(productSource, /managedGallery\.length \? managedGallery : fallback\?\.gallery/);
  assert.match(productSource, /seo:/);
  assert.match(productPage, /productSeo\?\.title/);
  assert.match(productPage, /absoluteAssetUrl/);
  assert.match(productList, /getProductSpecEntries/);
  assert.match(productPresentation, /preferredSpecKeys/);
  assert.match(llms, /await getCmsProducts\(\)/);
  assert.match(llms, /Published specifications/);
  assert.match(adminCss, /\.cms-publish-readiness/);
  assert.match(adminCss, /\.cms-product-gallery-picker/);
});

test("published product videos sync safely from the CMS to product pages", async () => {
  const route = await readProjectFile("app/api/admin/videos/route.ts");
  const workspace = await readProjectFile("components/admin/VideoWorkspace.tsx");
  const videoSource = await readProjectFile("lib/cms-videos.ts");
  const showcase = await readProjectFile("components/ProductVideoShowcase.tsx");
  const productPage = await readProjectFile("app/products/[slug]/page.tsx");
  const adminCss = await readProjectFile("app/admin/admin.css");

  assert.match(route, /发布视频前必须选择封面图片/);
  assert.match(route, /INVALID_VIDEO_MEDIA/);
  assert.match(route, /INVALID_VIDEO_POSTER/);
  assert.match(route, /revalidateTag\("cms-videos"/);
  assert.match(workspace, /videoPublishIssues/);
  assert.match(workspace, /发布预览/);
  assert.match(workspace, /发布后才会同步到关联产品页面/);
  assert.match(videoSource, /status: "PUBLISHED"/);
  assert.match(videoSource, /product: \{ is: \{ model \} \}/);
  assert.match(showcase, /video\.srcType \?\? "video\/mp4"/);
  assert.match(productPage, /await getCmsProductVideos\(product\.model\)/);
  assert.match(productPage, /managedVideos\.length \? managedVideos/);
  assert.match(productPage, /productVideos\.map/);
  assert.match(adminCss, /\.cms-video-selection-preview/);
});

test("Resend delivery webhooks are verified, idempotent, and visible in CRM", async () => {
  const route = await readProjectFile("app/api/webhooks/resend/route.ts");
  const delivery = await readProjectFile("lib/email-delivery-events.ts");
  const inquiryService = await readProjectFile("lib/inquiry-service.ts");
  const adminService = await readProjectFile("lib/admin-service.ts");
  const workspace = await readProjectFile("components/admin/InquiryWorkspace.tsx");

  assert.match(route, /resend\.webhooks\.verify/);
  assert.match(route, /RESEND_WEBHOOK_SECRET/);
  assert.match(route, /svix-id/);
  assert.match(delivery, /ON CONFLICT \(svix_id\) DO NOTHING/);
  assert.match(delivery, /email\.delivered/);
  assert.match(delivery, /email\.bounced/);
  assert.match(inquiryService, /salesEmailId/);
  assert.match(adminService, /sales_delivery_status/);
  assert.match(workspace, /已送达/);
  assert.match(workspace, /已退信/);
});

test("customer CRM separates today and overdue follow-ups", async () => {
  const workspace = await readProjectFile("components/admin/CustomerWorkspace.tsx");
  assert.match(workspace, /今日跟进/);
  assert.match(workspace, /已经超期/);
  assert.match(workspace, /按跟进时间筛选/);
  assert.match(workspace, /todayBounds/);
});

test("customer CRM exposes a unified timeline and audited owner queues", async () => {
  const service = await readProjectFile("lib/customer-service.ts");
  const timelineRoute = await readProjectFile("app/api/admin/customers/[id]/timeline/route.ts");
  const customerRoute = await readProjectFile("app/api/admin/customers/route.ts");
  const workspace = await readProjectFile("components/admin/CustomerWorkspace.tsx");
  const adminCss = await readProjectFile("app/admin/admin.css");
  const auditService = await readProjectFile("lib/audit-log-service.ts");

  assert.match(service, /export async function getCustomerTimeline/);
  assert.match(service, /FROM chat_conversations/);
  assert.match(service, /FROM audit_logs/);
  assert.match(service, /to_regclass\('public\.chat_conversations'\)/);
  assert.match(auditService, /CREATE TABLE IF NOT EXISTS audit_logs/);
  assert.match(timelineRoute, /requireAdmin\(\)/);
  assert.match(timelineRoute, /Cache-Control": "private, no-store/);
  assert.match(customerRoute, /CUSTOMER_FOLLOW_UP_UPDATE/);
  assert.match(customerRoute, /auditLog\.create/);
  assert.match(workspace, /客户互动时间轴/);
  assert.match(workspace, /负责人快捷视图/);
  assert.match(adminCss, /\.customer-timeline-panel/);
  assert.match(adminCss, /\.customer-owner-queues/);
});

test("lead ownership stays synchronized across inquiries, chats, and customer profiles", async () => {
  const customerService = await readProjectFile("lib/customer-service.ts");
  const inquiryService = await readProjectFile("lib/inquiry-service.ts");
  const adminService = await readProjectFile("lib/admin-service.ts");
  const chatRoute = await readProjectFile("app/api/admin/chats/route.ts");
  const publicChatRoute = await readProjectFile("app/api/chat/route.ts");
  const inquiryWorkspace = await readProjectFile("components/admin/InquiryWorkspace.tsx");
  const customerWorkspace = await readProjectFile("components/admin/CustomerWorkspace.tsx");

  assert.match(customerService, /owner = COALESCE\(crm_customers\.owner, EXCLUDED\.owner\)/);
  assert.match(customerService, /export async function syncCustomerOwner/);
  assert.match(customerService, /retryPendingCustomerOwnerSyncs/);
  assert.match(customerService, /initializeCustomerOwnerReplicas/);
  assert.match(customerService, /chatConversation\.updateMany/);
  assert.match(customerService, /owner: "Bowie" \| "Leo" \| null/);
  assert.match(customerService, /customerOwnerBackfillSql/);
  assert.match(inquiryService, /owner: assignedTo/);
  assert.match(publicChatRoute, /owner: assignedTo/);
  assert.match(adminService, /syncCustomerOwner/);
  assert.match(adminService, /owner: assignedTo \? assignedTo as SalesAssignee : null/);
  assert.match(chatRoute, /z\.enum\(\["Bowie", "Leo"\]\)/);
  assert.match(chatRoute, /syncCustomerOwner/);
  assert.match(inquiryWorkspace, /客户档案/);
  assert.match(customerWorkspace, /URLSearchParams\(window\.location\.search\)/);
  assert.match(customerWorkspace, /负责人同步待重试/);
});

test("customer CRM can safely balance unassigned active customers", async () => {
  const service = await readProjectFile("lib/customer-service.ts");
  const route = await readProjectFile("app/api/admin/customers/route.ts");
  const workspace = await readProjectFile("components/admin/CustomerWorkspace.tsx");

  assert.match(service, /export async function assignUnownedCrmCustomers/);
  assert.match(route, /assignUnownedCrmCustomers\(admin.id\)/);
  const assignment = await readProjectFile("lib/customer-assignment.ts");
  const backfill = await readProjectFile("lib/customer-owner-backfill.ts");
  assert.match(assignment, /owner IS NULL/);
  assert.match(assignment, /is_test = false/);
  assert.match(assignment, /NOT IN \('won', 'inactive'\)/);
  assert.match(backfill, /owner_initialized = false/);
  assert.match(backfill, /ORDER BY inquiry\.created_at DESC/);
  assert.match(assignment, /CUSTOMER_BULK_OWNER_ASSIGN/);
  assert.match(workspace, /均衡分配未分配客户/);
  assert.match(workspace, /确认均衡分配/);
});

test("Chinese search discovery has dedicated machine-readable endpoints", async () => {
  const [layout, robots, proxy, sitemapZh, llmsZh, baiduScript, envExample, chineseGuide, resources, companyPage, productPage, oemPage, localizedUi, productGeoLocalization] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("app/robots.ts"),
    readProjectFile("proxy.ts"),
    readProjectFile("app/sitemap-zh.xml/route.ts"),
    readProjectFile("app/llms-zh.txt/route.ts"),
    readProjectFile("scripts/submit-baidu.mjs"),
    readProjectFile(".env.example"),
    readProjectFile("app/china-oem-guide/page.tsx"),
    readProjectFile("app/resources/page.tsx"),
    readProjectFile("app/company/page.tsx"),
    readProjectFile("app/products/[slug]/page.tsx"),
    readProjectFile("app/oem-odm/page.tsx"),
    readProjectFile("lib/localized-ui.ts"),
    readProjectFile("lib/product-geo.ts"),
  ]);

  assert.match(layout, /baidu-site-verification/);
  assert.match(layout, /360-site-verification/);
  assert.match(layout, /sogou_site_verification/);
  assert.match(robots, /sitemap-zh\.xml/);
  assert.match(proxy, /sitemap-zh\.xml/);
  assert.match(proxy, /llms-zh\.txt/);
  assert.match(sitemapZh, /function chineseUrl/);
  assert.match(sitemapZh, /"\/products"/);
  assert.match(sitemapZh, /chineseUrl\(`\/products\/\$\{product\.slug\}`\)/);
  assert.match(sitemapZh, /china-oem-guide/);
  assert.match(sitemapZh, /getCmsProducts/);
  assert.match(llmsZh, /事实边界/);
  assert.match(llmsZh, /不公开统一价格、MOQ、交期或质保承诺/);
  assert.match(llmsZh, /中文 OEM\/ODM 采购指南/);
  assert.match(baiduScript, /data\.zz\.baidu\.com/);
  assert.match(baiduScript, /sitemap-zh\.xml/);
  assert.match(envExample, /BAIDU_API_ENDPOINT/);
  assert.match(chineseGuide, /FAQPage/);
  assert.match(chineseGuide, /inLanguage: "zh-CN"/);
  assert.match(chineseGuide, /网站不公开统一价格、MOQ、交期和质保承诺/);
  assert.match(resources, /localizedPath\("\/china-oem-guide", "zh"\)/);
  assert.match(companyPage, /"@type": "AboutPage"/);
  assert.match(companyPage, /深圳便携式咖啡机厂家/);
  assert.match(companyPage, /联系销售团队/);
  assert.match(productPage, /"@type": "Product"/);
  assert.match(productPage, /category: lang === "zh" \? "便携式咖啡机"/);
  assert.match(productPage, /schemaLanguage = lang === "zh" \? "zh-CN"/);
  assert.doesNotMatch(productPage, /"@type": "Offer"/);
  assert.match(oemPage, /便携式咖啡设备 OEM\/ODM 与私牌定制服务/);
  assert.match(localizedUi, /适合跨境与品牌采购/);
  assert.match(localizedUi, /适合注重性价比的私牌产品线/);
  assert.match(localizedUi, /美式滴滤配件拓展使用场景/);
  assert.doesNotMatch(localizedUi, /适合欧洲采购/);
  assert.match(productGeoLocalization, /localizeSpecValue\(product\.spec\.adapter, lang\)/);
});
