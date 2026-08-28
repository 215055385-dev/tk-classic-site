export type Lang = "en" | "es" | "pt" | "fr" | "ar" | "zh" | "ru";

export const languages: Array<{
  code: Lang;
  label: string;
  native: string;
  dir: "ltr" | "rtl";
}> = [
  { code: "en", label: "EN", native: "English", dir: "ltr" },
  { code: "es", label: "ES", native: "Español", dir: "ltr" },
  { code: "pt", label: "PT", native: "Português", dir: "ltr" },
  { code: "fr", label: "FR", native: "Français", dir: "ltr" },
  { code: "ar", label: "AR", native: "العربية", dir: "rtl" },
  { code: "zh", label: "ZH", native: "中文", dir: "ltr" },
  { code: "ru", label: "RU", native: "Русский", dir: "ltr" },
];

export const company = {
  brand: "TK Classic",
  legalName: "Daqian Classic (Shenzhen) Industrial Co., Ltd.",
  address:
    "Unit C, 5th Floor, Building A9, Tianrui Industrial Park, No.35 Fuwei 1st Road, Xinhe Community, Fuhai Subdistrict, Bao'an District, Shenzhen, Guangdong Province, China",
  phoneBowie: "+86 159 1400 4936",
  whatsappBowie: "+8615914004936",
  emailBowie: "bowie@tkclassic.com",
  emailLeo: "leo@tkclassic.com",
  brochure: "/downloads/product-brochure.pdf",
  siteUrl: "https://portablecoffeemachine.com",
};

type Copy = {
  title: string;
  description: string;
  nav: Record<string, string>;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    support: string;
    primaryCta: string;
    secondaryCta: string;
    tertiaryCta: string;
  };
  signals: string[];
  sectionTitles: {
    products: string;
    oem: string;
    factory: string;
    certs: string;
    blog: string;
    faq: string;
    contact: string;
    about: string;
    accessories: string;
  };
  intro: string;
  about: string[];
  factory: string[];
  oem: string[];
  certs: string[];
  blogLead: string;
  faq: Array<{ q: string; a: string }>;
  contactTitle: string;
  contactLead: string;
  form: {
    name: string;
    email: string;
    company: string;
    product: string;
    message: string;
    submit: string;
    whatsapp: string;
    emailUs: string;
  };
  labels: Record<string, string>;
};

