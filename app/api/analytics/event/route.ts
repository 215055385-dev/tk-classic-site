import { NextResponse } from "next/server";
import { conversionEventNames, recordEvent, type ConversionEventName } from "@/lib/admin-service";

export const runtime = "nodejs";

const allowedEvents = new Set<string>(conversionEventNames);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const payload = body as {
    name?: unknown;
    path?: unknown;
    lang?: unknown;
    product?: unknown;
    referrer?: unknown;
    metadata?: unknown;
  };
  const name = typeof payload.name === "string" ? payload.name : "";
  const path = typeof payload.path === "string" ? payload.path : "/";
  if (!allowedEvents.has(name) || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  const metadata = payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata)
    ? payload.metadata as Record<string, unknown>
    : {};

  try {
    await recordEvent({
      name: name as ConversionEventName,
      path,
      lang: typeof payload.lang === "string" ? payload.lang : "en",
      product: typeof payload.product === "string" ? payload.product : "",
      referrer: typeof payload.referrer === "string" ? payload.referrer : request.headers.get("referer") ?? "",
      userAgent: request.headers.get("user-agent") ?? "unknown",
      metadata,
    });
  } catch (error) {
    console.error("Conversion event tracking failed", error);
  }
  return new NextResponse(null, { status: 204 });
}
