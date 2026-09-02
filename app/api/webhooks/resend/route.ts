import { Resend } from "resend";
import { recordResendDeliveryEvent, type ResendDeliveryEvent } from "@/lib/email-delivery-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxPayloadBytes = 1_000_000;

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) return Response.json({ ok: false }, { status: 503 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxPayloadBytes) return Response.json({ ok: false }, { status: 413 });

  const payload = await request.text();
  if (payload.length > maxPayloadBytes) return Response.json({ ok: false }, { status: 413 });
  const id = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signature = request.headers.get("svix-signature") ?? "";
  if (!id || !timestamp || !signature) return Response.json({ ok: false }, { status: 400 });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const event = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret,
    }) as ResendDeliveryEvent;
    const result = await recordResendDeliveryEvent(id, event);
    return Response.json({ ok: true, ...result }, { status: 200 });
  } catch (error) {
    console.warn("Resend webhook rejected", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ ok: false }, { status: 400 });
  }
}
