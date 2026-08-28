import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getPrisma } from "@/lib/prisma";
import { getSupabasePublishableKey, getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories = ["PRODUCT", "FACTORY", "EXHIBITION", "CERTIFICATION", "BANNER", "VIDEO_POSTER", "ARTICLE", "GENERAL"] as const;
const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "video/mp4", "video/webm"]);
const requestSchema = z.object({ action: z.enum(["prepare", "complete"]), name: z.string().min(1).max(240), type: z.string().min(1).max(100), size: z.number().int().positive(), category: z.enum(categories), altText: z.string().max(300).default(""), path: z.string().max(500).optional() });

function storageAdmin() { return createClient(getSupabaseUrl(), getSupabaseSecretKey(), { auth: { persistSession: false, autoRefreshToken: false } }); }
function uploadEndpoint() {
  const url = new URL(getSupabaseUrl());
  const hostname = url.hostname.endsWith(".storage.supabase.co") ? url.hostname : url.hostname.replace(/\.supabase\.co$/, ".storage.supabase.co");
  return `${url.protocol}//${hostname}/storage/v1/upload/resumable`;
}
function validateFile(type: string, size: number) {
  if (!allowed.has(type)) throw new Error("UNSUPPORTED_MEDIA");
  const max = type.startsWith("video/") ? 500 * 1024 * 1024 : 20 * 1024 * 1024;
  if (size > max) throw new Error("MEDIA_TOO_LARGE");
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(true, request);
    const input = requestSchema.parse(await request.json());
    validateFile(input.type, input.size);
    const bucket = "site-public";
    const supabase = storageAdmin();

    if (input.action === "prepare") {
      const extension = input.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      const safeBase = input.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "asset";
      const path = `${input.category.toLowerCase()}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeBase}.${extension}`;
      const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path, { upsert: false });
      if (error) throw error;
      return Response.json({ ok: true, endpoint: uploadEndpoint(), token: data.token, path, bucket, authorization: getSupabasePublishableKey() });
    }

    if (!input.path || !input.path.startsWith(`${input.category.toLowerCase()}/`)) return Response.json({ error: "上传路径无效。" }, { status: 400 });
    const directory = input.path.slice(0, input.path.lastIndexOf("/"));
    const filename = input.path.slice(input.path.lastIndexOf("/") + 1);
    const { data: objects, error: listError } = await supabase.storage.from(bucket).list(directory, { search: filename, limit: 2 });
    if (listError) throw listError;
    if (!objects?.some((object) => object.name === filename)) return Response.json({ error: "尚未检测到已上传文件，请稍后重试。" }, { status: 409 });
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(input.path);
    const row = await getPrisma().mediaAsset.create({ data: { type: input.type.startsWith("video/") ? "VIDEO" : "IMAGE", visibility: "PUBLIC", category: input.category, storageBucket: bucket, storagePath: input.path, publicUrl: urlData.publicUrl, filename, originalName: input.name, mimeType: input.type, bytes: BigInt(input.size), altText: input.altText || null } });
    await getPrisma().auditLog.create({ data: { actorId: admin.id, action: "UPLOAD", entityType: "media", entityId: row.id, after: { category: input.category, filename: input.name, bytes: input.size, method: "tus-resumable" } } });
    return Response.json({ ok: true, id: row.id });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "上传信息不完整或格式无效。" }, { status: 400 });
    if (error instanceof Error && error.message === "UNSUPPORTED_MEDIA") return Response.json({ error: "文件格式不受支持。" }, { status: 415 });
    if (error instanceof Error && error.message === "MEDIA_TOO_LARGE") return Response.json({ error: "图片不能超过 20MB，视频不能超过 500MB。" }, { status: 413 });
    return adminErrorResponse(error);
  }
}
