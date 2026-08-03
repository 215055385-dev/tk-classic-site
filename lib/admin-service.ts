import { getDatabase } from "@/lib/database";

export const inquiryStatuses = ["new", "contacted", "quoted", "won", "closed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export type AdminInquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  product: string;
  accessories: string;
  quantity: string;
  branding: string;
  message: string;
  lang: string;
  source: string;
  sourcePage: string;
  referrer: string;
  attachmentCount: number;
  status: InquiryStatus;
  adminNote: string;
  salesEmailSent: boolean | null;
  customerEmailSent: boolean | null;
  emailError: string;
  emailLastAttemptAt: string;
};

export const conversionEventNames = [
  "product_view",
  "quote_click",
  "whatsapp_click",
  "brochure_download",
  "form_start",
  "generate_lead",
] as const;
export type ConversionEventName = (typeof conversionEventNames)[number];

export type AdminStats = {
  totalInquiries: number;
  newInquiries: number;
  quotedInquiries: number;
  wonInquiries: number;
  totalVisits: number;
  visitsLast7Days: number;
  eventsLast7Days: number;
  emailDeliveryIssues: number;
  topProducts: Array<{ label: string; value: number }>;
  topPaths: Array<{ label: string; value: number }>;
  topReferrers: Array<{ label: string; value: number }>;
  topLanguages: Array<{ label: string; value: number }>;
  dailyVisits: Array<{ label: string; value: number }>;
  conversionEvents: Array<{ label: string; value: number }>;
};

