import { getDatabase } from "@/lib/database";
import { isSalesAssignee, type SalesAssignee } from "@/lib/lead-assignment";
import { syncCustomerOwner } from "@/lib/customer-service";

export const inquiryStatuses = ["new", "contacted", "qualified", "sample_discussion", "sample_sent", "quoted", "negotiating", "won", "closed"] as const;
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
  assignedTo: SalesAssignee | "";
  salesEmailSent: boolean | null;
  customerEmailSent: boolean | null;
  emailError: string;
  emailLastAttemptAt: string;
  salesDeliveryStatus: string;
  customerDeliveryStatus: string;
  salesDeliveredAt: string;
  customerDeliveredAt: string;
  deletedAt: string;
};

export const conversionEventNames = [
  "product_view",
  "quote_click",
  "whatsapp_click",
  "brochure_download",
  "form_start",
  "video_play",
  "coffee_lab_concept",
  "coffee_lab_download",
  "generate_lead",
] as const;
export type PublicConversionEventName = (typeof conversionEventNames)[number];
export type ConversionEventName = PublicConversionEventName | "qualify_lead" | "working_lead" | "close_convert_lead" | "close_unconvert_lead";

export type AdminStats = {
  totalInquiries: number;
  newInquiries: number;
  quotedInquiries: number;
  wonInquiries: number;
  totalVisits: number;
  visitsLast7Days: number;
  organicVisitsLast30Days: number;
  organicInquiriesLast30Days: number;
  organicConversionRate: number;
  eventsLast7Days: number;
  quoteClicksLast30Days: number;
  formStartsLast30Days: number;
  leadsLast30Days: number;
  formCompletionRate: number;
  salesReadyLeadsLast30Days: number;
  wonLeadsLast30Days: number;
  leadQualificationRate: number;
  leadWinRate: number;
  emailDeliveryIssues: number;
  topProducts: Array<{ label: string; value: number }>;
  topPaths: Array<{ label: string; value: number }>;
  topReferrers: Array<{ label: string; value: number }>;
  topOrganicPaths: Array<{ label: string; value: number }>;
  topSearchEngines: Array<{ label: string; value: number }>;
  topLanguages: Array<{ label: string; value: number }>;
  dailyVisits: Array<{ label: string; value: number }>;
  dailyPerformance: Array<{ label: string; visits: number; organic: number; quoteClicks: number; formStarts: number; leads: number; completionRate: number }>;
  conversionEvents: Array<{ label: string; value: number }>;
};

let adminSchemaPromise: Promise<void> | undefined;

async function ensureAdminSchema() {
  if (!adminSchemaPromise) {
    adminSchemaPromise = initializeAdminSchema().catch((error) => {
      adminSchemaPromise = undefined;
      throw error;
    });
  }
  return adminSchemaPromise;
}

