import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { setInquiryArchived } from "@/lib/admin-service";

export const runtime = "nodejs";

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

async function authorize(request: Request) {
  try {
    await requireAdmin(true, request);
    return null;
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await authorize(request);
  if (denied) return denied;
  const { id } = await context.params;
  if (!validId(id)) return NextResponse.json({ ok: false, message: "询盘编号无效。" }, { status: 400 });

  try {
    const inquiry = await setInquiryArchived(id, true);
    return NextResponse.json({ ok: true, inquiry, message: "询盘已移入回收站，可随时恢复。" });
  } catch (error) {
    const notFound = error instanceof Error && error.message === "Inquiry not found";
    return NextResponse.json({ ok: false, message: notFound ? "未找到该询盘。" : "询盘移除失败。" }, { status: notFound ? 404 : 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await authorize(request);
  if (denied) return denied;
  const { id } = await context.params;
  if (!validId(id)) return NextResponse.json({ ok: false, message: "询盘编号无效。" }, { status: 400 });

  try {
    const inquiry = await setInquiryArchived(id, false);
    return NextResponse.json({ ok: true, inquiry, message: "询盘已恢复到客户询盘列表。" });
  } catch (error) {
    const notFound = error instanceof Error && error.message === "Inquiry not found";
    return NextResponse.json({ ok: false, message: notFound ? "未找到该询盘。" : "询盘恢复失败。" }, { status: notFound ? 404 : 500 });
  }
}
