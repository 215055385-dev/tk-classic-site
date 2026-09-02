import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { ensureProductSeed } from "@/lib/cms-seed";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const baseProduct = z.object({
  id: z.string().uuid().optional(), slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/),
  model: z.string().trim().min(2).max(80).regex(/^[A-Z0-9][A-Z0-9-]*$/, "产品型号只能使用大写字母、数字和连字符。"), name: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(1000), description: z.string().max(20000).optional().default(""),
  featureLabel: z.string().max(160).optional().default(""), status: statusSchema,
  sortOrder: z.coerce.number().int().min(0).max(9999), heroMediaId: z.string().uuid().nullable().optional(),
  galleryMediaIds: z.array(z.string().uuid()).max(12).default([]),
  specs: z.record(z.string(), z.string().trim().min(1).max(500)).default({}), features: z.array(z.string().trim().min(1).max(500)).max(20).default([]), useCases: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  seoTitle: z.string().max(180).optional().default(""), seoDescription: z.string().max(500).optional().default(""), seoKeywords: z.array(z.string()).default([]),
}).superRefine((product, context) => {
  if (product.status !== "PUBLISHED") return;
  if (!product.heroMediaId) context.addIssue({ code: "custom", path: ["heroMediaId"], message: "发布前必须选择官方主图。" });
  if (Object.keys(product.specs).length < 3) context.addIssue({ code: "custom", path: ["specs"], message: "发布前至少填写 3 项真实参数。" });
  if (!product.features.length) context.addIssue({ code: "custom", path: ["features"], message: "发布前至少填写 1 条核心卖点。" });
  if (!product.useCases.length) context.addIssue({ code: "custom", path: ["useCases"], message: "发布前至少填写 1 个真实应用场景。" });
  if (!product.seoTitle.trim()) context.addIssue({ code: "custom", path: ["seoTitle"], message: "发布前必须填写 SEO 标题。" });
  if (!product.seoDescription.trim()) context.addIssue({ code: "custom", path: ["seoDescription"], message: "发布前必须填写 SEO 描述。" });
});
const sectionSchema = z.object({
  id: z.string().uuid().optional(), key: z.string().trim().min(2).regex(/^[a-z0-9-]+$/), type: z.string().trim().min(2).max(80),
  status: statusSchema, sortOrder: z.coerce.number().int().min(0), title: z.string().max(240).default(""), subtitle: z.string().max(500).default(""),
  body: z.string().max(30000).default(""), ctaLabel: z.string().max(100).default(""), ctaHref: z.string().max(500).default(""), settings: z.record(z.string(), z.unknown()).default({}),
});
const articleSchema = z.object({
  id: z.string().uuid().optional(), slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/), status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  title: z.string().trim().min(3).max(240), excerpt: z.string().max(1000).default(""), content: z.string().max(100000).default(""),
  category: z.string().trim().max(100).default("Buyer Guides"), coverMediaId: z.string().uuid().nullable().optional(),
  seoTitle: z.string().max(180).default(""), seoDescription: z.string().max(500).default(""),
});
const seoSchema = z.object({
  id: z.string().uuid().optional(), path: z.string().trim().min(1).startsWith("/"), locale: z.string().trim().min(2).max(12),
  title: z.string().trim().min(3).max(180), description: z.string().trim().min(10).max(500), keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().max(500).default(""), noIndex: z.boolean().default(false), schemaData: z.record(z.string(), z.unknown()).nullable().default(null),
});

async function audit(actorId: string, action: string, entityType: string, entityId?: string, after?: unknown) {
  await getPrisma().auditLog.create({ data: { actorId, action, entityType, entityId, after: after as never } });
}

