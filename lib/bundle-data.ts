import type { Lang } from "@/lib/site-data";

export type BundleCopy = {
  navLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
  cards: Array<{
    title: string;
    summary: string;
    includesLabel: string;
    includes: string;
    fitLabel: string;
    fit: string;
  }>;
};

export const bundleCopy: Record<Lang, BundleCopy> = {
  en: {
    navLabel: "Bundles",
    eyebrow: "Bundle programs",
    title: "Turn one product into a complete retail offer.",
    lead: "Choose a ready-made bundle direction, then let our team confirm the model, accessories, packaging and quote for your market.",
    cta: "Request bundle quote",
    cards: [
      { title: "Travel Starter Set", summary: "A compact everyday coffee setup for travel, commuting and outdoor retail.", includesLabel: "Includes", includes: "Portable machine, carry bag, cup or adapter", fitLabel: "Best for", fit: "Outdoor, travel and lifestyle retailers" },
      { title: "Retail Gift Set", summary: "A premium presentation built around a gift box, coordinated accessories and a clear shelf story.", includesLabel: "Includes", includes: "Hero model, gift box, accessories and insert card", fitLabel: "Best for", fit: "Corporate gifts, seasonal campaigns and gift shops" },
      { title: "Private Label Launch Kit", summary: "A practical starting point for brands testing a new portable coffee line with their own identity.", includesLabel: "Includes", includes: "Selected model, logo application, color and packaging review", fitLabel: "Best for", fit: "OEM/ODM brands and cross-border ecommerce" },
    ],
  },
  es: {
    navLabel: "Kits",
    eyebrow: "Programas de kits",
    title: "Convierte un producto en una oferta retail completa.",
    lead: "Elige una dirección de kit y nuestro equipo confirmará el modelo, los accesorios, el packaging y la cotización para tu mercado.",
    cta: "Solicitar cotización del kit",
    cards: [
      { title: "Kit de viaje", summary: "Un conjunto compacto para el día a día, los desplazamientos y el retail outdoor.", includesLabel: "Incluye", includes: "Máquina portátil, bolsa, taza o adaptador", fitLabel: "Ideal para", fit: "Tiendas outdoor, viaje y lifestyle" },
      { title: "Kit regalo retail", summary: "Una presentación premium con caja regalo, accesorios coordinados y una historia clara para el lineal.", includesLabel: "Incluye", includes: "Modelo principal, caja, accesorios y tarjeta", fitLabel: "Ideal para", fit: "Regalos corporativos, campañas y tiendas de regalo" },
      { title: "Kit de lanzamiento private label", summary: "Un punto de partida práctico para marcas que prueban una nueva línea de café portátil.", includesLabel: "Incluye", includes: "Modelo, aplicación de logo, color y revisión del packaging", fitLabel: "Ideal para", fit: "Marcas OEM/ODM y ecommerce cross-border" },
    ],
  },
  pt: {
    navLabel: "Kits",
    eyebrow: "Programas de kits",
    title: "Transforme um produto em uma oferta completa para o varejo.",
    lead: "Escolha uma direção de kit e nossa equipe confirmará modelo, acessórios, embalagem e cotação para o seu mercado.",
    cta: "Solicitar cotação do kit",
    cards: [
      { title: "Kit inicial de viagem", summary: "Uma configuração compacta para uso diário, deslocamentos e varejo outdoor.", includesLabel: "Inclui", includes: "Máquina portátil, bolsa, copo ou adaptador", fitLabel: "Ideal para", fit: "Lojas outdoor, viagem e lifestyle" },
      { title: "Kit presente para varejo", summary: "Apresentação premium com caixa presente, acessórios coordenados e uma história clara para a prateleira.", includesLabel: "Inclui", includes: "Modelo principal, caixa, acessórios e cartão", fitLabel: "Ideal para", fit: "Brindes corporativos, campanhas sazonais e lojas de presentes" },
      { title: "Kit de lançamento private label", summary: "Um ponto de partida prático para marcas que testam uma nova linha de café portátil.", includesLabel: "Inclui", includes: "Modelo, aplicação de logo, cor e revisão da embalagem", fitLabel: "Ideal para", fit: "Marcas OEM/ODM e ecommerce cross-border" },
    ],
  },
  fr: {
    navLabel: "Coffrets",
    eyebrow: "Programmes de coffrets",
    title: "Transformez un produit en offre retail complète.",
    lead: "Choisissez une direction de coffret et notre équipe confirmera le modèle, les accessoires, le packaging et le devis pour votre marché.",
    cta: "Demander un devis coffret",
    cards: [
      { title: "Coffret voyage", summary: "Une configuration compacte pour le quotidien, les déplacements et le retail outdoor.", includesLabel: "Comprend", includes: "Machine portable, sac, tasse ou adaptateur", fitLabel: "Idéal pour", fit: "Boutiques outdoor, voyage et lifestyle" },
      { title: "Coffret cadeau retail", summary: "Une présentation premium avec boîte cadeau, accessoires coordonnés et histoire claire en rayon.", includesLabel: "Comprend", includes: "Modèle phare, boîte, accessoires et carte", fitLabel: "Idéal pour", fit: "Cadeaux d'entreprise, campagnes saisonnières et boutiques cadeaux" },
      { title: "Kit de lancement private label", summary: "Un point de départ concret pour les marques qui testent une nouvelle gamme de café portable.", includesLabel: "Comprend", includes: "Modèle, marquage logo, couleur et revue packaging", fitLabel: "Idéal pour", fit: "Marques OEM/ODM et ecommerce cross-border" },
    ],
  },
  ar: {
    navLabel: "المجموعات",
    eyebrow: "برامج المجموعات",
    title: "حوّل منتجاً واحداً إلى عرض متكامل للبيع بالتجزئة.",
    lead: "اختر اتجاه المجموعة، وسيؤكد فريقنا النموذج والملحقات والتغليف وعرض السعر المناسب لسوقك.",
    cta: "اطلب عرض سعر للمجموعة",
    cards: [
      { title: "مجموعة السفر الأساسية", summary: "إعداد قهوة مدمج للاستخدام اليومي والتنقل ومتاجر المنتجات الخارجية.", includesLabel: "تتضمن", includes: "ماكينة محمولة وحقيبة وكوباً أو محولاً", fitLabel: "مناسبة لـ", fit: "متاجر السفر والأنشطة الخارجية ونمط الحياة" },
      { title: "مجموعة الهدايا للبيع بالتجزئة", summary: "عرض فاخر مع علبة هدايا وملحقات منسقة وقصة واضحة على الرف.", includesLabel: "تتضمن", includes: "النموذج الرئيسي والعلبة والملحقات وبطاقة تعريف", fitLabel: "مناسبة لـ", fit: "هدايا الشركات والحملات الموسمية ومتاجر الهدايا" },
      { title: "حزمة إطلاق العلامة الخاصة", summary: "بداية عملية للعلامات التي تختبر خطاً جديداً من القهوة المحمولة بهويتها الخاصة.", includesLabel: "تتضمن", includes: "النموذج وتطبيق الشعار ومراجعة اللون والتغليف", fitLabel: "مناسبة لـ", fit: "علامات OEM/ODM والتجارة الإلكترونية العابرة للحدود" },
    ],
  },
  zh: {
    navLabel: "套装方案",
    eyebrow: "套装销售方案",
    title: "把一款产品，组合成完整的零售方案。",
    lead: "选择适合你的套装方向，我们会进一步确认型号、配件、包装和市场报价。",
    cta: "咨询套装报价",
    cards: [
      { title: "旅行入门套装", summary: "适合旅行、通勤和户外零售的轻量化咖啡解决方案。", includesLabel: "包含", includes: "便携咖啡机、收纳包、杯子或转接器", fitLabel: "适合", fit: "户外、旅行和生活方式零售渠道" },
      { title: "零售礼盒套装", summary: "以礼盒、协调配件和清晰陈列故事打造更完整的高端礼赠呈现。", includesLabel: "包含", includes: "主推型号、礼盒、配件和说明卡", fitLabel: "适合", fit: "企业礼赠、节日活动和礼品店" },
      { title: "私牌启动套装", summary: "适合品牌测试便携咖啡产品线的务实起步方案。", includesLabel: "包含", includes: "选定型号、Logo 工艺、颜色和包装确认", fitLabel: "适合", fit: "OEM/ODM 品牌和跨境电商" },
    ],
  },
  ru: {
    navLabel: "Наборы",
    eyebrow: "Программы наборов",
    title: "Превратите один продукт в готовое retail-предложение.",
    lead: "Выберите направление набора, а наша команда подтвердит модель, аксессуары, упаковку и коммерческое предложение для вашего рынка.",
    cta: "Запросить расчёт набора",
    cards: [
      { title: "Дорожный стартовый набор", summary: "Компактное решение для повседневного использования, поездок и outdoor-ритейла.", includesLabel: "В комплекте", includes: "Портативная машина, чехол, чашка или адаптер", fitLabel: "Подходит для", fit: "Outdoor-, travel- и lifestyle-магазинов" },
      { title: "Подарочный retail-набор", summary: "Премиальная подача с подарочной коробкой, аксессуарами и понятной историей на полке.", includesLabel: "В комплекте", includes: "Основная модель, коробка, аксессуары и карточка", fitLabel: "Подходит для", fit: "Корпоративных подарков, сезонных кампаний и gift-магазинов" },
      { title: "Стартовый набор private label", summary: "Практичная отправная точка для брендов, тестирующих новую линейку портативного кофе.", includesLabel: "В комплекте", includes: "Модель, нанесение логотипа, цвет и проверка упаковки", fitLabel: "Подходит для", fit: "OEM/ODM-брендов и cross-border ecommerce" },
    ],
  },
};
