import { requireAdmin, adminErrorResponse } from "@/lib/admin-permissions";
import { listCrmCustomers, updateCrmCustomer } from "@/lib/customer-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return Response.json({ ok: true, customers: await listCrmCustomers() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin(true, request);
    const body = await request.json() as Record<string, unknown>;
    const id = String(body.id ?? "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return Response.json({ ok: false, error: "客户编号无效。" }, { status: 400 });
    }
    const customer = await updateCrmCustomer(id, {
      status: String(body.status ?? "new"),
      owner: String(body.owner ?? ""),
      tags: String(body.tags ?? ""),
      nextFollowUpAt: String(body.nextFollowUpAt ?? ""),
      adminNote: String(body.adminNote ?? ""),
    });
    return Response.json({ ok: true, customer, message: "客户跟进信息已保存。" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Customer not found") return Response.json({ ok: false, error: "未找到该客户。" }, { status: 404 });
    if (message.startsWith("Invalid ")) return Response.json({ ok: false, error: "客户跟进信息格式不正确。" }, { status: 400 });
    return adminErrorResponse(error);
  }
}
