import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getCustomerTimeline } from "@/lib/customer-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return Response.json({ ok: false, error: "客户编号无效。" }, { status: 400 });
    }
    return Response.json({ ok: true, timeline: await getCustomerTimeline(id) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "Customer not found") {
      return Response.json({ ok: false, error: "未找到该客户。" }, { status: 404 });
    }
    return adminErrorResponse(error);
  }
}
