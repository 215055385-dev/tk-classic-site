import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { listAdminData, updateInquiryStatus } from "@/lib/admin-service";

export const runtime = "nodejs";

async function authorized() {
  return hasAdminSession();
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, message: "请先登录后台。" }, { status: 401 });

  const url = new URL(request.url);
  try {
    const data = await listAdminData({
      status: url.searchParams.get("status") ?? "",
      product: url.searchParams.get("product") ?? "",
      country: url.searchParams.get("country") ?? "",
      from: url.searchParams.get("from") ?? "",
      to: url.searchParams.get("to") ?? "",
    });
    return NextResponse.json({ ok: true, ...data, generatedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Admin data query failed", error);
    return NextResponse.json({ ok: false, message: "后台数据加载失败，请稍后重试。" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin(true, request);
  } catch (error) {
    return adminErrorResponse(error);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "请求格式不正确。" }, { status: 400 });
  }

  const payload = body as { id?: unknown; status?: unknown; adminNote?: unknown; assignedTo?: unknown };
  if (!payload.id || !payload.status) return NextResponse.json({ ok: false, message: "缺少询盘编号或跟进状态。" }, { status: 400 });

  try {
    const result = await updateInquiryStatus(String(payload.id), String(payload.status), String(payload.adminNote ?? ""), String(payload.assignedTo ?? ""));
    return NextResponse.json({ ok: true, inquiry: result });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "";
    const message = rawMessage === "Inquiry not found" ? "未找到该询盘。" : rawMessage === "Invalid inquiry status" ? "询盘状态无效。" : rawMessage === "Invalid inquiry assignee" ? "询盘负责人无效。" : "询盘更新失败。";
    return NextResponse.json({ ok: false, message }, { status: rawMessage === "Inquiry not found" ? 404 : 400 });
  }
}
