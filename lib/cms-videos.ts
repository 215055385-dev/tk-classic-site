import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import type { ProductVideo } from "@/components/ProductVideoShowcase";

const categoryLabels = {
  PRODUCT_OPERATION: "Real product operation",
  EXTRACTION_ANIMATION: "Extraction process",
  FACTORY: "Factory presentation",
} as const;

const readProductVideos = unstable_cache(async (model: string): Promise<ProductVideo[]> => {
  try {
    const rows = await getPrisma().video.findMany({
      where: { status: "PUBLISHED", product: { is: { model } }, posterId: { not: null } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { video: true, poster: true },
    });
    return rows.flatMap((row) => {
      if (!row.video.publicUrl || !row.poster?.publicUrl || !row.description?.trim()) return [];
      return [{
        src: row.video.publicUrl,
        srcType: row.video.mimeType || "video/mp4",
        poster: row.poster.publicUrl,
        posterAlt: `${model} ${row.title} video cover`,
        label: `${categoryLabels[row.category]} / ${model}`,
        title: row.title,
        summary: row.description,
        steps: [],
        secondaryCta: { href: "#product-inquiry", label: `Request a ${model} quotation` },
        layout: row.sortOrder % 2 === 0 ? "media-right" as const : "media-left" as const,
        schema: { uploadDate: row.createdAt.toISOString() },
      }];
    });
  } catch {
    return [];
  }
}, ["cms-product-videos"], { tags: ["cms-videos"], revalidate: 300 });

export async function getCmsProductVideos(model: string) {
  return readProductVideos(model);
}
