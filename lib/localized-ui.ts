import type { Lang } from "@/lib/site-data";

type MarketCard = [string, string];
type SceneCard = [string, string, string];
type BlogCard = [string, string];

export const uiCopy: Record<
  Lang,
  {
    proof: {
      extraction: string;
      years: string;
      markets: string;
      compliance: string;
    };
    marquee: string[];
    market: {
      eyebrow: string;
      title: string;
      lead: string;
      cards: MarketCard[];
    };
    scenes: {
      eyebrow: string;
      title: string;
      lead: string;
      cards: SceneCard[];
    };
    blog: {
      cardPrefix: string;
      cards: BlogCard[];
    };
    form: {
      ariaLabel: string;
      helper: string;
      phone: string;
      country: string;
      quantity: string;
      branding: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
      companyPlaceholder: string;
      countryPlaceholder: string;
      quantityPlaceholder: string;
      brandingPlaceholder: string;
      messagePlaceholder: string;
    };
  }
> = {
  en: {
    proof: {
      extraction: "Extraction platform",
      years: "Years OEM",
      markets: "Markets served",
      compliance: "Compliance set",
    },
    marquee: [
      "25 bar extraction",
      "Project-based quotations",
      "OEM / ODM pathways",
      "EU compliance files",
      "Gift-ready packaging",
      "Portable espresso systems",
      "Factory-direct supply",
      "Multilingual support",
    ],
    market: {
      eyebrow: "European buyer fit",
      title: "Built for retail-ready sourcing teams.",
      lead:
        "A focused product line for distributors, ecommerce brands, gift programs, and private label buyers that need premium presentation with factory-direct execution.",
      cards: [
        ["European wholesalers", "Portable espresso models, compliance files, and repeatable order planning for distribution programs."],
        ["Cross-border brands", "Compact hero products with strong imagery, accessory bundles, and fast quote cycles for marketplace launches."],
        ["Gift procurement", "Gift-ready silhouettes, packaging support, carry bags, and retail bundles for seasonal programs."],
        ["OEM / ODM private label", "Logo, color, packaging and differentiated product development from sample confirmation to export packing."],
      ],
    },
    scenes: {
      eyebrow: "Wholesale launch scenes",
      title: "Designed to look premium before the first sip.",
      lead:
        "Inspired by modern direct-to-consumer coffee brands, but structured for B2B buyers who need product confidence, visual appeal and repeatable export execution.",
      cards: [
        ["Retail shelf launch", "Hero models with clean silhouettes, certification files and packaging options for European shelf-ready programs.", "DQ-001 / DQ-010"],
        ["Gift set programs", "Portable machines, bags, adapters and branded boxes for seasonal corporate gifting and premium procurement.", "Gift-ready bundles"],
        ["Marketplace visuals", "Compact product formats with clear spec stories for Amazon, Shopify and cross-border ecommerce landing pages.", "Content-ready SKUs"],
      ],
    },
    blog: {
      cardPrefix: "Buyer guide",
      cards: [
        ["How to source portable espresso machines for European private label programs", "Buyer-focused content built around compliance, packaging, performance and retail shelf planning."],
        ["25 bar portable coffee machines: what wholesalers should verify before ordering", "A practical checklist for pressure, battery, adapters, documents and repeat supply readiness."],
        ["OEM packaging checklist for portable coffee gift sets in Europe", "Packaging and branding notes for retail bundles, gift boxes and seasonal procurement programs."],
      ],
    },
    form: {
      ariaLabel: "TK Classic inquiry form",
      helper:
        "Share your model, quantity, target market and branding needs. The TK Classic sales team will receive your inquiry and keep it in our lead record.",
      phone: "WhatsApp / Phone",
      country: "Country / Market",
      quantity: "Estimated quantity",
      branding: "Branding / packaging needs",
      submit: "Submit inquiry",
      submitting: "Submitting...",
      success: "Inquiry received. TK Classic will reply soon.",
      error: "Unable to submit right now. Please try WhatsApp or email.",
      companyPlaceholder: "Wholesale company / brand",
      countryPlaceholder: "Germany / France / EU / UK",
      quantityPlaceholder: "500 / 1,000 / 2,000 pcs",
      brandingPlaceholder: "Logo, gift box, private label color, retail bundle...",
      messagePlaceholder: "Target market, quantity, logo/package needs, and expected timeline.",
    },
  },
  es: {
    proof: { extraction: "Plataforma de extracción", years: "Años de experiencia OEM", markets: "Mercados atendidos", compliance: "Documentación de conformidad" },
    marquee: ["Extracción 25 bar", "Cotizaciones por proyecto", "Programas OEM / ODM", "Archivos de conformidad UE", "Packaging listo para regalo", "Sistemas espresso portátiles", "Suministro directo de fábrica", "Soporte multilingüe"],
    market: {
      eyebrow: "Para compradores europeos",
      title: "Preparado para equipos de sourcing retail.",
      lead: "Una línea pensada para distribuidores, marcas de comercio electrónico, programas de regalo y compradores de marca propia que buscan una presentación cuidada y ejecución directa de fábrica.",
      cards: [
        ["Mayoristas europeos", "Modelos espresso portátiles, archivos de conformidad y planificación de pedidos para distribución."],
        ["Marcas de comercio transfronterizo", "Productos principales compactos, imágenes potentes, conjuntos de accesorios y ciclos rápidos de cotización."],
        ["Compras de regalos", "Formatos listos para regalo, opciones de embalaje, bolsas y conjuntos para campañas estacionales."],
        ["Private label OEM / ODM", "Logo, color, packaging y desarrollo diferenciado desde muestra hasta embalaje de exportación."],
      ],
    },
    scenes: {
      eyebrow: "Escenarios de lanzamiento wholesale",
      title: "Diseñado para verse premium antes del primer sorbo.",
      lead: "Inspirado en marcas modernas de café DTC, pero estructurado para compradores B2B que necesitan confianza de producto, atractivo visual y ejecución exportable.",
      cards: [
        ["Lanzamiento en retail", "Modelos hero con siluetas limpias, certificados y opciones de packaging para programas europeos.", "DQ-001 / DQ-010"],
        ["Programas de regalo", "Máquinas portátiles, bolsas, adaptadores y cajas con marca para regalos corporativos premium.", "Bundles listos para regalo"],
        ["Visuales marketplace", "Formatos compactos con historias de especificaciones claras para Amazon, Shopify y ecommerce cross-border.", "SKUs listos para contenido"],
      ],
    },
    blog: {
      cardPrefix: "Guía comprador",
      cards: [
        ["Cómo comprar máquinas espresso portátiles para private label en Europa", "Contenido para compradores sobre conformidad, packaging, rendimiento y retail."],
        ["Máquinas portátiles de 25 bar: qué verificar antes de ordenar", "Checklist de presión, batería, adaptadores, documentos y suministro repetible."],
        ["Checklist OEM de packaging para gift sets de café portátil", "Notas de packaging y marca para bundles retail, cajas regalo y compras estacionales."],
      ],
    },
    form: {
      ariaLabel: "Formulario de consulta TK Classic",
      helper: "Comparta modelo, cantidad, mercado objetivo y necesidades de marca. El equipo de ventas recibirá la consulta y la guardará en el registro de leads.",
      phone: "WhatsApp / Teléfono",
      country: "País / Mercado",
      quantity: "Cantidad estimada",
      branding: "Necesidades de marca / packaging",
      submit: "Enviar consulta",
      submitting: "Enviando...",
      success: "Consulta recibida. TK Classic responderá pronto.",
      error: "No se puede enviar ahora. Pruebe WhatsApp o email.",
      companyPlaceholder: "Empresa mayorista / marca",
      countryPlaceholder: "Alemania / Francia / UE / Reino Unido",
      quantityPlaceholder: "500 / 1.000 / 2.000 uds",
      brandingPlaceholder: "Logo, caja regalo, color private label, bundle retail...",
      messagePlaceholder: "Mercado objetivo, cantidad, logo/packaging y calendario esperado.",
    },
  },
  pt: {
    proof: { extraction: "Plataforma de extração", years: "Anos de experiência OEM", markets: "Mercados atendidos", compliance: "Documentação de conformidade" },
    marquee: ["Extração 25 bar", "Cotações por projeto", "Programas OEM / ODM", "Arquivos de conformidade UE", "Embalagem pronta para presente", "Sistemas espresso portáteis", "Fornecimento direto da fábrica", "Suporte multilíngue"],
    market: {
      eyebrow: "Adequado para compradores europeus",
      title: "Feito para equipes de sourcing prontas para o varejo.",
      lead: "Linha voltada a distribuidores, marcas de comércio eletrônico, programas de brindes e compradores de marca própria que buscam apresentação premium e execução direta da fábrica.",
      cards: [
        ["Atacadistas europeus", "Modelos espresso portáteis, arquivos de conformidade e planejamento de pedidos para distribuição."],
        ["Marcas de comércio internacional", "Produtos principais compactos, imagens fortes, conjuntos de acessórios e cotações rápidas."],
        ["Compras de brindes", "Formatos prontos para presente, suporte de embalagem, bolsas e conjuntos para varejo."],
        ["Private label OEM / ODM", "Logo, cor, embalagem e desenvolvimento diferenciado da amostra à exportação."],
      ],
    },
    scenes: {
      eyebrow: "Cenas de lançamento wholesale",
      title: "Feito para parecer premium antes do primeiro gole.",
      lead: "Inspirado em marcas modernas de café DTC, mas estruturado para compradores B2B que precisam de confiança, visual forte e execução exportável.",
      cards: [
        ["Lançamento no varejo", "Modelos hero com silhuetas limpas, certificados e opções de embalagem para a Europa.", "DQ-001 / DQ-010"],
        ["Programas de brindes", "Máquinas portáteis, bolsas, adaptadores e caixas com marca para brindes corporativos.", "Bundles prontos para presente"],
        ["Visuais marketplace", "Formatos compactos com especificações claras para Amazon, Shopify e ecommerce cross-border.", "SKUs prontos para conteúdo"],
      ],
    },
    blog: {
      cardPrefix: "Guia comprador",
      cards: [
        ["Como comprar máquinas espresso portáteis para private label na Europa", "Conteúdo para compradores sobre conformidade, embalagem, desempenho e varejo."],
        ["Máquinas portáteis de 25 bar: o que verificar antes do pedido", "Checklist de pressão, bateria, adaptadores, documentos e fornecimento repetível."],
        ["Checklist OEM de embalagem para gift sets de café portátil", "Notas de embalagem e marca para bundles, caixas presente e compras sazonais."],
      ],
    },
    form: {
      ariaLabel: "Formulário de consulta TK Classic",
      helper: "Compartilhe modelo, quantidade, mercado-alvo e necessidades de marca. A equipe comercial receberá a consulta e guardará no registro de leads.",
      phone: "WhatsApp / Telefone",
      country: "País / Mercado",
      quantity: "Quantidade estimada",
      branding: "Marca / embalagem",
      submit: "Enviar consulta",
      submitting: "Enviando...",
      success: "Consulta recebida. A TK Classic responderá em breve.",
      error: "Não foi possível enviar agora. Tente WhatsApp ou email.",
      companyPlaceholder: "Empresa atacadista / marca",
      countryPlaceholder: "Alemanha / França / UE / Reino Unido",
      quantityPlaceholder: "500 / 1.000 / 2.000 un.",
      brandingPlaceholder: "Logo, caixa presente, cor private label, bundle de varejo...",
      messagePlaceholder: "Mercado-alvo, quantidade, logo/embalagem e prazo esperado.",
    },
  },
  fr: {
    proof: { extraction: "Plateforme d'extraction", years: "Années d'expérience OEM", markets: "Marchés desservis", compliance: "Dossiers de conformité" },
    marquee: ["Extraction 25 bars", "Devis par projet", "Programmes OEM / ODM", "Dossiers conformité UE", "Packaging prêt cadeau", "Systèmes espresso portables", "Approvisionnement usine", "Support multilingue"],
    market: {
      eyebrow: "Adapté aux acheteurs européens",
      title: "Pensé pour les équipes sourcing retail.",
      lead: "Une gamme destinée aux distributeurs, aux marques de commerce en ligne, aux programmes cadeaux et aux acheteurs de marque propre recherchant une présentation soignée et une exécution directe usine.",
      cards: [
        ["Grossistes européens", "Modèles espresso portables, dossiers de conformité et planification des commandes pour la distribution."],
        ["Marques transfrontalières", "Produits phares compacts, visuels forts, ensembles d’accessoires et cycles de devis rapides."],
        ["Achats cadeaux", "Formats prêts à offrir, solutions d’emballage, sacs et ensembles pour programmes saisonniers."],
        ["Private label OEM / ODM", "Logo, couleur, packaging et développement différencié de l'échantillon à l'export."],
      ],
    },
    scenes: {
      eyebrow: "Scénarios de lancement wholesale",
      title: "Un rendu premium avant même la première tasse.",
      lead: "Inspiré des marques café DTC modernes, mais structuré pour les acheteurs B2B qui veulent confiance produit, impact visuel et exécution export.",
      cards: [
        ["Lancement retail", "Modèles hero aux lignes propres, certificats et options packaging pour programmes européens.", "DQ-001 / DQ-010"],
        ["Programmes cadeaux", "Machines portables, sacs, adaptateurs et boîtes brandées pour cadeaux d'entreprise premium.", "Bundles prêts cadeau"],
        ["Visuels marketplace", "Formats compacts avec specs claires pour Amazon, Shopify et ecommerce cross-border.", "SKUs prêts contenu"],
      ],
    },
    blog: {
      cardPrefix: "Guide acheteur",
      cards: [
        ["Comment sourcer des machines espresso portables pour private label en Europe", "Contenu orienté acheteurs : conformité, packaging, performance et retail."],
        ["Machines portables 25 bars : points à vérifier avant commande", "Checklist pression, batterie, adaptateurs, documents et capacité de réassort."],
        ["Checklist packaging OEM pour coffrets café portables", "Notes packaging et branding pour bundles retail, coffrets cadeau et achats saisonniers."],
      ],
    },
    form: {
      ariaLabel: "Formulaire de demande TK Classic",
      helper: "Partagez modèle, quantité, marché cible et besoins de marque. L'équipe commerciale recevra votre demande et la gardera dans le registre leads.",
      phone: "WhatsApp / Téléphone",
      country: "Pays / Marché",
      quantity: "Quantité estimée",
      branding: "Besoins marque / packaging",
      submit: "Envoyer la demande",
      submitting: "Envoi...",
      success: "Demande reçue. TK Classic répondra bientôt.",
      error: "Impossible d'envoyer pour le moment. Essayez WhatsApp ou email.",
      companyPlaceholder: "Grossiste / marque",
      countryPlaceholder: "Allemagne / France / UE / Royaume-Uni",
      quantityPlaceholder: "500 / 1 000 / 2 000 pièces",
      brandingPlaceholder: "Logo, coffret cadeau, couleur private label, bundle retail...",
      messagePlaceholder: "Marché cible, quantité, logo/packaging et calendrier attendu.",
    },
  },
  ar: {
    proof: { extraction: "منصة الاستخلاص", years: "سنوات خبرة OEM", markets: "الأسواق التي نخدمها", compliance: "ملفات المطابقة" },
    marquee: ["استخلاص 25 بار", "عروض أسعار حسب المشروع", "برامج OEM / ODM", "ملفات مطابقة أوروبا", "تغليف جاهز للهدايا", "أنظمة إسبرسو محمولة", "توريد مباشر من المصنع", "دعم متعدد اللغات"],
    market: {
      eyebrow: "مناسب للمشترين الأوروبيين",
      title: "مصمم لفرق التوريد الجاهزة للبيع بالتجزئة.",
      lead: "خط منتجات مركز للموزعين وعلامات التجارة الإلكترونية والهدايا والعلامات الخاصة التي تحتاج عرضاً فاخراً وتنفيذاً مباشراً من المصنع.",
      cards: [
        ["موزعون أوروبيون", "نماذج إسبرسو محمولة وملفات مطابقة وتخطيط متكرر للطلبات من أجل التوزيع."],
        ["علامات التجارة العابرة للحدود", "منتجات hero مدمجة بصور قوية وحزم ملحقات ودورات عرض سعر سريعة."],
        ["مشتريات الهدايا", "تصاميم جاهزة للهدايا ودعم تغليف وحقائب وحزم للبيع بالتجزئة."],
        ["علامة خاصة OEM / ODM", "شعار، لون، تغليف وتطوير مخصص من تأكيد العينة إلى تغليف التصدير."],
      ],
    },
    scenes: {
      eyebrow: "مشاهد إطلاق الجملة",
      title: "مظهر فاخر قبل أول رشفة.",
      lead: "مستوحى من علامات القهوة الحديثة، ومهيأ لمشتري B2B الذين يحتاجون ثقة بالمنتج وجاذبية بصرية وتنفيذ تصدير متكرر.",
      cards: [
        ["إطلاق رفوف البيع", "نماذج hero بتصاميم نظيفة وملفات شهادات وخيارات تغليف للسوق الأوروبي.", "DQ-001 / DQ-010"],
        ["برامج الهدايا", "ماكينات محمولة وحقائب ومحولات وعلب مخصصة للهدايا المؤسسية الفاخرة.", "حزم جاهزة للهدايا"],
        ["صور المتاجر الإلكترونية", "تنسيقات مدمجة بمواصفات واضحة لـ Amazon وShopify والتجارة العابرة للحدود.", "منتجات جاهزة للمحتوى"],
      ],
    },
    blog: {
      cardPrefix: "دليل المشتري",
      cards: [
        ["كيفية توريد ماكينات إسبرسو محمولة للعلامات الخاصة في أوروبا", "محتوى للمشترين حول المطابقة والتغليف والأداء وتخطيط البيع."],
        ["ماكينات 25 بار المحمولة: ما يجب فحصه قبل الطلب", "قائمة فحص للضغط، البطارية، المحولات، المستندات وجاهزية التوريد المتكرر."],
        ["قائمة تغليف OEM لمجموعات هدايا القهوة المحمولة", "ملاحظات تغليف وعلامة للحزم وعلب الهدايا والبرامج الموسمية."],
      ],
    },
    form: {
      ariaLabel: "نموذج استفسار TK Classic",
      helper: "شارك النموذج والكمية والسوق المستهدف واحتياجات العلامة. سيستلم فريق المبيعات الاستفسار ويحفظه في سجل العملاء.",
      phone: "واتساب / هاتف",
      country: "الدولة / السوق",
      quantity: "الكمية التقديرية",
      branding: "احتياجات العلامة / التغليف",
      submit: "إرسال الاستفسار",
      submitting: "جارٍ الإرسال...",
      success: "تم استلام الاستفسار. سترد TK Classic قريباً.",
      error: "تعذر الإرسال الآن. يرجى تجربة واتساب أو البريد.",
      companyPlaceholder: "شركة توزيع / علامة تجارية",
      countryPlaceholder: "ألمانيا / فرنسا / الاتحاد الأوروبي / بريطانيا",
      quantityPlaceholder: "500 / 1000 / 2000 قطعة",
      brandingPlaceholder: "شعار، علبة هدية، لون علامة خاصة، حزمة بيع...",
      messagePlaceholder: "السوق المستهدف، الكمية، احتياجات الشعار/التغليف والجدول المتوقع.",
    },
  },
  zh: {
    proof: { extraction: "萃取平台", years: "OEM 年经验", markets: "服务市场", compliance: "合规资料" },
    marquee: ["25 巴萃取", "按项目书面报价", "OEM / ODM 方案", "欧盟合规资料", "礼品级包装", "便携式意式咖啡系统", "工厂直供", "多语言支持"],
    market: {
      eyebrow: "适合欧洲采购",
      title: "为零售上架型采购团队打造。",
      lead: "聚焦经销商、跨境电商品牌、礼品采购和私牌客户，兼顾高端展示感与工厂直供执行力。",
      cards: [
        ["欧洲批发商", "便携式意式咖啡机型号、合规资料和可复用的订单规划，适合分销项目。"],
        ["跨境电商品牌", "紧凑主推款、强视觉素材、配件组合和快速报价流程，适合 marketplace 上新。"],
        ["礼品采购商", "礼品级外观、包装支持、收纳包和零售组合，适合季节性采购项目。"],
        ["OEM / ODM 私牌客户", "支持 Logo、颜色、包装和差异化开发，从样品确认到出口包装。"],
      ],
    },
    scenes: {
      eyebrow: "批发上新场景",
      title: "让产品在第一杯咖啡之前就显得高级。",
      lead: "借鉴现代咖啡品牌的视觉表达，但结构上更适合 B2B 买家：产品可信、展示高级、出口执行可复制。",
      cards: [
        ["零售上架", "主推型号外观干净，配套认证资料和包装选项，适合欧洲零售上架项目。", "DQ-001 / DQ-010"],
        ["礼品套装项目", "便携咖啡机、收纳包、转接器和品牌礼盒，适合企业礼品和高端采购。", "礼品组合"],
        ["电商视觉内容", "紧凑产品形态和清晰卖点，适合 Amazon、Shopify 与跨境落地页展示。", "内容型 SKU"],
      ],
    },
    blog: {
      cardPrefix: "采购指南",
      cards: [
        ["欧洲私牌项目如何采购便携式意式咖啡机", "围绕合规、包装、性能和零售陈列规划的采购内容。"],
        ["25 巴便携咖啡机：批发下单前要确认什么", "检查压力、电池、转接器、认证资料和稳定复购供货能力。"],
        ["便携咖啡礼品套装的 OEM 包装清单", "适用于零售组合、礼盒和季节性采购项目的包装与品牌建议。"],
      ],
    },
    form: {
      ariaLabel: "TK Classic 询盘表单",
      helper: "请填写目标型号、数量、销售市场和品牌需求。TK Classic 销售团队会收到询盘，并存档到线索记录中。",
      phone: "WhatsApp / 电话",
      country: "国家 / 市场",
      quantity: "预计数量",
      branding: "品牌 / 包装需求",
      submit: "提交询盘",
      submitting: "提交中...",
      success: "询盘已收到，TK Classic 会尽快回复。",
      error: "暂时无法提交，请尝试 WhatsApp 或邮件联系。",
      companyPlaceholder: "批发公司 / 品牌名称",
      countryPlaceholder: "德国 / 法国 / 欧盟 / 英国",
      quantityPlaceholder: "500 / 1000 / 2000 件",
      brandingPlaceholder: "Logo、礼盒、私牌颜色、零售套装等",
      messagePlaceholder: "目标市场、数量、Logo/包装需求和预计时间。",
    },
  },
  ru: {
    proof: { extraction: "Платформа экстракции", years: "Лет опыта OEM", markets: "Рынки поставок", compliance: "Документы соответствия" },
    marquee: ["Экстракция 25 бар", "Расчёт по проекту", "Программы OEM / ODM", "Документы соответствия ЕС", "Подарочная упаковка", "Портативные эспрессо-системы", "Поставка с фабрики", "Многоязычная поддержка"],
    market: {
      eyebrow: "Для европейских покупателей",
      title: "Создано для команд sourcing и retail.",
      lead: "Линейка для дистрибьюторов, брендов электронной коммерции, подарочных программ и заказчиков собственной торговой марки, которым важны премиальная подача и прямое фабричное исполнение.",
      cards: [
        ["Европейские оптовики", "Портативные модели, документы соответствия и повторяемое планирование заказов для дистрибуции."],
        ["Бренды международной торговли", "Компактные флагманские товары, выразительные материалы, наборы аксессуаров и быстрые циклы расчёта."],
        ["Закупка подарков", "Подарочное оформление, поддержка упаковки, сумки и розничные наборы для сезонных программ."],
        ["Private label OEM / ODM", "Логотип, цвет, упаковка и дифференцированная разработка от образца до экспортной упаковки."],
      ],
    },
    scenes: {
      eyebrow: "Сценарии запуска wholesale",
      title: "Премиальный вид ещё до первого глотка.",
      lead: "Вдохновлено современными кофейными DTC-брендами, но структурировано для B2B-покупателей: доверие к продукту, визуальная сила и экспортное исполнение.",
      cards: [
        ["Запуск на retail-полке", "Hero-модели с чистым силуэтом, сертификатами и вариантами упаковки для европейского retail.", "DQ-001 / DQ-010"],
        ["Подарочные программы", "Портативные машины, сумки, адаптеры и брендированные коробки для корпоративных подарков.", "Подарочные наборы"],
        ["Визуалы marketplace", "Компактные форматы с понятными спецификациями для Amazon, Shopify и cross-border ecommerce.", "SKU для контента"],
      ],
    },
    blog: {
      cardPrefix: "Гид покупателя",
      cards: [
        ["Как закупать портативные эспрессо-машины для private label в Европе", "Контент для покупателей о соответствии, упаковке, характеристиках и retail-планировании."],
        ["Портативные машины 25 бар: что проверить перед заказом", "Чеклист по давлению, батарее, адаптерам, документам и готовности к повторным поставкам."],
        ["OEM-чеклист упаковки для подарочных кофейных наборов", "Заметки по упаковке и брендингу для retail-наборов, подарочных коробок и сезонных закупок."],
      ],
    },
    form: {
      ariaLabel: "Форма запроса TK Classic",
      helper: "Укажите модель, количество, целевой рынок и требования к брендингу. Команда продаж получит запрос и сохранит его в базе лидов.",
      phone: "WhatsApp / Телефон",
      country: "Страна / Рынок",
      quantity: "Ориентировочное количество",
      branding: "Брендинг / упаковка",
      submit: "Отправить запрос",
      submitting: "Отправка...",
      success: "Запрос получен. TK Classic скоро ответит.",
      error: "Сейчас отправить не удалось. Попробуйте WhatsApp или email.",
      companyPlaceholder: "Оптовая компания / бренд",
      countryPlaceholder: "Германия / Франция / ЕС / Великобритания",
      quantityPlaceholder: "500 / 1 000 / 2 000 шт.",
      brandingPlaceholder: "Логотип, подарочная коробка, цвет private label, retail-набор...",
      messagePlaceholder: "Целевой рынок, количество, логотип/упаковка и ожидаемые сроки.",
    },
  },
};

