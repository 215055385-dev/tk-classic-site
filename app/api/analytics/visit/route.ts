import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/admin-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const payload = body as { path?: unknown; lang?: unknown; referrer?: unknown };
  const path = typeof payload.path === "string" ? payload.path : "/";
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await recordVisit({
      path,
      lang: typeof payload.lang === "string" ? payload.lang : "en",
      referrer: typeof payload.referrer === "string" ? payload.referrer : request.headers.get("referer") ?? "",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });
  } catch (error) {
    console.error("Visit tracking failed", error);
  }
  return new NextResponse(null, { status: 204 });
}
