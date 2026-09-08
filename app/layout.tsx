import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { company } from "@/lib/site-data";
import type { Lang } from "@/lib/site-data";
import { VisitTracker } from "@/components/VisitTracker";
import { SiteStructuredData } from "@/components/SiteStructuredData";
import { LocaleDocumentSync } from "@/components/LocaleDocumentSync";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteChatWidget } from "@/components/SiteChatWidget";
import { GoogleTracking } from "@/components/GoogleTracking";
import { GlobalLanguageSwitcher } from "@/components/GlobalLanguageSwitcher";
import { PageProgress } from "@/components/PageProgress";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "./globals.css";
import "./styles/performance.css";
import "./styles/home-carousel.css";
import "./styles/inquiry.css";
import "./styles/chat.css";
import "./styles/upgrade.css";
import "./styles/editorial-simplify.css";
import "./styles/outdoor-cinema-preview.css";
import "./styles/coffee-lab.css";
import "./styles/site-unified-theme.css";
import "./styles/titanium-aurora.css";
import "./styles/home-tech-stage.css";
import "./styles/scene-transitions.css";
import "./styles/interaction-depth.css";
import "./styles/front-refinement.css";
import "./styles/conversion-typography.css";
import "./styles/coffee-art-direction.css";
import "./styles/experience-polish.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "TK Classic | Portable Coffee Machine OEM & Private Label Supplier",
    template: "%s | TK Classic",
  },
  description:
    "Factory-direct portable espresso machines and OEM/private-label sourcing support for US importers, wholesalers, outdoor retailers and global B2B buyers.",
  keywords: [
    "portable coffee machine OEM",
    "portable espresso machine wholesale",
    "private label coffee machine",
    "OEM ODM coffee maker supplier",
    "portable coffee accessories",
  ],
  applicationName: "TK Classic",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "TK Classic | Portable Coffee Machine OEM & Private Label Supplier",
    description:
      "Factory-direct portable espresso machines and coffee accessories for wholesale and private label sourcing.",
    url: "/",
    type: "website",
    siteName: "TK Classic",
    images: [
      {
        url: "/optimized/products/dq-010-stand.webp",
        width: 1200,
        height: 1200,
        alt: "TK Classic DQ-010 portable coffee machine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TK Classic | Portable Coffee Machine OEM & Private Label Supplier",
    description:
      "Factory-direct portable espresso machines and coffee accessories for wholesale and private label sourcing.",
    images: ["/optimized/products/dq-010-stand.webp"],
  },
  other: {
    google: "notranslate",
    ...(process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION
      ? { "baidu-site-verification": process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_360_SITE_VERIFICATION
      ? { "360-site-verification": process.env.NEXT_PUBLIC_360_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_SOGOU_SITE_VERIFICATION
      ? { sogou_site_verification: process.env.NEXT_PUBLIC_SOGOU_SITE_VERIFICATION }
      : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const requestedLang = requestHeaders.get("x-site-lang") ?? "en";
  const lang = (["en", "es", "pt", "fr", "ar", "zh", "ru"].includes(requestedLang) ? requestedLang : "en") as Lang;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      translate="no"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`notranslate ${GeistSans.variable} ${GeistMono.variable}`}
    >
      {process.env.NODE_ENV === "development" ? (
        <head>
          <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        </head>
      ) : null}
      <body suppressHydrationWarning>
        <MotionProvider>
          <SiteStructuredData />
          <LocaleDocumentSync lang={lang} />
          <VisitTracker />
          <GoogleTracking />
          <PageProgress />
          {children}
          <GlobalLanguageSwitcher currentLang={lang} />
          <SiteChatWidget />
          <Analytics />
          <SpeedInsights />
        </MotionProvider>
      </body>
    </html>
  );
}
