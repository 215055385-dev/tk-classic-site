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
    en: {
      load: "Video loads when this section enters view",
      sound: "Muted by default.",
      play: "Play video",
      pause: "Pause video",
      mute: "Mute sound",
      unmute: "Enable sound",
    },
    es: {
      load: "El vídeo se carga al entrar en esta sección",
      sound: "Silenciado de forma predeterminada.",
      play: "Reproducir vídeo",
      pause: "Pausar vídeo",
      mute: "Silenciar",
      unmute: "Activar sonido",
    },
    pt: {
      load: "O vídeo carrega quando esta seção entra em vista",
      sound: "Sem som por padrão.",
      play: "Reproduzir vídeo",
      pause: "Pausar vídeo",
      mute: "Silenciar",
      unmute: "Ativar som",
    },
    fr: {
      load: "La vidéo se charge lorsque cette section apparaît",
      sound: "Son coupé par défaut.",
      play: "Lire la vidéo",
      pause: "Mettre en pause",
      mute: "Couper le son",
      unmute: "Activer le son",
    },
    ar: {
      load: "يتم تحميل الفيديو عند ظهور هذا القسم",
      sound: "الفيديو مكتوم افتراضياً.",
      play: "تشغيل الفيديو",
      pause: "إيقاف الفيديو مؤقتاً",
      mute: "كتم الصوت",
      unmute: "تشغيل الصوت",
    },
    zh: {
      load: "进入此区域后加载视频",
      sound: "默认静音播放。",
      play: "播放视频",
      pause: "暂停视频",
      mute: "静音",
      unmute: "开启声音",
    },
    ru: {
      load: "Видео загрузится, когда раздел появится на экране",
      sound: "Звук по умолчанию выключен.",
      play: "Воспроизвести видео",
      pause: "Приостановить видео",
      mute: "Выключить звук",
      unmute: "Включить звук",
    },
  }[lang];
  const videoStoryCopy = {
    en: {
      extraction: {
        eyebrow: "Extraction / DQ-010",
        title: "Portable Espresso, Explained",
        lead: "See how pressure, heat and precision come together in every extraction.",
        posterAlt: "DQ-010 portable espresso machine extraction video cover",
        steps: [
          ["Prepare", "Add water and fit the prepared coffee container as shown in the video."],
          ["Heat", "The machine heats the water before extraction begins."],
          ["Extract", "Pressure moves hot water through the coffee and espresso flows into the cup."],
        ],
      },
      operation: {
        eyebrow: "Real operation / DQ-010",
        title: "Espresso Anywhere, Made Simple",
        lead: "A clear, real-product walkthrough from preparation to the finished cup.",
        posterAlt: "DQ-010 portable espresso machine real operation video cover",
        steps: [
          ["Load coffee", "Add ground coffee to the compatible container shown in the video."],
          ["Add water", "Fill the water chamber following the demonstrated order."],
          ["Assemble and start", "Fit the parts together and start the machine as shown."],
          ["Collect espresso", "Let the finished espresso flow directly into the cup."],
        ],
        viewProducts: "View DQ-010",
        getQuote: "Get a quote",
      },
    },
    es: {
      extraction: {
        eyebrow: "Extracción / DQ-010",
        title: "Espresso portátil, explicado",
        lead: "Descubra cómo la presión, el calor y la precisión trabajan juntos en cada extracción.",
        posterAlt: "Portada del vídeo de extracción de la cafetera portátil DQ-010",
        steps: [
          ["Preparar", "Añada agua y coloque el recipiente de café preparado como aparece en el vídeo."],
          ["Calentar", "La máquina calienta el agua antes de iniciar la extracción."],
          ["Extraer", "La presión hace pasar el agua caliente por el café y el espresso cae en la taza."],
        ],
      },
      operation: {
        eyebrow: "Uso real / DQ-010",
        title: "Espresso en cualquier lugar, de forma sencilla",
        lead: "Una demostración clara con el producto real, desde la preparación hasta la taza.",
        posterAlt: "Portada del vídeo de uso real de la cafetera portátil DQ-010",
        steps: [
          ["Colocar el café", "Añada café molido al recipiente compatible que aparece en el vídeo."],
          ["Añadir agua", "Llene el depósito siguiendo el orden mostrado."],
          ["Montar y encender", "Una las piezas y encienda la máquina como se muestra."],
          ["Recoger el espresso", "Deje que el espresso terminado caiga directamente en la taza."],
        ],
        viewProducts: "Ver DQ-010",
        getQuote: "Solicitar cotización",
      },
    },
    pt: {
      extraction: {
        eyebrow: "Extração / DQ-010",
        title: "Espresso portátil, explicado",
        lead: "Veja como pressão, calor e precisão trabalham juntos em cada extração.",
        posterAlt: "Capa do vídeo de extração da máquina de espresso portátil DQ-010",
        steps: [
          ["Preparar", "Adicione água e encaixe o recipiente de café preparado como mostrado no vídeo."],
          ["Aquecer", "A máquina aquece a água antes de iniciar a extração."],
          ["Extrair", "A pressão conduz a água quente pelo café e o espresso flui para a xícara."],
        ],
      },
      operation: {
        eyebrow: "Uso real / DQ-010",
        title: "Espresso em qualquer lugar, sem complicação",
        lead: "Uma demonstração clara com o produto real, do preparo à xícara pronta.",
        posterAlt: "Capa do vídeo de operação real da máquina de espresso portátil DQ-010",
        steps: [
          ["Adicionar café", "Coloque café moído no recipiente compatível mostrado no vídeo."],
          ["Adicionar água", "Encha o reservatório seguindo a ordem demonstrada."],
          ["Montar e iniciar", "Encaixe as peças e ligue a máquina como mostrado."],
          ["Coletar o espresso", "Deixe o espresso pronto fluir diretamente para a xícara."],
        ],
        viewProducts: "Ver DQ-010",
        getQuote: "Solicitar orçamento",
      },
    },
    fr: {
      extraction: {
        eyebrow: "Extraction / DQ-010",
        title: "L’espresso portable, expliqué",
        lead: "Découvrez comment la pression, la chaleur et la précision agissent ensemble à chaque extraction.",
        posterAlt: "Affiche de la vidéo d’extraction de la machine à espresso portable DQ-010",
        steps: [
          ["Préparer", "Ajoutez l’eau et installez le réceptacle de café préparé comme dans la vidéo."],
          ["Chauffer", "La machine chauffe l’eau avant le début de l’extraction."],
          ["Extraire", "La pression fait passer l’eau chaude dans le café et l’espresso coule dans la tasse."],
        ],
      },
      operation: {
        eyebrow: "Utilisation réelle / DQ-010",
        title: "Un espresso partout, en toute simplicité",
        lead: "Une démonstration claire avec le produit réel, de la préparation à la tasse.",
        posterAlt: "Affiche de la vidéo d’utilisation réelle de la machine à espresso portable DQ-010",
        steps: [
          ["Ajouter le café", "Placez le café moulu dans le réceptacle compatible montré dans la vidéo."],
          ["Ajouter l’eau", "Remplissez le réservoir dans l’ordre présenté."],
          ["Assembler et démarrer", "Assemblez les pièces et démarrez la machine comme indiqué."],
          ["Recueillir l’espresso", "Laissez l’espresso terminé couler directement dans la tasse."],
        ],
        viewProducts: "Voir le DQ-010",
        getQuote: "Demander un devis",
      },
    },
    ar: {
      extraction: {
        eyebrow: "الاستخلاص / DQ-010",
        title: "شرح الإسبريسو المحمول",
        lead: "شاهد كيف تعمل الحرارة والضغط والدقة معاً في كل عملية استخلاص.",
        posterAlt: "غلاف فيديو استخلاص الإسبريسو باستخدام جهاز DQ-010 المحمول",
        steps: [
          ["التحضير", "أضف الماء وثبّت حاوية القهوة كما يظهر في الفيديو."],
          ["التسخين", "يسخّن الجهاز الماء قبل بدء الاستخلاص."],
          ["الاستخلاص", "يدفع الضغط الماء الساخن عبر القهوة ليتدفق الإسبريسو إلى الكوب."],
        ],
      },
      operation: {
        eyebrow: "تشغيل حقيقي / DQ-010",
        title: "إسبريسو في أي مكان، بخطوات بسيطة",
        lead: "عرض واضح للمنتج الحقيقي من التجهيز حتى فنجان الإسبريسو.",
        posterAlt: "غلاف فيديو التشغيل الحقيقي لجهاز الإسبريسو المحمول DQ-010",
        steps: [
          ["إضافة القهوة", "ضع القهوة المطحونة في الحاوية المتوافقة الظاهرة في الفيديو."],
          ["إضافة الماء", "املأ خزان الماء بالترتيب الموضح."],
          ["التجميع والتشغيل", "ثبّت الأجزاء وشغّل الجهاز كما يظهر في الفيديو."],
          ["استقبال الإسبريسو", "اترك الإسبريسو الجاهز يتدفق مباشرة إلى الكوب."],
        ],
        viewProducts: "عرض DQ-010",
        getQuote: "طلب عرض سعر",
      },
    },
    zh: {
      extraction: {
        eyebrow: "萃取过程 / DQ-010",
        title: "便携式意式浓缩，原理清晰呈现",
        lead: "了解加热、压力与精准控制如何共同完成每一次咖啡萃取。",
        posterAlt: "DQ-010 便携式意式咖啡机萃取演示视频封面",
        steps: [
          ["准备", "按照视频所示加入水，并安装准备好的咖啡容器。"],
          ["加热", "机器在开始萃取前对水进行加热。"],
          ["萃取", "压力推动热水穿过咖啡，意式浓缩咖啡流入杯中。"],
        ],
      },
      operation: {
        eyebrow: "真实操作 / DQ-010",
        title: "随时随地，简单完成一杯意式浓缩",
        lead: "使用真实产品，从准备到获得咖啡的清晰操作演示。",
        posterAlt: "DQ-010 便携式意式咖啡机真实操作视频封面",
        steps: [
          ["装入咖啡粉", "将咖啡粉装入视频所示的兼容咖啡容器。"],
          ["加入清水", "按照视频展示的顺序向水箱中加水。"],
          ["组装并启动", "按照演示完成部件安装并启动机器。"],
          ["获得咖啡", "让萃取完成的意式浓缩咖啡直接流入杯中。"],
        ],
        viewProducts: "查看 DQ-010",
        getQuote: "获取报价",
      },
    },
    ru: {
      extraction: {
        eyebrow: "Экстракция / DQ-010",
        title: "Как работает портативный эспрессо",
        lead: "Посмотрите, как нагрев, давление и точность объединяются в процессе экстракции.",
        posterAlt: "Обложка видео об экстракции в портативной кофемашине DQ-010",
        steps: [
          ["Подготовка", "Добавьте воду и установите подготовленный контейнер с кофе, как показано в видео."],
          ["Нагрев", "Перед началом экстракции машина нагревает воду."],
          ["Экстракция", "Давление проводит горячую воду через кофе, и эспрессо поступает в чашку."],
        ],
      },
      operation: {
        eyebrow: "Реальная работа / DQ-010",
        title: "Эспрессо в любом месте — это просто",
        lead: "Понятная демонстрация реального продукта: от подготовки до готовой чашки.",
        posterAlt: "Обложка видео реальной работы портативной кофемашины DQ-010",
        steps: [
          ["Добавьте кофе", "Поместите молотый кофе в совместимый контейнер, показанный в видео."],
          ["Добавьте воду", "Наполните резервуар в показанном порядке."],
          ["Соберите и запустите", "Соедините детали и запустите машину, как показано."],
          ["Получите эспрессо", "Дайте готовому эспрессо стечь прямо в чашку."],
        ],
        viewProducts: "Посмотреть DQ-010",
        getQuote: "Запросить цену",
      },
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
  const extractionVideo: ProductVideo = {
    src: "/videos/dq-010-extraction-animation.mp4",
    webmSrc: "/videos/dq-010-extraction-animation.webm",
    poster: "/optimized/video-posters/dq-010-extraction-animation.webp",
    posterAlt: videoStoryCopy.extraction.posterAlt,
    label: videoStoryCopy.extraction.eyebrow,
    title: videoStoryCopy.extraction.title,
    summary: videoStoryCopy.extraction.lead,
    steps: videoStoryCopy.extraction.steps.map(([title, description]) => ({ title, description })),
    layout: "media-left",
  };
  const operationVideo: ProductVideo = {
    src: "/videos/dq-010-real-operation.mp4",
    webmSrc: "/videos/dq-010-real-operation.webm",
    poster: "/optimized/video-posters/dq-010-real-operation.webp",
    posterAlt: videoStoryCopy.operation.posterAlt,
    label: videoStoryCopy.operation.eyebrow,
    title: videoStoryCopy.operation.title,
    summary: videoStoryCopy.operation.lead,
    steps: videoStoryCopy.operation.steps.map(([title, description]) => ({ title, description })),
    primaryCta: {
      href: `/products/dq-010${langQuery(lang)}`,
      label: videoStoryCopy.operation.viewProducts,
    },
    secondaryCta: {
      href: "#contact",
      label: videoStoryCopy.operation.getQuote,
    },
    layout: "media-right",
  };
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
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: extractionVideo.title,
      description: extractionVideo.summary,
      thumbnailUrl: `${company.siteUrl}${extractionVideo.poster}`,
      contentUrl: `${company.siteUrl}${extractionVideo.src}`,
      duration: "PT59S",
      inLanguage: lang,
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: operationVideo.title,
      description: operationVideo.summary,
      thumbnailUrl: `${company.siteUrl}${operationVideo.poster}`,
      contentUrl: `${company.siteUrl}${operationVideo.src}`,
      duration: "PT45S",
      inLanguage: lang,
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

      <RevealSection
        className="section product-video-section extraction-video-section"
        id="extraction-video"
        aria-label={videoStoryCopy.extraction.title}
      >
        <ProductVideoShowcase
          video={extractionVideo}
          loadLabel={videoUi.load}
          playLabel={videoUi.play}
          pauseLabel={videoUi.pause}
          muteLabel={videoUi.mute}
          unmuteLabel={videoUi.unmute}
          soundNote={videoUi.sound}
        />
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

      <RevealSection
        className="section product-video-section operation-video-section"
        id="operation-video"
        aria-label={videoStoryCopy.operation.title}
      >
        <ProductVideoShowcase
          video={operationVideo}
          loadLabel={videoUi.load}
          playLabel={videoUi.play}
          pauseLabel={videoUi.pause}
          muteLabel={videoUi.mute}
          unmuteLabel={videoUi.unmute}
          soundNote={videoUi.sound}
        />
      </RevealSection>

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
