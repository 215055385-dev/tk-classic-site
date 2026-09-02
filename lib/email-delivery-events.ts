import { getDatabase } from "@/lib/database";

const trackedEvents = new Set([
  "email.sent",
  "email.delivered",
  "email.delivery_delayed",
  "email.bounced",
  "email.complained",
  "email.failed",
  "email.suppressed",
]);

const statusByEvent: Record<string, string> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.delivery_delayed": "delayed",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.failed": "failed",
  "email.suppressed": "suppressed",
};

let schemaReady: Promise<void> | null = null;

async function ensureEmailEventSchema() {
  if (!schemaReady) schemaReady = createEmailEventSchema().catch((error) => { schemaReady = null; throw error; });
  return schemaReady;
}

async function createEmailEventSchema() {
  const sql = getDatabase();
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_email_id text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_email_id text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_delivery_status text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_delivery_status text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_delivered_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_delivered_at timestamptz`;
  await sql`
    CREATE TABLE IF NOT EXISTS email_delivery_events (
      id uuid PRIMARY KEY,
      svix_id text NOT NULL UNIQUE,
      email_id text NOT NULL,
      event_type text NOT NULL,
      recipient text,
      detail text,
      occurred_at timestamptz NOT NULL,
      received_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS email_delivery_events_email_idx ON email_delivery_events (email_id, occurred_at DESC)`;
}

function cleanDetail(value: unknown) {
  if (typeof value === "string") return value.slice(0, 1000);
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  return [record.message, record.type, record.subType].filter((part) => typeof part === "string").join(" · ").slice(0, 1000);
}

export type ResendDeliveryEvent = {
  type?: unknown;
  created_at?: unknown;
  data?: {
    email_id?: unknown;
    to?: unknown;
    bounce?: unknown;
    suppressed?: unknown;
    failed?: unknown;
  };
};

export async function recordResendDeliveryEvent(svixId: string, event: ResendDeliveryEvent) {
  const eventType = String(event.type ?? "");
  const emailId = String(event.data?.email_id ?? "").slice(0, 200);
  if (!trackedEvents.has(eventType) || !emailId) return { tracked: false, duplicate: false };

  const occurredAt = new Date(String(event.created_at ?? ""));
  if (Number.isNaN(occurredAt.getTime())) throw new Error("Invalid webhook event timestamp");
  const recipients = Array.isArray(event.data?.to) ? event.data.to : [];
  const recipient = recipients.map(String).join(", ").slice(0, 500);
  const detail = cleanDetail(event.data?.bounce ?? event.data?.suppressed ?? event.data?.failed);
  const status = statusByEvent[eventType];
  const failure = ["bounced", "failed", "suppressed"].includes(status);

  await ensureEmailEventSchema();
  const sql = getDatabase();
  const inserted = await sql`
    INSERT INTO email_delivery_events (id, svix_id, email_id, event_type, recipient, detail, occurred_at)
    VALUES (${crypto.randomUUID()}, ${svixId.slice(0, 200)}, ${emailId}, ${eventType}, ${recipient || null}, ${detail || null}, ${occurredAt.toISOString()})
    ON CONFLICT (svix_id) DO NOTHING
    RETURNING id
  `;
  if (!inserted.length) return { tracked: true, duplicate: true };

  await sql`
    UPDATE inquiries
    SET
      sales_delivery_status = CASE
        WHEN sales_email_id = ${emailId} AND (${status} IN ('bounced', 'complained', 'failed', 'suppressed') OR COALESCE(sales_delivery_status, '') NOT IN ('bounced', 'complained', 'failed', 'suppressed')) THEN ${status}
        ELSE sales_delivery_status
      END,
      customer_delivery_status = CASE
        WHEN customer_email_id = ${emailId} AND (${status} IN ('bounced', 'complained', 'failed', 'suppressed') OR COALESCE(customer_delivery_status, '') NOT IN ('bounced', 'complained', 'failed', 'suppressed')) THEN ${status}
        ELSE customer_delivery_status
      END,
      sales_delivered_at = CASE WHEN sales_email_id = ${emailId} AND ${status} = 'delivered' THEN ${occurredAt.toISOString()} ELSE sales_delivered_at END,
      customer_delivered_at = CASE WHEN customer_email_id = ${emailId} AND ${status} = 'delivered' THEN ${occurredAt.toISOString()} ELSE customer_delivered_at END,
      sales_email_sent = CASE WHEN sales_email_id = ${emailId} AND ${failure} THEN false ELSE sales_email_sent END,
      customer_email_sent = CASE WHEN customer_email_id = ${emailId} AND ${failure} THEN false ELSE customer_email_sent END,
      email_error = CASE
        WHEN (sales_email_id = ${emailId} OR customer_email_id = ${emailId}) AND ${failure} THEN ${`${eventType}: ${detail || "Delivery failed"}`.slice(0, 1000)}
        ELSE email_error
      END
    WHERE sales_email_id = ${emailId} OR customer_email_id = ${emailId}
  `;

  return { tracked: true, duplicate: false };
}
