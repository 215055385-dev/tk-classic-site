import { getPrisma } from "@/lib/prisma";
import { products as sourceProducts } from "@/lib/site-data";

const specLabels: Record<string, string> = {
  model: "型号", cup: "杯容量", capacity: "水箱 / 冲煮容量", pressure: "压力",
  battery: "电池", material: "材质", charging: "充电", heat: "加热",
  size: "尺寸", life: "续航 / 冲煮次数", adapter: "兼容与选配",
};

export async function ensureProductSeed() {
  const db = getPrisma();
  if ((await db.product.count()) > 0) return;

  await db.$transaction(async (tx) => {
    const category = await tx.productCategory.upsert({
      where: { slug: "portable-espresso-machines" },
      update: {},
      create: {
        slug: "portable-espresso-machines",
        translations: { create: [{ locale: "en", name: "Portable espresso machines" }, { locale: "zh", name: "便携式意式咖啡机" }] },
      },
    });

    for (const [index, item] of sourceProducts.entries()) {
      const media = await tx.mediaAsset.create({
        data: {
          type: "IMAGE", visibility: "PUBLIC", category: "PRODUCT",
          storageBucket: "legacy-public", storagePath: `legacy/${item.slug}/hero`,
          publicUrl: item.hero, filename: `${item.slug}-hero.webp`, originalName: `${item.model} official hero`,
          mimeType: "image/webp", bytes: BigInt(0), altText: `${item.model} portable espresso machine`,
        },
      });
      const product = await tx.product.create({ data: { slug: item.slug, model: item.model, categoryId: category.id, status: "PUBLISHED", sortOrder: index + 1, lockedModel: true, publishedAt: new Date() } });
      await tx.productTranslation.createMany({ data: Object.entries(item.summary).map(([locale, summary]) => ({ productId: product.id, locale, name: item.model, summary, featureLabel: locale === "en" ? item.featureLabel : null, seoTitle: locale === "en" ? `${item.model} Portable Espresso Machine | OEM & ODM` : null, seoDescription: locale === "en" ? summary : null })) });
      for (const [specIndex, [key, value]] of Object.entries(item.spec).entries()) {
        const spec = await tx.productSpec.create({ data: { productId: product.id, key, value, sortOrder: specIndex + 1 } });
        await tx.productSpecTranslation.createMany({ data: [{ specId: spec.id, locale: "en", label: key.replace(/(^.|_.)/g, (s) => s.replace("_", " ").toUpperCase()) }, { specId: spec.id, locale: "zh", label: specLabels[key] ?? key }] });
      }
      await tx.productFeature.createMany({ data: item.highlight.map((content, i) => ({ productId: product.id, locale: "en", content, sortOrder: i + 1 })) });
      await tx.productUseCase.createMany({ data: item.useCases.map((content, i) => ({ productId: product.id, locale: "en", content, sortOrder: i + 1 })) });
      await tx.productMedia.create({ data: { productId: product.id, mediaId: media.id, role: "HERO", sortOrder: 1 } });
    }
  }, { maxWait: 10_000, timeout: 60_000 });
}