function isUniqueConflict(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  try {
    await requireAdmin();
    const { resource } = await params;
    const db = getPrisma();
    if (resource === "products") {
      await ensureProductSeed();
      const [rows, media] = await Promise.all([
        db.product.findMany({ orderBy: [{ sortOrder: "asc" }, { model: "asc" }], include: { translations: true, specs: { orderBy: { sortOrder: "asc" } }, features: { orderBy: { sortOrder: "asc" } }, useCases: { orderBy: { sortOrder: "asc" } }, media: { where: { role: { in: ["HERO", "GALLERY"] } }, include: { media: true }, orderBy: { sortOrder: "asc" } } } }),
        db.mediaAsset.findMany({ where: { type: "IMAGE", deletedAt: null }, orderBy: { createdAt: "desc" }, select: { id: true, originalName: true, publicUrl: true, altText: true } }),
      ]);
      return Response.json({ items: rows.map((row) => { const en = row.translations.find((t) => t.locale === "en") ?? row.translations[0]; const hero = row.media.find((entry) => entry.role === "HERO"); const gallery = row.media.filter((entry) => entry.role === "GALLERY"); return { id: row.id, slug: row.slug, model: row.model, lockedModel: row.lockedModel, name: en?.name ?? row.model, summary: en?.summary ?? "", description: en?.description ?? "", featureLabel: en?.featureLabel ?? "", status: row.status, sortOrder: row.sortOrder, specs: Object.fromEntries(row.specs.map((s) => [s.key, s.value])), features: row.features.filter((x) => x.locale === "en").map((x) => x.content), useCases: row.useCases.filter((x) => x.locale === "en").map((x) => x.content), seoTitle: en?.seoTitle ?? "", seoDescription: en?.seoDescription ?? "", seoKeywords: en?.seoKeywords ?? [], heroMediaId: hero?.mediaId ?? null, heroUrl: hero?.media.publicUrl ?? null, galleryMediaIds: gallery.map((entry) => entry.mediaId), galleryUrls: gallery.map((entry) => entry.media.publicUrl), updatedAt: row.updatedAt.toISOString() }; }), media });
    }
    if (resource === "homepage") {
      const rows = await db.homepageSection.findMany({ orderBy: { sortOrder: "asc" }, include: { translations: { where: { locale: "en" }, take: 1 } } });
      return Response.json({ items: rows.map((row) => { const t = row.translations[0]; return { id: row.id, key: row.key, type: row.type, status: row.status, sortOrder: row.sortOrder, settings: row.settings, title: t?.title ?? "", subtitle: t?.subtitle ?? "", body: t?.body ?? "", ctaLabel: t?.ctaLabel ?? "", ctaHref: t?.ctaHref ?? "", updatedAt: row.updatedAt.toISOString() }; }) });
    }
    if (resource === "articles") {
      const [rows, media] = await Promise.all([db.article.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true, translations: { where: { locale: "en" }, take: 1 } } }), db.mediaAsset.findMany({ where: { type: "IMAGE", deletedAt: null }, select: { id: true, originalName: true, publicUrl: true } })]);
      return Response.json({ items: rows.map((row) => ({ id: row.id, slug: row.slug, status: row.status, category: row.category?.name ?? "", coverMediaId: row.coverMediaId, publishedAt: row.publishedAt?.toISOString() ?? null, updatedAt: row.updatedAt.toISOString(), title: row.translations[0]?.title ?? "", excerpt: row.translations[0]?.excerpt ?? "", content: typeof row.translations[0]?.content === "string" ? row.translations[0].content : JSON.stringify(row.translations[0]?.content ?? ""), seoTitle: row.translations[0]?.seoTitle ?? "", seoDescription: row.translations[0]?.seoDescription ?? "" })), media });
    }
    if (resource === "seo") { const rows = await db.pageSeo.findMany({ orderBy: [{ path: "asc" }, { locale: "asc" }] }); return Response.json({ items: rows.map((row) => ({ ...row, canonicalUrl: row.canonicalUrl ?? "", schemaData: row.schemaData ?? null, updatedAt: row.updatedAt.toISOString() })), settings: await db.siteSetting.findMany({ orderBy: { key: "asc" } }) }); }
    return Response.json({ error: "未知的后台资源。" }, { status: 404 });
  } catch (error) { return adminErrorResponse(error); }
}

