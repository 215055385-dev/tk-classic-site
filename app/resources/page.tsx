import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Building2, ChevronRight, Compass, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { commercialCopy } from "@/lib/support-page-data";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedPath, localizedUrl } from "@/lib/seo";
import { uiCopy } from "@/lib/localized-ui";
import { certificationRequestCopy } from "@/lib/certification-copy";
import { buyerGuides } from "@/lib/buyer-guides";
import { brandTagline } from "@/lib/translation-copy";
import { PrimaryNav, resourcesCopy } from "@/components/PrimaryNav";

type ResourcesPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

const readGuideCopy: Record<Lang, string> = {
  en: "Read buyer guide",
  es: "Leer la guía en inglés",
  pt: "Ler o guia em inglês",
  fr: "Lire le guide en anglais",
  ar: "قراءة الدليل باللغة الإنجليزية",
  zh: "阅读英文采购指南",
  ru: "Читать руководство на английском",
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export async function generateMetadata({ searchParams }: ResourcesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return {
    title: { absolute: `${t.sectionTitles.blog} | TK Classic` },
    description: t.blogLead,
    keywords: ["portable coffee machine FAQ", "coffee machine certification documents", "OEM coffee buyer guide", "coffee machine sourcing Europe"],
    alternates: { canonical: localizedUrl("/resources", lang), languages: languageAlternates("/resources") },
  };
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const ui = uiCopy[lang];
  const support = commercialCopy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const query = langQuery(lang);
  const guideCards = lang === "en"
    ? buyerGuides.map((guide) => [guide.title, guide.description] as [string, string])
    : ui.blog.cards;
  const resources = resourcesCopy[lang];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "TK Classic buyer guides",
      itemListElement: buyerGuides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: `${localizedUrl(`/resources/${guide.slug}`, "en")}`,
      })),
    },
  ];

  return (
    <main className="inner-page resources-page" dir={dir} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link>
        <PrimaryNav lang={lang} current="resources" ariaLabel="Resources navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/resources${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/resources" label={t.sectionTitles.blog} />

      <section className="inner-hero section resources-hero">
        <div className="resources-hero-copy">
          <p className="eyebrow">{t.nav.blog}</p>
          <h1>{t.sectionTitles.blog}</h1>
          <p className="inner-hero-lead">{t.blogLead}</p>
        </div>
        <nav className="resources-hero-shortcuts" aria-label={resources.overview[0]}>
          <Link href="#guides"><BookOpen size={23} aria-hidden="true" /><span>01</span><h3>{resources.guides[0]}</h3><p>{resources.guides[1]}</p><strong><ArrowUpRight size={16} aria-hidden="true" /></strong></Link>
          <Link href={localizedPath("/solutions", lang)}><Compass size={23} aria-hidden="true" /><span>02</span><h3>{resources.scenarios[0]}</h3><p>{resources.scenarios[1]}</p><strong><ArrowUpRight size={16} aria-hidden="true" /></strong></Link>
          <Link href={localizedPath("/wholesale/usa", lang)}><Building2 size={23} aria-hidden="true" /><span>03</span><h3>{resources.wholesale[0]}</h3><p>{resources.wholesale[1]}</p><strong><ArrowUpRight size={16} aria-hidden="true" /></strong></Link>
        </nav>
      </section>

      <section id="guides" className="section blog-section">
        <div className="section-heading"><span>{ui.blog.cardPrefix}</span><h2>{resources.guides[0]}</h2></div>
        <div className="blog-grid">
          {guideCards.map(([title, summary], index) => {
            const guide = buyerGuides[index];
            return <RevealArticle key={title} className="resource-guide-card"><BookOpen size={21} aria-hidden="true" /><span>{ui.blog.cardPrefix} 0{index + 1}</span><h3>{title}</h3><p>{summary}</p><Link href={guide ? `/resources/${guide.slug}` : `/contact${query}`}>{readGuideCopy[lang]}<ChevronRight size={16} aria-hidden="true" /></Link></RevealArticle>;
          })}
        </div>
      </section>

      <RevealSection id="faq" className="section faq-section">
        <div className="section-heading align-left"><span>{t.nav.faq}</span><h2>{t.sectionTitles.faq}</h2></div>
        <div className="faq-list">{t.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </RevealSection>

      <section className="section resource-evidence-bar">
        <ShieldCheck size={25} aria-hidden="true" />
        <div><span>{t.nav.certs}</span><h2>{t.sectionTitles.certs}</h2><p>{certificationRequestCopy[lang]}</p></div>
        <Link href={localizedPath("/certifications", lang)}>{t.nav.certs}<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="section commercial-section">
        <div className="section-heading"><span>{support.proofTitle}</span><h2>{support.proofLead}</h2></div>
        <div className="proof-grid">{support.proofItems.map((item) => <article key={item} className="proof-card"><ShieldCheck size={21} aria-hidden="true" /><p>{item}</p></article>)}</div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