export const copy: Record<Lang, Copy> = {
  en: {
    title: "Portable Espresso Machine Manufacturer & OEM Supplier | TK Classic",
    description:
      "Factory-direct portable espresso machines for US importers, wholesalers and private-label brands. Compare verified models, OEM options and request a quote.",
    nav: {
      home: "Home",
      products: "Products",
      oem: "OEM & ODM",
      about: "About",
      factory: "Factory",
      certs: "Certifications",
      blog: "Buyer guides",
      faq: "FAQ",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Premium portable coffee machines",
      title: "Portable Espresso. Anywhere You Go.",
      lead:
        "Premium portable coffee machines designed for outdoor, travel and everyday coffee routines.",
      support:
        "TK Classic is a Shenzhen portable espresso machine manufacturer serving importers, wholesalers and private-label brands with verified model data and project-based OEM support.",
      primaryCta: "Request quotation",
      secondaryCta: "Chat on WhatsApp",
      tertiaryCta: "Download brochure",
    },
    signals: [
      "Factory direct",
      "OEM / ODM",
      "Project-based order planning",
      "European compliance",
      "Custom packaging",
      "Multilingual support",
    ],
    sectionTitles: {
      products: "Featured products",
      oem: "OEM / ODM program",
      factory: "Factory strength",
      certs: "Certification set",
      blog: "Buyer guide content hub",
      faq: "FAQ",
      contact: "Get a quotation",
      about: "About TK Classic",
      accessories: "Accessories",
    },
    intro:
      "Built for European sourcing teams that need a portable coffee supplier with strong product depth, fast response, and private label flexibility.",
    about: [
      "Founded in 2016 in Shenzhen, Daqian Classic (Shenzhen) Industrial Co., Ltd. focuses on portable coffee equipment R&D and one-on-one project service.",
      "TK Classic is the market-facing brand. The range covers portable espresso machines, milk frothers, warmers, adapters, stands and carry bags.",
      "The team supports English, Spanish, Portuguese, French, Arabic, Chinese and Russian buyer workflows without slowing down the quote process.",
    ],
    factory: [
      "Factory-direct supply for wholesalers, private label brands and gift programs.",
      "OEM programs support logo and packaging customization.",
      "ODM programs support differentiated product development.",
      "Type-C charging, lithium battery platforms and compact engineering for retail-friendly shelf presence.",
    ],
    oem: [
      "Logo customization: laser engraving, silk screen printing, UV printing and water transfer printing.",
      "Packaging support: custom gift boxes, body color matching and outer packaging design.",
      "OEM / ODM process: project brief, sample confirmation, artwork review, mass production and export packing.",
      "Order quantities and packaging formats are confirmed after the project brief.",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA for market access confidence.",
      "LFGB and FDA material reports for food-contact components.",
      "ISO 9001 quality system documentation.",
      "EU conformity declaration and supporting export reports available on request.",
    ],
    blogLead:
      "Practical sourcing guides based on published product data, OEM approval steps, packaging decisions and model-specific compliance documents.",
    faq: [
      {
        q: "How do you plan order quantities?",
        a: "We confirm the right quantity and packaging format after reviewing the model, market and branding requirements.",
      },
      {
        q: "Can you support logo and packaging customization?",
        a: "Yes. We support laser engraving, silk screen printing, UV printing, water transfer printing, custom gift boxes and color matching.",
      },
      {
        q: "Which compliance documents do you have?",
        a: "The file set includes CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 and EU conformity declaration documents.",
      },
      {
        q: "Do you support multilingual buyer communication?",
        a: "Yes. The site and inquiry flow are set up for English, Spanish, Portuguese, French, Arabic, Chinese and Russian buyers.",
      },
    ],
    contactTitle: "Start your quotation",
    contactLead:
      "Send your target model, order quantity, destination market and branding needs. We will reply with the best fit and the fastest sourcing path.",
    form: {
      name: "Name",
      email: "Email",
      company: "Company",
      product: "Product interest",
      message: "Message",
      submit: "Prepare inquiry email",
      whatsapp: "WhatsApp",
      emailUs: "Email us",
    },
    labels: {
      model: "Model",
      capacity: "Capacity",
      pressure: "Pressure",
      material: "Material",
      battery: "Battery",
      charging: "Charging",
      heat: "Heating",
      cup: "Cup capacity",
      size: "Size",
      adapter: "Adapters",
      life: "Brews",
      scene: "Best for",
      feature: "Key features",
      download: "Download PDF",
      fullSpec: "Full specs",
      related: "Related products",
      support: "Sales support",
      selected: "Selected market fit",
    },
  },
  es: {
    title: "TK Classic | Máquinas de café portátiles para OEM/ODM y marcas propias",
    description:
      "Máquinas espresso portátiles, espumadores, calentadores y accesorios de fábrica para mayoristas europeos, marcas privadas y programas OEM/ODM.",
    nav: {
      home: "Inicio",
      products: "Productos",
      oem: "OEM y ODM",
      about: "Nosotros",
      factory: "Fábrica",
      certs: "Certificados",
      blog: "Guías",
      faq: "FAQ",
      contact: "Contacto",
    },
    hero: {
      eyebrow: "Cafeteras portátiles premium",
      title: "Espresso portátil. Dondequiera que vaya.",
      lead:
        "Cafeteras portátiles premium diseñadas para actividades al aire libre, viajes y rutinas diarias de café.",
      support:
        "Para mayoristas, programas de regalo y marcas propias: seleccione un modelo verificado, configure el conjunto y avance hacia la producción con un socio industrial especializado.",
      primaryCta: "Pedir cotización",
      secondaryCta: "Hablar por WhatsApp",
      tertiaryCta: "Descargar catálogo",
    },
    signals: ["Directo de fábrica", "OEM / ODM", "Planificación por proyecto", "Cumplimiento europeo", "Embalaje personalizado", "Soporte multilingüe"],
    sectionTitles: {
      products: "Productos destacados",
      oem: "Programa OEM / ODM",
      factory: "Fortaleza de fábrica",
      certs: "Paquete de certificaciones",
      blog: "Guías para compradores",
      faq: "FAQ",
      contact: "Solicitar cotización",
      about: "Sobre TK Classic",
      accessories: "Accesorios",
    },
    intro:
      "Pensado para equipos de compras europeos que necesitan un proveedor de café portátil con respuesta rápida y flexibilidad de marca propia.",
    about: [
      "Fundada en 2016 en Shenzhen, Daqian Classic (Shenzhen) Industrial Co., Ltd. se centra en I+D de equipos de café portátiles y servicio de proyecto uno a uno.",
      "TK Classic es la marca comercial. La línea cubre máquinas espresso portátiles, espumadores, calentadores, adaptadores, soportes y bolsas.",
      "El equipo atiende flujos de compra en inglés, español, portugués, francés, árabe, chino y ruso.",
    ],
    factory: [
      "Suministro directo de fábrica para mayoristas, marcas propias y programas de regalo.",
      "Los programas OEM admiten personalización de logo y empaque.",
      "Los programas ODM permiten desarrollo diferenciado.",
      "Carga Type-C, plataformas de batería de litio y diseño compacto listo para retail.",
    ],
    oem: [
      "Personalización de logo: grabado láser, serigrafía, impresión UV y transferencia de agua.",
      "Embalaje: cajas regalo personalizadas, coincidencia de color y diseño exterior.",
      "Proceso: brief, muestra, revisión de artes, producción en masa y embalaje de exportación.",
      "La cantidad y el formato de empaque se confirman después del brief del proyecto.",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA para acceso a mercado.",
      "Informes LFGB y FDA para piezas en contacto con alimentos.",
      "Sistema de calidad ISO 9001.",
      "Declaración de conformidad UE y reportes de exportación a solicitud.",
    ],
    blogLead:
      "Guías prácticas basadas en datos de producto publicados, aprobaciones OEM, decisiones de embalaje y documentos de conformidad específicos por modelo.",
    faq: [
      {
        q: "¿Cómo se planifica la cantidad del pedido?",
        a: "Confirmamos la cantidad y el formato de empaque adecuados después de revisar el modelo, el mercado y las necesidades de marca.",
      },
      {
        q: "¿Hacen logo y empaque personalizado?",
        a: "Sí. Apoyamos grabado láser, serigrafía, impresión UV, transferencia de agua, cajas regalo y ajuste de color.",
      },
      {
        q: "¿Qué certificados tienen?",
        a: "El paquete incluye CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 y declaración de conformidad UE.",
      },
      {
        q: "¿Atienden en varios idiomas?",
        a: "Sí. La web y el flujo de consulta están listos para inglés, español, portugués, francés, árabe, chino y ruso.",
      },
    ],
    contactTitle: "Empezar la cotización",
    contactLead:
      "Envíe el modelo objetivo, cantidad, mercado destino y necesidades de branding. Le responderemos con la opción más adecuada.",
    form: {
      name: "Nombre",
      email: "Correo",
      company: "Empresa",
      product: "Producto de interés",
      message: "Mensaje",
      submit: "Preparar correo",
      whatsapp: "WhatsApp",
      emailUs: "Escríbenos",
    },
    labels: {
      model: "Modelo",
      capacity: "Capacidad",
      pressure: "Presión",
      material: "Material",
      battery: "Batería",
      charging: "Carga",
      heat: "Calentamiento",
      cup: "Capacidad de taza",
      size: "Tamaño",
      adapter: "Adaptadores",
      life: "Preparaciones",
      scene: "Ideal para",
      feature: "Características clave",
      download: "Descargar PDF",
      fullSpec: "Especificaciones",
      related: "Productos relacionados",
      support: "Soporte comercial",
      selected: "Encaje de mercado",
    },
  },
  pt: {
    title: "TK Classic | Máquinas de café portáteis para OEM/ODM e marca própria",
    description:
      "Máquinas espresso portáteis, espumadores, aquecedores e acessórios de fábrica para atacadistas europeus, marcas próprias e programas OEM/ODM.",
    nav: {
      home: "Início",
      products: "Produtos",
      oem: "OEM e ODM",
      about: "Sobre",
      factory: "Fábrica",
      certs: "Certificações",
      blog: "Guias",
      faq: "FAQ",
      contact: "Contato",
    },
    hero: {
      eyebrow: "Máquinas de café portáteis premium",
      title: "Espresso portátil. Onde quer que você vá.",
      lead:
        "Máquinas de café portáteis premium criadas para atividades ao ar livre, viagens e rotinas diárias de café.",
      support:
        "Para atacadistas, programas de presentes e marcas próprias: selecione um modelo verificado, configure o conjunto e avance para a produção com um parceiro industrial especializado.",
      primaryCta: "Pedir orçamento",
      secondaryCta: "Falar no WhatsApp",
      tertiaryCta: "Baixar catálogo",
    },
    signals: ["Direto da fábrica", "OEM / ODM", "Planejamento por projeto", "Conformidade europeia", "Embalagem personalizada", "Suporte multilíngue"],
    sectionTitles: {
      products: "Produtos em destaque",
      oem: "Programa OEM / ODM",
      factory: "Força da fábrica",
      certs: "Pacote de certificados",
      blog: "Guias para compradores",
      faq: "FAQ",
      contact: "Solicitar orçamento",
      about: "Sobre a TK Classic",
      accessories: "Acessórios",
    },
    intro:
      "Feito para equipes de compras europeias que precisam de um fornecedor de café portátil com resposta rápida e flexibilidade de marca própria.",
    about: [
      "Fundada em 2016 em Shenzhen, a Daqian Classic (Shenzhen) Industrial Co., Ltd. foca em P&D de equipamentos de café portáteis e atendimento de projeto individual.",
      "A TK Classic é a marca comercial. A linha inclui máquinas espresso portáteis, espumadores, aquecedores, adaptadores, suportes e bolsas.",
      "A equipe atende fluxos de compra em inglês, espanhol, português, francês, árabe, chinês e russo.",
    ],
    factory: [
      "Fornecimento direto da fábrica para atacadistas, marcas próprias e brindes.",
      "Os programas OEM permitem personalização de logo e embalagem.",
      "Os programas ODM permitem desenvolvimento diferenciado.",
      "Carga Type-C, plataforma de bateria de lítio e design compacto pronto para varejo.",
    ],
    oem: [
      "Personalização de logo: gravação a laser, serigrafia, impressão UV e transferência de água.",
      "Embalagem: caixas personalizadas, combinação de cores e design externo.",
      "Processo: briefing, amostra, revisão de arte, produção em massa e embalagem de exportação.",
      "A quantidade e o formato da embalagem são confirmados após o briefing do projeto.",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA para acesso ao mercado.",
      "Relatórios LFGB e FDA para partes em contato com alimentos.",
      "Sistema de qualidade ISO 9001.",
      "Declaração de conformidade UE e relatórios de exportação sob solicitação.",
    ],
    blogLead:
      "Guias práticos baseados em dados de produto publicados, aprovações OEM, decisões de embalagem e documentos de conformidade específicos por modelo.",
    faq: [
      {
        q: "Como vocês planejam a quantidade do pedido?",
        a: "Confirmamos a quantidade e o formato de embalagem adequados depois de revisar o modelo, o mercado e as necessidades da marca.",
      },
      {
        q: "Vocês fazem logo e embalagem personalizados?",
        a: "Sim. Oferecemos gravação a laser, serigrafia, impressão UV, transferência de água, caixas de presente e ajuste de cor.",
      },
      {
        q: "Quais certificados vocês possuem?",
        a: "O pacote inclui CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 e declaração de conformidade UE.",
      },
      {
        q: "Vocês atendem em vários idiomas?",
        a: "Sim. O site e o fluxo de contato estão prontos para inglês, espanhol, português, francês, árabe, chinês e russo.",
      },
    ],
    contactTitle: "Começar orçamento",
    contactLead:
      "Envie modelo alvo, quantidade, mercado de destino e necessidades de branding. Responderemos com a melhor opção.",
    form: {
      name: "Nome",
      email: "E-mail",
      company: "Empresa",
      product: "Produto de interesse",
      message: "Mensagem",
      submit: "Preparar e-mail",
      whatsapp: "WhatsApp",
      emailUs: "Enviar e-mail",
    },
    labels: {
      model: "Modelo",
      capacity: "Capacidade",
      pressure: "Pressão",
      material: "Material",
      battery: "Bateria",
      charging: "Carregamento",
      heat: "Aquecimento",
      cup: "Capacidade do copo",
      size: "Tamanho",
      adapter: "Adaptadores",
      life: "Preparos",
      scene: "Ideal para",
      feature: "Principais recursos",
      download: "Baixar PDF",
      fullSpec: "Especificações",
      related: "Produtos relacionados",
      support: "Suporte comercial",
      selected: "Aderência ao mercado",
    },
  },
  fr: {
    title: "TK Classic | Machines à café portables pour OEM/ODM et marques propres",
    description:
      "Machines espresso portables, mousseurs, chauffe-tasses et accessoires en direct usine pour grossistes européens, marques propres et programmes OEM/ODM.",
    nav: {
      home: "Accueil",
      products: "Produits",
      oem: "OEM & ODM",
      about: "À propos",
      factory: "Usine",
      certs: "Certificats",
      blog: "Guides",
      faq: "FAQ",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Machines à café portables premium",
      title: "Espresso portable. Partout avec vous.",
      lead:
        "Des machines à café portables premium pensées pour le plein air, le voyage et les routines café du quotidien.",
      support:
        "Pour grossistes, programmes cadeaux et marques propres : choisissez un modèle vérifié, configurez l’ensemble et avancez vers la production avec un partenaire industriel spécialisé.",
      primaryCta: "Demander un devis",
      secondaryCta: "Discuter sur WhatsApp",
      tertiaryCta: "Télécharger le catalogue",
    },
    signals: ["Direct usine", "OEM / ODM", "Planification par projet", "Conformité européenne", "Emballage personnalisé", "Support multilingue"],
    sectionTitles: {
      products: "Produits phares",
      oem: "Programme OEM / ODM",
      factory: "Force de l'usine",
      certs: "Dossier de certification",
      blog: "Guides acheteurs",
      faq: "FAQ",
      contact: "Demander un devis",
      about: "À propos de TK Classic",
      accessories: "Accessoires",
    },
    intro:
      "Pensé pour les équipes achats européennes qui veulent un fournisseur de café portable réactif et flexible pour les marques propres.",
    about: [
      "Fondée en 2016 à Shenzhen, Daqian Classic (Shenzhen) Industrial Co., Ltd. se concentre sur la R&D d'équipements café portables et un service projet personnalisé.",
      "TK Classic est la marque commerciale. La gamme couvre les machines espresso portables, mousseurs, chauffe-tasses, adaptateurs, supports et sacs.",
      "L'équipe gère les demandes en anglais, espagnol, portugais, français, arabe, chinois et russe.",
    ],
    factory: [
      "Approvisionnement direct usine pour grossistes, marques propres et cadeaux d'entreprise.",
      "Les programmes OEM prennent en charge la personnalisation du logo et de l'emballage.",
      "Les programmes ODM prennent en charge le développement différencié.",
      "Recharge Type-C, batteries lithium et format compact prêt pour le retail.",
    ],
    oem: [
      "Personnalisation logo : gravure laser, sérigraphie, impression UV et transfert d'eau.",
      "Emballage : boîtes cadeau personnalisées, harmonie des couleurs et design extérieur.",
      "Processus : brief, échantillon, validation des visuels, production et emballage export.",
      "La quantité et le format d'emballage sont confirmés après le brief du projet.",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA pour l'accès marché.",
      "Rapports LFGB et FDA pour les composants alimentaires.",
      "Système qualité ISO 9001.",
      "Déclaration UE de conformité et rapports d'export disponibles sur demande.",
    ],
    blogLead:
      "Guides pratiques fondés sur les données produit publiées, les validations OEM, les choix d'emballage et les documents de conformité propres à chaque modèle.",
    faq: [
      {
        q: "Comment planifiez-vous la quantité de commande ?",
        a: "Nous confirmons la quantité et le format d'emballage adaptés après examen du modèle, du marché et des besoins de marque.",
      },
      {
        q: "Pouvez-vous personnaliser le logo et l'emballage ?",
        a: "Oui. Nous proposons gravure laser, sérigraphie, impression UV, transfert d'eau, boîtes cadeau et ajustement des couleurs.",
      },
      {
        q: "Quels certificats possédez-vous ?",
        a: "Le dossier comprend CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 et la déclaration UE de conformité.",
      },
      {
        q: "Travaillez-vous en plusieurs langues ?",
        a: "Oui. Le site et le flux de contact sont prêts pour l'anglais, l'espagnol, le portugais, le français, l'arabe, le chinois et le russe.",
      },
    ],
    contactTitle: "Lancer votre devis",
    contactLead:
      "Envoyez le modèle, la quantité, le marché cible et les besoins de branding. Nous répondons avec la meilleure solution.",
    form: {
      name: "Nom",
      email: "E-mail",
      company: "Société",
      product: "Produit recherché",
      message: "Message",
      submit: "Préparer l'e-mail",
      whatsapp: "WhatsApp",
      emailUs: "Nous écrire",
    },
    labels: {
      model: "Modèle",
      capacity: "Capacité",
      pressure: "Pression",
      material: "Matériau",
      battery: "Batterie",
      charging: "Charge",
      heat: "Chauffage",
      cup: "Capacité tasse",
      size: "Taille",
      adapter: "Adaptateurs",
      life: "Tasses",
      scene: "Idéal pour",
      feature: "Points forts",
      download: "Télécharger le PDF",
      fullSpec: "Spécifications",
      related: "Produits associés",
      support: "Support commercial",
      selected: "Adéquation marché",
    },
  },
  ar: {
    title: "TK Classic | ماكينات قهوة محمولة لـ OEM/ODM والعلامات الخاصة",
    description:
      "ماكينات إسبرسو محمولة، مخفقات حليب، سخانات وملحقات مباشرة من المصنع للموزعين الأوروبيين والعلامات الخاصة وبرامج OEM/ODM.",
    nav: {
      home: "الرئيسية",
      products: "المنتجات",
      oem: "OEM وODM",
      about: "من نحن",
      factory: "المصنع",
      certs: "الشهادات",
      blog: "أدلة",
      faq: "الأسئلة",
      contact: "اتصل بنا",
    },
    hero: {
      eyebrow: "ماكينات قهوة محمولة فاخرة",
      title: "إسبريسو محمول. أينما ذهبت.",
      lead:
        "ماكينات قهوة محمولة فاخرة مصممة للأنشطة الخارجية والسفر وروتين القهوة اليومي.",
      support:
        "للموزعين وبرامج الهدايا والعلامات الخاصة: اختر طرازاً موثقاً، وحدد الحزمة، ثم انتقل نحو الإنتاج مع شريك صناعي متخصص.",
      primaryCta: "طلب عرض سعر",
      secondaryCta: "تواصل عبر واتساب",
      tertiaryCta: "تحميل الكتالوج",
    },
    signals: ["مباشر من المصنع", "OEM / ODM", "تخطيط حسب المشروع", "مطابقة أوروبا", "تغليف مخصص", "دعم متعدد اللغات"],
    sectionTitles: {
      products: "المنتجات المميزة",
      oem: "برنامج OEM / ODM",
      factory: "قوة المصنع",
      certs: "ملف الشهادات",
      blog: "أدلة للمشترين",
      faq: "الأسئلة الشائعة",
      contact: "ابدأ عرض السعر",
      about: "عن TK Classic",
      accessories: "ملحقات",
    },
    intro:
      "مناسب لفرق الشراء الأوروبية التي تحتاج مورداً للقهوة المحمولة بسرعة استجابة عالية ومرونة في العلامة الخاصة.",
    about: [
      "تأسست Daqian Classic (Shenzhen) Industrial Co., Ltd. عام 2016 في شنتشن وتركز على البحث والتطوير وخدمة المشاريع بشكل مباشر.",
      "TK Classic هو الاسم التجاري في السوق. وتشمل المجموعة ماكينات إسبرسو محمولة، مخفقات، سخانات، محولات، حوامل وحقائب.",
      "فريقنا يدعم المشتريات بالإنجليزية والإسبانية والبرتغالية والفرنسية والعربية والصينية والروسية.",
    ],
    factory: [
      "توريد مباشر من المصنع للموزعين والعلامات الخاصة وبرامج الهدايا.",
      "تدعم برامج OEM تخصيص الشعار والتغليف.",
      "تتيح برامج ODM تطويراً مميزاً للمنتج.",
      "شحن Type-C ومنصات بطارية ليثيوم وتصميم مدمج مناسب للرفوف.",
    ],
    oem: [
      "تخصيص الشعار: حفر ليزر، طباعة سلك سكرين، طباعة UV، ونقل مائي.",
      "التغليف: علب هدايا مخصصة وتنسيق ألوان وتغليف خارجي.",
      "العملية: ملخص، عينة، مراجعة العمل الفني، الإنتاج، ثم التغليف للتصدير.",
      "يتم تأكيد الكمية وشكل التغليف بعد مراجعة ملخص المشروع.",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA لدعم دخول السوق.",
      "تقارير LFGB وFDA للأجزاء الملامسة للطعام.",
      "نظام الجودة ISO 9001.",
      "إقرار المطابقة الأوروبي وتقارير التصدير متاحة عند الطلب.",
    ],
    blogLead:
      "أدلة شراء عملية مبنية على بيانات المنتجات المنشورة وخطوات اعتماد OEM وقرارات التغليف ووثائق المطابقة الخاصة بكل طراز.",
    faq: [
      {
        q: "كيف يتم تحديد كمية الطلب؟",
        a: "نؤكد الكمية المناسبة وشكل التغليف بعد مراجعة الطراز والسوق ومتطلبات العلامة التجارية.",
      },
      {
        q: "هل تدعمون الشعار والتغليف المخصص؟",
        a: "نعم. ندعم الحفر بالليزر، الطباعة السلكية، UV، النقل المائي، علب الهدايا وتنسيق الألوان.",
      },
      {
        q: "ما هي الشهادات المتوفرة؟",
        a: "تتضمن المجموعة CE وRoHS وFCC وUKCA وLFGB وFDA وISO 9001 وإقرار المطابقة الأوروبي.",
      },
      {
        q: "هل تدعمون أكثر من لغة؟",
        a: "نعم. الموقع ونموذج الاستفسار جاهزان للإنجليزية والإسبانية والبرتغالية والفرنسية والعربية والصينية والروسية.",
      },
    ],
    contactTitle: "ابدأ عرض السعر",
    contactLead:
      "أرسل الطراز المطلوب والكمية وسوق الوجهة واحتياجات العلامة. سنرد بخيار مناسب وسريع.",
    form: {
      name: "الاسم",
      email: "البريد",
      company: "الشركة",
      product: "المنتج المطلوب",
      message: "الرسالة",
      submit: "جهز البريد",
      whatsapp: "واتساب",
      emailUs: "راسلنا",
    },
    labels: {
      model: "الطراز",
      capacity: "السعة",
      pressure: "الضغط",
      material: "المادة",
      battery: "البطارية",
      charging: "الشحن",
      heat: "التسخين",
      cup: "سعة الكوب",
      size: "الحجم",
      adapter: "المحولات",
      life: "عدد الأكواب",
      scene: "مناسب لـ",
      feature: "الميزات الرئيسية",
      download: "تحميل PDF",
      fullSpec: "المواصفات",
      related: "منتجات مرتبطة",
      support: "الدعم التجاري",
      selected: "ملاءمة السوق",
    },
  },
  zh: {
    title: "TK Classic | 便携式咖啡机 OEM/ODM 与私牌解决方案",
    description:
      "面向欧洲批发商、私牌品牌和 OEM/ODM 项目的工厂直供便携式咖啡机、打奶器、保温器和配件。",
    nav: {
      home: "首页",
      products: "产品",
      oem: "OEM/ODM",
      about: "关于我们",
      factory: "工厂实力",
      certs: "认证资料",
      blog: "采购指南",
      faq: "FAQ",
      contact: "联系我们",
    },
    hero: {
      eyebrow: "高端便携咖啡机",
      title: "便携意式咖啡，随行随享。",
      lead:
        "专为户外、旅行和日常咖啡场景设计的高端便携咖啡机。",
      support: "面向批发商、礼品采购和私牌品牌：选择已核实型号、组合配套，并由同一个专业工厂伙伴协同推进生产。",
      primaryCta: "获取报价",
      secondaryCta: "WhatsApp 咨询",
      tertiaryCta: "下载画册",
    },
    signals: ["工厂直供", "OEM / ODM", "按项目规划订单", "欧洲合规", "定制包装", "多语言支持"],
    sectionTitles: {
      products: "主推产品",
      oem: "OEM / ODM 方案",
      factory: "工厂实力",
      certs: "认证资料",
      blog: "采购指南内容中心",
      faq: "常见问题",
      contact: "开始询盘",
      about: "关于 TK Classic",
      accessories: "咖啡配件",
    },
    intro:
      "面向欧洲采购团队，提供响应快、产品深、支持私牌定制的便携咖啡供应能力。",
    about: [
      "公司成立于 2016 年，深圳大千经典实业有限公司专注便携咖啡设备研发和一对一项目服务。",
      "市场端品牌使用 TK Classic，产品覆盖便携式咖啡机、打奶器、保温器、转接器、支架和收纳包。",
      "支持英语、西班牙语、葡萄牙语、法语、阿拉伯语、中文和俄语的采购沟通。",
    ],
    factory: [
      "工厂直供，服务批发商、私牌品牌和礼品项目。",
      "OEM 支持 Logo 与包装定制方案。",
      "ODM 支持产品差异化开发方案。",
      "Type-C 充电、锂电平台和适合零售上架的紧凑结构。",
    ],
    oem: [
      "Logo 定制：激光雕刻、丝印、UV 印刷、水转印。",
      "包装支持：礼盒定制、颜色匹配和外包装设计。",
      "流程：需求确认、打样、稿件审核、量产和出口包装。",
      "具体订单量和包装形式，会在确认项目需求后沟通。",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA 等市场准入资料。",
      "LFGB、FDA 食品接触材料报告。",
      "ISO 9001 质量体系文件。",
      "EU DoC 及出口相关资料可按需提供。",
    ],
    blogLead:
      "基于已发布产品参数、OEM 审批节点、包装决策和型号对应合规资料编写的实用采购指南。",
    faq: [
      {
        q: "订单数量如何规划？",
        a: "我们会结合型号、销售市场和品牌需求，确认合适的订单量与包装形式。",
      },
      {
        q: "可以做 Logo 和包装定制吗？",
        a: "可以。支持激光雕刻、丝印、UV、水转印、礼盒定制和颜色匹配。",
      },
      {
        q: "有哪些认证资料？",
        a: "文件包含 CE、RoHS、FCC、UKCA、LFGB、FDA、ISO 9001 和 EU DoC。",
      },
      {
        q: "支持多语言沟通吗？",
        a: "支持。站点和询盘流程覆盖英语、西语、葡语、法语、阿语、中文和俄语。",
      },
    ],
    contactTitle: "开始报价",
    contactLead:
      "请发送目标型号、数量、销售市场和品牌需求，我们会尽快给出匹配方案。",
    form: {
      name: "姓名",
      email: "邮箱",
      company: "公司",
      product: "意向产品",
      message: "留言",
      submit: "生成询盘邮件",
      whatsapp: "WhatsApp",
      emailUs: "邮件联系",
    },
    labels: {
      model: "型号",
      capacity: "容量",
      pressure: "压力",
      material: "材质",
      battery: "电池",
      charging: "充电",
      heat: "加热",
      cup: "杯量",
      size: "尺寸",
      adapter: "转接器",
      life: "杯数",
      scene: "适用场景",
      feature: "核心特点",
      download: "下载 PDF",
      fullSpec: "完整参数",
      related: "相关产品",
      support: "销售支持",
      selected: "市场匹配",
    },
  },
  ru: {
    title: "TK Classic | Портативные кофемашины для OEM/ODM и private label",
    description:
      "Портативные эспрессо-машины, капучинаторы, подогреватели и аксессуары с фабрики для европейских оптовиков, private label и OEM/ODM проектов.",
    nav: {
      home: "Главная",
      products: "Продукты",
      oem: "OEM и ODM",
      about: "О нас",
      factory: "Фабрика",
      certs: "Сертификаты",
      blog: "Гиды",
      faq: "FAQ",
      contact: "Контакты",
    },
    hero: {
      eyebrow: "Премиальные портативные кофемашины",
      title: "Портативный эспрессо. Куда бы вы ни отправились.",
      lead:
        "Премиальные портативные кофемашины для отдыха на природе, путешествий и ежедневных кофейных привычек.",
      support:
        "Для оптовиков, подарочных программ и private label: выберите проверенную модель, настройте комплект и переходите к производству с одним специализированным партнёром.",
      primaryCta: "Запросить цену",
      secondaryCta: "Связаться в WhatsApp",
      tertiaryCta: "Скачать каталог",
    },
    signals: ["Фабричная цена", "OEM / ODM", "Планирование по проекту", "Соответствие Европе", "Индивидуальная упаковка", "Многоязычная поддержка"],
    sectionTitles: {
      products: "Популярные продукты",
      oem: "Программа OEM / ODM",
      factory: "Сила фабрики",
      certs: "Пакет сертификатов",
      blog: "Руководства для покупателей",
      faq: "FAQ",
      contact: "Получить предложение",
      about: "О TK Classic",
      accessories: "Аксессуары",
    },
    intro:
      "Для европейских закупщиков, которым нужен поставщик портативного кофе с быстрым откликом и гибкостью private label.",
    about: [
      "Компания Daqian Classic (Shenzhen) Industrial Co., Ltd. основана в 2016 году в Шэньчжэне и специализируется на R&D портативного кофейного оборудования.",
      "TK Classic — торговое имя бренда. Линейка включает портативные эспрессо-машины, капучинаторы, подогреватели, адаптеры, стойки и сумки.",
      "Команда поддерживает запросы на английском, испанском, португальском, французском, арабском, китайском и русском языках.",
    ],
    factory: [
      "Прямые фабричные поставки для оптовиков, private label и подарочных программ.",
      "Программы OEM поддерживают нанесение логотипа и индивидуальную упаковку.",
      "Программы ODM позволяют разработать отличающуюся версию продукта.",
      "Type-C зарядка, литиевые батареи и компактный формат для retail-полки.",
    ],
    oem: [
      "Логотип: лазерная гравировка, шелкография, UV-печать, водная деколь.",
      "Упаковка: индивидуальные подарочные коробки, подбор цвета и дизайн внешней упаковки.",
      "Процесс: бриф, образец, согласование макета, массовое производство и экспортная упаковка.",
      "Количество и формат упаковки подтверждаются после обсуждения проекта.",
    ],
    certs: [
      "CE / RoHS / FCC / UKCA для доступа на рынок.",
      "Отчёты LFGB и FDA для пищевого контакта.",
      "Система качества ISO 9001.",
      "EU Declaration of Conformity и экспортные отчёты доступны по запросу.",
    ],
    blogLead:
      "Практические руководства по закупке на основе опубликованных данных о продукции, этапов согласования OEM, решений по упаковке и документов соответствия для конкретных моделей.",
    faq: [
      {
        q: "Как планируется объём заказа?",
        a: "Мы подтверждаем подходящий объём и формат упаковки после обсуждения модели, рынка и требований к бренду.",
      },
      {
        q: "Можно ли сделать логотип и упаковку?",
        a: "Да. Поддерживаем лазерную гравировку, шелкографию, UV-печать, водную деколь, подарочные коробки и подбор цвета.",
      },
      {
        q: "Какие сертификаты есть?",
        a: "Пакет включает CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 и EU DoC.",
      },
      {
        q: "Поддерживаете несколько языков?",
        a: "Да. Сайт и форма запроса готовы для английского, испанского, португальского, французского, арабского, китайского и русского.",
      },
    ],
    contactTitle: "Начать расчёт",
    contactLead:
      "Отправьте модель, объём, рынок и требования к брендингу. Мы дадим подходящее предложение.",
    form: {
      name: "Имя",
      email: "Email",
      company: "Компания",
      product: "Интересующий продукт",
      message: "Сообщение",
      submit: "Подготовить письмо",
      whatsapp: "WhatsApp",
      emailUs: "Написать на email",
    },
    labels: {
      model: "Модель",
      capacity: "Ёмкость",
      pressure: "Давление",
      material: "Материал",
      battery: "Аккумулятор",
      charging: "Зарядка",
      heat: "Нагрев",
      cup: "Объём чашки",
      size: "Размер",
      adapter: "Адаптеры",
      life: "Чашек",
      scene: "Лучше всего для",
      feature: "Ключевые особенности",
      download: "Скачать PDF",
      fullSpec: "Полные характеристики",
      related: "Связанные продукты",
      support: "Поддержка продаж",
      selected: "Соответствие рынку",
    },
  },
};

