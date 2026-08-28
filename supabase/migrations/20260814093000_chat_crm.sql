ALTER TABLE "chat_conversations" ADD COLUMN IF NOT EXISTS "tags" text[] NOT NULL DEFAULT ARRAY[]::text[];
ALTER TABLE "chat_conversations" ADD COLUMN IF NOT EXISTS "assigned_to" text;
ALTER TABLE "chat_conversations" ADD COLUMN IF NOT EXISTS "follow_up_at" timestamptz;
ALTER TABLE "chat_conversations" ADD COLUMN IF NOT EXISTS "converted_inquiry_id" uuid;
ALTER TABLE "chat_conversations" ADD COLUMN IF NOT EXISTS "last_notified_at" timestamptz;
CREATE INDEX IF NOT EXISTS "chat_conversations_follow_up_at_idx" ON "chat_conversations"("follow_up_at");
