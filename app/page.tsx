import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { brandTagline } from "@/lib/translation-copy";
import {
  Award,
  BadgeCheck,
  ChevronRight,
  Coffee,
  Droplets,
  FileCheck2,
  Leaf,
  Mail,
  MessageCircle,
  PlayCircle,
  Radio,
  ShieldCheck,
  UtensilsCrossed,
  Wrench,
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
import {
  company,
  copy,
  certifications,
  languages,
  products,
  type Lang,
} from "@/lib/site-data";
import { SiteFooter } from "@/components/SiteFooter";
import { localizeFeatureLabel, uiCopy } from "@/lib/localized-ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProductVideoShowcase, type ProductVideo } from "@/components/ProductVideoShowcase";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { whatsappHref } from "@/lib/contact";
import {
  certificationCtaCopy,
  certificationPreviewCopy,
  certificationRequestCopy,
} from "@/lib/certification-copy";
import { getPublishedHomepageSections } from "@/lib/cms-content";
import { getProductGeo } from "@/lib/product-geo";
import { CoffeeAtmosphere } from "@/components/CoffeeAtmosphere";
import { PrimaryNav } from "@/components/PrimaryNav";
import { FeaturedBuyerGuides } from "@/components/FeaturedBuyerGuides";

// The homepage only assembles static catalog content. Serving it from the
// Edge runtime keeps cold starts short for buyers visiting from Europe and
// other regions, while the inquiry/admin API routes remain on Node.js.
export const runtime = "nodejs";

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

const certificationIcons = [
  Leaf,
  Radio,
  ShieldCheck,
  UtensilsCrossed,
  BadgeCheck,
  Award,
  FileCheck2,
] as const;

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
  const [params, managedSections] = await Promise.all([searchParams, getPublishedHomepageSections()]);
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const ui = uiCopy[lang];
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
  const launchPath = {
    en: {
      eyebrow: "The private-label launch system",
      title: "From verified model to market-ready brand.",
      steps: [
        ["Select", "Choose a real model and confirmed specification."],
        ["Configure", "Add compatible accessories and a retail bundle."],
        ["Brand", "Align logo, colour and packaging requirements."],
        ["Launch", "Confirm samples, documents and production details."],
      ],
      allModels: "Explore all six models",
    },
    es: {
      eyebrow: "Sistema de lanzamiento de marca propia",
      title: "Del modelo verificado a una marca lista para el mercado.",
      steps: [["Seleccionar", "Elija un modelo real y especificaciones confirmadas."], ["Configurar", "Añada accesorios compatibles y un conjunto retail."], ["Personalizar", "Defina logo, color y requisitos de embalaje."], ["Lanzar", "Confirme muestras, documentos y detalles de producción."]],
      allModels: "Ver los seis modelos",
    },
    pt: {
      eyebrow: "Sistema de lançamento de marca própria",
      title: "Do modelo verificado à marca pronta para o mercado.",
      steps: [["Selecionar", "Escolha um modelo real e especificações confirmadas."], ["Configurar", "Adicione acessórios compatíveis e um conjunto de varejo."], ["Personalizar", "Alinhe logotipo, cor e requisitos de embalagem."], ["Lançar", "Confirme amostras, documentos e detalhes de produção."]],
      allModels: "Ver os seis modelos",
    },
    fr: {
      eyebrow: "Système de lancement de marque propre",
      title: "Du modèle vérifié à une marque prête pour le marché.",
      steps: [["Sélectionner", "Choisissez un modèle réel et des spécifications confirmées."], ["Configurer", "Ajoutez les accessoires compatibles et un ensemble retail."], ["Personnaliser", "Alignez logo, couleur et exigences d’emballage."], ["Lancer", "Confirmez échantillons, documents et détails de production."]],
      allModels: "Voir les six modèles",
    },
    ar: {
      eyebrow: "نظام إطلاق العلامة الخاصة",
      title: "من طراز موثق إلى علامة جاهزة للسوق.",
      steps: [["الاختيار", "اختر طرازاً حقيقياً ومواصفات مؤكدة."], ["التكوين", "أضف الملحقات المتوافقة وحزمة البيع."], ["العلامة", "حدّد متطلبات الشعار واللون والتغليف."], ["الإطلاق", "أكّد العينات والوثائق وتفاصيل الإنتاج."]],
      allModels: "استكشف الطرازات الستة",
    },
    zh: {
      eyebrow: "私牌产品上市系统",
      title: "从真实型号到可投放市场的品牌产品。",
      steps: [["选型", "选择真实型号并确认已有参数。"], ["选配", "组合兼容配件与零售套装。"], ["品牌化", "确认 Logo、颜色与包装需求。"], ["落地", "核对样品、资料与生产细节。"]],
      allModels: "查看全部六个型号",
    },
    ru: {
      eyebrow: "Система запуска private label",
      title: "От проверенной модели до готового к рынку бренда.",
      steps: [["Выбор", "Выберите реальную модель и подтверждённые характеристики."], ["Комплектация", "Добавьте совместимые аксессуары и розничный комплект."], ["Брендинг", "Согласуйте логотип, цвет и требования к упаковке."], ["Запуск", "Подтвердите образцы, документы и детали производства."]],
      allModels: "Посмотреть все шесть моделей",
    },
  }[lang];
  const homeHeroCtas = {
    en: { products: "Explore Products", factory: "Contact Factory", video: "Watch product video" },
    es: { products: "Explorar productos", factory: "Contactar con fábrica", video: "Ver vídeo del producto" },
    pt: { products: "Explorar produtos", factory: "Falar com a fábrica", video: "Ver vídeo do produto" },
    fr: { products: "Explorer les produits", factory: "Contacter l’usine", video: "Voir la vidéo produit" },
    ar: { products: "استكشف المنتجات", factory: "تواصل مع المصنع", video: "شاهد فيديو المنتج" },
    zh: { products: "探索产品", factory: "联系工厂", video: "观看产品视频" },
    ru: { products: "Смотреть продукты", factory: "Связаться с фабрикой", video: "Смотреть видео" },
  }[lang];
  const campaign = {
    en: { title: "Portable Espresso. Anywhere You Go.", lead: "Portable coffee machines for outdoor, travel and private-label programs.", products: "Six models. One portable range.", productLead: "Choose a model, then explore its verified details.", certs: "Compliance, shown simply.", certLead: "Available documents are confirmed by model and destination market.", contact: "Build your next coffee product." },
    es: { title: "Espresso portátil. Dondequiera que vaya.", lead: "Cafeteras portátiles para exterior, viajes y proyectos de marca propia.", products: "Seis modelos. Una gama portátil.", productLead: "Elija un modelo y consulte sus datos verificados.", certs: "Cumplimiento, de forma clara.", certLead: "Los documentos disponibles se confirman según el modelo y el mercado.", contact: "Cree su próximo producto de café." },
    pt: { title: "Espresso portátil. Onde quer que você vá.", lead: "Cafeteiras portáteis para uso outdoor, viagens e marca própria.", products: "Seis modelos. Uma linha portátil.", productLead: "Escolha um modelo e veja seus dados verificados.", certs: "Conformidade, sem complicação.", certLead: "Os documentos disponíveis são confirmados por modelo e mercado.", contact: "Crie seu próximo produto de café." },
    fr: { title: "Espresso portable. Partout avec vous.", lead: "Machines à café portables pour l’outdoor, le voyage et la marque propre.", products: "Six modèles. Une gamme portable.", productLead: "Choisissez un modèle et consultez ses données vérifiées.", certs: "La conformité, en toute clarté.", certLead: "Les documents disponibles sont confirmés selon le modèle et le marché.", contact: "Créez votre prochain produit café." },
    ar: { title: "إسبريسو محمول. أينما ذهبت.", lead: "ماكينات قهوة محمولة للأنشطة الخارجية والسفر وبرامج العلامة الخاصة.", products: "ستة طرازات. مجموعة محمولة واحدة.", productLead: "اختر الطراز ثم راجع بياناته الموثقة.", certs: "امتثال واضح وبسيط.", certLead: "تُؤكد الوثائق المتاحة حسب الطراز والسوق المستهدف.", contact: "ابدأ منتج القهوة القادم." },
    zh: { title: "便携意式咖啡，随时随地。", lead: "面向户外、旅行与私牌项目的便携式咖啡机。", products: "六个型号，一套便携产品线。", productLead: "选择型号，查看已经核实的产品资料。", certs: "认证支持，清晰呈现。", certLead: "可提供的资料根据型号和目标市场确认。", contact: "打造您的下一款咖啡产品。" },
    ru: { title: "Портативный эспрессо. Где бы вы ни были.", lead: "Портативные кофемашины для активного отдыха, поездок и private label.", products: "Шесть моделей. Одна портативная линейка.", productLead: "Выберите модель и изучите проверенные данные.", certs: "Соответствие без лишней сложности.", certLead: "Доступные документы подтверждаются по модели и рынку.", contact: "Создайте свой следующий кофейный продукт." },
  }[lang];
  const heroTech = {
    en: { series: "Product Series", model: "Flagship model", lcd: "LCD control", formats: "4 coffee formats", extraction: "Hot & cold extraction", oem: "OEM / ODM ready", viewAll: "View all models" },
    es: { series: "Serie de productos", model: "Modelo principal", lcd: "Control LCD", formats: "4 formatos de café", extraction: "Extracción fría y caliente", oem: "Listo para OEM / ODM", viewAll: "Ver todos los modelos" },
    pt: { series: "Linha de produtos", model: "Modelo principal", lcd: "Controle LCD", formats: "4 formatos de café", extraction: "Extração quente e fria", oem: "Pronto para OEM / ODM", viewAll: "Ver todos os modelos" },
    fr: { series: "Gamme de produits", model: "Modèle phare", lcd: "Commande LCD", formats: "4 formats de café", extraction: "Extraction chaude et froide", oem: "Prêt pour OEM / ODM", viewAll: "Voir tous les modèles" },
    ar: { series: "سلسلة المنتجات", model: "الطراز الرئيسي", lcd: "تحكم LCD", formats: "4 أنظمة قهوة", extraction: "استخلاص ساخن وبارد", oem: "جاهز لـ OEM / ODM", viewAll: "عرض جميع الطرازات" },
    zh: { series: "产品系列", model: "旗舰型号", lcd: "LCD 智能控制", formats: "兼容四种咖啡", extraction: "冷热双萃模式", oem: "支持 OEM / ODM", viewAll: "查看全部型号" },
    ru: { series: "Линейка продуктов", model: "Флагманская модель", lcd: "LCD-управление", formats: "4 формата кофе", extraction: "Горячая и холодная экстракция", oem: "Готово для OEM / ODM", viewAll: "Все модели" },
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
      areaServed: ["United States", "Europe", "Middle East", "Global wholesale and private label buyers"],
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
      uploadDate: "2026-07-30T16:46:36+08:00",
      duration: "PT59S",
      inLanguage: lang,
    },
  ];

  return (
    <main className="home-shell editorial-home cinematic-preview tech-stage-home" dir={dir} lang={lang}>
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
            <small>{brandTagline[lang]}</small>
          </span>
        </Link>
        <PrimaryNav lang={lang} current="home" />
        <LanguageSwitcher
          currentLang={lang}
          hrefForLang={(language) => (language === "en" ? "/" : `/?lang=${language}`)}
        />
      </header>

      <section id="home" className="hero-section dark-hero">
        <div className="hero-coffee-orbit" aria-hidden="true">
          <span className="hero-coffee-ring" />
          <span className="hero-coffee-bean bean-one" />
          <span className="hero-coffee-bean bean-two" />
        </div>
        <div className="tech-coffee-current" aria-hidden="true">
          <svg viewBox="0 0 900 190" preserveAspectRatio="none">
            <defs>
              <linearGradient id="coffee-current-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5a2b16" stopOpacity="0" />
                <stop offset="0.28" stopColor="#9f5630" stopOpacity="0.78" />
                <stop offset="0.62" stopColor="#d08b54" stopOpacity="0.88" />
                <stop offset="1" stopColor="#6f381f" stopOpacity="0" />
              </linearGradient>
              <filter id="coffee-current-glow" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d="M-40 116 C165 190 286 54 486 116 C650 168 760 59 950 105 L950 136 C760 92 648 196 480 146 C294 92 170 210 -40 145 Z" fill="url(#coffee-current-gradient)" opacity="0.2" filter="url(#coffee-current-glow)" />
            <path d="M-30 122 C170 190 285 60 480 122 C640 171 740 65 940 114" fill="none" stroke="url(#coffee-current-gradient)" strokeWidth="3" filter="url(#coffee-current-glow)" />
            <path d="M-20 138 C172 192 308 84 482 139 C635 187 770 91 930 130" fill="none" stroke="url(#coffee-current-gradient)" strokeWidth="1.2" opacity="0.58" />
          </svg>
          <span className="coffee-current-particles" />
        </div>
        <HeroCopyMotion className="hero-copy hero-heading">
          <p className="tech-model-kicker"><span>DQ-010</span>{heroTech.model}</p>
          <HeroTitleMotion className="hero-title">{campaign.title}</HeroTitleMotion>
        </HeroCopyMotion>
        <HeroCopyMotion className="hero-copy hero-body">
          <HeroTextMotion className="hero-lead">{campaign.lead}</HeroTextMotion>
          <HeroActionsMotion className="hero-actions">
            <MotionCta className="primary-action" href={`/products${langQuery(lang)}`}>
              {homeHeroCtas.products}
              <ChevronRight size={18} aria-hidden="true" />
            </MotionCta>
            <MotionCta
              className="secondary-action"
              href={`/contact${langQuery(lang)}#inquiry-form`}
            >
              {homeHeroCtas.factory}
              <ChevronRight size={18} aria-hidden="true" />
            </MotionCta>
            <MotionCta className="text-action" href="#extraction-video">
              <PlayCircle size={18} aria-hidden="true" />
              {homeHeroCtas.video}
            </MotionCta>
          </HeroActionsMotion>
        </HeroCopyMotion>

        <HeroVisualMotion className="hero-visual tech-hero-visual" aria-label="DQ-010 portable espresso machine product display">
          <Link className="tech-product-stage" href={`/products/dq-010${langQuery(lang)}`} aria-label={getProductGeo(productLine.find((product) => product.model === "DQ-010")!, lang).displayName}>
            <Image
              src="/optimized/product-scenes/dq-010-1.webp"
              alt={getProductGeo(productLine.find((product) => product.model === "DQ-010")!, lang).primaryAlt}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 62vw"
            />
          </Link>
        </HeroVisualMotion>
        <div className="tech-hero-console">
          <div className="tech-series-list">
            <span className="tech-series-title">{heroTech.series}</span>
            <Link className="tech-series-featured" href={`/products/dq-010${langQuery(lang)}`}>
              <span><strong>DQ-010</strong><small>{heroTech.model}</small></span>
              <Image
                src={productLine.find((product) => product.model === "DQ-010")!.hero}
                alt={getProductGeo(productLine.find((product) => product.model === "DQ-010")!, lang).primaryAlt}
                width={180}
                height={180}
                sizes="160px"
                loading="eager"
                fetchPriority="high"
              />
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
            <div className="tech-series-models">
              {productLine.map((product) => (
                <Link href={`/products/${product.slug}${langQuery(lang)}`} key={product.model} className={product.model === "DQ-010" ? "is-active" : undefined}>
                  {product.model}
                </Link>
              ))}
            </div>
            <Link className="tech-series-all" href={`/products${langQuery(lang)}`}>{heroTech.viewAll}<ChevronRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="tech-capability-strip" aria-label="DQ-010 key capabilities">
            <div><Radio aria-hidden="true" /><span>{heroTech.lcd}</span></div>
            <div><Coffee aria-hidden="true" /><span>{heroTech.formats}</span></div>
            <div><Droplets aria-hidden="true" /><span>{heroTech.extraction}</span></div>
            <div><Wrench aria-hidden="true" /><span>{heroTech.oem}</span></div>
          </div>
        </div>
      </section>

      <section id="features" className="home-proof-ribbon" aria-label="TK Classic proof points">
        <div><strong>15+</strong><span>{ui.proof.years}</span></div>
        <div><strong>50+</strong><span>{ui.proof.markets}</span></div>
        <div><strong>OEM / ODM</strong><span>{t.nav.oem}</span></div>
        <div><strong>{certifications.length}</strong><span>{t.nav.certs}</span></div>
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

      <section className="launch-system-band" aria-label={launchPath.eyebrow}>
        <CoffeeAtmosphere variant="stream" />
        <div className="launch-system-intro">
          <span>{launchPath.eyebrow}</span>
          <h2>{launchPath.title}</h2>
        </div>
        <ol className="launch-system-steps">
          {launchPath.steps.map(([title, description], index) => (
            <li key={title}>
              <small>0{index + 1}</small>
              <strong>{title}</strong>
              <span>{description}</span>
            </li>
          ))}
        </ol>
      </section>

      <RevealSection className="section certification-trust-section" id="certifications" aria-label={t.sectionTitles.certs}>
        <CoffeeAtmosphere variant="crema" />
        <div className="certification-showcase-intro">
          <div className="section-heading align-left">
            <span>{t.nav.certs}</span>
            <h2>{campaign.certs}</h2>
            <p>{campaign.certLead}</p>
          </div>
          <div className="certification-availability" id="certification-availability-note">
            <ShieldCheck size={22} aria-hidden="true" />
            <p>{certificationRequestCopy[lang]}</p>
            <Link className="certification-request-link" href={`/contact${langQuery(lang)}#inquiry-form`}>
              {certificationCtaCopy[lang]}
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <figure className="certification-overview is-compact" aria-describedby="certification-availability-note">
          <Image
            className="certification-overview-image"
            src="/images/certifications/certification-overview.webp"
            alt="TK Classic certification and test report preview covering CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 and EU declaration documents"
            width={1440}
            height={810}
            sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1200px) calc(100vw - 64px), 1180px"
            draggable={false}
          />
          <figcaption>
            <FileCheck2 size={15} aria-hidden="true" />
            {certificationPreviewCopy[lang]}
          </figcaption>
        </figure>

        <div className="certification-icon-grid" aria-label={ui.proof.compliance}>
          {certifications.map((certification, index) => {
            const CertificationIcon = certificationIcons[index] ?? ShieldCheck;
            return (
              <div className="certification-icon-item" key={certification.name}>
                <span className="certification-trust-mark"><CertificationIcon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                <strong>{certification.name}</strong>
              </div>
            );
          })}
        </div>
      </RevealSection>

      <section id="products" className="section product-section">
        <CoffeeAtmosphere variant="stream" />
        <div className="section-heading">
          <span>{t.nav.products}</span>
          <h2>{campaign.products}</h2>
          <p>{campaign.productLead}</p>
        </div>
        <div className="product-grid featured-grid product-visual-grid">
          {productLine.map((product) => (
            <article className="product-card is-featured" key={product.model}>
              <Link href={`/products/${product.slug}${langQuery(lang)}`} className="product-image-link">
                <Image
                  src={product.hero}
                  alt={getProductGeo(product, lang).primaryAlt}
                  width={900}
                  height={900}
                  sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw"
                />
              </Link>
              <div className="product-card-body">
                <p className="card-label">{localizeFeatureLabel(product.featureLabel, lang)}</p>
                <h3>{product.model}</h3>
                <Link className="card-link" href={`/products/${product.slug}${langQuery(lang)}`}>
                  {t.labels.fullSpec}
                  <ChevronRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="product-section-action">
          <Link className="primary-action" href={`/products${langQuery(lang)}`}>
            {launchPath.allModels}
            <ChevronRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {managedSections.slice(0, 1).map((section) => {
        const content = section.translations.find((item) => item.locale === lang)
          ?? (lang === "en" ? section.translations.find((item) => item.locale === "en") ?? section.translations[0] : undefined);
        if (!content) return null;
        return <RevealSection className="section cms-managed-section" key={section.id} data-section-key={section.key}>
          <div className="section-heading">
            <span>{section.type}</span>
            {content.title ? <h2>{content.title}</h2> : null}
            {content.subtitle ? <p>{content.subtitle}</p> : null}
          </div>
          {content.ctaLabel && content.ctaHref ? <Link className="primary-action" href={content.ctaHref}>{content.ctaLabel}<ChevronRight size={17} aria-hidden="true" /></Link> : null}
        </RevealSection>;
      })}

      <FeaturedBuyerGuides lang={lang} />

      <section id="contact" className="section contact-section">
        <CoffeeAtmosphere variant="steam" />
        <div className="home-contact-promo">
          <div className="section-heading align-left">
            <span>{t.nav.contact}</span>
            <h2>{campaign.contact}</h2>
          </div>
          <div className="contact-methods">
            <a href={whatsappHref("DQ-001")} target="_blank" rel="noreferrer">
              <MessageCircle size={20} aria-hidden="true" />
              <span>{t.form.whatsapp}</span>
            </a>
            <Link href={`/contact${langQuery(lang)}#inquiry-form`}>
              <Mail size={20} aria-hidden="true" />
              <span>{t.hero.primaryCta}</span>
            </Link>
          </div>
        </div>
      </section>

      <MobileStickyCta
        primaryLabel={t.hero.primaryCta}
        whatsappHref={whatsappHref("DQ-001")}
      />

      <SiteFooter lang={lang} />
    </main>
  );
}
