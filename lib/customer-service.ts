import { getDatabase } from "@/lib/database";
import { ensureAuditLogSchema } from "@/lib/audit-log-service";
import { customerAssignmentSql } from "@/lib/customer-assignment";
import { customerOwnerBackfillSql } from "@/lib/customer-owner-backfill";
import { customerOwnerSyncSql } from "@/lib/customer-owner-sync";
import { getPrisma } from "@/lib/prisma";

export type CustomerActivity = "inquiry" | "chat";
export const customerStatuses = ["new", "contacted", "follow_up", "qualified", "won", "inactive"] as const;
export type CustomerStatus = (typeof customerStatuses)[number];

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
  status: CustomerStatus;
  owner: "Bowie" | "Leo" | "";
  tags: string;
  nextFollowUpAt: string;
  adminNote: string;
  updatedAt: string;
  ownerSyncPending: boolean;
};

export type CustomerTimelineItem = {
  id: string;
  type: "inquiry" | "chat" | "customer_update";
  title: string;
  detail: string;
  occurredAt: string;
  product: string;
  sourcePage: string;
  actor: string;
};

let schemaReady: Promise<void> | null = null;
let ownerBackfillReady: Promise<void> | null = null;

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
      is_test boolean NOT NULL DEFAULT false,
      crm_status text NOT NULL DEFAULT 'new',
      owner text,
      owner_initialized boolean NOT NULL DEFAULT true,
      owner_replicas_initialized boolean NOT NULL DEFAULT true,
      owner_sync_pending boolean NOT NULL DEFAULT false,
      owner_sync_error text NOT NULL DEFAULT '',
      tags text NOT NULL DEFAULT '',
      next_follow_up_at timestamptz,
      admin_note text NOT NULL DEFAULT '',
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS crm_customers_last_seen_at_idx ON crm_customers (last_seen_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS crm_customers_last_channel_idx ON crm_customers (last_channel)`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS crm_status text NOT NULL DEFAULT 'new'`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS owner text`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS owner_initialized boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS owner_replicas_initialized boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS owner_sync_pending boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS owner_sync_error text NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS tags text NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS admin_note text NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE crm_customers ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()`;
  await sql`CREATE INDEX IF NOT EXISTS crm_customers_follow_up_idx ON crm_customers (next_follow_up_at) WHERE next_follow_up_at IS NOT NULL`;
}

export async function recordCustomerActivity(input: { name: string; email: string; source: string; sourcePage: string; referrer?: string; activity: CustomerActivity; owner?: "Bowie" | "Leo" }) {
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
      first_source_page, last_source_page, inquiry_count, chat_count, is_test, owner, owner_initialized, owner_replicas_initialized
    ) VALUES (
      ${crypto.randomUUID()}, ${email}, ${email}, ${input.name.trim().slice(0, 100)}, ${channel}, ${channel},
      ${input.sourcePage.slice(0, 500)}, ${input.sourcePage.slice(0, 500)}, ${inquiryIncrement}, ${chatIncrement}, ${isTest}, ${input.owner ?? null}, true, true
    )
    ON CONFLICT (email_normalized) DO UPDATE SET
      email = EXCLUDED.email,
      name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE crm_customers.name END,
      last_channel = EXCLUDED.last_channel,
      last_source_page = EXCLUDED.last_source_page,
      inquiry_count = crm_customers.inquiry_count + EXCLUDED.inquiry_count,
      chat_count = crm_customers.chat_count + EXCLUDED.chat_count,
      is_test = EXCLUDED.is_test,
      owner = COALESCE(crm_customers.owner, EXCLUDED.owner),
      owner_initialized = true,
      owner_replicas_initialized = true,
      last_seen_at = now()
    RETURNING id, email, name, first_channel, last_channel, first_source_page, last_source_page,
      inquiry_count, chat_count, first_seen_at, last_seen_at, is_test, crm_status, owner, tags,
      next_follow_up_at, admin_note, updated_at, owner_sync_pending
  `;
  return mapCustomer(rows[0]);
}

export async function listCrmCustomers() {
  await ensureCustomerSchema();
  await ensureCustomerOwnerBackfill();
  await initializeCustomerOwnerReplicas();
  await retryPendingCustomerOwnerSyncs();
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, email, name, first_channel, last_channel, first_source_page, last_source_page,
      inquiry_count, chat_count, first_seen_at, last_seen_at, is_test, crm_status, owner, tags,
      next_follow_up_at, admin_note, updated_at, owner_sync_pending
    FROM crm_customers
    ORDER BY last_seen_at DESC
    LIMIT 2000
  `;
  return rows.map(mapCustomer);
}

