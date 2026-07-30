import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { company } from "@/lib/site-data";
import { VisitTracker } from "@/components/VisitTracker";
import { SiteStructuredData } from "@/components/SiteStructuredData";
import { LocaleDocumentSync } from "@/components/LocaleDocumentSync";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";
import "./styles/performance.css";
import "./styles/home-carousel.css";
import "./styles/inquiry.css";
import "./styles/upgrade.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "TK Classic | Portable Coffee Machine OEM & Private Label Supplier",
    template: "%s | TK Classic",
  },
  description:
    "Factory-direct portable espresso machines, frothers, warmers and accessories for European wholesalers, private label brands, and OEM/ODM programs.",
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
      "Factory-direct portable espresso machines and coffee accessories for European wholesale and private label sourcing.",
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
      "Factory-direct portable espresso machines and coffee accessories for European wholesale and private label sourcing.",
    images: ["/optimized/products/dq-010-stand.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body><MotionProvider><SiteStructuredData /><LocaleDocumentSync /><VisitTracker />{children}</MotionProvider></body>
    </html>
  );
}
