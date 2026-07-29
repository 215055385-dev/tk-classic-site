import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BatteryCharging,
  ChevronRight,
  Coffee,
  FileDown,
  Mail,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import {
  HeroActionsMotion,
  HeroCopyMotion,
  HeroTextMotion,
  HeroTitleMotion,
  HeroVisualMotion,
  MotionCta,
  RevealArticle,
  RevealSection,
} from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import {
  localizeFeatureLabel,
  localizeHighlight,
  localizeTerm,
} from "@/lib/localized-ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { ProductPriceTag } from "@/components/ProductPriceTag";
import { ProductAccessorySelector } from "@/components/ProductAccessorySelector";
import { company, copy, languages, products, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";
import { phoneHref, whatsappHref } from "@/lib/contact";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const runtime = "edge";

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export async function generateMetadata({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);

  return {
    title: `${product.model} | ${copy[lang].nav.products}`,
    description: product.summary[lang],
    alternates: {
      canonical: `/products/${product.slug}`,
      languages: languageAlternates(`/products/${product.slug}`),
    },
    openGraph: {
      title: `${product.model} | TK Classic Portable Coffee OEM`,
      description: product.summary[lang],
      url: `/products/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.hero,
          alt: `${product.model} portable coffee machine`,
        },
      ],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const lang = getLang(resolvedSearchParams?.lang);
  const t = copy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${product.model} Portable Coffee Machine`,
      brand: {
        "@type": "Brand",
        name: company.brand,
      },
      image: product.gallery.map((image) => `${company.siteUrl}${image}`),
      description: product.summary[lang],
      sku: product.model,
      category: "Portable coffee machine",
      inLanguage: lang,
      manufacturer: {
        "@type": "Organization",
        name: company.legalName,
      },
      offers: {
        "@type": "Offer",
        price: product.price.sale,
        priceCurrency: product.price.currency,
        availability: "https://schema.org/InStock",
        url: `${company.siteUrl}/products/${product.slug}`,
      },
      additionalProperty: Object.entries(product.spec).map(([name, value]) => ({
        "@type": "PropertyValue",
        name,
        value,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: company.siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.model,
          item: `${company.siteUrl}/products/${product.slug}`,
        },
      ],
    },
  ];

  return (
    <main className="inner-page" dir={dir} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header detail-header">
        <Link className="brand" href={`/${langQuery(lang)}`} aria-label="Back to TK Classic home">
          <span className="brand-mark">TK</span>
          <span>
            <strong>TK Classic</strong>
            <small>Portable coffee OEM</small>
          </span>
        </Link>
        <nav aria-label="Product page navigation">
          <Link href={`/products${langQuery(lang)}`}>{t.nav.products}</Link>
          <Link href={`/oem-odm${langQuery(lang)}`}>{t.nav.oem}</Link>
          <Link href={`/certifications${langQuery(lang)}`}>{t.nav.certs}</Link>
          <Link href={`/contact${langQuery(lang)}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher
          currentLang={lang}
          hrefForLang={(language) =>
            `/products/${product.slug}${language === "en" ? "" : `?lang=${language}`}`
          }
        />
      </header>
      <SectionFloatNav lang={lang} />

      <section className="product-hero">
        <HeroCopyMotion className="product-hero-copy">
          <Link className="back-link" href={`/${langQuery(lang)}#products`}>
            <ArrowLeft size={17} aria-hidden="true" />
            {t.nav.products}
          </Link>
          <p className="eyebrow">{localizeFeatureLabel(product.featureLabel, lang)}</p>
          <HeroTitleMotion>{product.model}</HeroTitleMotion>
          <HeroTextMotion className="hero-lead">{product.summary[lang]}</HeroTextMotion>
          <ProductPriceTag lang={lang} price={product.price} />
          <div className="spec-pill-row">
            <span>
              <Zap size={16} aria-hidden="true" />
              {product.spec.pressure}
            </span>
            <span>
              <BatteryCharging size={16} aria-hidden="true" />
              {product.spec.battery}
            </span>
            <span>
              <Coffee size={16} aria-hidden="true" />
              {product.spec.cup}
            </span>
          </div>
          <HeroActionsMotion className="hero-actions">
            <MotionCta className="primary-action" href="#product-inquiry">
              <Mail size={18} aria-hidden="true" />
              {t.hero.primaryCta}
            </MotionCta>
            <MotionCta
              className="secondary-action"
              href={whatsappHref(product.model)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {t.hero.secondaryCta}
            </MotionCta>
            <MotionCta className="text-action" href={company.brochure}>
              <FileDown size={18} aria-hidden="true" />
              {t.hero.tertiaryCta}
            </MotionCta>
          </HeroActionsMotion>
        </HeroCopyMotion>
        <HeroVisualMotion className="product-hero-image">
          <Image
            src={product.hero}
            alt={`${product.model} portable coffee machine`}
            width={1000}
            height={1000}
            sizes="(max-width: 1040px) 100vw, 50vw"
            priority
          />
          <div className="hero-proof-card proof-top">
            <strong>{product.spec.pressure}</strong>
            <span>{t.labels.pressure}</span>
          </div>
          <div className="hero-proof-card proof-bottom">
            <strong>{product.spec.battery}</strong>
            <span>{t.labels.battery}</span>
          </div>
        </HeroVisualMotion>
      </section>

      <RevealSection className="section product-detail-grid">
        <div>
          <div className="section-heading align-left">
            <span>{t.labels.feature}</span>
            <h2>{t.labels.selected}</h2>
          </div>
          <div className="factory-list">
            {product.highlight.map((item) => (
              <div key={item}>
                <PackageCheck size={21} aria-hidden="true" />
                <p>{localizeHighlight(item, lang)}</p>
              </div>
            ))}
          </div>
          <div className="use-case-row">
            {product.useCases.map((item) => (
              <span key={item}>{localizeTerm(item, lang)}</span>
            ))}
          </div>
        </div>

        <div className="spec-table">
          {Object.entries(product.spec).map(([key, value]) => (
            <div key={key}>
              <dt>{t.labels[key] ?? key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section gallery-section">
        <div className="section-heading">
          <span>{product.model}</span>
          <h2>{t.labels.fullSpec}</h2>
        </div>
        <div className="gallery-grid">
          {product.gallery.map((image) => (
            <Image
              key={image}
              src={image}
              alt={`${product.model} product gallery image`}
              width={900}
              height={900}
              sizes="(max-width: 720px) 100vw, 50vw"
            />
          ))}
        </div>
      </RevealSection>

      <ProductAccessorySelector lang={lang} model={product.model} />

      <section id="product-inquiry" className="section contact-section">
        <div>
          <div className="section-heading align-left">
            <span>{t.labels.support}</span>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactLead}</p>
          </div>
          <div className="contact-methods">
            <Link href="#inquiry-form">
              <Mail size={20} aria-hidden="true" />
              <span>Send a secure inquiry</span>
            </Link>
            <a href={phoneHref(company.phoneBowie)}>
              <MessageCircle size={20} aria-hidden="true" />
              <span>Phone: {company.phoneBowie}</span>
            </a>
            <a href={whatsappHref(product.model)} target="_blank" rel="noreferrer">
              <MessageCircle size={20} aria-hidden="true" />
              <span>WhatsApp — {product.model}</span>
            </a>
            <a href="/downloads/product-brochure.pdf">
              <ShieldCheck size={20} aria-hidden="true" />
              <span>{t.hero.tertiaryCta}</span>
            </a>
          </div>
        </div>
        <InquiryForm lang={lang} selectedProduct={product.model} />
      </section>

      <section className="section">
        <div className="section-heading">
          <span>{t.labels.related}</span>
          <h2>{t.labels.related}</h2>
        </div>
        <div className="product-grid compact-grid">
          {related.map((item) => (
            <RevealArticle className="compact-product" key={item.model}>
              <Image
                src={item.hero}
                alt={`${item.model} product`}
                width={640}
                height={640}
                sizes="(max-width: 720px) 84px, 96px"
              />
              <div>
                <p className="card-label">{localizeFeatureLabel(item.featureLabel, lang)}</p>
                <h3>{item.model}</h3>
                <ProductPriceTag compact lang={lang} price={item.price} />
                <p>{item.summary[lang]}</p>
              </div>
              <Link href={`/products/${item.slug}${langQuery(lang)}`} aria-label={`${item.model} details`}>
                <ChevronRight size={20} aria-hidden="true" />
              </Link>
            </RevealArticle>
          ))}
        </div>
      </section>

      <div className="mobile-sticky-cta" aria-label="Mobile quick product inquiry">
        <a href="#product-inquiry">{t.hero.primaryCta}</a>
        <a
          href={whatsappHref(product.model)}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>

      <SiteFooter lang={lang} />
    </main>
  );
}