async function ensureCustomerOwnerBackfill() {
  if (!ownerBackfillReady) ownerBackfillReady = backfillCustomerOwners().catch((error) => { ownerBackfillReady = null; throw error; });
  return ownerBackfillReady;
}

async function backfillCustomerOwners() {
  const sql = getDatabase();
  const tables = await sql`SELECT to_regclass('public.inquiries') IS NOT NULL AS has_inquiries`;
  if (!tables[0]?.has_inquiries) return;
  await sql.query(customerOwnerBackfillSql);
  await sql`ALTER TABLE crm_customers ALTER COLUMN owner_initialized SET DEFAULT true`;
}

export async function syncCustomerOwner(input: { customerId?: string; email: string; owner: "Bowie" | "Leo" | null }) {
  await ensureCustomerSchema();
  const sql = getDatabase();
  const rows = await sql.query(customerOwnerSyncSql, [input.customerId ?? null, normalizeCustomerEmail(input.email), input.owner]);
  if (!rows[0]) return { pending: false };
  return syncChatOwnerReplica({ id: String(rows[0].id), email: String(rows[0].email_normalized), owner: input.owner });
}

async function syncChatOwnerReplica(input: { id: string; email: string; owner: "Bowie" | "Leo" | null }) {
  const sql = getDatabase();
  let desired = input;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await getPrisma().chatConversation.updateMany({
        where: { visitorEmail: { equals: desired.email, mode: "insensitive" } },
        data: { assignedTo: desired.owner },
      });
      const confirmed = await sql`UPDATE crm_customers SET owner_sync_pending = false, owner_sync_error = '' WHERE id = ${desired.id}::uuid AND owner IS NOT DISTINCT FROM ${desired.owner} RETURNING id`;
      if (confirmed[0]) return { pending: false };
      const latest = await sql`SELECT id, email_normalized, owner FROM crm_customers WHERE id = ${desired.id}::uuid LIMIT 1`;
      if (!latest[0]) return { pending: false };
      desired = {
        id: String(latest[0].id), email: String(latest[0].email_normalized),
        owner: ["Bowie", "Leo"].includes(String(latest[0].owner ?? "")) ? String(latest[0].owner) as "Bowie" | "Leo" : null,
      };
    }
    await sql`UPDATE crm_customers SET owner_sync_pending = true, owner_sync_error = 'Owner changed during synchronization' WHERE id = ${desired.id}::uuid`;
    return { pending: true };
  } catch (error) {
    console.error("Customer owner replica sync failed", error);
    await sql`UPDATE crm_customers SET owner_sync_pending = true, owner_sync_error = 'Chat owner synchronization failed' WHERE id = ${desired.id}::uuid AND owner IS NOT DISTINCT FROM ${desired.owner}`;
    return { pending: true };
  }
}

async function retryPendingCustomerOwnerSyncs() {
  const sql = getDatabase();
  const pending = await sql`SELECT id, email_normalized, owner FROM crm_customers WHERE owner_sync_pending = true ORDER BY updated_at LIMIT 25`;
  await Promise.all(pending.map((row) => syncChatOwnerReplica({
    id: String(row.id), email: String(row.email_normalized),
    owner: ["Bowie", "Leo"].includes(String(row.owner ?? "")) ? String(row.owner) as "Bowie" | "Leo" : null,
  })));
}

