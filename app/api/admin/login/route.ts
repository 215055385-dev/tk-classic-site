import { NextResponse } from "next/server";
import { adminCookieValue, getAdminToken, matchesAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const password = typeof body === "object" && body !== null && "password" in body
    ? String((body as { password?: unknown }).password ?? "")
    : "";

  try {
    const token = getAdminToken();
    if (!password || !matchesAdminToken(password, token)) {
      return NextResponse.json({ ok: false, message: "Invalid admin password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_COOKIE,
      value: adminCookieValue(token),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, message: message === "Missing ADMIN_DASHBOARD_TOKEN" ? "Admin password is not configured." : "Unable to sign in." },
      { status: message === "Missing ADMIN_DASHBOARD_TOKEN" ? 503 : 500 },
    );
  }
}
