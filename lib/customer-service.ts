import { getDatabase } from "@/lib/database";

export type CustomerActivity = "inquiry" | "chat";

export type CrmCustomer = {
  id: string;
  name: string;
  email: string;
  firstChannel: string;
  lastChannel: string;
  firstSourcePage: string;
  lastSourcePage: string;
  inquiryCount: number;
  chatCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  isTest: boolean;
};

let schemaReady: Promise<void> | null = null;

export function normalizeCustomerEmail(email: string) {
  return email.trim().toLowerCase();
}

export function identifyCustomerChannel(source: string, referrer = "") {
  const cleanSource = source.trim().slice(0, 120);
  const combined = `${cleanSource} ${referrer}`.toLowerCase();
  if (combined.includes("google")) return "Google";
  if (combined.includes("bing") || combined.includes("msclkid")) return "Bing";
  if (combined.includes("linkedin")) return "LinkedIn";
  if (combined.includes("facebook") || combined.includes("fb.com")) return "Facebook";
  if (combined.includes("instagram")) return "Instagram";
  if (combined.includes("alibaba")) return "Alibaba";
  if (cleanSource && !cleanSource.startsWith("/") && !/^https?:/i.test(cleanSource) && !["direct", "website", "website-chat"].includes(cleanSource.toLowerCase())) return cleanSource;
  if (cleanSource.toLowerCase() === "website-chat") return "Website chat";
  return "Direct";
}

export function isTestCustomer(input: { name:string; email:string; source:string }) {
  return /(^|[\s.@_-])(test|codex|verification)([\s.@_-]|$)/i.test(`${input.name} ${input.email} ${input.source}`) || /@example\.com$/i.test(input.email);
}

export async function ensureCustomerSchema() {
  if (!schemaReady) schemaReady = createCustomerSchema().catch((error) => { schemaReady = null; throw error; });
  return schemaReady;
}

async function createCustomerSchema() {
  const sql = getDatabase();
  await sql`
    CREATE TABLE IF NOT EXISTS crm_customers (
      id uuid PRIMARY KEY,
      email text NOT NULL,
      email_normalized text NOT NULL UNIQUE,
      name text NOT NULL DEFAULT '',
      first_channel text NOT NULL DEFAULT 'Direct',
      last_channel text NOT NULL DEFAULT 'Direct',
      first_source_page text NOT NULL DEFAULT '',
      last_source_page text NOT NULL DEFAULT '',
      inquiry_count integer NOT NULL DEFAULT 0 CHECK (inquiry_count >= 0),
      chat_count integer NOT NULL DEFAULT 0 CHECK (chat_count >= 0),
      first_seen_at timestamptz NOT NULL DEFAULT now(),
      last_seen_at timestamptz NOT NULL DEFAULT now(),
      is_test boolean NOT NULL DEFAULT false
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS crm_customers_last_seen_at_idx ON crm_customers (last_seen_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS crm_customers_last_channel_idx ON crm_customers (last_channel)`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false`;
}

export async function recordCustomerActivity(input: { name: string; email: string; source: string; sourcePage: string; referrer?: string; activity: CustomerActivity }) {
  await ensureCustomerSchema();
  const sql = getDatabase();
  const email = normalizeCustomerEmail(input.email);
  if (!email) throw new Error("Customer email is required");
  const channel = identifyCustomerChannel(input.source, input.referrer);
  const inquiryIncrement = input.activity === "inquiry" ? 1 : 0;
  const chatIncrement = input.activity === "chat" ? 1 : 0;
  const isTest = isTestCustomer(input);
  const rows = await sql`
    INSERT INTO crm_customers (
      id, email, email_normalized, name, first_channel, last_channel,
      first_source_page, last_source_page, inquiry_count, chat_count, is_test
    ) VALUES (
      ${crypto.randomUUID()}, ${email}, ${email}, ${input.name.trim().slice(0, 100)}, ${channel}, ${channel},
      ${input.sourcePage.slice(0, 500)}, ${input.sourcePage.slice(0, 500)}, ${inquiryIncrement}, ${chatIncrement}, ${isTest}
    )
    ON CONFLICT (email_normalized) DO UPDATE SET
      email = EXCLUDED.email,
      name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE crm_customers.name END,
      last_channel = EXCLUDED.last_channel,
      last_source_page = EXCLUDED.last_source_page,
      inquiry_count = crm_customers.inquiry_count + EXCLUDED.inquiry_count,
      chat_count = crm_customers.chat_count + EXCLUDED.chat_count,
      is_test = EXCLUDED.is_test,
      last_seen_at = now()
    RETURNING id, email, name, first_channel, last_channel, first_source_page, last_source_page,
      inquiry_count, chat_count, first_seen_at, last_seen_at, is_test
  `;
  return mapCustomer(rows[0]);
}

export async function listCrmCustomers() {
  await ensureCustomerSchema();
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, email, name, first_channel, last_channel, first_source_page, last_source_page,
      inquiry_count, chat_count, first_seen_at, last_seen_at, is_test
    FROM crm_customers
    ORDER BY last_seen_at DESC
    LIMIT 2000
  `;
  return rows.map(mapCustomer);
}

function mapCustomer(row: Record<string, unknown>): CrmCustomer {
  return {
    id: String(row.id), name: String(row.name ?? ""), email: String(row.email ?? ""),
    firstChannel: String(row.first_channel ?? "Direct"), lastChannel: String(row.last_channel ?? "Direct"),
    firstSourcePage: String(row.first_source_page ?? ""), lastSourcePage: String(row.last_source_page ?? ""),
    inquiryCount: Number(row.inquiry_count ?? 0), chatCount: Number(row.chat_count ?? 0),
    firstSeenAt: new Date(String(row.first_seen_at)).toISOString(), lastSeenAt: new Date(String(row.last_seen_at)).toISOString(),
    isTest: Boolean(row.is_test),
  };
}