async function initializeCustomerOwnerReplicas() {
  const sql = getDatabase();
  await sql`
    UPDATE crm_customers
    SET owner_replicas_initialized = true, owner_sync_pending = true, owner_sync_error = ''
    WHERE owner_replicas_initialized = false
  `;
}

export async function updateCrmCustomer(id: string, input: { status: string; owner: string; tags: string; nextFollowUpAt: string; adminNote: string }) {
  await ensureCustomerSchema();
  if (!customerStatuses.includes(input.status as CustomerStatus)) throw new Error("Invalid customer status");
  if (input.owner && !["Bowie", "Leo"].includes(input.owner)) throw new Error("Invalid customer owner");
  const nextFollowUpAt = input.nextFollowUpAt ? new Date(input.nextFollowUpAt) : null;
  if (nextFollowUpAt && Number.isNaN(nextFollowUpAt.getTime())) throw new Error("Invalid follow-up date");
  const sql = getDatabase();
  const rows = await sql`
    UPDATE crm_customers
    SET crm_status = ${input.status},
      tags = ${input.tags.trim().slice(0, 500)},
      next_follow_up_at = ${nextFollowUpAt ? nextFollowUpAt.toISOString() : null}::timestamptz,
      admin_note = ${input.adminNote.trim().slice(0, 2000)},
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING id, email, name, first_channel, last_channel, first_source_page, last_source_page,
      inquiry_count, chat_count, first_seen_at, last_seen_at, is_test, crm_status, owner, tags,
      next_follow_up_at, admin_note, updated_at, owner_sync_pending
  `;
  if (!rows[0]) throw new Error("Customer not found");
  const ownerResult = await syncCustomerOwner({ customerId: id, email: String(rows[0].email), owner: input.owner ? input.owner as "Bowie" | "Leo" : null });
  return { ...mapCustomer(rows[0]), owner: input.owner as "Bowie" | "Leo" | "", ownerSyncPending: ownerResult.pending };
}

export async function assignUnownedCrmCustomers(actorId: string) {
  await Promise.all([ensureCustomerSchema(), ensureAuditLogSchema()]);
  await ensureCustomerOwnerBackfill();
  const sql = getDatabase();
  // Separate statements give a fresh READ COMMITTED snapshot after the lock wait.
  const results = await sql.transaction([
    sql`SET LOCAL statement_timeout = '15s'`,
    sql`SELECT pg_advisory_xact_lock(84017, 1)`,
    sql.query(customerAssignmentSql, [actorId]),
  ], { isolationLevel: "ReadCommitted" });
  await retryPendingCustomerOwnerSyncs();
  return { assignments: results[2].map((row) => ({ id: String(row.id), owner: String(row.owner) })) };
}