async function initializeAdminSchema() {
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
      assigned_to text,
      sales_email_sent boolean,
      customer_email_sent boolean,
      email_error text,
      email_last_attempt_at timestamptz,
      sales_email_id text,
      customer_email_id text,
      sales_delivery_status text,
      customer_delivery_status text,
      sales_delivered_at timestamptz,
      customer_delivered_at timestamptz,
      deleted_at timestamptz
    )
  `;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS accessories text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source_page text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS referrer text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS attachments jsonb`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_note text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_email_sent boolean`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_email_sent boolean`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email_error text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email_last_attempt_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_email_id text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_email_id text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_delivery_status text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_delivery_status text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_delivered_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_delivered_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS deleted_at timestamptz`;
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
  archived?: string;
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
    dailyPerformanceRows,
    totalVisitRows,
    sevenDayVisitRows,
    conversionRows,
    funnelRows,
    leadQualityRows,
    sevenDayEventRows,
    organicVisitRows,
    organicInquiryRows,
    organicPathRows,
    searchEngineRows,
  ] = await Promise.all([
    sql`
      SELECT id, created_at, name, email, company, phone, country, product, accessories,
        quantity, branding, message, lang, source, source_page, referrer, attachments, status, admin_note, assigned_to,
        sales_email_sent, customer_email_sent, email_error, email_last_attempt_at,
        sales_delivery_status, customer_delivery_status, sales_delivered_at, customer_delivered_at, deleted_at
      FROM inquiries
      ORDER BY created_at DESC
      LIMIT 500
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE deleted_at IS NULL) AS total,
        COUNT(*) FILTER (WHERE deleted_at IS NULL AND COALESCE(status, 'new') = 'new') AS new_count,
        COUNT(*) FILTER (WHERE deleted_at IS NULL AND COALESCE(status, 'new') = 'quoted') AS quoted_count,
        COUNT(*) FILTER (WHERE deleted_at IS NULL AND COALESCE(status, 'new') = 'won') AS won_count,
        COUNT(*) FILTER (
          WHERE deleted_at IS NULL AND (
            sales_email_sent = false
            OR (customer_email_sent = false AND COALESCE(source, '') <> 'website-chat')
            OR sales_delivery_status IN ('bounced', 'complained', 'failed', 'suppressed')
            OR customer_delivery_status IN ('bounced', 'complained', 'failed', 'suppressed')
          )
        ) AS email_delivery_issues
      FROM inquiries
    `,
    sql`SELECT product, COUNT(*) AS total FROM inquiries WHERE deleted_at IS NULL GROUP BY product ORDER BY total DESC LIMIT 8`,
    sql`SELECT path, COUNT(*) AS total FROM site_visits GROUP BY path ORDER BY total DESC LIMIT 8`,
    sql`SELECT COALESCE(NULLIF(referrer, ''), 'Direct / none') AS referrer, COUNT(*) AS total FROM site_visits GROUP BY 1 ORDER BY total DESC LIMIT 8`,
    sql`SELECT COALESCE(NULLIF(lang, ''), 'en') AS lang, COUNT(*) AS total FROM site_visits GROUP BY 1 ORDER BY total DESC LIMIT 8`,
    sql`WITH days AS (SELECT generate_series((now() AT TIME ZONE 'Asia/Shanghai')::date - 13, (now() AT TIME ZONE 'Asia/Shanghai')::date, interval '1 day')::date AS day), visits AS (SELECT (visited_at AT TIME ZONE 'Asia/Shanghai')::date AS day, COUNT(*) AS visits, COUNT(*) FILTER (WHERE COALESCE(referrer, '') ~* '(google[.]|bing[.]com|search[.]yahoo[.]com|duckduckgo[.]com|ecosia[.]org|yandex[.]|baidu[.]com)') AS organic FROM site_visits WHERE visited_at >= now() - interval '15 days' GROUP BY 1), events AS (SELECT (occurred_at AT TIME ZONE 'Asia/Shanghai')::date AS day, COUNT(*) FILTER (WHERE name = 'quote_click') AS quote_clicks, COUNT(*) FILTER (WHERE name = 'form_start') AS form_starts, COUNT(*) FILTER (WHERE name = 'generate_lead') AS leads FROM site_events WHERE occurred_at >= now() - interval '15 days' GROUP BY 1) SELECT TO_CHAR(days.day, 'YYYY-MM-DD') AS day, COALESCE(visits.visits, 0) AS visits, COALESCE(visits.organic, 0) AS organic, COALESCE(events.quote_clicks, 0) AS quote_clicks, COALESCE(events.form_starts, 0) AS form_starts, COALESCE(events.leads, 0) AS leads FROM days LEFT JOIN visits USING (day) LEFT JOIN events USING (day) ORDER BY days.day ASC`,
    sql`SELECT COUNT(*) AS total FROM site_visits`,
    sql`SELECT COUNT(*) AS total FROM site_visits WHERE visited_at >= now() - interval '7 days'`,
    sql`SELECT name, COUNT(*) AS total FROM site_events WHERE occurred_at >= now() - interval '30 days' GROUP BY name ORDER BY total DESC`,
    sql`SELECT COUNT(*) FILTER (WHERE name = 'quote_click') AS quote_clicks, COUNT(*) FILTER (WHERE name = 'form_start') AS form_starts, COUNT(*) FILTER (WHERE name = 'generate_lead') AS leads FROM site_events WHERE occurred_at >= now() - interval '30 days'`,
    sql`SELECT COUNT(*) AS leads, COUNT(*) FILTER (WHERE status IN ('qualified','sample_discussion','sample_sent','quoted','negotiating','won')) AS sales_ready, COUNT(*) FILTER (WHERE status = 'won') AS won FROM inquiries WHERE deleted_at IS NULL AND created_at >= now() - interval '30 days'`,
    sql`SELECT COUNT(*) AS total FROM site_events WHERE occurred_at >= now() - interval '7 days'`,
    sql`SELECT COUNT(*) AS total FROM site_visits WHERE visited_at >= now() - interval '30 days' AND COALESCE(referrer, '') ~* '(google[.]|bing[.]com|search[.]yahoo[.]com|duckduckgo[.]com|ecosia[.]org|yandex[.]|baidu[.]com)'`,
    sql`SELECT COUNT(*) AS total FROM inquiries WHERE deleted_at IS NULL AND created_at >= now() - interval '30 days' AND (COALESCE(source, '') ~* '(google|bing|yahoo|duckduckgo|ecosia|yandex|baidu)' OR COALESCE(referrer, '') ~* '(google[.]|bing[.]com|search[.]yahoo[.]com|duckduckgo[.]com|ecosia[.]org|yandex[.]|baidu[.]com)')`,
    sql`SELECT path, COUNT(*) AS total FROM site_visits WHERE visited_at >= now() - interval '30 days' AND COALESCE(referrer, '') ~* '(google[.]|bing[.]com|search[.]yahoo[.]com|duckduckgo[.]com|ecosia[.]org|yandex[.]|baidu[.]com)' GROUP BY path ORDER BY total DESC LIMIT 8`,
    sql`SELECT CASE WHEN referrer ~* 'google[.]' THEN 'Google' WHEN referrer ~* 'bing[.]com' THEN 'Bing' WHEN referrer ~* 'search[.]yahoo[.]com' THEN 'Yahoo' WHEN referrer ~* 'duckduckgo[.]com' THEN 'DuckDuckGo' WHEN referrer ~* 'ecosia[.]org' THEN 'Ecosia' WHEN referrer ~* 'yandex[.]' THEN 'Yandex' WHEN referrer ~* 'baidu[.]com' THEN 'Baidu' ELSE 'Other search' END AS engine, COUNT(*) AS total FROM site_visits WHERE visited_at >= now() - interval '30 days' AND COALESCE(referrer, '') ~* '(google[.]|bing[.]com|search[.]yahoo[.]com|duckduckgo[.]com|ecosia[.]org|yandex[.]|baidu[.]com)' GROUP BY 1 ORDER BY total DESC`,
  ]);

  const from = filters.from ? new Date(`${filters.from}T00:00:00.000Z`).getTime() : undefined;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999Z`).getTime() : undefined;
  const inquiries = inquiryRows
    .map<AdminInquiry>((row) => ({
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
      assignedTo: isSalesAssignee(String(row.assigned_to ?? ""))
        ? (String(row.assigned_to) as SalesAssignee)
        : "",
      salesEmailSent: nullableBoolean(row.sales_email_sent),
      customerEmailSent: nullableBoolean(row.customer_email_sent),
      emailError: String(row.email_error ?? ""),
      emailLastAttemptAt: row.email_last_attempt_at ? new Date(String(row.email_last_attempt_at)).toISOString() : "",
      salesDeliveryStatus: String(row.sales_delivery_status ?? (row.sales_email_sent === true ? "sent" : row.sales_email_sent === false ? "failed" : "unknown")),
      customerDeliveryStatus: String(row.customer_delivery_status ?? (row.customer_email_sent === true ? "sent" : row.customer_email_sent === false ? "failed" : "unknown")),
      salesDeliveredAt: row.sales_delivered_at ? new Date(String(row.sales_delivered_at)).toISOString() : "",
      customerDeliveredAt: row.customer_delivered_at ? new Date(String(row.customer_delivered_at)).toISOString() : "",
      deletedAt: row.deleted_at ? new Date(String(row.deleted_at)).toISOString() : "",
    }))
    .filter((row) => !filters.status || row.status === filters.status)
    .filter((row) => !filters.product || row.product === filters.product)
    .filter((row) => !filters.country || row.country.toLowerCase().includes(filters.country.toLowerCase()))
    .filter((row) => from === undefined || new Date(row.createdAt).getTime() >= from)
    .filter((row) => to === undefined || new Date(row.createdAt).getTime() <= to);
  const visibleInquiries = inquiries.filter((row) => filters.archived === "only" ? Boolean(row.deletedAt) : !row.deletedAt);

  const summary = summaryRows[0] ?? {};
  const organicVisitsLast30Days = toNumber(organicVisitRows[0]?.total);
  const organicInquiriesLast30Days = toNumber(organicInquiryRows[0]?.total);
  const funnel = funnelRows[0] ?? {};
  const quoteClicksLast30Days = toNumber(funnel.quote_clicks);
  const formStartsLast30Days = toNumber(funnel.form_starts);
  const leadsLast30Days = toNumber(funnel.leads);
  const leadQuality = leadQualityRows[0] ?? {};
  const submittedLeadsLast30Days = toNumber(leadQuality.leads);
  const salesReadyLeadsLast30Days = toNumber(leadQuality.sales_ready);
  const wonLeadsLast30Days = toNumber(leadQuality.won);
  const dailyPerformance = dailyPerformanceRows.map((row) => {
    const formStarts = toNumber(row.form_starts);
    const leads = toNumber(row.leads);
    return { label: String(row.day), visits: toNumber(row.visits), organic: toNumber(row.organic), quoteClicks: toNumber(row.quote_clicks), formStarts, leads, completionRate: formStarts ? Number(((leads / formStarts) * 100).toFixed(1)) : 0 };
  });

  const stats: AdminStats = {
    totalInquiries: toNumber(summary.total),
    newInquiries: toNumber(summary.new_count),
    quotedInquiries: toNumber(summary.quoted_count),
    wonInquiries: toNumber(summary.won_count),
    totalVisits: toNumber(totalVisitRows[0]?.total),
    visitsLast7Days: toNumber(sevenDayVisitRows[0]?.total),
    organicVisitsLast30Days,
    organicInquiriesLast30Days,
    organicConversionRate: organicVisitsLast30Days ? Number(((organicInquiriesLast30Days / organicVisitsLast30Days) * 100).toFixed(2)) : 0,
    eventsLast7Days: toNumber(sevenDayEventRows[0]?.total),
    quoteClicksLast30Days,
    formStartsLast30Days,
    leadsLast30Days,
    formCompletionRate: formStartsLast30Days ? Number(((leadsLast30Days / formStartsLast30Days) * 100).toFixed(1)) : 0,
    salesReadyLeadsLast30Days,
    wonLeadsLast30Days,
    leadQualificationRate: submittedLeadsLast30Days ? Number(((salesReadyLeadsLast30Days / submittedLeadsLast30Days) * 100).toFixed(1)) : 0,
    leadWinRate: submittedLeadsLast30Days ? Number(((wonLeadsLast30Days / submittedLeadsLast30Days) * 100).toFixed(1)) : 0,
    emailDeliveryIssues: toNumber(summary.email_delivery_issues),
    topProducts: productRows.map((row) => ({ label: String(row.product), value: toNumber(row.total) })),
    topPaths: pathRows.map((row) => ({ label: String(row.path), value: toNumber(row.total) })),
    topReferrers: referrerRows.map((row) => ({ label: String(row.referrer), value: toNumber(row.total) })),
    topOrganicPaths: organicPathRows.map((row) => ({ label: String(row.path), value: toNumber(row.total) })),
    topSearchEngines: searchEngineRows.map((row) => ({ label: String(row.engine), value: toNumber(row.total) })),
    topLanguages: languageRows.map((row) => ({ label: String(row.lang), value: toNumber(row.total) })),
    dailyVisits: dailyPerformance.map((row) => ({ label: row.label, value: row.visits })),
    dailyPerformance,
    conversionEvents: conversionRows.map((row) => ({ label: String(row.name), value: toNumber(row.total) })),
  };

  return { inquiries: visibleInquiries, stats };
}

