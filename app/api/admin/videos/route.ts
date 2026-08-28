import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  id: z.string().uuid().optional(), slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/), title: z.string().trim().min(2).max(240),
  description: z.string().max(2000).default(""), category: z.enum(["PRODUCT_OPERATION", "EXTRACTION_ANIMATION", "FACTORY"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), videoId: z.string().uuid(), posterId: z.string().uuid().nullable().optional(),
  productId: z.string().uuid().nullable().optional(), sortOrder: z.coerce.number().int().min(0).max(9999),
});

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
    const selected = await db.mediaAsset.findUnique({ where: { id: input.videoId }, select: { type: true } });
    if (selected?.type !== "VIDEO") return Response.json({ error: "请选择有效的视频文件。" }, { status: 400 });
    const row = await db.video.create({ data: { slug: input.slug, title: input.title, description: input.description || null, category: input.category, status: input.status, videoId: input.videoId, posterId: input.posterId || null, productId: input.productId || null, sortOrder: input.sortOrder } });
    await db.auditLog.create({ data: { actorId: admin.id, action: "CREATE", entityType: "video", entityId: row.id, after: input } }); revalidatePath("/", "layout");
    return Response.json({ ok: true, id: row.id });
  } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || "视频信息无效。" }, { status: 400 }); return adminErrorResponse(error); }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const input = schema.parse(await request.json()); if (!input.id) return Response.json({ error: "缺少视频编号。" }, { status: 400 }); const db = getPrisma();
    const selected = await db.mediaAsset.findUnique({ where: { id: input.videoId }, select: { type: true } });
    if (selected?.type !== "VIDEO") return Response.json({ error: "请选择有效的视频文件。" }, { status: 400 });
    await db.video.update({ where: { id: input.id }, data: { slug: input.slug, title: input.title, description: input.description || null, category: input.category, status: input.status, videoId: input.videoId, posterId: input.posterId || null, productId: input.productId || null, sortOrder: input.sortOrder } });
    await db.auditLog.create({ data: { actorId: admin.id, action: "UPDATE", entityType: "video", entityId: input.id, after: input } }); revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || "视频信息无效。" }, { status: 400 }); return adminErrorResponse(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const { id } = z.object({ id: z.string().uuid() }).parse(await request.json()); const db = getPrisma();
    await db.video.delete({ where: { id } }); await db.auditLog.create({ data: { actorId: admin.id, action: "DELETE", entityType: "video", entityId: id } }); revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) { return adminErrorResponse(error); }
}