export async function getCustomerTimeline(id: string) {
  await Promise.all([ensureCustomerSchema(), ensureAuditLogSchema()]);
  const sql = getDatabase();
  const customerRows = await sql`SELECT email_normalized FROM crm_customers WHERE id = ${id}::uuid LIMIT 1`;
  if (!customerRows[0]) throw new Error("Customer not found");
  const email = String(customerRows[0].email_normalized);
  const tableRows = await sql`
    SELECT
      to_regclass('public.chat_conversations') IS NOT NULL AS has_chats,
      to_regclass('public.admin_profiles') IS NOT NULL AS has_admin_profiles
  `;
  const hasChats = Boolean(tableRows[0]?.has_chats);
  const hasAdminProfiles = Boolean(tableRows[0]?.has_admin_profiles);
  const [inquiries, chats, updates] = await Promise.all([
    sql`
      SELECT id, created_at, product, status, source, source_page, assigned_to
      FROM inquiries
      WHERE lower(email) = ${email}
      ORDER BY created_at DESC
      LIMIT 100
    `,
    hasChats ? sql`
      SELECT id, created_at, last_message_at, status, source_page, product_model, assigned_to
      FROM chat_conversations
      WHERE lower(visitor_email) = ${email}
      ORDER BY last_message_at DESC
      LIMIT 100
    ` : Promise.resolve([]),
    hasAdminProfiles ? sql`
      SELECT audit_logs.id, audit_logs.created_at, audit_logs.after,
        COALESCE(admin_profiles.display_name, admin_profiles.username, '管理员') AS actor
      FROM audit_logs
      LEFT JOIN admin_profiles ON admin_profiles.id = audit_logs.actor_id
      WHERE audit_logs.entity_type = 'customer' AND audit_logs.entity_id = ${id}
      ORDER BY audit_logs.created_at DESC
      LIMIT 100
    ` : sql`
      SELECT id, created_at, after, '管理员' AS actor
      FROM audit_logs
      WHERE entity_type = 'customer' AND entity_id = ${id}
      ORDER BY created_at DESC
      LIMIT 100
    `,
  ]);

  const items: CustomerTimelineItem[] = [
    ...inquiries.map((row) => ({
      id: `inquiry-${row.id}`,
      type: "inquiry" as const,
      title: `提交询盘 · ${String(row.product ?? "未指定产品")}`,
      detail: `状态：${String(row.status ?? "new")} · 负责人：${String(row.assigned_to ?? "未分配")} · 渠道：${identifyCustomerChannel(String(row.source ?? ""))}`,
      occurredAt: new Date(String(row.created_at)).toISOString(),
      product: String(row.product ?? ""),
      sourcePage: String(row.source_page ?? ""),
      actor: "客户",
    })),
    ...chats.map((row) => ({
      id: `chat-${row.id}`,
      type: "chat" as const,
      title: `站内聊天 · ${String(row.product_model ?? "一般咨询")}`,
      detail: `状态：${String(row.status ?? "OPEN")} · 负责人：${String(row.assigned_to ?? "未分配")}`,
      occurredAt: new Date(String(row.last_message_at ?? row.created_at)).toISOString(),
      product: String(row.product_model ?? ""),
      sourcePage: String(row.source_page ?? ""),
      actor: "客户",
    })),
    ...updates.map((row) => {
      const after = row.after && typeof row.after === "object" ? row.after as Record<string, unknown> : {};
      return {
        id: `update-${row.id}`,
        type: "customer_update" as const,
        title: "更新客户跟进计划",
        detail: `状态：${String(after.status ?? "未变更")} · 负责人：${String(after.owner || "未分配")} · 下次跟进：${String(after.nextFollowUpAt || "未安排")}`,
        occurredAt: new Date(String(row.created_at)).toISOString(),
        product: "",
        sourcePage: "",
        actor: String(row.actor ?? "管理员"),
      };
    }),
  ];
  return items.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()).slice(0, 150);
}

function mapCustomer(row: Record<string, unknown>): CrmCustomer {
  return {
    id: String(row.id), name: String(row.name ?? ""), email: String(row.email ?? ""),
    firstChannel: String(row.first_channel ?? "Direct"), lastChannel: String(row.last_channel ?? "Direct"),
    firstSourcePage: String(row.first_source_page ?? ""), lastSourcePage: String(row.last_source_page ?? ""),
    inquiryCount: Number(row.inquiry_count ?? 0), chatCount: Number(row.chat_count ?? 0),
    firstSeenAt: new Date(String(row.first_seen_at)).toISOString(), lastSeenAt: new Date(String(row.last_seen_at)).toISOString(),
    isTest: Boolean(row.is_test),
    status: customerStatuses.includes(String(row.crm_status) as CustomerStatus) ? String(row.crm_status) as CustomerStatus : "new",
    owner: ["Bowie", "Leo"].includes(String(row.owner ?? "")) ? String(row.owner) as "Bowie" | "Leo" : "",
    tags: String(row.tags ?? ""),
    nextFollowUpAt: row.next_follow_up_at ? new Date(String(row.next_follow_up_at)).toISOString() : "",
    adminNote: String(row.admin_note ?? ""),
    updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : new Date(String(row.last_seen_at)).toISOString(),
    ownerSyncPending: Boolean(row.owner_sync_pending),
  };
}
