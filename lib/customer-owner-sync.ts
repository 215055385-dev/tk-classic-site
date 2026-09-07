export const customerOwnerSyncSql = `
WITH target AS (
  UPDATE crm_customers
  SET owner = $3::text,
      owner_initialized = true,
      owner_sync_pending = true,
      owner_sync_error = '',
      updated_at = now()
  WHERE ($1::uuid IS NOT NULL AND id = $1::uuid)
     OR ($1::uuid IS NULL AND email_normalized = $2::text)
  RETURNING id, email_normalized, owner
), inquiry_sync AS (
  UPDATE inquiries AS inquiry
  SET assigned_to = target.owner
  FROM target
  WHERE lower(inquiry.email) = target.email_normalized
  RETURNING inquiry.id
)
SELECT id, email_normalized, owner FROM target
`;