async function ensureAdminSchema() {
  const sql = getDatabase();
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id uuid PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      email text NOT NULL,
      company text,
      phone text,
      country text,
      product text NOT NULL,
      accessories text,
      quantity text NOT NULL,
      branding text,
      message text NOT NULL,
      lang text,
      source text,
      ip text,
      user_agent text,
      status text NOT NULL DEFAULT 'new',
      admin_note text,
      sales_email_sent boolean,
      customer_email_sent boolean,
      email_error text,
      email_last_attempt_at timestamptz
    )
  `;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS accessories text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source_page text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS referrer text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS attachments jsonb`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_note text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_email_sent boolean`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_email_sent boolean`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email_error text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email_last_attempt_at timestamptz`;
  await sql`
    CREATE TABLE IF NOT EXISTS site_visits (
      id uuid PRIMARY KEY,
      visited_at timestamptz NOT NULL DEFAULT now(),
      path text NOT NULL,
      lang text,
      referrer text,
      user_agent text
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS site_visits_visited_at_idx ON site_visits (visited_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS site_visits_path_idx ON site_visits (path)`;
  await sql`
    CREATE TABLE IF NOT EXISTS site_events (
      id uuid PRIMARY KEY,
      occurred_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      path text NOT NULL,
      lang text,
      product text,
      referrer text,
      user_agent text,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS site_events_occurred_at_idx ON site_events (occurred_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS site_events_name_idx ON site_events (name)`;
}

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

function countAttachments(value: unknown) {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

function nullableBoolean(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

export async function listAdminData(filters: {
  status?: string;
  product?: string;
  country?: string;
  from?: string;
  to?: string;
}) {
  await ensureAdminSchema();
  const sql = getDatabase();
  const [
    inquiryRows,
    summaryRows,
    productRows,
    pathRows,
    referrerRows,
    languageRows,
    dailyVisitRows,
    totalVisitRows,
    sevenDayVisitRows,
    conversionRows,
    sevenDayEventRows,
  ] = await Promise.all([
    sql`
      SELECT id, created_at, name, email, company, phone, country, product, accessories,
        quantity, branding, message, lang, source, source_page, referrer, attachments, status, admin_note,
        sales_email_sent, customer_email_sent, email_error, email_last_attempt_at
      FROM inquiries
      ORDER BY created_at DESC
      LIMIT 500
    `,
    sql`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE COALESCE(status, 'new') = 'new') AS new_count,
        COUNT(*) FILTER (WHERE COALESCE(status, 'new') = 'quoted') AS quoted_count,
        COUNT(*) FILTER (WHERE COALESCE(status, 'new') = 'won') AS won_count,
        COUNT(*) FILTER (
          WHERE sales_email_sent = false OR customer_email_sent = false
        ) AS email_delivery_issues
      FROM inquiries
    `,
    sql`SELECT product, COUNT(*) AS total FROM inquiries GROUP BY product ORDER BY total DESC LIMIT 8`,
    sql`SELECT path, COUNT(*) AS total FROM site_visits GROUP BY path ORDER BY total DESC LIMIT 8`,
    sql`SELECT COALESCE(NULLIF(referrer, ''), 'Direct / none') AS referrer, COUNT(*) AS total FROM site_visits GROUP BY 1 ORDER BY total DESC LIMIT 8`,
    sql`SELECT COALESCE(NULLIF(lang, ''), 'en') AS lang, COUNT(*) AS total FROM site_visits GROUP BY 1 ORDER BY total DESC LIMIT 8`,
    sql`SELECT TO_CHAR((visited_at AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS day, COUNT(*) AS total FROM site_visits WHERE visited_at >= now() - interval '14 days' GROUP BY 1 ORDER BY day ASC`,
    sql`SELECT COUNT(*) AS total FROM site_visits`,
    sql`SELECT COUNT(*) AS total FROM site_visits WHERE visited_at >= now() - interval '7 days'`,
    sql`SELECT name, COUNT(*) AS total FROM site_events GROUP BY name ORDER BY total DESC`,
    sql`SELECT COUNT(*) AS total FROM site_events WHERE occurred_at >= now() - interval '7 days'`,
  ]);

  const from = filters.from ? new Date(`${filters.from}T00:00:00.000Z`).getTime() : undefined;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999Z`).getTime() : undefined;
  const inquiries = inquiryRows
    .map((row) => ({
      id: String(row.id),
      createdAt: new Date(String(row.created_at)).toISOString(),
      name: String(row.name ?? ""),
      email: String(row.email ?? ""),
      company: String(row.company ?? ""),
      phone: String(row.phone ?? ""),
      country: String(row.country ?? ""),
      product: String(row.product ?? ""),
      accessories: String(row.accessories ?? ""),
      quantity: String(row.quantity ?? ""),
      branding: String(row.branding ?? ""),
      message: String(row.message ?? ""),
      lang: String(row.lang ?? "en"),
      source: String(row.source ?? "website"),
      sourcePage: String(row.source_page ?? ""),
      referrer: String(row.referrer ?? ""),
      attachmentCount: countAttachments(row.attachments),
      status: inquiryStatuses.includes(String(row.status) as InquiryStatus) ? String(row.status) as InquiryStatus : "new",
      adminNote: String(row.admin_note ?? ""),
      salesEmailSent: nullableBoolean(row.sales_email_sent),
      customerEmailSent: nullableBoolean(row.customer_email_sent),
      emailError: String(row.email_error ?? ""),
      emailLastAttemptAt: row.email_last_attempt_at ? new Date(String(row.email_last_attempt_at)).toISOString() : "",
    }))
    .filter((row) => !filters.status || row.status === filters.status)
    .filter((row) => !filters.product || row.product === filters.product)
    .filter((row) => !filters.country || row.country.toLowerCase().includes(filters.country.toLowerCase()))
    .filter((row) => from === undefined || new Date(row.createdAt).getTime() >= from)
    .filter((row) => to === undefined || new Date(row.createdAt).getTime() <= to);

  const summary = summaryRows[0] ?? {};

  const stats: AdminStats = {
    totalInquiries: toNumber(summary.total),
    newInquiries: toNumber(summary.new_count),
    quotedInquiries: toNumber(summary.quoted_count),
    wonInquiries: toNumber(summary.won_count),
    totalVisits: toNumber(totalVisitRows[0]?.total),
    visitsLast7Days: toNumber(sevenDayVisitRows[0]?.total),
    eventsLast7Days: toNumber(sevenDayEventRows[0]?.total),
    emailDeliveryIssues: toNumber(summary.email_delivery_issues),
    topProducts: productRows.map((row) => ({ label: String(row.product), value: toNumber(row.total) })),
    topPaths: pathRows.map((row) => ({ label: String(row.path), value: toNumber(row.total) })),
    topReferrers: referrerRows.map((row) => ({ label: String(row.referrer), value: toNumber(row.total) })),
    topLanguages: languageRows.map((row) => ({ label: String(row.lang), value: toNumber(row.total) })),
    dailyVisits: dailyVisitRows.map((row) => ({ label: String(row.day), value: toNumber(row.total) })),
    conversionEvents: conversionRows.map((row) => ({ label: String(row.name), value: toNumber(row.total) })),
  };

  return { inquiries, stats };
}

export async function updateInquiryStatus(id: string, status: string, adminNote: string) {
  if (!inquiryStatuses.includes(status as InquiryStatus)) throw new Error("Invalid inquiry status");
  const sql = getDatabase();
  const rows = await sql`
    UPDATE inquiries
    SET status = ${status}, admin_note = ${adminNote.slice(0, 2000)}
    WHERE id = ${id}::uuid
    RETURNING id, status, admin_note
  `;
  if (!rows[0]) throw new Error("Inquiry not found");
  return { id: String(rows[0].id), status: String(rows[0].status) as InquiryStatus, adminNote: String(rows[0].admin_note ?? "") };
}

export async function recordVisit(input: { path: string; lang: string; referrer: string; userAgent: string }) {
  await ensureAdminSchema();
  const sql = getDatabase();
  await sql`
    INSERT INTO site_visits (id, path, lang, referrer, user_agent)
    VALUES (${crypto.randomUUID()}, ${input.path.slice(0, 200)}, ${input.lang.slice(0, 12)}, ${input.referrer.slice(0, 500)}, ${input.userAgent.slice(0, 500)})
  `;
}

export async function recordEvent(input: {
  name: ConversionEventName;
  path: string;
  lang: string;
  product: string;
  referrer: string;
  userAgent: string;
  metadata: Record<string, unknown>;
}) {
  await ensureAdminSchema();
  const sql = getDatabase();
  await sql`
    INSERT INTO site_events (id, name, path, lang, product, referrer, user_agent, metadata)
    VALUES (
      ${crypto.randomUUID()},
      ${input.name},
      ${input.path.slice(0, 200)},
      ${input.lang.slice(0, 12)},
      ${input.product.slice(0, 80)},
      ${input.referrer.slice(0, 500)},
      ${input.userAgent.slice(0, 500)},
      ${JSON.stringify(input.metadata).slice(0, 4000)}::jsonb
    )
  `;
}
