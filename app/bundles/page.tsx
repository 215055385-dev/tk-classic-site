import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { bundleCopy } from "@/lib/bundle-data";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";
import { bundleOptionalNote } from "@/lib/translation-copy";

type BundlesPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Portable Coffee Bundles | TK Classic",
  description: "Configure portable coffee machine bundles with accessories, packaging and private-label options.",
  keywords: ["portable coffee machine bundle", "coffee gift set wholesale", "private label coffee bundle", "OEM coffee gift set"],
  alternates: { canonical: "/bundles", languages: languageAlternates("/bundles") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export default async function BundlesPage({ searchParams }: BundlesPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const bundles = bundleCopy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";

  return (
    <main className="inner-page bundles-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <nav aria-label="Bundles navigation">
          <Link href={`/products${query}`}>{t.nav.products}</Link>
          <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
          <Link href={`/bundles${query}`} aria-current="page">{bundles.navLabel}</Link>
          <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
          <Link href={`/factory${query}`}>{t.nav.factory}</Link>
          <Link href={`/contact${query}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/bundles${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/bundles" label={bundles.title} />

      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <p className="eyebrow">{bundles.navLabel}</p>
        <h1>{bundles.title}</h1>
        <p className="inner-hero-lead">{bundles.lead} {bundleOptionalNote[lang]}</p>
      </section>

      <RevealSection className="section bundle-section">
        <div className="bundle-grid">
          {bundles.cards.map((bundle, index) => (
            <RevealArticle className="bundle-card" key={bundle.title}>
              <span className="bundle-index">0{index + 1}</span>
              <h3>{bundle.title}</h3>
              <p>{bundle.summary}</p>
              <div className="bundle-meta"><strong>{bundle.includesLabel}</strong><span>{bundle.includes}</span></div>
              <div className="bundle-meta"><strong>{bundle.fitLabel}</strong><span>{bundle.fit}</span></div>
              <Link className="quote-link" href={`/contact${query}`}>{bundles.cta}<Mail size={15} aria-hidden="true" /></Link>
            </RevealArticle>
          ))}
        </div>
      </RevealSection>
      <SiteFooter lang={lang} />
    </main>
  );
}
