import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { products as fallbackProducts, type Product } from "@/lib/site-data";

const readProducts = unstable_cache(async (): Promise<Product[]> => {
  try {
    const rows = await getPrisma().product.findMany({
      where: { status: "PUBLISHED" }, orderBy: [{ sortOrder: "asc" }, { model: "asc" }],
      include: { translations: true, specs: { orderBy: { sortOrder: "asc" } }, features: { orderBy: { sortOrder: "asc" } }, useCases: { orderBy: { sortOrder: "asc" } }, media: { where: { role: { in: ["HERO", "GALLERY"] } }, include: { media: true }, orderBy: { sortOrder: "asc" } } },
    });
    if (!rows.length) return fallbackProducts;
    return rows.map((row) => {
      const fallback = fallbackProducts.find((item) => item.slug === row.slug);
      const summaries = Object.fromEntries(row.translations.map((t) => [t.locale, t.summary]));
      const english = row.translations.find((t) => t.locale === "en") ?? row.translations[0];
      const truthfulBaseSummary = fallback?.summary ?? {
        en: english?.summary ?? "",
        es: english?.summary ?? "",
        pt: english?.summary ?? "",
        fr: english?.summary ?? "",
        ar: english?.summary ?? "",
        zh: english?.summary ?? "",
        ru: english?.summary ?? "",
      };
      const hero = row.media.find((entry) => entry.role === "HERO")?.media.publicUrl ?? fallback?.hero ?? "/optimized/hero-products/dq-001.webp";
      const managedGallery = [...new Set(row.media.filter((entry) => entry.role === "GALLERY").map((entry) => entry.media.publicUrl).filter((url): url is string => Boolean(url)))];
      return {
        slug: row.slug,
        model: row.model,
        summary: { ...truthfulBaseSummary, ...summaries } as Product["summary"],
        hero,
        gallery: managedGallery.length ? managedGallery : fallback?.gallery ?? [hero],
        featureLabel: english?.featureLabel ?? fallback?.featureLabel ?? "Portable espresso machine",
        price: fallback?.price ?? { regular: 0, sale: 0, currency: "USD" },
        spec: Object.fromEntries(row.specs.map((spec) => [spec.key, spec.value])),
        highlight: row.features.filter((x) => x.locale === "en").map((x) => x.content),
        useCases: row.useCases.filter((x) => x.locale === "en").map((x) => x.content),
      };
    });
  } catch {
    return fallbackProducts;
  }
}, ["cms-products"], { tags: ["cms-products"], revalidate: 300 });

export async function getCmsProducts() { return readProducts(); }
