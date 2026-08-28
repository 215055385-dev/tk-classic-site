import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getPrisma } from "@/lib/prisma";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories = ["PRODUCT", "FACTORY", "EXHIBITION", "CERTIFICATION", "BANNER", "VIDEO_POSTER", "ARTICLE", "GENERAL"] as const;
const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "video/mp4", "video/webm"]);

function storageAdmin() { return createClient(getSupabaseUrl(), getSupabaseSecretKey(), { auth: { persistSession: false, autoRefreshToken: false } }); }
function serialize(item: { bytes: bigint; createdAt: Date; updatedAt: Date; _count?: Record<string, number>; [key: string]: unknown }) {
  const referenceCount = item._count ? Object.values(item._count).reduce((sum, count) => sum + count, 0) : 0;
  const data = Object.fromEntries(Object.entries(item).filter(([key]) => key !== "_count"));
  return { ...data, referenceCount, bytes: Number(item.bytes), createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() };
}

const referenceSelection = { productMedia: true, videoFiles: true, videoPosters: true, heroSlides: true, factoryEntries: true, exhibitions: true, certificationPreviews: true, certificationDocuments: true, articleCovers: true } as const;

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(); const q = request.nextUrl.searchParams.get("q")?.trim() ?? ""; const category = request.nextUrl.searchParams.get("category");
    const rows = await getPrisma().mediaAsset.findMany({ where: { deletedAt: null, ...(q ? { OR: [{ originalName: { contains: q, mode: "insensitive" } }, { altText: { contains: q, mode: "insensitive" } }] } : {}), ...(category && categories.includes(category as never) ? { category: category as typeof categories[number] } : {}) }, include: { _count: { select: referenceSelection } }, orderBy: { createdAt: "desc" } });
    return Response.json({ items: rows.map(serialize) });
  } catch (error) { return adminErrorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const data = await request.formData(); const file = data.get("file");
    if (!(file instanceof File)) return Response.json({ error: "请选择需要上传的文件。" }, { status: 400 });
    const category = z.enum(categories).parse(data.get("category") || "GENERAL"); const altText = z.string().max(300).parse(data.get("altText") || "");
    if (!allowed.has(file.type)) return Response.json({ error: "仅支持 JPG、PNG、WebP、AVIF、SVG、MP4 或 WebM 文件。" }, { status: 400 });
    const max = file.type.startsWith("video/") ? 150 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size <= 0 || file.size > max) return Response.json({ error: `文件不能为空，且不能超过  ${max / 1024 / 1024}MB` }, { status: 400 });
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const safeBase = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "asset";
    const path = `${category.toLowerCase()}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeBase}.${extension}`;
    const bucket = "site-public"; const supabase = storageAdmin(); const payload = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from(bucket).upload(path, payload, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) throw error; const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    const type = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
    const row = await getPrisma().mediaAsset.create({ data: { type, visibility: "PUBLIC", category, storageBucket: bucket, storagePath: path, publicUrl: urlData.publicUrl, filename: path.split("/").pop()!, originalName: file.name, mimeType: file.type, bytes: BigInt(file.size), altText: altText || null } });
    await getPrisma().auditLog.create({ data: { actorId: admin.id, action: "UPLOAD", entityType: "media", entityId: row.id, after: { category, filename: file.name, bytes: file.size } } });
    return Response.json({ ok: true, item: serialize(row) });
  } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: "媒体字段内容无效。" }, { status: 400 }); return adminErrorResponse(error); }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const x = z.object({ id: z.string().uuid(), category: z.enum(categories), altText: z.string().max(300), originalName: z.string().min(1).max(240) }).parse(await request.json());
    const row = await getPrisma().mediaAsset.update({ where: { id: x.id }, data: { category: x.category, altText: x.altText || null, originalName: x.originalName } });
    await getPrisma().auditLog.create({ data: { actorId: admin.id, action: "UPDATE", entityType: "media", entityId: row.id, after: x } });
    return Response.json({ ok: true, item: serialize(row) });
  } catch (error) { return adminErrorResponse(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request); const { id } = z.object({ id: z.string().uuid() }).parse(await request.json()); const db = getPrisma();
    const row = await db.mediaAsset.findUniqueOrThrow({ where: { id }, include: { _count: { select: { productMedia: true, videoFiles: true, videoPosters: true, heroSlides: true, factoryEntries: true, exhibitions: true, certificationPreviews: true, certificationDocuments: true, articleCovers: true } } } });
    const references = Object.values(row._count).reduce((a, b) => a + b, 0); if (references) return Response.json({ error: `该文件正在被 ${references} 处内容引用，请先解除引用。` }, { status: 409 });
    if (row.storageBucket === "site-public") { const { error } = await storageAdmin().storage.from(row.storageBucket).remove([row.storagePath]); if (error) throw error; }
    await db.mediaAsset.delete({ where: { id } }); await db.auditLog.create({ data: { actorId: admin.id, action: "DELETE", entityType: "media", entityId: id } });
    return Response.json({ ok: true });
  } catch (error) { return adminErrorResponse(error); }
}

