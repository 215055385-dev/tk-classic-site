# TK Classic CMS architecture

This document records the approved CMS foundation. It contains no credentials and performs no database migration.

## Target services

- Supabase PostgreSQL for CMS and CRM data.
- Prisma ORM for schema management and typed server-side data access.
- Supabase Auth for administrator identities.
- Supabase Storage with separate public and private buckets.

## Storage policy

- `site-public`: product, homepage, factory, exhibition, article and public video assets.
- `cert-private`: original certification and restricted documents.
- Public pages may show approved certification icons or a compressed overview image only.
- A media record cannot be deleted while a product, page, article or video still references it.

## Migration policy

1. Back up the current Neon PostgreSQL database.
2. Create the Supabase project and storage buckets.
3. Apply reviewed Prisma migrations to an empty preview database.
4. Import the existing products from `lib/site-data.ts` without changing model names, parameters or media paths.
5. Import the current inquiries, site visits and site events without changing their identifiers or timestamps.
6. Compare front-end output against the current static source.
7. Enable database reads behind a controlled switch and keep the static source as a temporary fallback.
8. Remove the fallback only after production verification.

## Protected product policy

The current DQ-001, DQ-002, DQ-005, DQ-008, DQ-010 and DQ-011 records are imported with `lockedModel = true`. The CMS may update approved content around those records, but model identifiers cannot be edited and records use archive/unpublish rather than hard deletion.

## Cache synchronization

Published CMS mutations will invalidate narrow cache tags and paths, such as `products`, `homepage`, `articles`, `/products/[slug]`, `/sitemap.xml` and `/llms.txt`. Draft updates do not invalidate public pages.
