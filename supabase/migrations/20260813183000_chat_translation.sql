ALTER TABLE "chat_conversations" ADD COLUMN IF NOT EXISTS "locale" varchar(12) NOT NULL DEFAULT 'en';
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "language" varchar(12);
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "translated_body" text;
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "translated_lang" varchar(12);
