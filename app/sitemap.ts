import type { MetadataRoute } from "next";
import { company, products } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const localized = (path: string) => ({
    languages: {
      ...Object.fromEntries(
        ["en", "es", "pt", "fr", "ar", "zh", "ru"].map((lang) => [
          lang,
          `${company.siteUrl}${path}${lang === "en" ? "" : `?lang=${lang}`}`,
        ]),
      ),
      "x-default": `${company.siteUrl}${path}`,
    },
  });

  return [
    {
      url: company.siteUrl,
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
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: localized("/resources"),
    },
    {
      url: `${company.siteUrl}/products`,
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
      url: `${company.siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localized("/contact"),
    },
    {
      url: `${company.siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: localized("/privacy"),
    },
    ...["product-selector", "bundle-configurator", "savings-calculator", "inquiry-builder"].map((tool) => ({
      url: `${company.siteUrl}/tools/${tool}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: localized(`/tools/${tool}`),
    })),
    ...products.map((product) => ({
      url: `${company.siteUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: localized(`/products/${product.slug}`),
    })),
  ];
}
