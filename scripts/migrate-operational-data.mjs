import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import pg from "pg";

dotenv.config({ path: ".env.local", quiet: true });

const sourceUrl = process.env.DATABASE_URL;
const targetUrl = process.env.CMS_DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL;
if (!sourceUrl || !targetUrl) throw new Error("Missing source or target database URL");
if (sourceUrl === targetUrl) throw new Error("Source and target database URLs must be different");

const source = neon(sourceUrl);
const allowSelfSigned = process.env.CMS_ALLOW_SELF_SIGNED_CERTIFICATE === "true";
const targetConnectionString = new URL(targetUrl);
if (allowSelfSigned) targetConnectionString.searchParams.delete("sslmode");
const target = new pg.Pool({
  connectionString: targetConnectionString.toString(),
  max: 1,
  ssl: allowSelfSigned ? { rejectUnauthorized: false } : undefined,
});

const inquiries = await source.query(`
  select id, created_at, name, email, company, phone, country, product,
    accessories, quantity, branding, message, lang, source, source_page,
    referrer, attachments, ip, user_agent, status, admin_note,
    sales_email_sent, customer_email_sent, email_error, email_last_attempt_at
  from inquiries
  order by created_at asc
`);

const visits = await source.query(`
  select id, visited_at, path, lang, referrer, user_agent
  from site_visits
  order by visited_at asc
`);

const events = await source.query(`
  select id, occurred_at, name, path, lang, product, referrer, user_agent, metadata
  from site_events
  order by occurred_at asc
`);

const client = await target.connect();
const copied = { inquiries: 0, siteVisits: 0, siteEvents: 0 };

try {
  await client.query("begin");

  for (const row of inquiries) {
    const result = await client.query(
      `insert into inquiries (
        id, created_at, name, email, company, phone, country, product,
        accessories, quantity, branding, message, lang, source, source_page,
        referrer, attachments, ip, user_agent, status, admin_note,
        sales_email_sent, customer_email_sent, email_error, email_last_attempt_at
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      ) on conflict (id) do nothing`,
      [
        row.id, row.created_at, row.name, row.email, row.company, row.phone,
        row.country, row.product, row.accessories, row.quantity, row.branding,
        row.message, row.lang, row.source, row.source_page, row.referrer,
        row.attachments, row.ip, row.user_agent, row.status, row.admin_note,
        row.sales_email_sent, row.customer_email_sent, row.email_error,
        row.email_last_attempt_at,
      ],
    );
    copied.inquiries += result.rowCount ?? 0;
  }

  for (const row of visits) {
    const result = await client.query(
      `insert into site_visits (id, visited_at, path, lang, referrer, user_agent)
       values ($1,$2,$3,$4,$5,$6) on conflict (id) do nothing`,
      [row.id, row.visited_at, row.path, row.lang, row.referrer, row.user_agent],
    );
    copied.siteVisits += result.rowCount ?? 0;
  }

  for (const row of events) {
    const result = await client.query(
      `insert into site_events (
        id, occurred_at, name, path, lang, product, referrer, user_agent, metadata
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) on conflict (id) do nothing`,
      [
        row.id, row.occurred_at, row.name, row.path, row.lang, row.product,
        row.referrer, row.user_agent, row.metadata ?? {},
      ],
    );
    copied.siteEvents += result.rowCount ?? 0;
  }

  await client.query("commit");
  console.log(JSON.stringify({ source: { inquiries: inquiries.length, siteVisits: visits.length, siteEvents: events.length }, copied }));
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  client.release();
  await target.end();
}
