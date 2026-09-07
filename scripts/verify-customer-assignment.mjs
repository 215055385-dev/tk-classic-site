import assert from "node:assert/strict";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { customerAssignmentSql } from "../lib/customer-assignment.ts";
import { customerOwnerBackfillSql } from "../lib/customer-owner-backfill.ts";

config({ path: ".env.local", quiet: true });
const sql = neon(process.env.DATABASE_URL);
// Every table is session-local and removed at commit. No public CRM rows are touched.
for (const [bowie, leo] of [[0, 0], [0, 3], [3, 0]]) {
  const results = await sql.transaction([
    sql`CREATE TEMP TABLE crm_customers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner text, owner_initialized boolean DEFAULT true, is_test boolean DEFAULT false, crm_status text DEFAULT 'new', last_seen_at timestamptz DEFAULT now(), updated_at timestamptz, next_follow_up_at timestamptz) ON COMMIT DROP`,
    sql`CREATE TEMP TABLE audit_logs (id uuid, actor_id uuid, action text, entity_type text, entity_id text, before jsonb, after jsonb) ON COMMIT DROP`,
    sql`INSERT INTO crm_customers (owner) SELECT 'Bowie' FROM generate_series(1, ${bowie})`,
    sql`INSERT INTO crm_customers (owner) SELECT 'Leo' FROM generate_series(1, ${leo})`,
    sql`INSERT INTO crm_customers (owner) SELECT NULL FROM generate_series(1, 7)`,
    sql`INSERT INTO crm_customers (is_test, crm_status) VALUES (true, 'new'), (false, 'won'), (false, 'inactive')`,
    sql.query(customerAssignmentSql, ["00000000-0000-4000-8000-000000000001"]),
    sql.query(customerAssignmentSql, ["00000000-0000-4000-8000-000000000001"]),
    sql`SELECT count(*) FILTER (WHERE owner = 'Bowie')::int b, count(*) FILTER (WHERE owner = 'Leo')::int l, count(*) FILTER (WHERE owner IS NULL)::int untouched FROM crm_customers`,
    sql`SELECT count(*)::int n, count(DISTINCT entity_id)::int unique_n FROM audit_logs`,
  ]);
  assert.equal(results[6].length, 7);
  assert.equal(results[7].length, 0, "repeat call must be a no-op");
  assert.ok(Math.abs(results[8][0].b - results[8][0].l) <= 1);
  assert.equal(results[8][0].untouched, 3, "exclude test, won and inactive customers");
  assert.equal(results[9][0].n, 7);
  assert.equal(results[9][0].unique_n, 7);
}

const backfillResults = await sql.transaction([
  sql`CREATE TEMP TABLE crm_customers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email_normalized text, owner text, owner_initialized boolean DEFAULT false, updated_at timestamptz DEFAULT now()) ON COMMIT DROP`,
  sql`CREATE TEMP TABLE inquiries (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text, assigned_to text, created_at timestamptz DEFAULT now()) ON COMMIT DROP`,
  sql`INSERT INTO crm_customers (email_normalized, owner, owner_initialized) VALUES ('legacy@example.com', NULL, false), ('cleared@example.com', NULL, true), ('unknown@example.com', NULL, false)`,
  sql`INSERT INTO inquiries (email, assigned_to, created_at) VALUES ('legacy@example.com', 'Bowie', now() - interval '1 day'), ('legacy@example.com', 'Leo', now()), ('cleared@example.com', 'Bowie', now())`,
  sql.query(customerOwnerBackfillSql),
  sql.query(customerOwnerBackfillSql),
  sql`SELECT email_normalized, owner, owner_initialized FROM crm_customers ORDER BY email_normalized`,
]);
const backfilled = new Map(backfillResults[6].map((row) => [row.email_normalized, row]));
assert.equal(backfilled.get('legacy@example.com').owner, 'Leo', 'latest historical owner should be recovered');
assert.equal(backfilled.get('cleared@example.com').owner, null, 'administrator-cleared owner must stay empty');
assert.equal(backfilled.get('unknown@example.com').owner, null, 'unknown historical owner stays empty');
assert.ok([...backfilled.values()].every((row) => row.owner_initialized), 'all legacy rows must be finalized once');
console.log("Customer ownership: assignment and historical backfill scenarios passed; no public CRM rows changed.");