async function saveProduct(input: z.infer<typeof baseProduct>) {
  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const existing = input.id ? await tx.product.findUnique({ where: { id: input.id } }) : null;
    const galleryMediaIds = [...new Set(input.galleryMediaIds)].filter((id) => id !== input.heroMediaId);
    if (input.heroMediaId) {
      const hero = await tx.mediaAsset.findFirst({ where: { id: input.heroMediaId, type: "IMAGE", deletedAt: null }, select: { id: true } });
      if (!hero) throw new Error("INVALID_HERO_MEDIA");
    }
    if (galleryMediaIds.length) {
      const validGallery = await tx.mediaAsset.count({ where: { id: { in: galleryMediaIds }, type: "IMAGE", deletedAt: null } });
      if (validGallery !== galleryMediaIds.length) throw new Error("INVALID_GALLERY_MEDIA");
    }
    if (input.status === "PUBLISHED" && !existing?.lockedModel && !galleryMediaIds.length) throw new Error("MISSING_PRODUCT_GALLERY");
    if (existing?.lockedModel && existing.model !== input.model) throw new Error("LOCKED_MODEL");
    const product = input.id
      ? await tx.product.update({ where: { id: input.id }, data: { slug: input.slug, model: input.model, status: input.status, sortOrder: input.sortOrder, publishedAt: input.status === "PUBLISHED" ? existing?.publishedAt ?? new Date() : null } })
      : await tx.product.create({ data: { slug: input.slug, model: input.model, status: input.status, sortOrder: input.sortOrder, publishedAt: input.status === "PUBLISHED" ? new Date() : null } });
    await tx.productTranslation.upsert({ where: { productId_locale: { productId: product.id, locale: "en" } }, update: { name: input.name, summary: input.summary, description: input.description || null, featureLabel: input.featureLabel || null, seoTitle: input.seoTitle || null, seoDescription: input.seoDescription || null, seoKeywords: input.seoKeywords }, create: { productId: product.id, locale: "en", name: input.name, summary: input.summary, description: input.description || null, featureLabel: input.featureLabel || null, seoTitle: input.seoTitle || null, seoDescription: input.seoDescription || null, seoKeywords: input.seoKeywords } });
    await Promise.all([tx.productSpec.deleteMany({ where: { productId: product.id } }), tx.productFeature.deleteMany({ where: { productId: product.id, locale: "en" } }), tx.productUseCase.deleteMany({ where: { productId: product.id, locale: "en" } })]);
    let i = 0; for (const [key, value] of Object.entries(input.specs)) await tx.productSpec.create({ data: { productId: product.id, key, value, sortOrder: ++i } });
    if (input.features.length) await tx.productFeature.createMany({ data: input.features.filter(Boolean).map((content, index) => ({ productId: product.id, locale: "en", content, sortOrder: index + 1 })) });
    if (input.useCases.length) await tx.productUseCase.createMany({ data: input.useCases.filter(Boolean).map((content, index) => ({ productId: product.id, locale: "en", content, sortOrder: index + 1 })) });
    await tx.productMedia.deleteMany({ where: { productId: product.id, role: { in: ["HERO", "GALLERY"] } } });
    if (input.heroMediaId) await tx.productMedia.create({ data: { productId: product.id, mediaId: input.heroMediaId, role: "HERO", sortOrder: 1 } });
    if (galleryMediaIds.length) await tx.productMedia.createMany({ data: galleryMediaIds.map((mediaId, index) => ({ productId: product.id, mediaId, role: "GALLERY" as const, sortOrder: index + 1 })) });
    return product;
  });
}

