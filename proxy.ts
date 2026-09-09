import { NextRequest, NextResponse } from "next/server";
import { refreshAdminSession } from "@/lib/supabase/proxy";

const localeCodes = new Set(["en", "es", "pt", "fr", "ar", "zh", "ru"]);
const publicEdgeCache = "public, s-maxage=60, stale-while-revalidate=300";
const baiduVerificationPath = "/baidu_verify_codeva-E9efZejrfe.html";
const baiduVerificationBody = "aa046224176d828d13cff8f16d6dfa77";

function withPublicEdgeCache(response: NextResponse, pathname: string, method: string) {
  if ((method === "GET" || method === "HEAD") && pathname !== "/contact/success") {
    response.headers.set("CDN-Cache-Control", publicEdgeCache);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === baiduVerificationPath || pathname === `${baiduVerificationPath}/`) {
    return new Response(request.method === "HEAD" ? null : baiduVerificationBody, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=60, must-revalidate",
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  // Preserve the site's existing canonical no-trailing-slash behavior now that
  // framework-level normalization is disabled for the Baidu compatibility path.
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const canonical = new URL(request.url);
    canonical.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(canonical, 308);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return refreshAdminSession(request);
  }
  const segments = pathname.split("/").filter(Boolean);
  const pathLocale = segments[0];
  const queryLocale = request.nextUrl.searchParams.get("lang");
  const cookieLocale = request.cookies.get("tk_site_lang")?.value;
  const locale = pathLocale && localeCodes.has(pathLocale)
    ? pathLocale
    : queryLocale && localeCodes.has(queryLocale)
      ? queryLocale
      : cookieLocale && localeCodes.has(cookieLocale)
        ? cookieLocale
        : "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-lang", locale);

  if (!pathLocale || !localeCodes.has(pathLocale)) {
    if (!queryLocale && cookieLocale && localeCodes.has(cookieLocale) && cookieLocale !== "en") {
      const localized = request.nextUrl.clone();
      localized.pathname = `/${cookieLocale}${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(localized);
    }
    return withPublicEdgeCache(
      NextResponse.next({ request: { headers: requestHeaders } }),
      pathname,
      request.method,
    );
  }

  const rewritten = request.nextUrl.clone();
  const remainingPath = segments.slice(1).join("/");
  rewritten.pathname = remainingPath ? `/${remainingPath}` : "/";
  rewritten.searchParams.set("lang", locale);

  return withPublicEdgeCache(
    NextResponse.rewrite(rewritten, { request: { headers: requestHeaders } }),
    pathname,
    request.method,
  );
}

export const config = {
  matcher: ["/((?!_next|api|downloads|optimized|hero-products|lifestyle|videos|favicon.svg|robots.txt|sitemap.xml|sitemap-zh.xml|llms.txt|llms-zh.txt).*)"],
};