export const homeUxCopy: Record<
  Lang,
  {
    scrollCue: string;
    showcaseHeading: string;
    toolsEyebrow: string;
    toolsTitle: string;
    tools: Array<{ title: string; description: string }>;
  }
> = {
  en: {
    scrollCue: "Scroll to explore",
    showcaseHeading: "A portable ritual, engineered for scale.",
    toolsEyebrow: "Buyer tools",
    toolsTitle: "Move from browsing to a quote-ready plan.",
    tools: [
      { title: "Product selector", description: "Choose use case, volume and branding direction to get a recommended model." },
      { title: "Bundle configurator", description: "Assemble a retail, gifting or private-label set with a clearer scope." },
      { title: "Savings calculator", description: "Estimate order value and see how packaging and volume change the plan." },
      { title: "Inquiry builder", description: "Prepare a concise buyer brief before sending it to the TK Classic team." },
    ],
  },
  es: {
    scrollCue: "Desplázate para explorar",
    showcaseHeading: "Un ritual portátil diseñado para crecer.",
    toolsEyebrow: "Herramientas para compradores",
    toolsTitle: "Pasa de explorar a un plan listo para cotizar.",
    tools: [
      { title: "Selector de producto", description: "Elige uso, volumen y marca para recibir un modelo recomendado." },
      { title: "Configurador de bundles", description: "Combina un set retail, de regalo o private label con un alcance claro." },
      { title: "Calculadora de ahorro", description: "Estima el valor del pedido y el impacto del packaging y el volumen." },
      { title: "Generador de consultas", description: "Prepara un brief de compra antes de enviarlo al equipo de TK Classic." },
    ],
  },
  pt: {
    scrollCue: "Deslize para explorar",
    showcaseHeading: "Um ritual portátil preparado para crescer.",
    toolsEyebrow: "Ferramentas do comprador",
    toolsTitle: "Passe da descoberta a um plano pronto para cotação.",
    tools: [
      { title: "Seletor de produtos", description: "Escolha uso, volume e direção de marca para receber um modelo recomendado." },
      { title: "Configurador de bundles", description: "Monte um conjunto retail, presente ou private label com escopo claro." },
      { title: "Calculadora de economia", description: "Estime o valor do pedido e o efeito da embalagem e do volume." },
      { title: "Gerador de consulta", description: "Prepare um briefing objetivo antes de enviá-lo à equipe TK Classic." },
    ],
  },
  fr: {
    scrollCue: "Faites défiler pour explorer",
    showcaseHeading: "Un rituel portable conçu pour changer d’échelle.",
    toolsEyebrow: "Outils acheteur",
    toolsTitle: "Passez de la découverte à un plan prêt à chiffrer.",
    tools: [
      { title: "Sélecteur de produit", description: "Choisissez l’usage, le volume et la marque pour obtenir un modèle conseillé." },
      { title: "Configurateur de bundle", description: "Composez un coffret retail, cadeau ou private label avec un périmètre clair." },
      { title: "Calculateur d’économies", description: "Estimez la valeur de commande et l’impact du packaging et du volume." },
      { title: "Générateur de demande", description: "Préparez un brief acheteur concis avant de l’envoyer à TK Classic." },
    ],
  },
  ar: {
    scrollCue: "مرر للاستكشاف",
    showcaseHeading: "تجربة قهوة محمولة مصممة للتوسع.",
    toolsEyebrow: "أدوات المشتري",
    toolsTitle: "انتقل من التصفح إلى خطة جاهزة لطلب السعر.",
    tools: [
      { title: "اختيار المنتج", description: "حدد الاستخدام والكمية واتجاه العلامة للحصول على الطراز المناسب." },
      { title: "منشئ الحزم", description: "كوّن حزمة للبيع بالتجزئة أو للهدايا أو بعلامتك الخاصة بوضوح أكبر." },
      { title: "حاسبة التوفير", description: "قدّر قيمة الطلب وتأثير التغليف والكمية على الخطة." },
      { title: "منشئ الاستفسار", description: "جهّز موجز شراء مختصرًا قبل إرساله إلى فريق TK Classic." },
    ],
  },
  zh: {
    scrollCue: "向下探索",
    showcaseHeading: "为规模化采购打造的便携咖啡仪式。",
    toolsEyebrow: "采购工具",
    toolsTitle: "从浏览产品到形成可报价的采购方案。",
    tools: [
      { title: "产品选型器", description: "选择用途、采购量和品牌方向，获取匹配的产品建议。" },
      { title: "套装配置器", description: "组合零售、礼品或私牌套装，提前明确采购范围。" },
      { title: "节省计算器", description: "估算订单金额，了解包装与采购量对方案的影响。" },
      { title: "询盘生成器", description: "发送给 TK Classic 团队前，先整理一份清晰的采购需求。" },
    ],
  },
  ru: {
    scrollCue: "Прокрутите, чтобы изучить",
    showcaseHeading: "Портативный кофейный ритуал для масштабных закупок.",
    toolsEyebrow: "Инструменты покупателя",
    toolsTitle: "От просмотра к плану, готовому для расчёта.",
    tools: [
      { title: "Подбор продукта", description: "Выберите задачу, объём и направление бренда, чтобы получить модель." },
      { title: "Конфигуратор набора", description: "Соберите розничный, подарочный или private label набор." },
      { title: "Калькулятор экономии", description: "Оцените сумму заказа и влияние упаковки и объёма." },
      { title: "Конструктор запроса", description: "Подготовьте краткое описание закупки для команды TK Classic." },
    ],
  },
};

