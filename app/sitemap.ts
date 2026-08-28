import type { MetadataRoute } from "next";
import { buyerGuides } from "@/lib/buyer-guides";
import { company, languages } from "@/lib/site-data";
import { localizedUrl } from "@/lib/seo";
import { getCmsProducts } from "@/lib/cms-products";
import { getPublishedArticles } from "@/lib/cms-content";
import { solutions } from "@/lib/solutions";
import { scenarioPages } from "@/lib/scenario-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cmsProducts, cmsArticles] = await Promise.all([getCmsProducts(), getPublishedArticles()]);
  const localized = (path: string) => ({
    languages: {
      ...Object.fromEntries(languages.map((language) => [language.code, localizedUrl(path, language.code)])),
      "x-default": localizedUrl(path, "en"),
    },
  });

  return [
    {
      url: company.siteUrl,
      lastModified: "2026-08-20",
      changeFrequency: "weekly",
      priority: 1,
      alternates: localized("/"),
    },
    {
      url: `${company.siteUrl}/company`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/company"),
    },
    {
      url: `${company.siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${company.siteUrl}/manufacturer`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${company.siteUrl}/oem-odm`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/oem-odm"),
    },
    {
      url: `${company.siteUrl}/factory`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/factory"),
    },
    {
      url: `${company.siteUrl}/certifications`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/certifications"),
    },
    {
      url: `${company.siteUrl}/resources`,
      lastModified: "2026-08-20",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: localized("/resources"),
    },
    {
      url: `${company.siteUrl}/products`,
      lastModified: "2026-08-20",
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: localized("/products"),
    },
    {
      url: `${company.siteUrl}/accessories`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/accessories"),
    },
    {
      url: `${company.siteUrl}/bundles`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/bundles"),
    },
    {
      url: `${company.siteUrl}/coffee-lab`,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: localized("/coffee-lab"),
    },
    {
      url: `${company.siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/contact"),
    },
    {
      url: `${company.siteUrl}/wholesale/usa`,
      lastModified: "2026-08-25",
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${company.siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: localized("/privacy"),
    },
    ...["product-selector", "bundle-configurator", "inquiry-builder"].map((tool) => ({
      url: `${company.siteUrl}/tools/${tool}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: localized(`/tools/${tool}`),
    })),
    {
      url: `${company.siteUrl}/solutions`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...solutions.map((solution) => ({
      url: `${company.siteUrl}/solutions/${solution.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),
    ...scenarioPages.map((scenario) => ({
      url: `${company.siteUrl}/${scenario.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.84,
    })),
    ...cmsProducts.map((product) => ({
      url: `${company.siteUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: localized(`/products/${product.slug}`),
    })),
    ...buyerGuides.map((guide) => ({
      url: `${company.siteUrl}/resources/${guide.slug}`,
      lastModified: guide.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...cmsArticles.map((article) => ({
      url: `${company.siteUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
