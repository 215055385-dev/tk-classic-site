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
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { phoneHref, whatsappHref } from "@/lib/contact";

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

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];

  return {
    title: { absolute: t.title },
    description: t.description,
    keywords: [
      "portable coffee machine OEM",
      "portable espresso machine wholesale",
      "private label coffee machine",
      "OEM ODM coffee maker supplier",
      "coffee machine accessories",
    ],
    alternates: {
      canonical: localizedUrl("/", lang),
      languages: languageAlternates("/"),
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: localizedUrl("/", lang),
      type: "website",
      siteName: company.brand,
      locale: lang,
      images: [{
        url: "/optimized/hero-products/dq-001.webp",
        width: 1600,
        height: 750,
        alt: "TK Classic DQ-001 portable espresso machine range",
      }],
    },
  };
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
  const videoUi = {
    en: { load: "Scroll to load video", sound: "Sound is off until you choose to play it." },
    es: { load: "Desplázate para cargar el vídeo", sound: "El sonido permanece apagado hasta que reproduzcas el vídeo." },
    pt: { load: "Desloque para carregar o vídeo", sound: "O som fica desligado até iniciar o vídeo." },
    fr: { load: "Faites défiler pour charger la vidéo", sound: "Le son reste coupé jusqu’à la lecture." },
    ar: { load: "مرّر لتحميل الفيديو", sound: "يبقى الصوت متوقفاً حتى تختار التشغيل." },
    zh: { load: "滚动后加载视频", sound: "点击播放前默认静音。" },
    ru: { load: "Прокрутите, чтобы загрузить видео", sound: "Звук выключен до начала воспроизведения." },
  }[lang];
  const videoSectionCopy = {
    en: {
      eyebrow: "DQ-010 operation",
      title: "See DQ-010 in operation.",
      lead: "Two focused demonstrations show setup, adapter options and the brewing workflow.",
      cards: ["Adapter setup", "Brewing workflow"],
      summaries: [
        "See how the compatible adapters are installed before brewing.",
        "Follow the machine assembly and operating sequence from setup to extraction.",
      ],
    },
    es: {
      eyebrow: "Funcionamiento del DQ-010",
      title: "Vea el DQ-010 en funcionamiento.",
      lead: "Dos demostraciones muestran la preparación, los adaptadores y el proceso de extracción.",
      cards: ["Preparación de adaptadores", "Proceso de extracción"],
      summaries: [
        "Vea cómo se instalan los adaptadores compatibles antes de preparar el café.",
        "Siga el montaje y la secuencia de uso desde la preparación hasta la extracción.",
      ],
    },
    pt: {
      eyebrow: "Operação do DQ-010",
      title: "Veja o DQ-010 em funcionamento.",
      lead: "Duas demonstrações mostram a preparação, os adaptadores e o processo de extração.",
      cards: ["Preparação dos adaptadores", "Processo de extração"],
      summaries: [
        "Veja como instalar os adaptadores compatíveis antes do preparo.",
        "Acompanhe a montagem e a operação, da preparação à extração.",
      ],
    },
    fr: {
      eyebrow: "Utilisation du DQ-010",
      title: "Découvrez le DQ-010 en fonctionnement.",
      lead: "Deux démonstrations présentent la mise en place, les adaptateurs et le processus d’extraction.",
      cards: ["Mise en place des adaptateurs", "Processus d’extraction"],
      summaries: [
        "Découvrez comment installer les adaptateurs compatibles avant la préparation.",
        "Suivez l’assemblage et l’utilisation, de la mise en place à l’extraction.",
      ],
    },
    ar: {
      eyebrow: "تشغيل DQ-010",
      title: "شاهد DQ-010 أثناء التشغيل.",
      lead: "يعرض مقطعان توضيحيان الإعداد والمحوّلات وخطوات تحضير القهوة.",
      cards: ["إعداد المحوّلات", "خطوات تحضير القهوة"],
      summaries: [
        "تعرّف على طريقة تركيب المحوّلات المتوافقة قبل التحضير.",
        "تابع تجميع الجهاز وتسلسل التشغيل من الإعداد حتى الاستخلاص.",
      ],
    },
    zh: {
      eyebrow: "DQ-010 操作演示",
      title: "查看 DQ-010 的实际操作。",
      lead: "两段演示集中展示安装、适配器和咖啡萃取流程。",
      cards: ["适配器安装", "咖啡萃取流程"],
      summaries: [
        "查看冲煮前如何安装兼容的咖啡适配器。",
        "了解从机器组装、设置到咖啡萃取的完整操作顺序。",
      ],
    },
    ru: {
      eyebrow: "Работа DQ-010",
      title: "Посмотрите DQ-010 в работе.",
      lead: "Два демонстрационных видео показывают настройку, адаптеры и процесс приготовления кофе.",
      cards: ["Установка адаптеров", "Процесс приготовления"],
      summaries: [
        "Посмотрите, как установить совместимые адаптеры перед приготовлением.",
        "Проследите сборку и порядок работы от настройки до экстракции.",
      ],
    },
  }[lang];
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
      src: "/videos/product-02.mp4",
      poster: "/optimized/video-posters/dq-010-adapter.webp",
      label: "DQ-010 · 01",
      title: videoSectionCopy.cards[0],
      summary: videoSectionCopy.summaries[0],
    },
    {
      src: "/videos/product-01.mp4",
      poster: "/optimized/video-posters/dq-010-brewing.webp",
      label: "DQ-010 · 02",
      title: videoSectionCopy.cards[1],
      summary: videoSectionCopy.summaries[1],
    },
  ];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${company.siteUrl}#organization`,
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
        <HeroCopyMotion className="hero-copy hero-heading">
          <p className="eyebrow hero-eyebrow">
            <Sparkles size={17} aria-hidden="true" />
            {t.hero.eyebrow}
          </p>
          <HeroTitleMotion className="hero-title">{t.hero.title}</HeroTitleMotion>
        </HeroCopyMotion>
        <HeroCopyMotion className="hero-copy hero-body">
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

      <RevealSection className="section product-video-section" id="videos" aria-label="Product videos">
        <div className="section-heading">
          <span>{videoSectionCopy.eyebrow}</span>
          <h2>{videoSectionCopy.title}</h2>
          <p>{videoSectionCopy.lead}</p>
        </div>
        <ProductVideoShowcase videos={videoScenes} loadLabel={videoUi.load} soundNote={videoUi.sound} />
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
              <span>{ui.form.phone}: {company.phoneBowie}</span>
            </a>
            <a href={whatsappHref("DQ-001")} target="_blank" rel="noreferrer">
              <MessageCircle size={20} aria-hidden="true" />
              <span>{t.form.whatsapp} — DQ-001</span>
            </a>
            <Link href="#inquiry-form">
              <Mail size={20} aria-hidden="true" />
              <span>{t.form.emailUs}</span>
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
