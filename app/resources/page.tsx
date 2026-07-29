import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, ChevronRight, Download, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { commercialCopy } from "@/lib/support-page-data";
import { copy, certifications, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";
import { uiCopy } from "@/lib/localized-ui";

type ResourcesPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const runtime = "edge";

export const metadata: Metadata = {
  title: "TK Classic Resources | Certifications and Buyer Guides",
  description: "Portable coffee machine certification files, buyer guides and sourcing FAQs for wholesale and private label programs.",
  keywords: ["portable coffee machine FAQ", "coffee machine certification documents", "OEM coffee buyer guide", "coffee machine sourcing Europe"],
  alternates: { canonical: "/resources", languages: languageAlternates("/resources") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const ui = uiCopy[lang];
  const support = commercialCopy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const query = langQuery(lang);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="inner-page" dir={dir} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <nav aria-label="Resources navigation">
          <Link href={`/products${query}`}>{t.nav.products}</Link>
          <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
          <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
          <Link href={`/factory${query}`}>{t.nav.factory}</Link>
          <Link href={`/certifications${query}`}>{t.nav.certs}</Link>
          <Link href={`/contact${query}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/resources${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/resources" label={t.sectionTitles.blog} />

      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <p className="eyebrow">{t.nav.blog}</p>
        <h1>{t.sectionTitles.blog}</h1>
        <p className="inner-hero-lead">{t.blogLead}</p>
      </section>

      <RevealSection id="certifications" className="section cert-section">
        <div className="section-heading align-left"><span>{t.nav.certs}</span><h2>{t.sectionTitles.certs}</h2><p>{t.certs.join(" ")}</p></div>
        <div className="cert-grid">
          {certifications.map((cert) => <a key={cert.name} href={cert.file}><ShieldCheck size={22} aria-hidden="true" /><span>{cert.name}</span><small><Download size={14} aria-hidden="true" />{t.labels.download}</small></a>)}
        </div>
      </RevealSection>

      <section id="guides" className="section blog-section">
        <div className="section-heading"><span>{ui.blog.cardPrefix}</span><h2>{t.sectionTitles.blog}</h2></div>
        <div className="blog-grid">
          {ui.blog.cards.map(([title, summary], index) => <RevealArticle key={title} className="resource-guide-card"><BookOpen size={21} aria-hidden="true" /><span>{ui.blog.cardPrefix} 0{index + 1}</span><h3>{title}</h3><p>{summary}</p><Link href={`/${query}#contact`}>{t.hero.primaryCta}<ChevronRight size={16} aria-hidden="true" /></Link></RevealArticle>)}
        </div>
      </section>

      <RevealSection id="faq" className="section faq-section">
        <div className="section-heading align-left"><span>{t.nav.faq}</span><h2>{t.sectionTitles.faq}</h2></div>
        <div className="faq-list">{t.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </RevealSection>

      <section className="section commercial-section">
        <div className="section-heading"><span>{support.proofTitle}</span><h2>{support.proofLead}</h2></div>
        <div className="proof-grid">{support.proofItems.map((item) => <article key={item} className="proof-card"><ShieldCheck size={21} aria-hidden="true" /><p>{item}</p></article>)}</div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