const featureLabels: Record<string, Partial<Record<Lang, string>>> = {
  "Portable flagship": {
    es: "Modelo insignia portátil",
    pt: "Flagship portátil",
    fr: "Modèle phare portable",
    ar: "الطراز المحمول الرئيسي",
    zh: "便携旗舰款",
    ru: "Портативный флагман",
  },
  "Wholesale hero": {
    es: "Modelo principal para mayoristas",
    pt: "Modelo principal para atacado",
    fr: "Modèle vedette pour grossistes",
    ar: "منتج رئيسي للجملة",
    zh: "批发主推款",
    ru: "Флагманская модель для оптовых продаж",
  },
  "Fast-charge model": {
    es: "Modelo de carga rápida",
    pt: "Modelo de carga rápida",
    fr: "Modèle charge rapide",
    ar: "طراز الشحن السريع",
    zh: "快充型号",
    ru: "Модель с быстрой зарядкой",
  },
  "Multi-format model": {
    es: "Modelo multiformato",
    pt: "Modelo multiformato",
    fr: "Modèle multiformat",
    ar: "طراز متعدد الصيغ",
    zh: "多规格兼容款",
    ru: "Мультиформатная модель",
  },
  "Double-cup design": {
    es: "Diseño doble taza",
    pt: "Design de copo duplo",
    fr: "Design double tasse",
    ar: "تصميم كوبين",
    zh: "双杯设计",
    ru: "Дизайн на две чашки",
  },
  "Higher-capacity format": {
    es: "Formato de mayor capacidad",
    pt: "Formato de maior capacidade",
    fr: "Format grande capacité",
    ar: "سعة أكبر",
    zh: "大容量款",
    ru: "Формат большей ёмкости",
  },
  "Premium LCD multi-format model": {
    es: "Modelo premium multiformato con LCD",
    pt: "Modelo premium multiformato com LCD",
    fr: "Modèle premium multiformat avec LCD",
    ar: "طراز فاخر متعدد الصيغ بشاشة LCD",
    zh: "高端 LCD 多规格兼容款",
    ru: "Премиальная мультиформатная модель с LCD",
  },
  "Premium gifting format": {
    es: "Formato regalo premium",
    pt: "Formato premium para brindes",
    fr: "Format cadeau premium",
    ar: "تنسيق هدايا فاخر",
    zh: "高端礼品款",
    ru: "Премиальный подарочный формат",
  },
};

