import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ChevronRight, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { ProductPriceTag } from "@/components/ProductPriceTag";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { company, copy, languages, products, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";
import { localizeFeatureLabel } from "@/lib/localized-ui";

type ProductsPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = {
  title: "Portable Coffee Machines | TK Classic Products",
  description: "Explore TK Classic portable espresso machines for wholesale, private label and OEM/ODM coffee programs.",
  keywords: ["portable espresso machine wholesale", "portable coffee machine models", "coffee machine OEM range", "private label espresso machine"],
  alternates: { canonical: "/products", languages: languageAlternates("/products") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.sectionTitles.products,
    url: `${company.siteUrl}/products${query}`,
    isPartOf: { "@type": "WebSite", "@id": `${company.siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.model,
        url: `${company.siteUrl}/products/${product.slug}${query}`,
      })),
    },
  };

  return (
    <main className="inner-page products-page" dir={dir} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <nav aria-label="Products navigation">
          <Link href={`/products${query}`} aria-current="page">{t.nav.products}</Link>
          <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
          <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
          <Link href={`/factory${query}`}>{t.nav.factory}</Link>
          <Link href={`/certifications${query}`}>{t.nav.certs}</Link>
          <Link href={`/contact${query}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/products${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/products" label={t.sectionTitles.products} />

      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <p className="eyebrow">{t.nav.products}</p>
        <h1>{t.sectionTitles.products}</h1>
        <p className="inner-hero-lead">{t.description}</p>
      </section>

      <RevealSection className="section product-catalog-section">
        <div className="product-grid featured-grid product-pricing-grid">
          {products.map((product) => (
            <RevealArticle className="product-card is-featured" key={product.model}>
              <Link href={`/products/${product.slug}${query}`} className="product-image-link">
                <Image src={product.hero} alt={`${product.model} portable coffee machine`} width={900} height={900} sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw" />
              </Link>
              <div className="product-card-body">
                <p className="card-label">{localizeFeatureLabel(product.featureLabel, lang)}</p>
                <h3>{product.model}</h3>
                <ProductPriceTag lang={lang} price={product.price} />
                <p>{product.summary[lang]}</p>
                <dl>
                  <div><dt>{t.labels.pressure}</dt><dd>{product.spec.pressure}</dd></div>
                  <div><dt>{t.labels.battery}</dt><dd>{product.spec.battery}</dd></div>
                  <div><dt>{t.labels.material}</dt><dd>{product.spec.material}</dd></div>
                </dl>
                <Link className="card-link" href={`/products/${product.slug}${query}`}>{t.labels.fullSpec}<ChevronRight size={17} aria-hidden="true" /></Link>
                <Link className="quote-link" href={`/contact${query}`}>{t.hero.primaryCta}<Mail size={15} aria-hidden="true" /></Link>
              </div>
            </RevealArticle>
          ))}
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
