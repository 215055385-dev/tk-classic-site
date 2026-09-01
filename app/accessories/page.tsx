import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Coffee, PackageCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { AccessoryCompatibilityMatrix } from "@/components/AccessoryCompatibilityMatrix";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { accessories } from "@/lib/accessory-data";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { accessoryPageCopy, brandTagline, getAccessoryDisplay } from "@/lib/translation-copy";
import { PrimaryNav } from "@/components/PrimaryNav";

type AccessoriesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export async function generateMetadata({ searchParams }: AccessoriesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const pageCopy = accessoryPageCopy[lang];
  return {
    title: { absolute: `${pageCopy.heroTitle} | TK Classic` },
    description: pageCopy.heroLead,
    keywords: ["portable coffee machine accessories", "coffee machine accessories wholesale", "OEM coffee accessories", "portable espresso bundle"],
    alternates: { canonical: localizedUrl("/accessories", lang), languages: languageAlternates("/accessories") },
  };
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
          <span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span>
        </Link>
        <PrimaryNav lang={lang} current="accessories" ariaLabel="Accessories navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/accessories${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/accessories" label={t.sectionTitles.accessories} />

      <section className="accessories-hero section">
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
          <div className="accessories-hero-showcase" aria-label={pageCopy.photoLabel}>
            <div className="accessories-hero-media is-primary">
              <Image src="/accessories/cold-rolled-steel-coffee-stand.webp" alt="Black cold-rolled carbon steel stand for a portable coffee machine" fill loading="eager" fetchPriority="high" sizes="(max-width: 720px) 62vw, 29vw" quality={78} />
              <span>01</span>
            </div>
            <div className="accessories-hero-media is-carry-case">
              <Image src="/accessories/portable-carry-case.webp" alt="Black portable coffee machine carry case" fill loading="eager" sizes="(max-width: 720px) 34vw, 16vw" quality={76} />
              <span>02</span>
            </div>
            <div className="accessories-hero-media is-acrylic">
              <Image src="/accessories/acrylic-machine-stand.webp" alt="Clear acrylic stand for a portable coffee machine" fill loading="lazy" sizes="(max-width: 720px) 34vw, 16vw" quality={72} />
              <span>03</span>
            </div>
            <p>{pageCopy.photoLabel}</p>
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
                <Image src={accessory.image} alt={accessory.alt} fill loading="lazy" sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw" />
                <span>0{index + 1}</span>
              </div>
              <div className="accessory-card-body">
                <p className="card-label">{display.category}</p>
                <h3>{display.title}</h3>
                <p>{display.description}</p>
                {display.highlights?.length ? (
                  <ul className="accessory-card-highlights" aria-label={`${display.title} highlights`}>
                    {display.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                ) : null}
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
