import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { ProductPriceTag } from "@/components/ProductPriceTag";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { company, copy, languages, products, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { localizeFeatureLabel } from "@/lib/localized-ui";
import { getCmsProducts } from "@/lib/cms-products";
import { getCmsSeo } from "@/lib/cms-content";
import { brandTagline } from "@/lib/translation-copy";
import { getProductGeo } from "@/lib/product-geo";
import { PrimaryNav } from "@/components/PrimaryNav";
import { getProductSpecEntries } from "@/lib/product-presentation";
import { localizeSpecValue } from "@/lib/localized-ui";

type ProductsPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const runtime = "nodejs";

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const title = `${t.sectionTitles.products} | ${company.brand}`;
  const managed = await getCmsSeo("/products", lang);

  return {
    title: { absolute: managed?.title?.trim() || title },
    description: managed?.description?.trim() || t.description,
    keywords: managed?.keywords.length ? managed.keywords : ["portable espresso machine wholesale", "portable coffee machine models", "coffee machine OEM range", "private label espresso machine"],
    robots: managed?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: managed?.canonicalUrl?.trim() || localizedUrl("/products", lang),
      languages: languageAlternates("/products"),
    },
    openGraph: {
      title,
      description: t.description,
      url: localizedUrl("/products", lang),
      images: [{ url: products[0].hero, alt: getProductGeo(products[0], lang).primaryAlt }],
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [params, cmsProducts] = await Promise.all([searchParams, getCmsProducts()]);
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const featuredProduct = cmsProducts.find((product) => product.model === "DQ-010") ?? cmsProducts[0];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.sectionTitles.products,
    url: localizedUrl("/products", lang),
    isPartOf: { "@type": "WebSite", "@id": `${company.siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cmsProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: getProductGeo(product, lang).displayName,
        url: localizedUrl(`/products/${product.slug}`, lang),
      })),
    },
  };

  return (
    <main className="inner-page products-page cinematic-products-preview" dir={dir} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link>
        <PrimaryNav lang={lang} current="products" ariaLabel="Products navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/products${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/products" label={t.sectionTitles.products} />

      <section className="inner-hero section product-collection-hero">
        <div className="inner-hero-copy">
          <p className="eyebrow">{t.nav.products}</p>
          <h1>{t.sectionTitles.products}</h1>
          <p className="inner-hero-lead">{t.description}</p>
          <a className="primary-action" href="#product-catalog">{t.nav.products}<ChevronRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="product-collection-stage" aria-label={t.sectionTitles.products}>
          <Link className="product-collection-feature" href={`/products/${featuredProduct.slug}${query}`}>
            <Image
              src="/optimized/product-scenes/dq-010-1.webp"
              alt={getProductGeo(featuredProduct, lang).primaryAlt}
              fill
              sizes="(max-width: 720px) 92vw, 52vw"
              priority
              loading="eager"
            />
            <span><small>{localizeFeatureLabel(featuredProduct.featureLabel, lang)}</small><strong>{featuredProduct.model}</strong><ChevronRight size={18} aria-hidden="true" /></span>
          </Link>
          <nav className="product-collection-model-links" aria-label={t.sectionTitles.products}>
            {cmsProducts.map((product) => <Link href={`/products/${product.slug}${query}`} key={product.model} aria-current={product.model === featuredProduct.model ? "page" : undefined}>{product.model}</Link>)}
          </nav>
        </div>
      </section>

      <RevealSection id="product-catalog" className="section product-catalog-section">
        <div className="product-grid featured-grid product-pricing-grid">
          {cmsProducts.map((product, index) => {
            const geo = getProductGeo(product, lang);
            const cardSpecs = getProductSpecEntries(product, 3);
            return (
            <RevealArticle className="product-card is-featured" key={product.model}>
              <Link href={`/products/${product.slug}${query}`} className="product-image-link">
                <Image
                  src={product.hero}
                  alt={geo.primaryAlt}
                  width={900}
                  height={900}
                  sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw"
                  loading={index < 3 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </Link>
              <div className="product-card-body">
                <p className="card-label">{localizeFeatureLabel(product.featureLabel, lang)}</p>
                <h3>{product.model}</h3>
                <ProductPriceTag lang={lang} />
                <p>{product.summary[lang]}</p>
                <dl>
                  {cardSpecs.map(([key, value]) => <div key={key}><dt>{t.labels[key] ?? key}</dt><dd>{localizeSpecValue(value, lang)}</dd></div>)}
                </dl>
                <Link className="card-link" href={`/products/${product.slug}${query}`}>{t.labels.fullSpec}<ChevronRight size={17} aria-hidden="true" /></Link>
                <Link className="quote-link" href={`/contact${query}`}>{t.hero.primaryCta}<Mail size={15} aria-hidden="true" /></Link>
              </div>
            </RevealArticle>
          );})}
        </div>
      </RevealSection>

      <section className="section accessory-cta-section">
        <div className="accessory-cta-panel">
          <div><span className="eyebrow">{t.sectionTitles.accessories}</span><h2>{t.sectionTitles.accessories}</h2><p>{t.intro}</p></div>
          <Link className="primary-action" href={`/accessories${query}`}>{t.sectionTitles.accessories} <ChevronRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
