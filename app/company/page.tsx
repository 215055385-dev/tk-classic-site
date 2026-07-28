import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { uiCopy } from "@/lib/localized-ui";
import { commercialCopy } from "@/lib/support-page-data";
import { company, copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";

type CompanyPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "TK Classic Company | OEM/ODM Portable Coffee",
  description: "Factory capabilities, OEM/ODM workflow, quality checkpoints and commercial support for portable coffee sourcing.",
  keywords: ["portable coffee machine supplier", "Shenzhen coffee machine factory", "coffee OEM ODM supplier", "private label coffee equipment"],
  alternates: { canonical: "/company", languages: languageAlternates("/company") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export default async function CompanyPage({ searchParams }: CompanyPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const support = commercialCopy[lang];
  const ui = uiCopy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const query = langQuery(lang);

  return (
    <main className="inner-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span><strong>TK Classic</strong><small>Portable coffee OEM</small></span>
        </Link>
        <nav aria-label="Company navigation">
          <Link href={`/products${query}`}>{t.nav.products}</Link>
          <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
          <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
          <Link href={`/factory${query}`}>{t.nav.factory}</Link>
          <Link href={`/certifications${query}`}>{t.nav.certs}</Link>
          <Link href={`/contact${query}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/company${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/company" label={t.sectionTitles.about} />

      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <p className="eyebrow">{t.nav.about}</p>
        <h1>{t.sectionTitles.about}</h1>
        <p className="inner-hero-lead">{t.intro}</p>
        <div className="metric-panel">
          <div><strong>15+</strong><span>{ui.proof.years}</span></div>
          <div><strong>50+</strong><span>{ui.proof.markets}</span></div>
          <div><strong>7</strong><span>{t.signals[5]}</span></div>
          <div><strong>CE</strong><span>{t.nav.certs}</span></div>
        </div>
      </section>

      <RevealSection id="oem" className="section split-section">
        <div className="section-heading align-left">
          <span>{t.nav.oem}</span>
          <h2>{t.sectionTitles.oem}</h2>
          <p>{t.contactLead}</p>
        </div>
        <div className="process-grid">
          {t.oem.map((item, index) => (
            <article key={item} className="process-card"><strong>{String(index + 1).padStart(2, "0")}</strong><p>{item}</p></article>
          ))}
        </div>
      </RevealSection>

      <section id="factory" className="section factory-section">
        <div>
          <div className="section-heading align-left">
            <span>{t.nav.factory}</span>
            <h2>{t.sectionTitles.factory}</h2>
          </div>
          <div className="factory-list">
            {t.factory.map((item) => <div key={item}><BadgeCheck size={21} aria-hidden="true" /><p>{item}</p></div>)}
          </div>
        </div>
        <div className="metric-panel">
          <div><strong>15+</strong><span>{ui.proof.years}</span></div>
          <div><strong>50+</strong><span>{ui.proof.markets}</span></div>
          <div><strong>CE / FDA</strong><span>{ui.proof.compliance}</span></div>
          <div><strong>ISO 9001</strong><span>{ui.proof.compliance}</span></div>
        </div>
      </section>

      <RevealSection id="quality" className="section quality-section">
        <div className="section-heading">
          <span>{support.qualityTitle}</span>
          <h2>{support.qualityLead}</h2>
        </div>
        <div className="quality-grid">
          {support.qualityItems.map((item, index) => <RevealArticle key={item} className="quality-card"><span>0{index + 1}</span><CheckCircle2 size={20} aria-hidden="true" /><p>{item}</p></RevealArticle>)}
        </div>
      </RevealSection>

      <section id="commercial" className="section commercial-section">
        <div className="section-heading">
          <span>{t.nav.contact}</span>
          <h2>{support.shippingTitle}</h2>
        </div>
        <div className="commercial-grid">
          {[support.shippingTitle, support.leadTimeTitle, support.warrantyTitle].map((title) => {
            const body = title === support.shippingTitle ? support.shipping : title === support.leadTimeTitle ? support.leadTime : support.warranty;
            return <article key={title} className="commercial-card"><ShieldCheck size={22} aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>;
          })}
        </div>
      </section>

      <section id="proof" className="section proof-section">
        <div className="section-heading">
          <span>{support.proofTitle}</span>
          <h2>{support.proofLead}</h2>
        </div>
        <div className="proof-grid">
          {support.proofItems.map((item) => <article key={item} className="proof-card"><Building2 size={21} aria-hidden="true" /><p>{item}</p></article>)}
        </div>
        <div className="contact-methods company-contact-methods">
          <a href={`mailto:${company.emailBowie}`}><Mail size={19} aria-hidden="true" /><span>{company.emailBowie}</span></a>
          <a href={`https://wa.me/${company.whatsappBowie.replace("+", "")}`} target="_blank" rel="noreferrer"><MessageCircle size={19} aria-hidden="true" /><span>{company.whatsappBowie}</span></a>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
