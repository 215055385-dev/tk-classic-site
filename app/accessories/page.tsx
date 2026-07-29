import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Coffee, PackageCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { AccessoryCompatibilityMatrix } from "@/components/AccessoryCompatibilityMatrix";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { accessories } from "@/lib/accessory-data";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";
import { accessoryPageCopy, getAccessoryDisplay } from "@/lib/translation-copy";

type AccessoriesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Coffee Accessories | TK Classic Portable Coffee OEM",
  description: "Optional capsule adapters, brewing components, cups and acrylic display accessories for TK Classic portable coffee systems and bundles.",
  keywords: ["portable coffee machine accessories", "coffee machine accessories wholesale", "OEM coffee accessories", "portable espresso bundle"],
  alternates: { canonical: "/accessories", languages: languageAlternates("/accessories") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export default async function AccessoriesPage({ searchParams }: AccessoriesPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const pageCopy = accessoryPageCopy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";

  return (
    <main className="inner-page accessories-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span><strong>TK Classic</strong><small>Portable coffee OEM</small></span>
        </Link>
        <nav aria-label="Accessories navigation">
          <Link href={`/products${query}`}>{t.nav.products}</Link>
          <Link href={`/accessories${query}`} aria-current="page">{t.sectionTitles.accessories}</Link>
          <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
          <Link href={`/factory${query}`}>{t.nav.factory}</Link>
          <Link href={`/certifications${query}`}>{t.nav.certs}</Link>
          <Link href={`/contact${query}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/accessories${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/accessories" label={t.sectionTitles.accessories} />

      <section className="accessories-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <div className="accessories-hero-grid">
          <div>
            <p className="eyebrow"><Coffee size={16} aria-hidden="true" />{t.sectionTitles.accessories}</p>
            <h1>{pageCopy.heroTitle}</h1>
            <p className="inner-hero-lead">{pageCopy.heroLead}</p>
            <div className="accessories-hero-actions">
              <Link className="primary-action" href={`/contact${query}`}>{pageCopy.bundleCta} <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <Link className="secondary-action" href={`/products${query}`}>{pageCopy.exploreCta}</Link>
            </div>
          </div>
          <div className="accessories-hero-image">
            <Image src="/accessories/acrylic-machine-stand.png" alt="Acrylic stand for a portable coffee machine" fill priority sizes="(max-width: 720px) 100vw, 45vw" quality={75} />
            <span>{pageCopy.photoLabel}</span>
          </div>
        </div>
      </section>

      <RevealSection className="section accessories-catalog" aria-labelledby="accessories-catalog-title">
        <div className="section-heading">
          <span>{pageCopy.catalogEyebrow}</span>
          <h2 id="accessories-catalog-title">{pageCopy.catalogTitle}</h2>
          <p>{pageCopy.catalogLead}</p>
        </div>
        <div className="accessory-grid">
          {accessories.map((accessory, index) => {
            const display = getAccessoryDisplay(accessory.slug, lang, accessory);
            return (
            <RevealArticle className="accessory-card" key={accessory.slug}>
              <div className="accessory-card-image">
                <Image src={accessory.image} alt={accessory.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 25vw" />
                <span>0{index + 1}</span>
              </div>
              <div className="accessory-card-body">
                <p className="card-label">{display.category}</p>
                <h3>{display.title}</h3>
                <p>{display.description}</p>
                <small><PackageCheck size={14} aria-hidden="true" />{display.note}</small>
              </div>
            </RevealArticle>
            );
          })}
        </div>
      </RevealSection>

      <AccessoryCompatibilityMatrix lang={lang} />

      <section className="section accessory-cta-section">
        <div className="accessory-cta-panel">
          <div>
            <span className="eyebrow">{pageCopy.planningEyebrow}</span>
            <h2>{pageCopy.planningTitle}</h2>
            <p>{pageCopy.planningLead}</p>
          </div>
          <Link className="primary-action" href={`/contact${query}`}>{pageCopy.planningCta} <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