export type Product = {
  slug: string;
  model: string;
  summary: Record<Lang, string>;
  hero: string;
  gallery: string[];
  featureLabel: string;
  price: ProductPrice;
  spec: Record<string, string>;
  highlight: string[];
  useCases: string[];
};

export type ProductPrice = {
  regular: number;
  sale: number;
  currency: "USD";
};

export const products: Product[] = [
  {
    slug: "dq-001",
    model: "DQ-001",
    summary: {
      en: "25 bar BrewHandy portable espresso machine with capsule and ground-coffee adapters.",
      es: "Cafetera espresso portátil BrewHandy de 25 bar con adaptadores para cápsulas y café molido.",
      pt: "Máquina espresso portátil BrewHandy de 25 bar com adaptadores para cápsulas e café moído.",
      fr: "Machine espresso portable BrewHandy 25 bars avec adaptateurs pour capsules et café moulu.",
      ar: "ماكينة إسبريسو محمولة BrewHandy بضغط 25 بار مع محولين للكبسولات والقهوة المطحونة.",
      zh: "BrewHandy 25 巴便携式意式咖啡机，配有胶囊和咖啡粉适配器。",
      ru: "Портативная эспрессо-машина BrewHandy на 25 бар с адаптерами для капсул и молотого кофе.",
    },
    hero: "/optimized/hero-products/dq-001.webp",
    gallery: [
      "/optimized/hero-products/dq-001.webp",
      "/optimized/product-scenes/dq-001-1.webp",
      "/optimized/product-scenes/dq-001-2.webp",
      "/products/dq-001/detail.png",
    ],
    featureLabel: "Portable flagship",
    price: { regular: 39, sale: 25, currency: "USD" },
    spec: {
      model: "DQ-001",
      cup: "300 mL",
      capacity: "60-80 mL water tank",
      pressure: "25 bar",
      battery: "9600mAh / 30Wh",
      material: "ABS + PP + PS",
      charging: "About 180 minutes, USB Type-C",
      heat: "Cold-water cycle heats to 96°C",
      size: "77 × 77 × 268 mm",
      adapter: "Capsule adapter + ground-coffee adapter",
    },
    highlight: [
      "Best for private label retail launches",
      "Works as a core product for gift programs",
      "Deep accessory compatibility",
    ],
    useCases: ["Retail shelf", "Cross-border ecommerce", "Gift set", "Private label"],
  },
  {
    slug: "dq-002",
    model: "DQ-002",
    summary: {
      en: "2-in-1 capsule and ground coffee model with 9600mAh battery and fast heating.",
      es: "Modelo 2 en 1 para cápsulas y café molido con batería de 9600mAh y calentamiento rápido.",
      pt: "Modelo 2 em 1 para cápsulas e café moído com bateria de 9600mAh e aquecimento rápido.",
      fr: "Modèle 2-en-1 pour capsules et café moulu avec batterie 9600mAh et chauffe rapide.",
      ar: "طراز 2 في 1 للكبسولات والقهوة المطحونة مع بطارية 9600mAh وتسخين سريع.",
      zh: "2 合 1 胶囊 + 咖啡粉型号，配 9600mAh 电池和快速加热。",
      ru: "Модель 2-в-1 для капсул и молотого кофе с батареей 9600mAh и быстрым нагревом.",
    },
    hero: "/optimized/hero-products/dq-002.webp",
    gallery: [
      "/optimized/hero-products/dq-002.webp",
      "/optimized/product-scenes/dq-002-1.webp",
      "/optimized/product-scenes/dq-002-2.webp",
      "/products/dq-002/2in1.jpg",
      "/products/dq-002/battery.jpg",
      "/products/dq-002/heat.jpg",
      "/products/dq-002/oem.jpg",
    ],
    featureLabel: "Wholesale hero",
    price: { regular: 44, sale: 26, currency: "USD" },
    spec: {
      model: "DQ-002",
      cup: "Single-cup portable format",
      capacity: "2-in-1 capsule + ground",
      pressure: "25 bar extraction platform",
      battery: "9600mAh",
      material: "ABS + PP + stainless steel",
      charging: "Type-C fast charging",
      heat: "Fast heat to 92°C",
      size: "Compact handheld format",
      life: "Designed for portable retail and gifting programs",
      adapter: "Custom colors / logo / packaging",
    },
    highlight: [
      "Strong hero imagery for wholesale pages",
      "Fits retail gifting and cross-border programs",
      "Easy to localize for OEM launch pages",
    ],
    useCases: ["Wholesale", "Gift set", "Retail launch", "OEM branding"],
  },
  {
    slug: "dq-005",
    model: "DQ-005",
    summary: {
      en: "25 bar portable coffee machine for N-series capsules, Dolce Gusto capsules and ground coffee.",
      es: "Cafetera portátil de 25 bar para cápsulas N-series, cápsulas Dolce Gusto y café molido.",
      pt: "Máquina de café portátil de 25 bar para cápsulas N-series, cápsulas Dolce Gusto e café moído.",
      fr: "Machine à café portable 25 bars pour capsules N-series, capsules Dolce Gusto et café moulu.",
      ar: "ماكينة قهوة محمولة بضغط 25 بار لكبسولات N-series وDolce Gusto والقهوة المطحونة.",
      zh: "25 巴便携式咖啡机，支持 N-series 胶囊、Dolce Gusto 胶囊和咖啡粉。",
      ru: "Портативная кофемашина на 25 бар для капсул N-series, Dolce Gusto и молотого кофе.",
    },
    hero: "/optimized/hero-products/dq-005.webp",
    gallery: [
      "/optimized/hero-products/dq-005.webp",
      "/optimized/product-scenes/dq-005-1.webp",
      "/optimized/product-scenes/dq-005-2.webp",
      "/products/dq-005/black.jpg",
      "/products/dq-005/white.jpg",
    ],
    featureLabel: "Multi-format model",
    price: { regular: 48, sale: 29, currency: "USD" },
    spec: {
      model: "DQ-005",
      cup: "300 mL",
      capacity: "50-100 mL water tank",
      pressure: "25 bar",
      battery: "9600mAh",
      material: "ABS + PP + stainless steel",
      charging: "About 4 hours, 5V / 3A",
      heat: "Cold-water cycle heats to 96°C",
      size: "77 × 77 × 268 mm",
      adapter: "N-series + Dolce Gusto + ground coffee",
    },
    highlight: [
      "Balanced size for shelf and gift-box programs",
      "Black and white versions in stock",
      "Three coffee formats documented in the revised manual",
    ],
    useCases: ["Retail shelf", "Gift box", "Travel use", "Private label"],
  },
  {
    slug: "dq-008",
    model: "DQ-008",
    summary: {
      en: "Double-cup portable coffee maker for shared use and stronger retail shelf impact.",
      es: "Cafetera portátil de doble taza para uso compartido y mayor impacto en el lineal.",
      pt: "Máquina de café portátil de copo duplo para uso compartilhado e maior presença na prateleira.",
      fr: "Machine à café portable double tasse pour un usage partagé et un meilleur impact en rayon.",
      ar: "ماكينة قهوة محمولة مزدوجة الكوب للاستخدام المشترك وحضور أقوى على الرف.",
      zh: "双杯便携咖啡机，适合共享使用并提升零售陈列表现。",
      ru: "Портативная кофемашина с двойной чашкой для совместного использования и яркой выкладки.",
    },
    hero: "/optimized/hero-products/dq-008.webp",
    gallery: [
      "/optimized/hero-products/dq-008.webp",
      "/optimized/product-scenes/dq-008-1.webp",
      "/optimized/product-scenes/dq-008-2.webp",
      "/products/dq-008/hero.jpg",
    ],
    featureLabel: "Double-cup design",
    price: { regular: 48, sale: 29, currency: "USD" },
    spec: {
      model: "DQ-008",
      cup: "250 mL per cup, double-cup design",
      capacity: "50-100 mL water tank",
      pressure: "25 bar",
      battery: "9600mAh / 7800mAh",
      material: "ABS + PP + silicone + stainless steel",
      charging: "4 hours, Type-C",
      heat: "3-4 minutes",
      size: "7 × 7 × 23.6 cm",
      life: "3 heated cups / 500+ direct extraction cups",
      adapter: "Nespresso pod adapter, ground coffee chamber",
    },
    highlight: [
      "Good fit for shared-use demos",
      "Strong on-shelf visibility",
      "Lightweight retail format",
    ],
    useCases: ["Retail shelf", "Shared use", "Promo gift", "Marketplace"],
  },
  {
    slug: "dq-010",
    model: "DQ-010",
    summary: {
      en: "Premium LCD portable coffee maker with a 325 mL cup for N-series capsules, Dolce Gusto capsules, ground coffee and the documented portable drip-cup format.",
      es: "Cafetera portátil premium con pantalla LCD y taza de 325 mL para cápsulas N-series, Dolce Gusto, café molido y el formato de goteo portátil documentado.",
      pt: "Cafeteira portátil premium com tela LCD e copo de 325 mL para cápsulas N-series, Dolce Gusto, café moído e o formato de gotejamento portátil documentado.",
      fr: "Cafetière portable premium avec écran LCD et tasse de 325 mL pour capsules N-series, Dolce Gusto, café moulu et format filtre portable documenté.",
      ar: "ماكينة قهوة محمولة فاخرة بشاشة LCD وكوب سعة 325 مل لكبسولات N-series وDolce Gusto والقهوة المطحونة وطريقة التقطير المحمولة الموثقة.",
      zh: "高端 LCD 便携式咖啡机，配备 325mL 杯，支持 N-series 胶囊、Dolce Gusto 胶囊、咖啡粉及说明书列明的便携滴滤杯模式。",
      ru: "Премиальная портативная кофемашина с LCD-дисплеем и чашкой 325 мл для капсул N-series, Dolce Gusto, молотого кофе и документированного портативного фильтр-формата.",
    },
    hero: "/optimized/hero-products/dq-010.webp",
    gallery: [
      "/optimized/hero-products/dq-010.webp",
      "/optimized/product-scenes/dq-010-1.webp",
      "/optimized/product-scenes/dq-010-2.webp",
      "/products/dq-010/hero.jpg",
      "/products/dq-010/white.jpg",
    ],
    featureLabel: "Premium LCD multi-format model",
    price: { regular: 79, sale: 36, currency: "USD" },
    spec: {
      model: "DQ-010",
      cup: "325 mL",
      capacity: "100 mL maximum water tank",
      pressure: "25 bar",
      battery: "9600mAh",
      charging: "About 2 hours, USB Type-C",
      heat: "About 3 min 30 sec heating; 46 sec extraction",
      size: "85 × 85 × 280 mm",
      adapter: "N-series + Dolce Gusto + ground coffee; portable drip cup documented",
    },
    highlight: [
      "Designed for premium private label and retail programs",
      "Good fit for office and travel coffee routines",
      "LCD shows temperature, battery level and extraction mode",
    ],
    useCases: ["Office coffee", "Travel", "Private label", "Retail bundle"],
  },
  {
    slug: "dq-011",
    model: "DQ-011",
    summary: {
      en: "285 mL portable espresso maker designed for premium gift sets and private label programs.",
      es: "Máquina espresso portátil de 285 mL pensada para gift sets premium y marcas propias.",
      pt: "Máquina espresso portátil de 285 mL pensada para gift sets premium e marcas próprias.",
      fr: "Machine espresso portable 285 mL conçue pour les coffrets premium et les marques propres.",
      ar: "ماكينة إسبريسو محمولة بسعة 285 مل مصممة للهدايا الفاخرة وبرامج العلامات الخاصة.",
      zh: "285mL 便携式意式咖啡机，适合高端礼盒和私牌项目。",
      ru: "Портативная эспрессо-машина на 285 мл для премиальных подарочных наборов и private label.",
    },
    hero: "/optimized/hero-products/dq-011.webp",
    gallery: [
      "/optimized/hero-products/dq-011.webp",
      "/optimized/product-scenes/dq-011-1.webp",
      "/optimized/product-scenes/dq-011-2.webp",
      "/products/dq-011/hero.jpg",
      "/products/dq-011/detail.jpg",
    ],
    featureLabel: "Premium gifting format",
    price: { regular: 70, sale: 34, currency: "USD" },
    spec: {
      model: "DQ-011",
      cup: "285 mL",
      capacity: "50-100 mL water tank",
      pressure: "25 bar",
      battery: "9600mAh",
      material: "ABS + PP + stainless steel",
      charging: "2 hours, Type-C",
      heat: "3-3.5 minutes",
      size: "7.7 × 7.7 × 25.1 cm",
      life: "5 heated cups / 500+ direct extraction cups",
      adapter: "Nespresso pod adapter, ground coffee chamber",
    },
    highlight: [
      "A polished gift-friendly silhouette",
      "Premium look for branded bundles",
      "Good companion to private label launches",
    ],
    useCases: ["Gift set", "Retail shelf", "Brand launch", "Premium wholesale"],
  },
];

