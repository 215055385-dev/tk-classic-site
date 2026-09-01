import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BatteryCharging,
  BookOpenCheck,
  ChevronRight,
  Coffee,
  Droplets,
  Mail,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import {
  HeroActionsMotion,
  HeroCopyMotion,
  HeroTextMotion,
  HeroTitleMotion,
  HeroVisualMotion,
  MotionCta,
  RevealSection,
} from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import {
  localizeFeatureLabel,
  localizeHighlight,
  localizeSpecValue,
  localizeTerm,
} from "@/lib/localized-ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { PrimaryNav } from "@/components/PrimaryNav";
import { ProductAccessorySelector } from "@/components/ProductAccessorySelector";
import { ProductVideoShowcase, type ProductVideo } from "@/components/ProductVideoShowcase";
import { company, copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedPath, localizedUrl } from "@/lib/seo";
import { brandTagline } from "@/lib/translation-copy";
import { whatsappHref } from "@/lib/contact";
import { getCmsProducts } from "@/lib/cms-products";
import { getCmsSeo } from "@/lib/cms-content";
import { getProductGeo } from "@/lib/product-geo";
import { getProductManualKnowledge } from "@/lib/product-manual-data";
import { ProcurementExpectation } from "@/components/ProcurementExpectation";
import { ProductLogistics } from "@/components/ProductLogistics";
import { packingProperties } from "@/lib/commercial-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const runtime = "nodejs";

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export async function generateMetadata({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const product = (await getCmsProducts()).find((item) => item.slug === slug);
  if (!product) return {};
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);
  const managed = await getCmsSeo(`/products/${slug}`, lang);
  const geo = getProductGeo(product, lang);

  return {
    title: { absolute: managed?.title?.trim() || (lang === "en" ? `${geo.seoTitle} | ${company.brand}` : `${geo.displayName} | ${company.brand}`) },
    description: managed?.description?.trim() || product.summary[lang],
    keywords: managed?.keywords.length ? managed.keywords : undefined,
    robots: managed?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: managed?.canonicalUrl?.trim() || localizedUrl(`/products/${product.slug}`, lang),
      languages: languageAlternates(`/products/${product.slug}`),
    },
    openGraph: {
      title: geo.displayName,
      description: product.summary[lang],
      url: localizedUrl(`/products/${product.slug}`, lang),
      type: "website",
      images: [
        {
          url: product.hero,
          alt: geo.primaryAlt,
        },
      ],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const [{ slug }, resolvedSearchParams, cmsProducts] = await Promise.all([params, searchParams, getCmsProducts()]);
  const product = cmsProducts.find((item) => item.slug === slug);
  if (!product) notFound();

  const lang = getLang(resolvedSearchParams?.lang);
  const t = copy[lang];
  const geo = getProductGeo(product, lang);
  const manual = getProductManualKnowledge(product.model, lang);
  const pageFaqs = manual ? [...geo.faqs, ...manual.faqs] : geo.faqs;
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const related = cmsProducts.filter((item) => item.slug !== product.slug).slice(0, 3);
  const productUi = {
    en: { fullSpecs: "View full specifications", packing: "Packing & logistics", procurement: "Procurement terms", verified: "Verified product guidance", inquiry: "Start a product inquiry" },
    es: { fullSpecs: "Ver especificaciones completas", packing: "Embalaje y logística", procurement: "Condiciones de compra", verified: "Guía de producto verificada", inquiry: "Iniciar una consulta" },
    pt: { fullSpecs: "Ver especificações completas", packing: "Embalagem e logística", procurement: "Condições de compra", verified: "Orientação verificada", inquiry: "Iniciar uma consulta" },
    fr: { fullSpecs: "Voir toutes les caractéristiques", packing: "Emballage et logistique", procurement: "Conditions d’achat", verified: "Guide produit vérifié", inquiry: "Démarrer une demande" },
    ar: { fullSpecs: "عرض المواصفات الكاملة", packing: "التعبئة والخدمات اللوجستية", procurement: "شروط الشراء", verified: "إرشادات منتج موثقة", inquiry: "ابدأ الاستفسار" },
    zh: { fullSpecs: "查看完整参数", packing: "包装与物流", procurement: "采购条款", verified: "已核实的产品指南", inquiry: "提交产品询盘" },
    ru: { fullSpecs: "Все характеристики", packing: "Упаковка и логистика", procurement: "Условия закупки", verified: "Проверенное руководство", inquiry: "Начать запрос" },
  }[lang];
  const productUrl = localizedUrl(`/products/${product.slug}`, lang);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${productUrl}#webpage`,
      url: productUrl,
      name: geo.displayName,
      description: product.summary[lang],
      inLanguage: lang,
      isPartOf: { "@id": `${company.siteUrl}#website` },
      about: {
        "@type": "Thing",
        "@id": `${productUrl}#model`,
        additionalType: "https://schema.org/Product",
        name: geo.displayName,
        alternateName: product.model,
        description: product.summary[lang],
        image: product.gallery.map((image) => `${company.siteUrl}${image}`),
        identifier: {
          "@type": "PropertyValue",
          propertyID: "Model",
          value: product.model,
        },
      },
      mentions: [
        { "@id": `${company.siteUrl}#organization` },
        ...Object.entries(product.spec).map(([name, value]) => ({
          "@type": "PropertyValue",
          name,
          value,
        })),
        ...packingProperties(product.model),
        ...(manual ? [{
          "@type": "PropertyValue",
          name: "Manual-verified coffee formats",
          value: manual.supportedInputs.join("; "),
        }] : []),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: copy[lang].nav.home,
          item: localizedUrl("/", lang),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t.nav.products,
          item: localizedUrl("/products", lang),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: geo.displayName,
          item: localizedUrl(`/products/${product.slug}`, lang),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pageFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    ...(product.model === "DQ-010" && lang === "en" ? [
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "DQ-010 Portable Espresso Extraction Demonstration",
        description: "A real DQ-010 presentation showing the preparation and espresso extraction sequence.",
        thumbnailUrl: `${company.siteUrl}/optimized/video-posters/dq-010-real-operation.webp`,
        contentUrl: `${company.siteUrl}/videos/dq-010-real-operation.mp4`,
        uploadDate: "2026-07-30T16:46:36+08:00",
        inLanguage: "en",
      },
    ] : []),
  ];

  const dq010Video: ProductVideo | null = product.model === "DQ-010" && lang === "en" ? {
    src: "/videos/dq-010-real-operation.mp4",
    webmSrc: "/videos/dq-010-real-operation.webm",
    poster: "/optimized/video-posters/dq-010-real-operation.webp",
    posterAlt: "DQ-010 portable coffee machine real operation video cover",
    label: "Real operation / DQ-010",
    title: "See the DQ-010 preparation and extraction sequence",
    summary: "This real-product video shows the order of preparing the coffee container, adding water, assembling the machine and collecting the finished espresso.",
    steps: [
      { title: "Prepare the coffee", description: "Use the compatible coffee container shown in the video." },
      { title: "Add water", description: "Fill the water chamber following the demonstrated order." },
      { title: "Assemble and start", description: "Fit the components and start the DQ-010 as shown." },
      { title: "Collect espresso", description: "Allow the extracted coffee to flow into the cup." },
    ],
    secondaryCta: { href: "#product-inquiry", label: "Request a DQ-010 quotation" },
    layout: "media-left",
  } : null;

  return (
    <main className="inner-page" dir={dir} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header detail-header">
        <Link className="brand" href={localizedPath("/", lang)} aria-label="Back to TK Classic home">
          <span className="brand-mark">TK</span>
          <span>
            <strong>TK Classic</strong>
            <small>{brandTagline[lang]}</small>
          </span>
        </Link>
        <PrimaryNav lang={lang} current="products" ariaLabel="Product page navigation" />
        <LanguageSwitcher
          currentLang={lang}
          hrefForLang={(language) =>
            localizedPath(`/products/${product.slug}`, language)
          }
        />
      </header>
      <SectionFloatNav lang={lang} />

      <section className="product-hero">
        <HeroCopyMotion className="product-hero-copy">
          <Link className="back-link" href={`${localizedPath("/", lang)}#products`}>
            <ArrowLeft size={17} aria-hidden="true" />
            {t.nav.products}
          </Link>
          <p className="eyebrow">{localizeFeatureLabel(product.featureLabel, lang)}</p>
          <HeroTitleMotion>{product.model}</HeroTitleMotion>
          <HeroTextMotion className="hero-lead">{product.summary[lang]}</HeroTextMotion>
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
          </HeroActionsMotion>
        </HeroCopyMotion>
        <HeroVisualMotion className="product-hero-image">
          <Image
            src={product.hero}
            alt={geo.primaryAlt}
            width={1000}
            height={1000}
            sizes="(max-width: 1040px) 100vw, 50vw"
            priority
            loading="eager"
          />
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

        <div className="product-spec-summary">
          <div className="spec-table">
          {Object.entries(product.spec).slice(0, 4).map(([key, value]) => (
            <div key={key}>
              <dt>{t.labels[key] ?? key}</dt>
              <dd>{localizeSpecValue(value, lang)}</dd>
            </div>
          ))}
          </div>
          <details className="product-spec-disclosure">
            <summary>{productUi.fullSpecs}<ChevronRight size={17} aria-hidden="true" /></summary>
            <dl className="spec-table">
              {Object.entries(product.spec).slice(4).map(([key, value]) => <div key={key}><dt>{t.labels[key] ?? key}</dt><dd>{localizeSpecValue(value, lang)}</dd></div>)}
            </dl>
          </details>
        </div>
      </RevealSection>

      <details id="packing-logistics" className="section product-content-disclosure">
        <summary>{productUi.packing}<ChevronRight size={18} aria-hidden="true" /></summary>
        <ProductLogistics model={product.model} lang={lang} compact />
      </details>

      <details className="section product-content-disclosure">
        <summary>{productUi.procurement}<ChevronRight size={18} aria-hidden="true" /></summary>
        <ProcurementExpectation lang={lang} compact />
      </details>

      <details className="section product-content-disclosure product-geo-overview">
        <summary>{geo.labels.overview}<ChevronRight size={18} aria-hidden="true" /></summary>
        <div className="section-heading align-left">
          <h2>{geo.labels.overviewTitle}</h2>
          <p>{geo.directAnswer}</p>
        </div>
        <div className="proof-grid">
          <article className="proof-card">
            <PackageCheck size={21} aria-hidden="true" />
            <h3>{geo.labels.audience}</h3>
            <p>{geo.faqs[1].answer}</p>
          </article>
          <article className="proof-card">
            <Coffee size={21} aria-hidden="true" />
            <h3>{geo.labels.scenarios}</h3>
            <p>{geo.useCases.join(" · ")}</p>
          </article>
          <article className="proof-card">
            <ShieldCheck size={21} aria-hidden="true" />
            <h3>{geo.labels.published}</h3>
            <p>{geo.faqs[2].answer}</p>
          </article>
        </div>
      </details>

      {manual ? (
        <details className="section product-content-disclosure manual-knowledge">
          <summary>{productUi.verified}<ChevronRight size={18} aria-hidden="true" /></summary>
          <div className="manual-knowledge-intro">
            <div className="section-heading align-left">
              <span>{lang === "zh" ? "说明书核实内容" : "Verified from the supplied manual"}</span>
              <h2>{lang === "zh" ? "操作、清洁与故障排查" : "Operation, care and troubleshooting"}</h2>
              <p>{lang === "zh" ? "以下内容按当前型号的修订版说明书整理，不将其他型号的参数或配件混入本页。" : "This model-specific guidance is derived from the revised manual supplied by TK Classic. It does not transfer specifications or accessories from another model."}</p>
            </div>
            <div className="manual-source-note">
              <BookOpenCheck size={20} aria-hidden="true" />
              <span>{manual.sourceLabel}</span>
              <small>{lang === "zh" ? `核对日期：${manual.reviewedOn}` : `Verified ${manual.reviewedOn}`}</small>
            </div>
          </div>

          <div className="manual-format-panel">
            <div>
              <Coffee size={20} aria-hidden="true" />
              <h3>{lang === "zh" ? "说明书列明的咖啡规格" : "Coffee formats listed in the manual"}</h3>
            </div>
            <ul>{manual.supportedInputs.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>

          <ol className="manual-steps">
            {manual.operationSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>

          <div className="manual-care-grid">
            <article>
              <Droplets size={21} aria-hidden="true" />
              <h3>{lang === "zh" ? "清洁与存放" : "Cleaning and storage"}</h3>
              <ul>{manual.cleaning.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <Wrench size={21} aria-hidden="true" />
              <h3>{lang === "zh" ? "故障排查" : "Troubleshooting"}</h3>
              <dl>{manual.troubleshooting.map((item) => <div key={item.issue}><dt>{item.issue}</dt><dd>{item.action}</dd></div>)}</dl>
            </article>
          </div>

          <div className="manual-safety-note">
            <ShieldCheck size={20} aria-hidden="true" />
            <p>{manual.safety}</p>
          </div>
          <details className="manual-package-contents">
            <summary>{lang === "zh" ? "查看说明书列明的包装内容" : "View package contents listed in the manual"}</summary>
            <p>{manual.packageContents}</p>
            <small>{lang === "zh" ? "最终随单配置以正式报价和订单确认为准。" : "Final included components must be confirmed in the formal quotation and order record."}</small>
          </details>
        </details>
      ) : null}

      <RevealSection className="section gallery-section">
        <div className="section-heading">
          <span>{product.model}</span>
          <h2>{product.model}</h2>
        </div>
        <div className="gallery-grid">
          {product.gallery.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={geo.galleryAlt(index)}
              width={900}
              height={900}
              sizes="(max-width: 720px) 100vw, 50vw"
              loading="lazy"
            />
          ))}
        </div>
      </RevealSection>

      {dq010Video ? <ProductVideoShowcase video={dq010Video} /> : null}

      <ProductAccessorySelector lang={lang} model={product.model} />

      <RevealSection className="section faq-section" aria-labelledby="product-faq-title">
        <div className="section-heading align-left">
          <span>{geo.labels.faq}</span>
          <h2 id="product-faq-title">{geo.labels.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {pageFaqs.slice(0, 5).map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
      </RevealSection>

      <section id="product-inquiry" className="section contact-section">
        <div className="product-contact-promo">
          <div className="section-heading align-left">
            <span>{t.labels.support}</span>
            <h2>{productUi.inquiry}</h2>
          </div>
          <div className="contact-methods">
            <Link href={`${localizedPath("/contact", lang)}?product=${encodeURIComponent(product.model)}#inquiry-form`}>
              <Mail size={20} aria-hidden="true" />
              <span>{t.hero.primaryCta}</span>
            </Link>
            <a href={whatsappHref(product.model)} target="_blank" rel="noreferrer">
              <MessageCircle size={20} aria-hidden="true" />
              <span>WhatsApp — {product.model}</span>
            </a>
            {lang === "en" && (product.model === "DQ-001" || product.model === "DQ-010") ? <Link href="/wholesale/usa">US importer sourcing guide</Link> : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>{t.labels.related}</span>
          <h2>{t.labels.related}</h2>
        </div>
        <div className="product-grid compact-grid">
          {related.map((item) => (
            <article className="compact-product" key={item.model}>
              <Image
                src={item.gallery[1] ?? item.hero}
                alt={getProductGeo(item, lang).primaryAlt}
                width={360}
                height={360}
                sizes="(max-width: 720px) 88px, 104px"
              />
              <div>
                <p className="card-label">{localizeFeatureLabel(item.featureLabel, lang)}</p>
                <h3>{item.model}</h3>
              </div>
              <Link href={localizedPath(`/products/${item.slug}`, lang)} aria-label={`${item.model} details`}>
                <ChevronRight size={20} aria-hidden="true" />
              </Link>
            </article>
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
