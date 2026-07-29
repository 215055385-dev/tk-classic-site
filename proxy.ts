import { NextRequest, NextResponse } from "next/server";

const localeCodes = new Set(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (!locale || !localeCodes.has(locale)) {
    return NextResponse.next();
  }

  const rewritten = request.nextUrl.clone();
  const remainingPath = segments.slice(1).join("/");
  rewritten.pathname = remainingPath ? `/${remainingPath}` : "/";
  rewritten.searchParams.set("lang", locale);

  return NextResponse.rewrite(rewritten);
}

export const config = {
  matcher: ["/((?!_next|api|downloads|optimized|hero-products|products|accessories|lifestyle|videos|favicon.svg|robots.txt|sitemap.xml|llms.txt).*)"],
};
