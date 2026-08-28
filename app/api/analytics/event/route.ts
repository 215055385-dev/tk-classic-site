import { NextResponse } from "next/server";
import { z } from "zod";
import { conversionEventNames, recordEvent, type PublicConversionEventName } from "@/lib/admin-service";

export const runtime = "nodejs";

const allowedEvents = new Set<string>(conversionEventNames);
const MAX_EVENT_BODY_BYTES = 16 * 1024;
const eventSchema = z.object({
  name: z.string().max(80),
  path: z.string().max(500),
  lang: z.string().max(12).optional(),
  product: z.string().max(80).optional(),
  referrer: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_EVENT_BODY_BYTES) return new NextResponse(null, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  const payload = parsed.data;
  const name = payload.name;
  const path = payload.path;
  if (!allowedEvents.has(name) || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  const metadata = payload.metadata ?? {};
  if (JSON.stringify(metadata).length > 4096) return new NextResponse(null, { status: 204 });

  try {
    await recordEvent({
      name: name as PublicConversionEventName,
      path,
      lang: payload.lang ?? "en",
      product: payload.product ?? "",
      referrer: payload.referrer ?? request.headers.get("referer") ?? "",
      userAgent: request.headers.get("user-agent") ?? "unknown",
      metadata,
    });
  } catch (error) {
    console.error("Conversion event tracking failed", error);
  }
  return new NextResponse(null, { status: 204 });
}
