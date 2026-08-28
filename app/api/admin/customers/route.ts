import { requireAdmin, adminErrorResponse } from "@/lib/admin-permissions";
import { listCrmCustomers } from "@/lib/customer-service";

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
