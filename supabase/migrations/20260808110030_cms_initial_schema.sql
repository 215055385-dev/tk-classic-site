-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'EDITOR', 'SALES', 'VIEWER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INVITED');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "MediaVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('PRODUCT', 'FACTORY', 'EXHIBITION', 'CERTIFICATION', 'BANNER', 'VIDEO_POSTER', 'ARTICLE', 'GENERAL');

-- CreateEnum
CREATE TYPE "ProductMediaRole" AS ENUM ('HERO', 'GALLERY', 'DETAIL', 'LIFESTYLE', 'VIDEO', 'VIDEO_POSTER');

-- CreateEnum
CREATE TYPE "VideoCategory" AS ENUM ('PRODUCT_OPERATION', 'EXTRACTION_ANIMATION', 'FACTORY');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'VIEWER',
    "status" "AccountStatus" NOT NULL DEFAULT 'INVITED',
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_category_translations" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "category_id" UUID,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "locked_model" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_translations" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "feature_label" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "seo_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specs" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_spec_translations" (
    "id" UUID NOT NULL,
    "spec_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "product_spec_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_features" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "content" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_use_cases" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "content" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_use_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_folders" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "folder_id" UUID,
    "type" "MediaType" NOT NULL,
    "visibility" "MediaVisibility" NOT NULL DEFAULT 'PUBLIC',
    "category" "MediaCategory" NOT NULL DEFAULT 'GENERAL',
    "storage_bucket" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "public_url" TEXT,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "bytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_ms" INTEGER,
    "alt_text" TEXT,
    "checksum" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "ProductMediaRole" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "VideoCategory" NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "video_id" UUID NOT NULL,
    "poster_id" UUID,
    "product_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_section_translations" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "body" TEXT,
    "cta_label" TEXT,
    "cta_href" TEXT,

    CONSTRAINT "homepage_section_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "image_id" UUID NOT NULL,
    "product_id" UUID,
    "title" JSONB NOT NULL,
    "subtitle" JSONB,
    "button_label" JSONB,
    "button_href" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factory_entries" (
    "id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "factory_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_entries" (
    "id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_name" TEXT,
    "city" TEXT,
    "country" TEXT,
    "year" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exhibition_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "preview_media_id" UUID,
    "document_media_id" UUID,
    "request_only" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "category_id" UUID,
    "cover_media_id" UUID,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_translations" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" JSONB NOT NULL,
    "seo_title" TEXT,
    "seo_description" TEXT,

    CONSTRAINT "article_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_seo" (
    "id" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "locale" VARCHAR(12) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "canonical_url" TEXT,
    "og_image_id" UUID,
    "schema_data" JSONB,
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "page_seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "product" TEXT NOT NULL,
    "accessories" TEXT,
    "quantity" TEXT NOT NULL,
    "branding" TEXT,
    "message" TEXT NOT NULL,
    "lang" TEXT,
    "source" TEXT,
    "source_page" TEXT,
    "referrer" TEXT,
    "attachments" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "admin_note" TEXT,
    "sales_email_sent" BOOLEAN,
    "customer_email_sent" BOOLEAN,
    "email_error" TEXT,
    "email_last_attempt_at" TIMESTAMPTZ(6),

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_notes" (
    "id" UUID NOT NULL,
    "inquiry_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiry_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_status_history" (
    "id" UUID NOT NULL,
    "inquiry_id" UUID NOT NULL,
    "actor_id" UUID,
    "from_status" TEXT,
    "to_status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiry_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_visits" (
    "id" UUID NOT NULL,
    "visited_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "lang" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "site_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_events" (
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "lang" TEXT,
    "product" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "site_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_auth_user_id_key" ON "admin_profiles"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_username_key" ON "admin_profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_translations_category_id_locale_key" ON "product_category_translations"("category_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_model_key" ON "products"("model");

-- CreateIndex
CREATE INDEX "products_status_sort_order_idx" ON "products"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_product_id_locale_key" ON "product_translations"("product_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "product_specs_product_id_key_key" ON "product_specs"("product_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "product_spec_translations_spec_id_locale_key" ON "product_spec_translations"("spec_id", "locale");

-- CreateIndex
CREATE INDEX "product_features_product_id_locale_sort_order_idx" ON "product_features"("product_id", "locale", "sort_order");

-- CreateIndex
CREATE INDEX "product_use_cases_product_id_locale_sort_order_idx" ON "product_use_cases"("product_id", "locale", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "media_folders_slug_key" ON "media_folders"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_storage_path_key" ON "media_assets"("storage_path");

-- CreateIndex
CREATE INDEX "media_assets_category_created_at_idx" ON "media_assets"("category", "created_at");

-- CreateIndex
CREATE INDEX "media_assets_folder_id_idx" ON "media_assets"("folder_id");

-- CreateIndex
CREATE INDEX "product_media_product_id_role_sort_order_idx" ON "product_media"("product_id", "role", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_media_product_id_media_id_role_key" ON "product_media"("product_id", "media_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "videos_slug_key" ON "videos"("slug");

-- CreateIndex
CREATE INDEX "videos_category_status_sort_order_idx" ON "videos"("category", "status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_sections_key_key" ON "homepage_sections"("key");

-- CreateIndex
CREATE INDEX "homepage_sections_status_sort_order_idx" ON "homepage_sections"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_section_translations_section_id_locale_key" ON "homepage_section_translations"("section_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "hero_slides_key_key" ON "hero_slides"("key");

-- CreateIndex
CREATE INDEX "hero_slides_status_sort_order_idx" ON "hero_slides"("status", "sort_order");

-- CreateIndex
CREATE INDEX "factory_entries_status_sort_order_idx" ON "factory_entries"("status", "sort_order");

-- CreateIndex
CREATE INDEX "exhibition_entries_status_sort_order_idx" ON "exhibition_entries"("status", "sort_order");

-- CreateIndex
CREATE INDEX "certifications_status_sort_order_idx" ON "certifications"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "article_categories_slug_key" ON "article_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_published_at_idx" ON "articles"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "article_translations_article_id_locale_key" ON "article_translations"("article_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "page_seo_path_locale_key" ON "page_seo"("path", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- CreateIndex
CREATE INDEX "inquiries_created_at_idx" ON "inquiries"("created_at");

-- CreateIndex
CREATE INDEX "inquiries_status_created_at_idx" ON "inquiries"("status", "created_at");

-- CreateIndex
CREATE INDEX "inquiry_notes_inquiry_id_created_at_idx" ON "inquiry_notes"("inquiry_id", "created_at");

-- CreateIndex
CREATE INDEX "inquiry_status_history_inquiry_id_created_at_idx" ON "inquiry_status_history"("inquiry_id", "created_at");

-- CreateIndex
CREATE INDEX "site_visits_visited_at_idx" ON "site_visits"("visited_at");

-- CreateIndex
CREATE INDEX "site_visits_path_idx" ON "site_visits"("path");

-- CreateIndex
CREATE INDEX "site_events_occurred_at_idx" ON "site_events"("occurred_at");

-- CreateIndex
CREATE INDEX "site_events_name_idx" ON "site_events"("name");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "product_category_translations" ADD CONSTRAINT "product_category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_translations" ADD CONSTRAINT "product_translations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_spec_translations" ADD CONSTRAINT "product_spec_translations_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "product_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_use_cases" ADD CONSTRAINT "product_use_cases_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "media_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_section_translations" ADD CONSTRAINT "homepage_section_translations_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "homepage_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factory_entries" ADD CONSTRAINT "factory_entries_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_entries" ADD CONSTRAINT "exhibition_entries_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_preview_media_id_fkey" FOREIGN KEY ("preview_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_document_media_id_fkey" FOREIGN KEY ("document_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "article_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_notes" ADD CONSTRAINT "inquiry_notes_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_notes" ADD CONSTRAINT "inquiry_notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_status_history" ADD CONSTRAINT "inquiry_status_history_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_status_history" ADD CONSTRAINT "inquiry_status_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "admin_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "admin_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Supabase Auth is the identity source for CMS administrators.
ALTER TABLE "admin_profiles"
ADD CONSTRAINT "admin_profiles_auth_user_id_fkey"
FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep optional hero-to-product links consistent without exposing product data.
ALTER TABLE "hero_slides"
ADD CONSTRAINT "hero_slides_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "hero_slides_product_id_idx" ON "hero_slides"("product_id");

-- All CMS tables live in the exposed public schema, so RLS is enabled even
-- though the application initially accesses them only from trusted servers.
ALTER TABLE "admin_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_category_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_spec_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_features" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_use_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media_folders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media_assets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "videos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "homepage_sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "homepage_section_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hero_slides" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "factory_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exhibition_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "article_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "article_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "page_seo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiry_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiry_status_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_visits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- No browser role receives table privileges. Public website reads and all CMS
-- mutations go through authenticated server routes, never a service key in JS.
REVOKE ALL ON ALL TABLES IN SCHEMA "public" FROM "anon", "authenticated";
REVOKE ALL ON ALL SEQUENCES IN SCHEMA "public" FROM "anon", "authenticated";

-- Public marketing media and private certification documents are separated.
-- Uploads/deletes are server-only, so storage.objects needs no browser policies.
INSERT INTO "storage"."buckets" (
  "id", "name", "public", "file_size_limit", "allowed_mime_types"
) VALUES
  (
    'site-public',
    'site-public',
    true,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
  ),
  (
    'cert-private',
    'cert-private',
    false,
    20971520,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  )
ON CONFLICT ("id") DO UPDATE SET
  "public" = EXCLUDED."public",
  "file_size_limit" = EXCLUDED."file_size_limit",
  "allowed_mime_types" = EXCLUDED."allowed_mime_types";
