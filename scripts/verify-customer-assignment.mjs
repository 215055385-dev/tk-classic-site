import assert from "node:assert/strict";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { customerAssignmentSql } from "../lib/customer-assignment.ts";

config({ path: ".env.local", quiet: true });
const sql = neon(process.env.DATABASE_URL);
// Every table is session-local and removed at commit. No public CRM rows are touched.
for (const [bowie, leo] of [[0, 0], [0, 3], [3, 0]]) {
  const results = await sql.transaction([
    sql`CREATE TEMP TABLE crm_customers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner text, is_test boolean DEFAULT false, crm_status text DEFAULT 'new', last_seen_at timestamptz DEFAULT now(), updated_at timestamptz, next_follow_up_at timestamptz) ON COMMIT DROP`,
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
console.log("Customer assignment: 3 isolated database scenarios passed; no public CRM rows changed.");
