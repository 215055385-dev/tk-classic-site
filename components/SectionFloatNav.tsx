import Link from "next/link";
import { bundleCopy } from "@/lib/bundle-data";
import { copy, type Lang } from "@/lib/site-data";
import { localizedUrl } from "@/lib/seo";

type SectionFloatNavProps = {
  lang: Lang;
  path?: string;
  label?: string;
};

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export function SectionFloatNav({ lang, path, label }: SectionFloatNavProps) {
  const query = langQuery(lang);
  const t = copy[lang];
  const bundles = bundleCopy[lang];

  const structuredData = path && label ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: localizedUrl("/", lang) },
      { "@type": "ListItem", position: 2, name: label, item: localizedUrl(path, lang) },
    ],
  } : null;

  return (
    <>
      {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /> : null}
      <nav className="section-float-nav detail-float-nav" aria-label="Quick section navigation">
        <Link href={`/products${query}`}>{t.nav.products}</Link>
        <Link href={`/bundles${query}`}>{bundles.navLabel}</Link>
        <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
        <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
        <Link href={`/factory${query}`}>{t.nav.factory}</Link>
        <Link href={`/contact${query}`}>{t.nav.contact}</Link>
      </nav>
    </>
  );
}