const termLabels: Record<string, Partial<Record<Lang, string>>> = {
  "Retail shelf": { es: "Exposición en tienda", pt: "Exposição no varejo", fr: "Mise en rayon", ar: "رف البيع", zh: "零售上架", ru: "Розничная выкладка" },
  "Cross-border ecommerce": { es: "Comercio electrónico transfronterizo", pt: "Comércio eletrônico internacional", fr: "Commerce en ligne transfrontalier", ar: "تجارة عابرة للحدود", zh: "跨境电商", ru: "Трансграничная электронная торговля" },
  "Gift set": { es: "Set de regalo", pt: "Kit para presente", fr: "Coffret cadeau", ar: "طقم هدايا", zh: "礼品套装", ru: "Подарочный набор" },
  "Private label": { es: "Marca propia", pt: "Marca própria", fr: "Marque propre", ar: "علامة خاصة", zh: "私牌", ru: "Private label" },
  Wholesale: { es: "Venta mayorista", pt: "Atacado", fr: "Vente en gros", ar: "جملة", zh: "批发", ru: "Оптовые продажи" },
  "Retail launch": { es: "Lanzamiento en tiendas", pt: "Lançamento no varejo", fr: "Lancement en magasin", ar: "إطلاق البيع", zh: "零售上新", ru: "Запуск в рознице" },
  "OEM branding": { es: "Branding OEM", pt: "Branding OEM", fr: "Branding OEM", ar: "علامة OEM", zh: "OEM 品牌定制", ru: "OEM-брендинг" },
  "Gift box": { es: "Caja regalo", pt: "Caixa presente", fr: "Coffret cadeau", ar: "علبة هدية", zh: "礼盒", ru: "Подарочная коробка" },
  "Travel use": { es: "Uso de viaje", pt: "Uso em viagem", fr: "Usage voyage", ar: "استخدام السفر", zh: "旅行使用", ru: "Для поездок" },
  "Shared use": { es: "Uso compartido", pt: "Uso compartilhado", fr: "Usage partagé", ar: "استخدام مشترك", zh: "共享使用", ru: "Совместное использование" },
  "Promo gift": { es: "Regalo promocional", pt: "Brinde promocional", fr: "Cadeau promo", ar: "هدية ترويجية", zh: "促销礼品", ru: "Промо-подарок" },
  Marketplace: { es: "Plataforma de comercio electrónico", pt: "Plataforma de comércio eletrônico", fr: "Place de marché", ar: "متجر إلكتروني", zh: "电商平台", ru: "Маркетплейс" },
  "Office coffee": { es: "Café de oficina", pt: "Café de escritório", fr: "Café bureau", ar: "قهوة المكتب", zh: "办公室咖啡", ru: "Офисный кофе" },
  Travel: { es: "Viaje", pt: "Viagem", fr: "Voyage", ar: "سفر", zh: "旅行", ru: "Путешествия" },
  "Retail bundle": { es: "Conjunto para venta minorista", pt: "Kit para varejo", fr: "Ensemble pour la vente au détail", ar: "حزمة بيع", zh: "零售组合", ru: "Розничный комплект" },
  "Brand launch": { es: "Lanzamiento de marca", pt: "Lançamento de marca", fr: "Lancement marque", ar: "إطلاق علامة", zh: "品牌上新", ru: "Запуск бренда" },
  "Premium wholesale": { es: "Venta mayorista premium", pt: "Atacado premium", fr: "Vente en gros premium", ar: "جملة فاخرة", zh: "高端批发", ru: "Премиальные оптовые продажи" },
};