export async function POST(request: NextRequest, context: { params: Promise<{ resource: string }> }) {
  try {
    const admin = await requireAdmin(true, request); const { resource } = await context.params; const body = await request.json(); const db = getPrisma(); let saved: { id: string };
    if (resource === "products") saved = await saveProduct(baseProduct.parse(body));
    else if (resource === "homepage") { const x = sectionSchema.parse(body); const section = await db.homepageSection.create({ data: { key: x.key, type: x.type, status: x.status, sortOrder: x.sortOrder, settings: x.settings as never, translations: { create: { locale: "en", title: x.title || null, subtitle: x.subtitle || null, body: x.body || null, ctaLabel: x.ctaLabel || null, ctaHref: x.ctaHref || null } } } }); saved = section; }
    else if (resource === "articles") { const x = articleSchema.parse(body); const category = x.category ? await db.articleCategory.upsert({ where: { slug: x.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "buyer-guides" }, update: { name: x.category }, create: { slug: x.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "buyer-guides", name: x.category } }) : null; saved = await db.article.create({ data: { slug: x.slug, status: x.status, categoryId: category?.id, coverMediaId: x.coverMediaId, publishedAt: x.status === "PUBLISHED" ? new Date() : null, translations: { create: { locale: "en", title: x.title, excerpt: x.excerpt || null, content: x.content, seoTitle: x.seoTitle || null, seoDescription: x.seoDescription || null } } } }); }
    else if (resource === "seo") { const x = seoSchema.parse(body); saved = await db.pageSeo.create({ data: { path: x.path, locale: x.locale, title: x.title, description: x.description, keywords: x.keywords, canonicalUrl: x.canonicalUrl || null, noIndex: x.noIndex, schemaData: x.schemaData as never } }); }
    else return Response.json({ error: "未知的后台资源。" }, { status: 404 });
    await audit(admin.id, "CREATE", resource, saved.id, body); revalidatePath("/", "layout"); revalidateTag("cms-products", "max"); revalidateTag("cms-content", "max"); return Response.json({ ok: true, id: saved.id });
  } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message ?? "字段内容无效。" }, { status: 400 }); if (error instanceof Error && error.message === "LOCKED_MODEL") return Response.json({ error: "官方型号已锁定，不能修改。" }, { status: 409 }); if (error instanceof Error && error.message === "INVALID_HERO_MEDIA") return Response.json({ error: "选择的主图不存在或不是有效图片，请重新选择。" }, { status: 400 }); if (error instanceof Error && error.message === "INVALID_GALLERY_MEDIA") return Response.json({ error: "详情图库包含不存在或无效的图片，请重新选择。" }, { status: 400 }); if (error instanceof Error && error.message === "MISSING_PRODUCT_GALLERY") return Response.json({ error: "新产品发布前至少需要选择 1 张详情展示图。" }, { status: 400 }); if (isUniqueConflict(error)) return Response.json({ error: "产品型号或 URL 路径已经存在，请使用新的唯一值。" }, { status: 409 }); return adminErrorResponse(error); }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ resource: string }> }) {
  try {
    const admin = await requireAdmin(true, request); const { resource } = await context.params; const body = await request.json(); const db = getPrisma(); let id = "";
    if (resource === "products") { const x = baseProduct.parse(body); if (!x.id) throw new Error("MISSING_ID"); id = (await saveProduct(x)).id; }
    else if (resource === "homepage") { const x = sectionSchema.parse(body); if (!x.id) throw new Error("MISSING_ID"); id = x.id; await db.$transaction([db.homepageSection.update({ where: { id }, data: { key: x.key, type: x.type, status: x.status, sortOrder: x.sortOrder, settings: x.settings as never } }), db.homepageSectionTranslation.upsert({ where: { sectionId_locale: { sectionId: id, locale: "en" } }, update: { title: x.title || null, subtitle: x.subtitle || null, body: x.body || null, ctaLabel: x.ctaLabel || null, ctaHref: x.ctaHref || null }, create: { sectionId: id, locale: "en", title: x.title || null, subtitle: x.subtitle || null, body: x.body || null, ctaLabel: x.ctaLabel || null, ctaHref: x.ctaHref || null } })]); }
    else if (resource === "articles") { const x = articleSchema.parse(body); if (!x.id) throw new Error("MISSING_ID"); id = x.id; const category = x.category ? await db.articleCategory.upsert({ where: { slug: x.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "buyer-guides" }, update: { name: x.category }, create: { slug: x.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "buyer-guides", name: x.category } }) : null; await db.$transaction([db.article.update({ where: { id }, data: { slug: x.slug, status: x.status, categoryId: category?.id, coverMediaId: x.coverMediaId, publishedAt: x.status === "PUBLISHED" ? new Date() : null } }), db.articleTranslation.upsert({ where: { articleId_locale: { articleId: id, locale: "en" } }, update: { title: x.title, excerpt: x.excerpt || null, content: x.content, seoTitle: x.seoTitle || null, seoDescription: x.seoDescription || null }, create: { articleId: id, locale: "en", title: x.title, excerpt: x.excerpt || null, content: x.content, seoTitle: x.seoTitle || null, seoDescription: x.seoDescription || null } })]); }
    else if (resource === "seo") { const x = seoSchema.parse(body); if (!x.id) throw new Error("MISSING_ID"); id = x.id; await db.pageSeo.update({ where: { id }, data: { path: x.path, locale: x.locale, title: x.title, description: x.description, keywords: x.keywords, canonicalUrl: x.canonicalUrl || null, noIndex: x.noIndex, schemaData: x.schemaData as never } }); }
    else return Response.json({ error: "未知的后台资源。" }, { status: 404 });
    await audit(admin.id, "UPDATE", resource, id, body); revalidatePath("/", "layout"); revalidateTag("cms-products", "max"); revalidateTag("cms-content", "max"); return Response.json({ ok: true, id });
  } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message ?? "字段内容无效。" }, { status: 400 }); if (error instanceof Error && error.message === "LOCKED_MODEL") return Response.json({ error: "官方型号已锁定，不能修改。" }, { status: 409 }); if (error instanceof Error && error.message === "INVALID_HERO_MEDIA") return Response.json({ error: "选择的主图不存在或不是有效图片，请重新选择。" }, { status: 400 }); if (error instanceof Error && error.message === "INVALID_GALLERY_MEDIA") return Response.json({ error: "详情图库包含不存在或无效的图片，请重新选择。" }, { status: 400 }); if (error instanceof Error && error.message === "MISSING_PRODUCT_GALLERY") return Response.json({ error: "新产品发布前至少需要选择 1 张详情展示图。" }, { status: 400 }); if (isUniqueConflict(error)) return Response.json({ error: "产品型号或 URL 路径已经存在，请使用新的唯一值。" }, { status: 409 }); return adminErrorResponse(error); }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ resource: string }> }) {
  try {
    const admin = await requireAdmin(true, request); const { resource } = await context.params; const { id } = z.object({ id: z.string().uuid() }).parse(await request.json()); const db = getPrisma();
    if (resource === "products") { const item = await db.product.findUniqueOrThrow({ where: { id } }); if (item.lockedModel) await db.product.update({ where: { id }, data: { status: "ARCHIVED" } }); else await db.product.delete({ where: { id } }); }
    else if (resource === "homepage") await db.homepageSection.delete({ where: { id } });
    else if (resource === "articles") await db.article.delete({ where: { id } });
    else if (resource === "seo") await db.pageSeo.delete({ where: { id } });
    else return Response.json({ error: "未知的后台资源。" }, { status: 404 });
    await audit(admin.id, "DELETE", resource, id); revalidatePath("/", "layout"); revalidateTag("cms-products", "max"); revalidateTag("cms-content", "max"); return Response.json({ ok: true });
  } catch (error) { return adminErrorResponse(error); }
}

