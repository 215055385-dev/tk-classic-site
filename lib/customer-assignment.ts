// Run after a transaction-scoped advisory lock. Keep the write and its audit atomic.
export const customerAssignmentSql = `
WITH counts AS (
  SELECT count(*) FILTER (WHERE owner = 'Bowie') AS b,
         count(*) FILTER (WHERE owner = 'Leo') AS l
  FROM crm_customers
  WHERE is_test = false AND COALESCE(crm_status, 'new') NOT IN ('won', 'inactive')
), candidates AS MATERIALIZED (
  SELECT id, last_seen_at FROM crm_customers
  WHERE owner IS NULL AND is_test = false
    AND COALESCE(crm_status, 'new') NOT IN ('won', 'inactive')
  ORDER BY last_seen_at DESC, id LIMIT 500 FOR UPDATE
), ranked AS (
  SELECT id, row_number() OVER (ORDER BY last_seen_at DESC, id) AS n FROM candidates
), assigned AS (
  SELECT id, CASE
    WHEN b < l AND n <= l-b THEN 'Bowie'
    WHEN l < b AND n <= b-l THEN 'Leo'
    WHEN mod(n-abs(b-l), 2) = 1 THEN 'Bowie'
    ELSE 'Leo' END AS owner
  FROM ranked CROSS JOIN counts
), updated AS (
  UPDATE crm_customers c SET owner = a.owner, owner_initialized = true,
    owner_sync_pending = true, owner_sync_error = '', updated_at = now()
  FROM assigned a WHERE c.id = a.id AND c.owner IS NULL AND c.is_test = false
    AND COALESCE(c.crm_status, 'new') NOT IN ('won', 'inactive')
  RETURNING c.id, c.owner, c.crm_status, c.next_follow_up_at
), inquiry_sync AS (
  UPDATE inquiries i SET assigned_to = u.owner
  FROM updated u JOIN crm_customers c ON c.id = u.id
  WHERE lower(i.email) = c.email_normalized
  RETURNING i.id
), audited AS (
  INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, before, after)
  SELECT gen_random_uuid(), $1::uuid, 'CUSTOMER_BULK_OWNER_ASSIGN', 'customer', id::text,
    jsonb_build_object('owner', NULL),
    jsonb_build_object('owner', owner, 'status', crm_status, 'nextFollowUpAt', next_follow_up_at)
  FROM updated RETURNING entity_id
)
SELECT u.id, u.owner FROM updated u JOIN audited a ON a.entity_id = u.id::text
`;
