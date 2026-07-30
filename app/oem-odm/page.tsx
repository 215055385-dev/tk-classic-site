import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const runtime = "edge";

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function queryFor(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return {
    title: { absolute: `${t.sectionTitles.oem} | TK Classic` },
    description: t.oem.join(" "),
    keywords: ["portable coffee machine OEM", "portable espresso ODM", "private label coffee machine", "custom coffee machine packaging"],
    alternates: { canonical: localizedUrl("/oem-odm", lang), languages: languageAlternates("/oem-odm") },
  };
}

export default async function OemOdmPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const query = queryFor(lang);
  const t = copy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";

  return (
    <main className="inner-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <nav aria-label="OEM and ODM navigation">
          <Link href={`/products${query}`}>{t.nav.products}</Link><Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link><Link href={`/oem-odm${query}`} aria-current="page">{t.nav.oem}</Link><Link href={`/factory${query}`}>{t.nav.factory}</Link><Link href={`/certifications${query}`}>{t.nav.certs}</Link><Link href={`/contact${query}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/oem-odm${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/oem-odm" label={t.sectionTitles.oem} />
      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <p className="eyebrow">{t.nav.oem}</p>
        <h1>{t.sectionTitles.oem}</h1>
        <p className="inner-hero-lead">{t.contactLead}</p>
        <Link className="primary-action" href={`/contact${query}`}>{t.hero.primaryCta}<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </section>
      <RevealSection className="section split-section" aria-labelledby="oem-process-title">
        <div className="section-heading align-left"><span>{t.nav.oem}</span><h2 id="oem-process-title">{t.sectionTitles.oem}</h2><p>{t.intro}</p></div>
        <div className="process-grid">{t.oem.map((item, index) => <RevealArticle className="process-card" key={item}><strong>{String(index + 1).padStart(2, "0")}</strong><p>{item}</p><CheckCircle2 size={19} aria-hidden="true" /></RevealArticle>)}</div>
      </RevealSection>
      <section className="section commercial-section"><div className="section-heading"><span>{t.nav.oem}</span><h2>{t.sectionTitles.oem}</h2></div><div className="proof-grid">{t.oem.slice(0, 3).map((item) => <article className="proof-card" key={item}><p>{item}</p></article>)}</div></section>
      <SiteFooter lang={lang} />
    </main>
  );
}
