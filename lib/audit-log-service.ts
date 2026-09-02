import { getDatabase } from "@/lib/database";

let auditSchemaReady: Promise<void> | null = null;

export async function ensureAuditLogSchema() {
  if (!auditSchemaReady) {
    auditSchemaReady = createAuditLogSchema().catch((error) => {
      auditSchemaReady = null;
      throw error;
    });
  }
  return auditSchemaReady;
}

async function createAuditLogSchema() {
  const sql = getDatabase();
  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id uuid PRIMARY KEY,
      actor_id uuid,
      action text NOT NULL,
      entity_type text NOT NULL,
      entity_id text,
      before jsonb,
      after jsonb,
      ip text,
      user_agent text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_entity_type_entity_id_idx ON audit_logs (entity_type, entity_id)`;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at)`;
}
