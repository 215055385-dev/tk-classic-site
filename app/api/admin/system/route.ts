import { NextRequest } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getEmailHealth } from "@/lib/email-health";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const mode = request.nextUrl.searchParams.get("mode") ?? "overview";
    if (mode === "email-health") {
      return Response.json({ ok: true, emailHealth: await getEmailHealth() }, {
        headers: { "Cache-Control": "private, no-store" },
      });
    }
    const db = getPrisma();
    if (mode === "backup") {
      const [productCategories, products, mediaFolders, media, videos, homepage, heroSlides, factory, exhibitions, certifications, articleCategories, articles, seo, settings, inquiries, chats, siteVisits, siteEvents, auditLogs] = await Promise.all([
        db.productCategory.findMany({ include: { translations: true }, orderBy: { sortOrder: "asc" } }),
        db.product.findMany({ include: { translations: true, specs: { include: { translations: true } }, features: true, useCases: true, media: true }, orderBy: { sortOrder: "asc" } }),
        db.mediaFolder.findMany({ orderBy: { name: "asc" } }),
        db.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
        db.video.findMany({ orderBy: { sortOrder: "asc" } }),
        db.homepageSection.findMany({ include: { translations: true }, orderBy: { sortOrder: "asc" } }),
        db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
        db.factoryEntry.findMany({ orderBy: { sortOrder: "asc" } }),
        db.exhibitionEntry.findMany({ orderBy: { sortOrder: "asc" } }),
        db.certification.findMany({ orderBy: { sortOrder: "asc" } }),
        db.articleCategory.findMany({ orderBy: { name: "asc" } }),
        db.article.findMany({ include: { translations: true, category: true }, orderBy: { createdAt: "desc" } }),
        db.pageSeo.findMany({ orderBy: { path: "asc" } }),
        db.siteSetting.findMany({ orderBy: { key: "asc" } }),
        db.inquiry.findMany({ include: { notes: true, statusHistory: true }, orderBy: { createdAt: "desc" } }),
        db.chatConversation.findMany({ include: { messages: true }, orderBy: { createdAt: "desc" } }),
        db.siteVisit.findMany({ orderBy: { visitedAt: "desc" } }),
        db.siteEvent.findMany({ orderBy: { occurredAt: "desc" } }),
        db.auditLog.findMany({ orderBy: { createdAt: "desc" } }),
      ]);
      const exportedAt = new Date().toISOString();
      return new Response(JSON.stringify({
        version: 2,
        exportedAt,
        content: { productCategories, products, mediaFolders, media, videos, homepage, heroSlides, factory, exhibitions, certifications, articleCategories, articles, seo, settings },
        operations: { inquiries, chats },
        analytics: { siteVisits, siteEvents },
        auditLogs,
      }, (_, value) => typeof value === "bigint" ? value.toString() : value, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="tk-classic-backup-${exportedAt.slice(0, 10)}.json"`, "Cache-Control": "no-store" },
      });
    }

    const [logs, counts, emailHealth] = await Promise.all([
      db.auditLog.findMany({ take: 100, orderBy: { createdAt: "desc" }, include: { actor: { select: { username: true, displayName: true } } } }),
      Promise.all([db.product.count(), db.mediaAsset.count({ where: { deletedAt: null } }), db.article.count(), db.inquiry.count(), db.auditLog.count()]),
      getEmailHealth(),
    ]);
    const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ?? "";
    const googleAdsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim() ?? "";
    const ga4 = /^G-[A-Z0-9]+$/i.test(gaMeasurementId);
    const googleAds = /^AW-\d+$/i.test(googleAdsId);
    const leadConversion = googleAds && googleAdsConversionLabel.length > 0;

    return Response.json({
      ok: true,
      counts: { products: counts[0], media: counts[1], articles: counts[2], inquiries: counts[3], auditLogs: counts[4] },
      growthReadiness: {
        ga4,
        googleAds,
        leadConversion,
        usLandingPage: true,
        inquiryTracking: true,
        readyForPaidTraffic: ga4 && googleAds && leadConversion,
      },
      emailHealth,
      logs: logs.map((log) => ({ ...log, createdAt: log.createdAt.toISOString() })),
    });
  } catch (error) { return adminErrorResponse(error); }
}
