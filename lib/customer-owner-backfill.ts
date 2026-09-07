// One-time compatibility update for CRM records created before owner tracking existed.
// Rows explicitly edited by an administrator are marked initialized and never backfilled again.
export const customerOwnerBackfillSql = `
UPDATE crm_customers AS customer
SET owner = COALESCE(
      customer.owner,
      (
        SELECT inquiry.assigned_to
        FROM inquiries AS inquiry
        WHERE lower(inquiry.email) = customer.email_normalized
          AND inquiry.assigned_to IN ('Bowie', 'Leo')
        ORDER BY inquiry.created_at DESC
        LIMIT 1
      )
    ),
    owner_initialized = true,
    updated_at = now()
WHERE customer.owner_initialized = false
`;
