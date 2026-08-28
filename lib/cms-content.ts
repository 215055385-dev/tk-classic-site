import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/prisma";

export const getPublishedHomepageSections = unstable_cache(async () => {
  try {
    return await getPrisma().homepageSection.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" }, include: { translations: true } });
  } catch { return []; }
}, ["cms-homepage-sections"], { revalidate: 300, tags: ["cms-content"] });

export const getPublishedArticles = unstable_cache(async () => {
  try {
    return await getPrisma().article.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, include: { category: true, coverMedia: true, translations: true } });
  } catch { return []; }
}, ["cms-articles"], { revalidate: 300, tags: ["cms-content"] });

export async function getPublishedArticle(slug: string) {
  try { return await getPrisma().article.findFirst({ where: { slug, status: "PUBLISHED" }, include: { category: true, coverMedia: true, translations: true } }); }
  catch { return null; }
}

const getCachedCmsSeo = unstable_cache(async (path: string, locale: string) => {
  try { return await getPrisma().pageSeo.findUnique({ where: { path_locale: { path, locale } } }); }
  catch { return null; }
}, ["cms-page-seo"], { revalidate: 300, tags: ["cms-content", "cms-seo"] });

export async function getCmsSeo(path: string, locale: string) {
  return getCachedCmsSeo(path, locale);
}
