import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  Box,
  Building2,
  Calculator,
  ChevronRight,
  Factory,
  FileDown,
  FileText,
  Mail,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
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
import {
  company,
  copy,
  certifications,
  languages,
  products,
  type Lang,
} from "@/lib/site-data";
import { SiteFooter } from "@/components/SiteFooter";
import { homeUxCopy, localizeFeatureLabel, uiCopy } from "@/lib/localized-ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProductPriceTag } from "@/components/ProductPriceTag";
import { bundleCopy } from "@/lib/bundle-data";
import { CoffeeRitualStage } from "@/components/CoffeeRitualStage";
import { ProductVideoShowcase, type ProductVideo } from "@/components/ProductVideoShowcase";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { languageAlternates } from "@/lib/seo";
import { phoneHref, whatsappHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Portable Coffee Machine OEM & Private Label Supplier",
  description:
    "Factory-direct portable espresso machines, accessories and OEM/ODM programs for European wholesalers, cross-border brands and gift buyers.",
  keywords: ["portable coffee machine OEM", "portable espresso machine wholesale", "private label coffee machine", "OEM ODM coffee maker supplier", "coffee machine accessories"],
  alternates: {
    canonical: "/",
    languages: languageAlternates("/"),
  },
};

// The homepage only assembles static catalog content. Serving it from the
// Edge runtime keeps cold starts short for buyers visiting from Europe and
// other regions, while the inquiry/admin API routes remain on Node.js.
export const runtime = "edge";

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const ui = uiCopy[lang];
  const homeUx = homeUxCopy[lang];
  const bundles = bundleCopy[lang];
  const dir = languages.find((item) => item.code === lang)?.dir ?? "ltr";
  const productLine = products.filter((item) =>
    ["DQ-001", "DQ-002", "DQ-005", "DQ-008", "DQ-010", "DQ-011"].includes(item.model),
  );
  const featuredProduct = productLine.find((item) => item.model === "DQ-010") ?? productLine[0];
  const sceneCards = ui.scenes.cards.slice(0, 3);
  const heroScenes = productLine.map((product) => ({
    model: product.model,
    title: product.summary[lang],
    summary: `${localizeFeatureLabel(product.featureLabel, lang)} / ${product.spec.pressure} / ${product.spec.cup}`,
    label: localizeFeatureLabel(product.featureLabel, lang),
    src: `/optimized/hero-products/${product.model.toLowerCase()}.webp`,
    href: `/products/${product.slug}${langQuery(lang)}`,
    fit: "contain" as const,
    stats: [
      { label: t.labels.pressure, value: product.spec.pressure },
      { label: t.labels.battery, value: product.spec.battery },
      { label: t.labels.cup, value: product.spec.cup },
    ],
    alt: `${product.model} portable coffee machine`,
  }));
  const videoScenes: ProductVideo[] = [
    {
      src: "/videos/outdoor-scene.mp4",
      poster: "/optimized/hero-products/dq-001.webp",
      label: sceneCards[0]?.[2] ?? "Outdoor scene",
      title: sceneCards[0]?.[0] ?? "Coffee wherever you go",
      summary: sceneCards[0]?.[1] ?? "Show the product in a real outdoor setting.",
    },
    {
      src: "/videos/product-01.mp4",
      poster: "/optimized/hero-products/dq-002.webp",
      label: sceneCards[1]?.[2] ?? "Product detail",
      title: sceneCards[1]?.[0] ?? "Portable by design",
      summary: sceneCards[1]?.[1] ?? "A closer look at the portable coffee system.",
    },
    {
      src: "/videos/product-02.mp4",
      poster: "/optimized/hero-products/dq-005.webp",
      label: sceneCards[2]?.[2] ?? "Brew routine",
      title: sceneCards[2]?.[0] ?? "Built for daily rituals",
      summary: sceneCards[2]?.[1] ?? "A visual product moment for buyer presentations.",
    },
    {
      src: "/videos/product-03.mp4",
      poster: "/optimized/hero-products/dq-008.webp",
      label: "Product film",
      title: productLine[0]?.summary[lang] ?? "Portable espresso system",
      summary: productLine[0]?.featureLabel ?? "Factory-direct portable coffee solutions.",
    },
    {
      src: "/videos/je009.mp4",
      poster: "/optimized/hero-products/dq-010.webp",
      label: "JE009",
      title: "Product demonstration",
      summary: "A dedicated product film for wholesale and private label conversations.",
    },
    {
      src: "/videos/exploded-operation.mp4",
      poster: "/optimized/hero-products/dq-011.webp",
      label: "Assembly view",
      title: "See how the system works",
      summary: "A closer operational view for sourcing and product evaluation.",
    },
  ];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.legalName,
      alternateName: company.brand,
      url: company.siteUrl,
      email: company.emailBowie,
      telephone: company.phoneBowie,
      knowsAbout: [
        "Portable espresso machines",
        "Portable coffee machine OEM and ODM",
        "Private label coffee equipment",
        "Coffee machine accessories and retail bundles",
      ],
      areaServed: ["European wholesalers", "Cross-border ecommerce brands", "Gift procurement buyers"],
      address: {
        "@type": "PostalAddress",
        streetAddress: company.address,
        addressLocality: "Shenzhen",
        addressRegion: "Guangdong",
        addressCountry: "CN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: company.phoneBowie,
          contactType: "sales",
          availableLanguage: languages.map((language) => language.native),
        },
        {
          "@type": "ContactPoint",
          telephone: company.phoneBowie,
          email: company.emailBowie,
          contactType: "sales",
          availableLanguage: languages.map((language) => language.native),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "TK Classic portable coffee machine range",
      itemListElement: productLine.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${product.model} portable coffee machine`,
        url: `${company.siteUrl}/products/${product.slug}`,
      })),
    },
  ];

  return (
    <main className="home-shell" dir={dir} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="home-decorations" aria-hidden="true">
        <span className="home-glow home-glow-primary" />
        <span className="home-glow home-glow-secondary" />
        <span className="home-grid-wash" />
        <span className="home-orbit-ring" />
        <span className="home-signal-line signal-line-one" />
        <span className="home-signal-line signal-line-two" />
      </div>
      <header className="site-header">
        <Link className="brand" href={`/${langQuery(lang)}`} aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span>
            <strong>TK Classic</strong>
            <small>Portable coffee OEM</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href={`/products${langQuery(lang)}`}>{t.nav.products}</Link>
          <Link href={`/bundles${langQuery(lang)}`}>{bundles.navLabel}</Link>
          <Link href={`/accessories${langQuery(lang)}`}>{t.sectionTitles.accessories}</Link>
          <Link href={`/oem-odm${langQuery(lang)}`}>{t.nav.oem}</Link>
          <Link href={`/factory${langQuery(lang)}`}>{t.nav.factory}</Link>
          <Link href={`/contact${langQuery(lang)}`}>{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher
          currentLang={lang}
          hrefForLang={(language) => (language === "en" ? "/" : `/?lang=${language}`)}
        />
      </header>

      <nav className="section-float-nav" aria-label="Quick section navigation">
        <Link href={`/products${langQuery(lang)}`}>{t.nav.products}</Link>
        <Link href={`/bundles${langQuery(lang)}`}>{bundles.navLabel}</Link>
        <Link href={`/accessories${langQuery(lang)}`}>{t.sectionTitles.accessories}</Link>
        <Link href={`/oem-odm${langQuery(lang)}`}>{t.nav.oem}</Link>
        <Link href={`/factory${langQuery(lang)}`}>{t.nav.factory}</Link>
        <Link href={`/contact${langQuery(lang)}`}>{t.nav.contact}</Link>
      </nav>

      <section id="home" className="hero-section dark-hero">
        <HeroCopyMotion className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <Sparkles size={17} aria-hidden="true" />
            {t.hero.eyebrow}
          </p>
          <HeroTitleMotion className="hero-title">{t.hero.title}</HeroTitleMotion>
          <HeroTextMotion className="hero-lead">{t.hero.lead}</HeroTextMotion>
          <HeroTextMotion className="hero-support">{t.hero.support}</HeroTextMotion>
          <HeroActionsMotion className="hero-actions">
            <MotionCta className="primary-action" href="#contact">
              <Mail size={18} aria-hidden="true" />
              {t.hero.primaryCta}
            </MotionCta>
            <MotionCta
              className="secondary-action"
              href={whatsappHref()}
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
          <div className="hero-stat-row" aria-label="TK Classic proof points">
            <div>
              <strong>15+</strong>
              <span>{ui.proof.years}</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>{ui.proof.markets}</span>
            </div>
            <div>
              <strong>25 bar</strong>
              <span>{ui.proof.extraction}</span>
            </div>
          </div>
        </HeroCopyMotion>

        <HeroVisualMotion className="hero-visual" aria-label="TK Classic portable espresso product image">
          <CoffeeRitualStage scenes={heroScenes} ctaLabel={t.labels.fullSpec} />
        </HeroVisualMotion>
        <a className="hero-scroll-cue" href="#features">
          <span>{homeUx.scrollCue}</span>
          <ChevronRight size={16} aria-hidden="true" />
        </a>
      </section>

      <section id="features" className="section feature-section" aria-label={ui.market.eyebrow}>
        <div className="section-heading">
          <span>{ui.market.eyebrow}</span>
          <h2>{ui.market.title}</h2>
          <p>{ui.market.lead}</p>
        </div>
        <div className="feature-grid">
          {t.signals.slice(0, 4).map((signal, index) => {
            const icons = [Factory, Box, ShieldCheck, PackageCheck];
            const Icon = icons[index] ?? BadgeCheck;
            const card = ui.market.cards[index] ?? [signal, t.intro];
            return (
              <RevealArticle className="feature-card" key={signal}>
                <span className="feature-icon"><Icon size={21} aria-hidden="true" /></span>
                <span className="feature-index">0{index + 1}</span>
                <h3>{card[0]}</h3>
                <p>{card[1]}</p>
              </RevealArticle>
            );
          })}
        </div>
      </section>

      <RevealSection className="section product-showcase-section" id="showcase" aria-label={t.sectionTitles.products}>
        <div className="section-heading">
          <span>{t.sectionTitles.products}</span>
          <h2>{featuredProduct.model} / {homeUx.showcaseHeading}</h2>
          <p>{featuredProduct.summary[lang]}</p>
        </div>
        <div className="showcase-panel">
          <div className="showcase-image-shell">
            <Image
              src="/optimized/products/dq-010-stand.webp"
              alt="DQ-010 portable espresso machine with cup stand"
              width={2048}
              height={2048}
              sizes="(max-width: 720px) 100vw, 55vw"
              quality={80}
            />
            <span className="showcase-orbit">DQ-010 / 01</span>
          </div>
          <div className="showcase-details">
            <p className="card-label">{localizeFeatureLabel(featuredProduct.featureLabel, lang)}</p>
            <h3>{featuredProduct.summary[lang]}</h3>
            <ProductPriceTag lang={lang} price={featuredProduct.price} />
            <div className="spec-grid">
              <div><span>{t.labels.pressure}</span><strong>{featuredProduct.spec.pressure}</strong></div>
              <div><span>{t.labels.battery}</span><strong>{featuredProduct.spec.battery}</strong></div>
              <div><span>{t.labels.material}</span><strong>{featuredProduct.spec.material}</strong></div>
              <div><span>{t.labels.cup}</span><strong>{featuredProduct.spec.cup}</strong></div>
            </div>
            <Link className="primary-action" href={`/products/${featuredProduct.slug}${langQuery(lang)}`}>
              {t.labels.fullSpec}
              <ChevronRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </RevealSection>

      <section className="section lifestyle-section" aria-label={ui.scenes.eyebrow}>
        <div className="section-heading">
          <span>{ui.scenes.eyebrow}</span>
          <h2>{ui.scenes.title}</h2>
          <p>{ui.scenes.lead}</p>
        </div>
        <div className="lifestyle-grid">
          {sceneCards.map(([title, summary, label], index) => (
            <RevealArticle className={`lifestyle-card lifestyle-card-${index + 1}`} key={title} aria-label={title}>
              <div className="lifestyle-card-content">
                <span>0{index + 1}</span>
                <strong>{title}</strong>
                <p>{summary}</p>
                <small>{label}</small>
              </div>
            </RevealArticle>
          ))}
        </div>
      </section>

      <RevealSection className="section product-video-section" id="videos" aria-label="Product videos">
        <div className="section-heading">
          <span>{t.nav.products}</span>
          <h2>{ui.scenes.title}</h2>
          <p>{ui.scenes.lead}</p>
        </div>
        <ProductVideoShowcase videos={videoScenes} />
      </RevealSection>

      <section className="proof-band" aria-label="TK Classic proof points">
        <div><strong>15+</strong><span>{ui.proof.years}</span></div>
        <div><strong>50+</strong><span>{ui.proof.markets}</span></div>
        <div><strong>25 bar</strong><span>{ui.proof.extraction}</span></div>
        <div><strong>CE / RoHS</strong><span>{ui.proof.compliance}</span></div>
      </section>

      <RevealSection className="section certification-trust-section" id="certifications" aria-label={t.sectionTitles.certs}>
        <div className="section-heading">
          <span>{t.nav.certs}</span>
          <h2>{t.sectionTitles.certs}</h2>
          <p>{t.certs[0]}</p>
        </div>
        <div className="certification-trust-grid">
          {certifications.map((certification) => (
            <div className="certification-trust-item" key={certification.name}>
              <span className="certification-trust-mark"><ShieldCheck size={18} aria-hidden="true" /></span>
              <strong>{certification.name}</strong>
              <small>{ui.proof.compliance}</small>
            </div>
          ))}
        </div>
      </RevealSection>

      <section id="bundles" className="section bundle-section" aria-label={bundles.eyebrow}>
        <div className="section-heading">
          <span>{bundles.eyebrow}</span>
          <h2>{bundles.title}</h2>
          <p>{bundles.lead}</p>
        </div>
        <div className="bundle-grid">
          {bundles.cards.map((bundle, index) => (
            <RevealArticle className="bundle-card" key={bundle.title}>
              <span className="bundle-index">0{index + 1}</span>
              <h3>{bundle.title}</h3>
              <p>{bundle.summary}</p>
              <div className="bundle-meta">
                <strong>{bundle.includesLabel}</strong>
                <span>{bundle.includes}</span>
              </div>
              <div className="bundle-meta">
                <strong>{bundle.fitLabel}</strong>
                <span>{bundle.fit}</span>
              </div>
              <a className="quote-link" href="#contact">
                {bundles.cta}
                <Mail size={15} aria-hidden="true" />
              </a>
            </RevealArticle>
          ))}
        </div>
      </section>

      <section id="tools" className="section tools-hub-section" aria-label="Buyer tools">
        <div className="section-heading">
          <span>{homeUx.toolsEyebrow}</span>
          <h2>{homeUx.toolsTitle}</h2>
          <p>{t.hero.support}</p>
        </div>
        <div className="tools-hub-grid">
          <Link className="tool-hub-card" href={`/tools/product-selector${langQuery(lang)}`}>
            <span className="tool-hub-icon"><SlidersHorizontal size={21} aria-hidden="true" /></span>
            <small>01</small>
            <h3>{homeUx.tools[0].title}</h3>
            <p>{homeUx.tools[0].description}</p>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
          <Link className="tool-hub-card" href={`/tools/bundle-configurator${langQuery(lang)}`}>
            <span className="tool-hub-icon"><PackageCheck size={21} aria-hidden="true" /></span>
            <small>02</small>
            <h3>{homeUx.tools[1].title}</h3>
            <p>{homeUx.tools[1].description}</p>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
          <Link className="tool-hub-card" href={`/tools/savings-calculator${langQuery(lang)}`}>
            <span className="tool-hub-icon"><Calculator size={21} aria-hidden="true" /></span>
            <small>03</small>
            <h3>{homeUx.tools[2].title}</h3>
            <p>{homeUx.tools[2].description}</p>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
          <Link className="tool-hub-card" href={`/tools/inquiry-builder${langQuery(lang)}`}>
            <span className="tool-hub-icon"><FileText size={21} aria-hidden="true" /></span>
            <small>04</small>
            <h3>{homeUx.tools[3].title}</h3>
            <p>{homeUx.tools[3].description}</p>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="products" className="section">
        <div className="section-heading">
          <span>{t.nav.products}</span>
          <h2>{t.sectionTitles.products}</h2>
          <p>{t.intro}</p>
        </div>
        <div className="product-grid featured-grid product-pricing-grid">
          {productLine.map((product) => (
            <RevealArticle className="product-card is-featured" key={product.model}>
              <Link href={`/products/${product.slug}${langQuery(lang)}`} className="product-image-link">
                <Image
                  src={product.hero}
                  alt={`${product.model} portable coffee machine`}
                  width={900}
                  height={900}
                  sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw"
                />
              </Link>
              <div className="product-card-body">
                <p className="card-label">{localizeFeatureLabel(product.featureLabel, lang)}</p>
                <h3>{product.model}</h3>
                <ProductPriceTag lang={lang} price={product.price} />
                <p>{product.summary[lang]}</p>
                <dl>
                  <div>
                    <dt>{t.labels.pressure}</dt>
                    <dd>{product.spec.pressure}</dd>
                  </div>
                  <div>
                    <dt>{t.labels.battery}</dt>
                    <dd>{product.spec.battery}</dd>
                  </div>
                  <div>
                    <dt>{t.labels.material}</dt>
                    <dd>{product.spec.material}</dd>
                  </div>
                </dl>
                <Link className="card-link" href={`/products/${product.slug}${langQuery(lang)}`}>
                  {t.labels.fullSpec}
                  <ChevronRight size={17} aria-hidden="true" />
                </Link>
                <a className="quote-link" href="#contact">
                  {t.hero.primaryCta}
                  <Mail size={15} aria-hidden="true" />
                </a>
              </div>
            </RevealArticle>
          ))}
        </div>

      </section>

      <section className="section home-hub-section">
        <div className="section-heading">
          <span>{t.nav.about}</span>
          <h2>{t.intro}</h2>
          <p>{t.contactLead}</p>
        </div>
        <div className="home-hub-grid">
          <Link className="home-hub-card" href={`/oem-odm${langQuery(lang)}`}>
            <span>{t.nav.oem}</span>
            <h3>{t.sectionTitles.oem}</h3>
            <p>{t.oem[0]}</p>
            <ChevronRight size={19} aria-hidden="true" />
          </Link>
          <Link className="home-hub-card" href={`/factory${langQuery(lang)}`}>
            <span>{t.nav.factory}</span>
            <h3>{t.sectionTitles.factory}</h3>
            <p>{t.factory[0]}</p>
            <ChevronRight size={19} aria-hidden="true" />
          </Link>
          <Link className="home-hub-card" href={`/resources${langQuery(lang)}#faq`}>
            <span>{t.nav.faq}</span>
            <h3>{t.sectionTitles.faq}</h3>
            <p>{t.faq[0].a}</p>
            <ChevronRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div>
          <div className="section-heading align-left">
            <span>{t.nav.contact}</span>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactLead}</p>
          </div>
          <div className="contact-methods">
            <a href={phoneHref(company.phoneBowie)}>
              <MessageCircle size={20} aria-hidden="true" />
              <span>Phone: {company.phoneBowie}</span>
            </a>
            <a href={whatsappHref("DQ-001")} target="_blank" rel="noreferrer">
              <MessageCircle size={20} aria-hidden="true" />
              <span>WhatsApp — DQ-001</span>
            </a>
            <Link href="#inquiry-form">
              <Mail size={20} aria-hidden="true" />
              <span>Send a secure inquiry</span>
            </Link>
          </div>
          <address>
            <Building2 size={19} aria-hidden="true" />
            {company.legalName}
            <br />
            {company.address}
          </address>
        </div>
        <InquiryForm lang={lang} selectedProduct="DQ-001" />
      </section>

      <MobileStickyCta
        primaryLabel={t.hero.primaryCta}
        whatsappHref={whatsappHref("DQ-001")}
      />

      <SiteFooter lang={lang} />
    </main>
  );
}
