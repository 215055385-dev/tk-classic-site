import { getDatabase } from "@/lib/database";

export const salesAssignees = ["Bowie", "Leo"] as const;
export type SalesAssignee = (typeof salesAssignees)[number];

export function isSalesAssignee(value: string): value is SalesAssignee {
  return salesAssignees.includes(value as SalesAssignee);
}

/**
 * Uses a database counter so serverless instances share one round-robin state.
 * The upsert is atomic in PostgreSQL, including when two leads arrive together.
 */
export async function getNextLeadAssignee(): Promise<SalesAssignee> {
  const sql = getDatabase();
  await sql`
    CREATE TABLE IF NOT EXISTS lead_assignment_state (
      key text PRIMARY KEY,
      next_index bigint NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  const rows = await sql`
    INSERT INTO lead_assignment_state (key, next_index)
    VALUES ('sales-round-robin', 1)
    ON CONFLICT (key) DO UPDATE SET
      next_index = lead_assignment_state.next_index + 1,
      updated_at = now()
    RETURNING next_index - 1 AS assignment_index
  `;
  const index = Number(rows[0]?.assignment_index ?? 0);
  return salesAssignees[((index % salesAssignees.length) + salesAssignees.length) % salesAssignees.length];
}