const highlightLabels: Record<string, Partial<Record<Lang, string>>> = {
  "Best for private label retail launches": { zh: "适合私牌零售上新", es: "Ideal para lanzamientos retail private label", pt: "Ideal para lançamentos retail de marca própria", fr: "Idéal pour lancements retail marque propre", ar: "مناسب لإطلاق علامات خاصة في البيع", ru: "Подходит для retail-запусков private label" },
  "Works as a core product for gift programs": { zh: "可作为礼品项目核心产品", es: "Funciona como producto central para programas de regalo", pt: "Funciona como produto principal para brindes", fr: "Produit central pour programmes cadeaux", ar: "يعمل كمنتج أساسي لبرامج الهدايا", ru: "Может быть основным продуктом подарочных программ" },
  "Deep accessory compatibility": { zh: "配件兼容度高", es: "Alta compatibilidad de accesorios", pt: "Alta compatibilidade de acessórios", fr: "Large compatibilité accessoires", ar: "توافق واسع مع الملحقات", ru: "Широкая совместимость аксессуаров" },
  "Strong hero imagery for wholesale pages": { zh: "适合批发页面做主视觉", es: "Visual hero fuerte para páginas wholesale", pt: "Visual hero forte para páginas de atacado", fr: "Visuel hero fort pour pages wholesale", ar: "صور رئيسية قوية لصفحات الجملة", ru: "Сильный hero-визуал для оптовых страниц" },
  "Fits retail gifting and cross-border programs": { zh: "适合零售礼品和跨境项目", es: "Encaja con regalos retail y programas cross-border", pt: "Serve para brindes retail e programas cross-border", fr: "Adapté aux cadeaux retail et programmes cross-border", ar: "مناسب للهدايا والتجارة العابرة للحدود", ru: "Подходит для retail-подарков и cross-border программ" },
  "Easy to localize for OEM launch pages": { zh: "便于本地化为 OEM 上新页面", es: "Fácil de localizar para páginas OEM", pt: "Fácil de localizar para páginas OEM", fr: "Facile à localiser pour pages OEM", ar: "سهل التوطين لصفحات إطلاق OEM", ru: "Легко локализуется для OEM-страниц запуска" },
  "Three coffee formats documented in the revised manual": { zh: "修订版说明书已列明三种咖啡规格", es: "Tres formatos de café documentados en el manual revisado", pt: "Três formatos de café documentados no manual revisado", fr: "Trois formats de café documentés dans le manuel révisé", ar: "ثلاث صيغ للقهوة موثقة في الدليل المنقح", ru: "Три формата кофе указаны в обновлённом руководстве" },
  "Balanced size for shelf and gift-box programs": { zh: "机身尺寸兼顾零售陈列与礼盒项目" },
  "Black and white versions in stock": { zh: "现有黑色与白色版本" },
  "Good fit for shared-use demos": { zh: "适合共享使用与现场演示" },
  "Strong on-shelf visibility": { zh: "零售陈列辨识度高" },
  "Lightweight retail format": { zh: "轻量化零售产品形态" },
  "Designed for premium private label and retail programs": { zh: "面向高端私牌与零售项目", es: "Diseñado para proyectos premium de marca propia y retail", pt: "Desenvolvido para projetos premium de marca própria e varejo", fr: "Conçu pour les projets premium de marque propre et de retail", ar: "مصمم لمشاريع العلامات الخاصة والبيع بالتجزئة الفاخرة", ru: "Для премиальных проектов private label и розничных программ" },
  "Good fit for office and travel coffee routines": { zh: "适合办公室与旅行咖啡场景" },
  "LCD shows temperature, battery level and extraction mode": { zh: "LCD 显示温度、电量与萃取模式" },
  "A polished gift-friendly silhouette": { zh: "外观精致，适合礼品项目" },
  "Premium look for branded bundles": { zh: "适合打造高端品牌套装" },
  "Good companion to private label launches": { zh: "适合搭配私牌新品发布" },
};