export const accessories = [
  {
    name: "DQ-010C American Drip Portable Cup",
    summary:
      "Accessory cup for the DQ-010 platform, with connector and American drip filter.",
  },
  {
    name: "DG Capsule Adapter",
    summary:
      "Compatible with DQ-001, DQ-005, DQ-010 and DQ-011 for capsule-based programs.",
  },
  {
    name: "DQ-010B Drip Coffee Filter",
    summary:
      "Food-grade PP + 304 stainless steel filter for drip use on DQ-005, DQ-010 and DQ-011.",
  },
  {
    name: "Foldable Coffee Machine Stand",
    summary:
      "Acrylic or iron-stainless stand for a cleaner retail display and easier use.",
  },
  {
    name: "Oxford Cloth Handle Bag",
    summary:
      "Carry bag for portable coffee machines, gift-ready and retail-friendly.",
  },
  {
    name: "EVA Handle Bag",
    summary: "Protective bag for travel sets and premium gift bundles.",
  },
];

export const certifications = [
  {
    name: "CE / RoHS",
  },
  {
    name: "FCC / VOC",
  },
  {
    name: "UKCA EMC",
  },
  {
    name: "LFGB",
  },
  {
    name: "FDA",
  },
  {
    name: "ISO 9001",
  },
  {
    name: "EU DoC",
  },
];
