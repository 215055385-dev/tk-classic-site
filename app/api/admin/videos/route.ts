import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getPrisma } from "@/lib/prisma";
import { ensureAuditLogSchema } from "@/lib/audit-log-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  id: z.string().uuid().optional(), slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/), title: z.string().trim().min(2).max(240),
  description: z.string().max(2000).default(""), category: z.enum(["PRODUCT_OPERATION", "EXTRACTION_ANIMATION", "FACTORY"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), videoId: z.string().uuid(), posterId: z.string().uuid().nullable().optional(),
  productId: z.string().uuid().nullable().optional(), sortOrder: z.coerce.number().int().min(0).max(9999),
}).superRefine((video, context) => {
  if (video.status !== "PUBLISHED") return;
  if (!video.posterId) context.addIssue({ code: "custom", path: ["posterId"], message: "发布视频前必须选择封面图片。" });
  if (video.description.trim().length < 8) context.addIssue({ code: "custom", path: ["description"], message: "发布视频前必须填写真实视频说明。" });
  if (video.category === "PRODUCT_OPERATION" && !video.productId) context.addIssue({ code: "custom", path: ["productId"], message: "产品操作视频发布前必须关联产品型号。" });
});

function isUniqueConflict(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

async function validateReferences(input: z.infer<typeof schema>) {
  const db = getPrisma();
  const selected = await db.mediaAsset.findFirst({ where: { id: input.videoId, type: "VIDEO", deletedAt: null }, select: { id: true } });
  if (!selected) throw new Error("INVALID_VIDEO_MEDIA");
  if (input.posterId) {
    const poster = await db.mediaAsset.findFirst({ where: { id: input.posterId, type: "IMAGE", deletedAt: null }, select: { id: true } });
    if (!poster) throw new Error("INVALID_VIDEO_POSTER");
  }
  if (input.productId) {
    const product = await db.product.findUnique({ where: { id: input.productId }, select: { id: true } });
    if (!product) throw new Error("INVALID_VIDEO_PRODUCT");
  }
}

function videoErrorResponse(error: unknown) {
  if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || "视频信息无效。" }, { status: 400 });
  if (error instanceof Error && error.message === "INVALID_VIDEO_MEDIA") return Response.json({ error: "请选择有效且未删除的视频文件。" }, { status: 400 });
  if (error instanceof Error && error.message === "INVALID_VIDEO_POSTER") return Response.json({ error: "请选择有效且未删除的封面图片。" }, { status: 400 });
  if (error instanceof Error && error.message === "INVALID_VIDEO_PRODUCT") return Response.json({ error: "关联的产品不存在，请重新选择。" }, { status: 400 });
  if (isUniqueConflict(error)) return Response.json({ error: "视频 URL 标识已存在，请使用新的唯一值。" }, { status: 409 });
  return adminErrorResponse(error);
}

function revalidateVideoContent() {
  revalidatePath("/", "layout");
  revalidateTag("cms-videos", "max");
}

export async function GET() {
  try {
    await requireAdmin(); const db = getPrisma();
    const [videos, media, products] = await Promise.all([
      db.video.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }], include: { video: true, poster: true, product: { select: { id: true, model: true } } } }),
      db.mediaAsset.findMany({ where: { deletedAt: null, type: { in: ["VIDEO", "IMAGE"] } }, orderBy: { createdAt: "desc" }, select: { id: true, type: true, originalName: true, publicUrl: true, mimeType: true } }),
      db.product.findMany({ orderBy: { model: "asc" }, select: { id: true, model: true } }),
    ]);
    return Response.json({ ok: true, items: videos.map((row) => ({ id: row.id, slug: row.slug, title: row.title, description: row.description ?? "", category: row.category, status: row.status, videoId: row.videoId, posterId: row.posterId, productId: row.productId, sortOrder: row.sortOrder, videoUrl: row.video.publicUrl, posterUrl: row.poster?.publicUrl ?? null, productModel: row.product?.model ?? "", updatedAt: row.updatedAt.toISOString() })), media, products });
  } catch (error) { return adminErrorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const input = schema.parse(await request.json()); const db = getPrisma();
    await ensureAuditLogSchema();
    await validateReferences(input);
    const row = await db.video.create({ data: { slug: input.slug, title: input.title, description: input.description || null, category: input.category, status: input.status, videoId: input.videoId, posterId: input.posterId || null, productId: input.productId || null, sortOrder: input.sortOrder } });
    await db.auditLog.create({ data: { actorId: admin.id, action: "CREATE", entityType: "video", entityId: row.id, after: input } }); revalidateVideoContent();
    return Response.json({ ok: true, id: row.id });
  } catch (error) { return videoErrorResponse(error); }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const input = schema.parse(await request.json()); if (!input.id) return Response.json({ error: "缺少视频编号。" }, { status: 400 }); const db = getPrisma();
    await ensureAuditLogSchema();
    await validateReferences(input);
    await db.video.update({ where: { id: input.id }, data: { slug: input.slug, title: input.title, description: input.description || null, category: input.category, status: input.status, videoId: input.videoId, posterId: input.posterId || null, productId: input.productId || null, sortOrder: input.sortOrder } });
    await db.auditLog.create({ data: { actorId: admin.id, action: "UPDATE", entityType: "video", entityId: input.id, after: input } }); revalidateVideoContent();
    return Response.json({ ok: true });
  } catch (error) { return videoErrorResponse(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const { id } = z.object({ id: z.string().uuid() }).parse(await request.json()); const db = getPrisma();
    await ensureAuditLogSchema();
    await db.video.delete({ where: { id } }); await db.auditLog.create({ data: { actorId: admin.id, action: "DELETE", entityType: "video", entityId: id } }); revalidateVideoContent();
    return Response.json({ ok: true });
  } catch (error) { return adminErrorResponse(error); }
}
