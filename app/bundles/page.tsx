import Link from "next/link";
import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { bundleCopy } from "@/lib/bundle-data";
import { languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { brandTagline, bundleOptionalNote } from "@/lib/translation-copy";
import { PrimaryNav } from "@/components/PrimaryNav";

type BundlesPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export async function generateMetadata({ searchParams }: BundlesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const bundles = bundleCopy[lang];
  return {
    title: { absolute: `${bundles.title} | TK Classic` },
    description: bundles.lead,
    keywords: ["portable coffee machine bundle", "coffee gift set wholesale", "private label coffee bundle", "OEM coffee gift set"],
    alternates: { canonical: localizedUrl("/bundles", lang), languages: languageAlternates("/bundles") },
  };
}

export default async function BundlesPage({ searchParams }: BundlesPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const bundles = bundleCopy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";

  return (
    <main className="inner-page bundles-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link>
        <PrimaryNav lang={lang} ariaLabel="Bundles navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/bundles${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/bundles" label={bundles.title} />

      <section className="inner-hero section">
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
