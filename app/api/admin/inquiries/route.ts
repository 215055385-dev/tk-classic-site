import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminToken, matchesAdminSession } from "@/lib/admin-auth";
import { listAdminData, updateInquiryStatus } from "@/lib/admin-service";
import { cookies } from "next/headers";

export const runtime = "nodejs";

async function authorized() {
  try {
    const token = getAdminToken();
    const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
    return Boolean(cookie && matchesAdminSession(cookie, token));
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });

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
    return NextResponse.json({ ok: false, message: "Unable to load admin data." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const payload = body as { id?: unknown; status?: unknown; adminNote?: unknown };
  if (!payload.id || !payload.status) return NextResponse.json({ ok: false, message: "Missing inquiry update fields." }, { status: 400 });

  try {
    const result = await updateInquiryStatus(String(payload.id), String(payload.status), String(payload.adminNote ?? ""));
    return NextResponse.json({ ok: true, inquiry: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update inquiry.";
    return NextResponse.json({ ok: false, message }, { status: message === "Inquiry not found" ? 404 : 400 });
  }
}