const specValueLabels: Record<string, Partial<Record<Lang, string>>> = {
  "60-80 mL water tank": { zh: "60–80 mL 水箱" },
  "50-100 mL water tank": { zh: "50–100 mL 水箱" },
  "100 mL maximum water tank": { zh: "水箱最大容量 100 mL" },
  "Single-cup portable format": { zh: "便携单杯规格" },
  "2-in-1 capsule + ground": { zh: "胶囊与咖啡粉二合一" },
  "250 mL per cup, double-cup design": { zh: "每杯 250 mL，双杯设计" },
  "25 bar extraction platform": { zh: "25 巴萃取平台" },
  "ABS + PP + stainless steel": { zh: "ABS + PP + 不锈钢" },
  "ABS + PP + silicone + stainless steel": { zh: "ABS + PP + 硅胶 + 不锈钢" },
  "About 180 minutes, USB Type-C": { zh: "约 180 分钟，USB Type-C" },
  "About 4 hours, 5V / 3A": { zh: "约 4 小时，5V / 3A" },
  "Type-C fast charging": { zh: "Type-C 快速充电" },
  "4 hours, Type-C": { zh: "约 4 小时，Type-C" },
  "2 hours, Type-C": { zh: "约 2 小时，Type-C" },
  "About 2 hours, USB Type-C": { zh: "约 2 小时，USB Type-C", es: "Aproximadamente 2 horas, USB Type-C", pt: "Cerca de 2 horas, USB Type-C", fr: "Environ 2 heures, USB Type-C", ar: "حوالي ساعتين، USB Type-C", ru: "Около 2 часов, USB Type-C" },
  "Cold-water cycle heats to 96°C": { zh: "冷水模式加热至 96°C" },
  "Fast heat to 92°C": { zh: "快速加热至 92°C" },
  "About 3 min 30 sec heating; 46 sec extraction": { zh: "加热约 3 分 30 秒；萃取约 46 秒" },
  "3-4 minutes": { zh: "约 3–4 分钟" },
  "3-3.5 minutes": { zh: "约 3–3.5 分钟" },
  "Compact handheld format": { zh: "紧凑手持式设计" },
  "Designed for portable retail and gifting programs": { zh: "面向便携零售与礼品项目设计" },
  "3 heated cups / 500+ direct extraction cups": { zh: "约 3 杯加热萃取 / 500 杯以上直接萃取" },
  "5 heated cups / 500+ direct extraction cups": { zh: "约 5 杯加热萃取 / 500 杯以上直接萃取" },
  "Capsule adapter + ground-coffee adapter": { zh: "胶囊适配器 + 咖啡粉适配器" },
  "N-series + Dolce Gusto + ground coffee": { zh: "N-series 胶囊 + Dolce Gusto 胶囊 + 咖啡粉" },
  "N-series + Dolce Gusto + ground coffee; portable drip cup documented": { zh: "N-series 胶囊 + Dolce Gusto 胶囊 + 咖啡粉；说明书已列明便携滴滤杯" },
  "Nespresso pod adapter, ground coffee chamber": { zh: "Nespresso 胶囊适配器 + 咖啡粉仓" },
  "Custom colors / logo / packaging": { zh: "支持颜色、Logo 与包装定制" },
};

export function localizeFeatureLabel(label: string, lang: Lang) {
  return featureLabels[label]?.[lang] ?? label;
}

export function localizeTerm(term: string, lang: Lang) {
  return termLabels[term]?.[lang] ?? term;
}

export function localizeHighlight(text: string, lang: Lang) {
  return highlightLabels[text]?.[lang] ?? text;
}

export function localizeSpecValue(value: string, lang: Lang) {
  return specValueLabels[value]?.[lang] ?? value;
}
