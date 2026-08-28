CREATE TYPE "ChatStatus" AS ENUM ('OPEN', 'PENDING', 'CLOSED');
CREATE TYPE "ChatSender" AS ENUM ('VISITOR', 'ADMIN', 'SYSTEM');

CREATE TABLE "chat_conversations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "visitor_token_hash" text NOT NULL UNIQUE,
  "visitor_name" text,
  "visitor_email" text,
  "visitor_company" text,
  "visitor_country" text,
  "status" "ChatStatus" NOT NULL DEFAULT 'OPEN',
  "source_page" text,
  "product_model" text,
  "referrer" text,
  "ip" text,
  "user_agent" text,
  "last_message_at" timestamptz NOT NULL DEFAULT now(),
  "visitor_last_read_at" timestamptz,
  "admin_last_read_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "chat_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "conversation_id" uuid NOT NULL REFERENCES "chat_conversations"("id") ON DELETE CASCADE,
  "sender" "ChatSender" NOT NULL,
  "body" text NOT NULL,
  "author_id" uuid REFERENCES "admin_profiles"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "chat_conversations_status_last_message_at_idx" ON "chat_conversations"("status", "last_message_at" DESC);
CREATE INDEX "chat_messages_conversation_id_created_at_idx" ON "chat_messages"("conversation_id", "created_at");

ALTER TABLE "chat_conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "chat_conversations", "chat_messages" FROM "anon", "authenticated";