export async function setInquiryArchived(id: string, archived: boolean) {
  await ensureAdminSchema();
  const sql = getDatabase();
  const rows = await sql`
    UPDATE inquiries
    SET deleted_at = ${archived ? new Date().toISOString() : null}::timestamptz
    WHERE id = ${id}::uuid
    RETURNING id, deleted_at
  `;
  if (!rows[0]) throw new Error("Inquiry not found");
  return {
    id: String(rows[0].id),
    deletedAt: rows[0].deleted_at ? new Date(String(rows[0].deleted_at)).toISOString() : "",
  };
}

export async function updateInquiryStatus(id: string, status: string, adminNote: string, assignedTo: string) {
  if (!inquiryStatuses.includes(status as InquiryStatus)) throw new Error("Invalid inquiry status");
  if (assignedTo && !isSalesAssignee(assignedTo)) throw new Error("Invalid inquiry assignee");
  const sql = getDatabase();
  const previous = await sql`SELECT status, product, customer_id, email FROM inquiries WHERE id = ${id}::uuid LIMIT 1`;
  if (!previous[0]) throw new Error("Inquiry not found");
  const rows = await sql`UPDATE inquiries SET status = ${status}, admin_note = ${adminNote.slice(0, 2000)}, assigned_to = ${assignedTo || null} WHERE id = ${id}::uuid RETURNING id, status, admin_note, assigned_to`;
  if (!rows[0]) throw new Error("Inquiry not found");
  await syncCustomerOwner({
    customerId: previous[0].customer_id ? String(previous[0].customer_id) : undefined,
    email: String(previous[0].email ?? ""),
    owner: assignedTo ? assignedTo as SalesAssignee : null,
  });
  if (String(previous[0].status ?? "new") !== status) {
    const eventName: ConversionEventName | undefined = status === "qualified" ? "qualify_lead"
      : (["sample_discussion", "sample_sent", "quoted", "negotiating"] as string[]).includes(status) ? "working_lead"
      : status === "won" ? "close_convert_lead"
      : status === "closed" ? "close_unconvert_lead" : undefined;
    if (eventName) await recordEvent({ name: eventName, path: "/admin/inquiries", lang: "zh", product: String(previous[0].product ?? ""), referrer: "", userAgent: "admin", metadata: { inquiryId: id, status } });
  }
  return { id: String(rows[0].id), status: String(rows[0].status) as InquiryStatus, adminNote: String(rows[0].admin_note ?? ""), assignedTo: String(rows[0].assigned_to ?? "") };
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
