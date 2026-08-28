import { accessories, type AccessoryItem } from "@/lib/accessory-data";
import { products, type Lang } from "@/lib/site-data";
import { getAccessoryDisplay } from "@/lib/translation-copy";

export type CoffeeLabModel = {
  slug: string;
  model: string;
  image: string;
  previewImage: string;
  previewPosition: string;
  variantBoard: string;
  variantHotspots: Partial<Record<string, { x: number; y: number }>>;
  zones: Record<"body" | "lid" | "cup", { left: number; top: number; width: number; height: number; radius: number }>;
  summary: string;
  role: "value" | "premium" | "standard";
};

export type CoffeeLabAccessory = AccessoryItem & { compatibleModels: string[] };

export type CoffeeLabCatalog = {
  source: "local" | "shopify";
  models: CoffeeLabModel[];
  accessories: CoffeeLabAccessory[];
};

export type CoffeeLabCatalogProvider = {
  getCatalog(lang: Lang): Promise<CoffeeLabCatalog>;
};

const modelIds = products.map((product) => product.model);

const carryCaseDisplay: Record<Lang, Pick<AccessoryItem, "title" | "category" | "description" | "alt" | "note">> = {
  en: { title: "Portable carry case", category: "Travel accessories", description: "Optional carry case for keeping the machine and selected accessories together.", alt: "Black portable carry case for TK Classic coffee machine configurations", note: "Optional add-on · compatible with all listed models" },
  es: { title: "Estuche de transporte", category: "Accesorios de viaje", description: "Estuche opcional para llevar juntos la máquina y los accesorios seleccionados.", alt: "Estuche negro para configuraciones de cafeteras portátiles TK Classic", note: "Accesorio opcional · compatible con todos los modelos indicados" },
  pt: { title: "Estojo de transporte", category: "Acessórios de viagem", description: "Estojo opcional para manter a máquina e os acessórios selecionados juntos.", alt: "Estojo preto para configurações de cafeteiras portáteis TK Classic", note: "Acessório opcional · compatível com todos os modelos listados" },
  fr: { title: "Étui de transport", category: "Accessoires de voyage", description: "Étui optionnel pour réunir la machine et les accessoires sélectionnés.", alt: "Étui noir pour configurations de machines à café portables TK Classic", note: "Option · compatible avec tous les modèles présentés" },
  ar: { title: "حقيبة حمل", category: "ملحقات السفر", description: "حقيبة اختيارية لحفظ الجهاز والملحقات المحددة معًا.", alt: "حقيبة حمل سوداء لتجهيزات آلات القهوة المحمولة من TK Classic", note: "إضافة اختيارية · متوافقة مع جميع الطرز المعروضة" },
  zh: { title: "便携收纳包", category: "旅行配件", description: "用于集中收纳咖啡机与已选配件的可选便携包。", alt: "适用于 TK Classic 便携咖啡机配置的黑色收纳包", note: "可选配件 · 兼容全部已列型号" },
  ru: { title: "Чехол для переноски", category: "Аксессуары для поездок", description: "Опциональный чехол для совместного хранения машины и выбранных аксессуаров.", alt: "Чёрный чехол для комплекта портативной кофемашины TK Classic", note: "Опция · совместима со всеми представленными моделями" },
};

const previewByModel: Record<string, Pick<CoffeeLabModel, "previewImage" | "previewPosition" | "variantBoard" | "variantHotspots" | "zones">> = {
  "DQ-001": { previewImage: "/products/dq-001/detail.png", previewPosition: "center", variantBoard: "/coffee-lab/variants/dq-001.webp", variantHotspots: { espresso: { x: 29, y: 50 }, graphite: { x: 29, y: 50 }, oat: { x: 50, y: 50 }, moss: { x: 72, y: 50 } }, zones: { lid: { left: 73, top: 1, width: 21, height: 13, radius: 46 }, body: { left: 73, top: 13, width: 23, height: 38, radius: 18 }, cup: { left: 74, top: 76, width: 22, height: 22, radius: 34 } } },
  "DQ-002": { previewImage: "/products/dq-002/oem.jpg", previewPosition: "center", variantBoard: "/coffee-lab/variants/dq-002.webp", variantHotspots: { espresso: { x: 42, y: 50 }, graphite: { x: 63, y: 48 }, oat: { x: 76, y: 58 }, clay: { x: 55, y: 59 } }, zones: { lid: { left: 51, top: 22, width: 12, height: 13, radius: 48 }, body: { left: 50, top: 31, width: 14, height: 37, radius: 22 }, cup: { left: 50, top: 64, width: 14, height: 19, radius: 32 } } },
  "DQ-005": { previewImage: "/products/dq-005/white.jpg", previewPosition: "center", variantBoard: "/coffee-lab/variants/dq-005.webp", variantHotspots: { espresso: { x: 68, y: 54 }, graphite: { x: 68, y: 54 }, oat: { x: 47, y: 50 } }, zones: { lid: { left: 38, top: 7, width: 24, height: 14, radius: 46 }, body: { left: 37, top: 16, width: 26, height: 48, radius: 16 }, cup: { left: 37, top: 62, width: 26, height: 29, radius: 28 } } },
  "DQ-008": { previewImage: "/products/dq-008/hero.jpg", previewPosition: "center", variantBoard: "/coffee-lab/variants/dq-008.webp", variantHotspots: { moss: { x: 25, y: 58 }, oat: { x: 43, y: 51 }, clay: { x: 65, y: 50 }, graphite: { x: 83, y: 60 } }, zones: { lid: { left: 40, top: 15, width: 20, height: 18, radius: 44 }, body: { left: 39, top: 29, width: 22, height: 43, radius: 14 }, cup: { left: 40, top: 68, width: 20, height: 23, radius: 28 } } },
  "DQ-010": { previewImage: "/products/dq-010/white.jpg", previewPosition: "center", variantBoard: "/coffee-lab/variants/dq-010.webp", variantHotspots: { oat: { x: 30, y: 57 }, espresso: { x: 70, y: 57 }, graphite: { x: 70, y: 57 } }, zones: { lid: { left: 38.4, top: 6.4, width: 23.2, height: 12.8, radius: 48 }, body: { left: 38.2, top: 18, width: 23.6, height: 45.2, radius: 18 }, cup: { left: 38.2, top: 62, width: 23.6, height: 27.8, radius: 28 } } },
  "DQ-011": { previewImage: "/products/dq-011/hero.jpg", previewPosition: "center", variantBoard: "/coffee-lab/variants/dq-011.webp", variantHotspots: { oat: { x: 60, y: 53 }, espresso: { x: 80, y: 53 }, graphite: { x: 80, y: 53 } }, zones: { lid: { left: 45, top: 18, width: 18, height: 13, radius: 45 }, body: { left: 44, top: 28, width: 20, height: 39, radius: 16 }, cup: { left: 45, top: 63, width: 18, height: 23, radius: 28 } } },
};

export const localCoffeeLabProvider: CoffeeLabCatalogProvider = {
  async getCatalog(lang) {
    return {
      source: "local",
      models: products.map((product) => ({
        slug: product.slug,
        model: product.model,
        image: product.hero,
        ...previewByModel[product.model],
        summary: product.summary[lang],
        role: product.model === "DQ-001" ? "value" : product.model === "DQ-010" ? "premium" : "standard",
      })),
      accessories: [
        ...accessories.map((item) => ({
          ...item,
          ...getAccessoryDisplay(item.slug, lang, item),
          compatibleModels: modelIds,
        })),
        {
          slug: "portable-carry-case",
          ...carryCaseDisplay[lang],
          image: "/accessories/portable-carry-case.webp",
          compatibleModels: modelIds,
        },
      ],
    };
  },
};

/** Replace this provider with a Shopify Storefront API adapter when the store is connected. */
export async function getCoffeeLabCatalog(lang: Lang, provider = localCoffeeLabProvider) {
  return provider.getCatalog(lang);
}

export const coffeeLabNav: Record<Lang, string> = {
  en: "Coffee Lab", es: "Coffee Lab", pt: "Coffee Lab", fr: "Coffee Lab",
  ar: "مختبر القهوة", zh: "咖啡创新实验室", ru: "Coffee Lab",
};

export const coffeeLabCopy: Record<Lang, {
  metaTitle: string; metaDescription: string; eyebrow: string; title: string; subtitle: string;
  start: string; oemCta: string; concept: string; configure: string; configureLead: string;
  machine: string; body: string; lid: string; cup: string; finish: string; color: string;
  accessories: string; add: string; added: string; compatible: string; preview: string;
  configuration: string; configId: string; save: string; saved: string; copy: string; copied: string;
  logo: string; logoHelp: string; upload: string; remove: string; logoScale: string; logoPosition: string;
  project: string; wholesale: string; privateLabel: string; oem: string; odm: string;
  structural: string; structuralHelp: string; quantity: string; name: string; company: string;
  email: string; country: string; phone: string; verification: string; submit: string;
  submitting: string; success: string; error: string; ecosystem: string; ecosystemLead: string;
  process: string; processLead: string; steps: string[]; finalTitle: string; finalLead: string;
  value: string; premium: string; standard: string; noAccessory: string;
}> = {
  en: {
    metaTitle: "Coffee Lab Studio | Portable Coffee Machine OEM Configuration", metaDescription: "Build a B2B portable coffee machine concept with real TK Classic models, compatible accessories and private-label options.", eyebrow: "MODULAR COFFEE SYSTEMS", title: "Coffee Lab Studio", subtitle: "Build your portable coffee product concept from a real machine, compatible accessories and brand options.", start: "Start configuring", oemCta: "Discuss OEM / ODM", concept: "Concept preview — final color and finish subject to sampling.", configure: "Build your configuration", configureLead: "Select a real machine first, then shape the visual direction and accessory bundle.", machine: "Machine", body: "Body", lid: "Lid", cup: "Cup", finish: "Finish", color: "Color", accessories: "Compatible accessories", add: "Add", added: "Added", compatible: "Compatible with selected model", preview: "Your custom coffee machine", configuration: "Configuration summary", configId: "Configuration ID", save: "Save on this device", saved: "Saved", copy: "Copy English summary", copied: "Copied", logo: "Customer logo", logoHelp: "PNG, JPG or SVG, up to 5 MB. Used only for this concept and inquiry.", upload: "Upload logo", remove: "Remove", logoScale: "Logo size", logoPosition: "Logo position", project: "Project type", wholesale: "Wholesale bundle", privateLabel: "Private label", oem: "OEM", odm: "ODM", structural: "Structural customization", structuralHelp: "Describe your concept for engineering review. Structural changes are not simulated in this preview.", quantity: "Estimated quantity", name: "Name", company: "Company", email: "Business email", country: "Target market / country", phone: "WhatsApp / phone", verification: "Verification", submit: "Submit custom request", submitting: "Submitting…", success: "Your configuration was received. Our sales team will review it and reply by email.", error: "We could not submit the request. Please check the fields and try again.", ecosystem: "One machine. Endless possibilities.", ecosystemLead: "Build a portable coffee offer around travel, outdoor, automotive, office or gifting use—using only confirmed machine and accessory options.", process: "From idea to production", processLead: "A practical OEM / ODM path, with each technical detail confirmed during project review.", steps: ["Project brief", "Configuration review", "Sample development", "Testing & confirmation", "Production planning"], finalTitle: "Create your next coffee product", finalLead: "Send the configuration to Bowie and Leo for a practical sourcing review.", value: "Value option", premium: "Premium lead model", standard: "Available model", noAccessory: "No accessories selected",
  },
  es: {
    metaTitle: "Coffee Lab Studio | Configuración OEM", metaDescription: "Cree un concepto B2B con modelos reales, accesorios compatibles y opciones de marca privada.", eyebrow: "SISTEMAS MODULARES DE CAFÉ", title: "Coffee Lab Studio", subtitle: "Cree su concepto de producto con una máquina real, accesorios compatibles y opciones de marca.", start: "Empezar a configurar", oemCta: "Hablar de OEM / ODM", concept: "Vista conceptual: el color y el acabado finales dependen de la muestra.", configure: "Cree su configuración", configureLead: "Elija una máquina real y después defina el estilo y los accesorios.", machine: "Máquina", body: "Cuerpo", lid: "Tapa", cup: "Vaso", finish: "Acabado", color: "Color", accessories: "Accesorios compatibles", add: "Añadir", added: "Añadido", compatible: "Compatible con el modelo seleccionado", preview: "Su cafetera personalizada", configuration: "Resumen de configuración", configId: "ID de configuración", save: "Guardar en este dispositivo", saved: "Guardado", copy: "Copiar resumen en inglés", copied: "Copiado", logo: "Logo del cliente", logoHelp: "PNG, JPG o SVG, máximo 5 MB. Solo para este concepto y consulta.", upload: "Subir logo", remove: "Eliminar", logoScale: "Tamaño del logo", logoPosition: "Posición del logo", project: "Tipo de proyecto", wholesale: "Paquete mayorista", privateLabel: "Marca privada", oem: "OEM", odm: "ODM", structural: "Personalización estructural", structuralHelp: "Describa su concepto para revisión de ingeniería. Los cambios estructurales no se simulan aquí.", quantity: "Cantidad estimada", name: "Nombre", company: "Empresa", email: "Email profesional", country: "Mercado / país", phone: "WhatsApp / teléfono", verification: "Verificación", submit: "Enviar solicitud", submitting: "Enviando…", success: "Recibimos su configuración. Nuestro equipo la revisará y responderá por email.", error: "No se pudo enviar. Revise los campos e inténtelo de nuevo.", ecosystem: "Una máquina. Posibilidades infinitas.", ecosystemLead: "Configure una oferta para viajes, exterior, automóvil, oficina o regalo con opciones confirmadas.", process: "De la idea a la producción", processLead: "Un proceso OEM / ODM práctico, con confirmación técnica durante la revisión.", steps: ["Resumen del proyecto", "Revisión", "Desarrollo de muestra", "Pruebas y confirmación", "Plan de producción"], finalTitle: "Cree su próximo producto de café", finalLead: "Envíe la configuración a Bowie y Leo para una revisión práctica.", value: "Opción de valor", premium: "Modelo premium principal", standard: "Modelo disponible", noAccessory: "Sin accesorios seleccionados",
  },
  pt: {
    metaTitle: "Coffee Lab Studio | Configuração OEM", metaDescription: "Crie um conceito B2B com modelos reais, acessórios compatíveis e opções de marca própria.", eyebrow: "SISTEMAS MODULARES DE CAFÉ", title: "Coffee Lab Studio", subtitle: "Crie seu conceito com uma máquina real, acessórios compatíveis e opções de marca.", start: "Começar configuração", oemCta: "Falar sobre OEM / ODM", concept: "Prévia conceitual — cor e acabamento finais sujeitos à amostragem.", configure: "Monte sua configuração", configureLead: "Escolha uma máquina real e defina o visual e o conjunto de acessórios.", machine: "Máquina", body: "Corpo", lid: "Tampa", cup: "Copo", finish: "Acabamento", color: "Cor", accessories: "Acessórios compatíveis", add: "Adicionar", added: "Adicionado", compatible: "Compatível com o modelo selecionado", preview: "Sua máquina personalizada", configuration: "Resumo da configuração", configId: "ID da configuração", save: "Salvar neste dispositivo", saved: "Salvo", copy: "Copiar resumo em inglês", copied: "Copiado", logo: "Logo do cliente", logoHelp: "PNG, JPG ou SVG, até 5 MB. Usado apenas neste conceito e consulta.", upload: "Enviar logo", remove: "Remover", logoScale: "Tamanho do logo", logoPosition: "Posição do logo", project: "Tipo de projeto", wholesale: "Kit atacadista", privateLabel: "Marca própria", oem: "OEM", odm: "ODM", structural: "Personalização estrutural", structuralHelp: "Descreva o conceito para análise de engenharia. Alterações estruturais não são simuladas.", quantity: "Quantidade estimada", name: "Nome", company: "Empresa", email: "E-mail comercial", country: "Mercado / país", phone: "WhatsApp / telefone", verification: "Verificação", submit: "Enviar solicitação", submitting: "Enviando…", success: "Recebemos sua configuração. Nossa equipe responderá por e-mail.", error: "Não foi possível enviar. Verifique os campos.", ecosystem: "Uma máquina. Possibilidades infinitas.", ecosystemLead: "Monte uma oferta para viagem, ar livre, carro, escritório ou presentes com opções confirmadas.", process: "Da ideia à produção", processLead: "Um caminho OEM / ODM prático, com confirmação técnica durante a revisão.", steps: ["Briefing", "Revisão", "Desenvolvimento de amostra", "Testes e confirmação", "Planejamento de produção"], finalTitle: "Crie seu próximo produto de café", finalLead: "Envie a configuração para Bowie e Leo.", value: "Opção econômica", premium: "Modelo premium", standard: "Modelo disponível", noAccessory: "Nenhum acessório selecionado",
  },
  fr: {
    metaTitle: "Coffee Lab Studio | Configuration OEM", metaDescription: "Créez un concept B2B avec modèles réels, accessoires compatibles et options de marque privée.", eyebrow: "SYSTÈMES DE CAFÉ MODULAIRES", title: "Coffee Lab Studio", subtitle: "Créez votre concept avec une machine réelle, des accessoires compatibles et des options de marque.", start: "Commencer", oemCta: "Parler OEM / ODM", concept: "Aperçu conceptuel — couleur et finition finales soumises à validation de l’échantillon.", configure: "Créez votre configuration", configureLead: "Choisissez une machine réelle, puis définissez le style et les accessoires.", machine: "Machine", body: "Corps", lid: "Couvercle", cup: "Tasse", finish: "Finition", color: "Couleur", accessories: "Accessoires compatibles", add: "Ajouter", added: "Ajouté", compatible: "Compatible avec le modèle sélectionné", preview: "Votre machine personnalisée", configuration: "Résumé de configuration", configId: "ID de configuration", save: "Enregistrer sur cet appareil", saved: "Enregistré", copy: "Copier le résumé anglais", copied: "Copié", logo: "Logo client", logoHelp: "PNG, JPG ou SVG, 5 Mo maximum. Utilisé uniquement pour ce concept et la demande.", upload: "Importer le logo", remove: "Retirer", logoScale: "Taille du logo", logoPosition: "Position du logo", project: "Type de projet", wholesale: "Pack grossiste", privateLabel: "Marque privée", oem: "OEM", odm: "ODM", structural: "Personnalisation structurelle", structuralHelp: "Décrivez le concept pour examen technique. Les modifications structurelles ne sont pas simulées.", quantity: "Quantité estimée", name: "Nom", company: "Entreprise", email: "E-mail professionnel", country: "Marché / pays", phone: "WhatsApp / téléphone", verification: "Vérification", submit: "Envoyer la demande", submitting: "Envoi…", success: "Votre configuration a été reçue. Notre équipe répondra par e-mail.", error: "Échec de l’envoi. Vérifiez les champs.", ecosystem: "Une machine. Des possibilités infinies.", ecosystemLead: "Créez une offre voyage, plein air, voiture, bureau ou cadeau avec des options confirmées.", process: "De l’idée à la production", processLead: "Un parcours OEM / ODM concret, avec validation technique pendant l’étude.", steps: ["Brief projet", "Étude de configuration", "Développement d’échantillon", "Tests et validation", "Planification de production"], finalTitle: "Créez votre prochain produit café", finalLead: "Envoyez la configuration à Bowie et Leo.", value: "Option économique", premium: "Modèle premium", standard: "Modèle disponible", noAccessory: "Aucun accessoire sélectionné",
  },
  zh: {
    metaTitle: "Coffee Lab 咖啡创新实验室 | OEM 定制配置", metaDescription: "基于真实型号、兼容配件和私牌选项创建便携咖啡机 B2B 产品方案。", eyebrow: "模块化咖啡系统", title: "Coffee Lab 咖啡创新实验室", subtitle: "从真实咖啡机、兼容配件与品牌选项出发，组合你的便携咖啡产品方案。", start: "开始 DIY 配置", oemCta: "洽谈 OEM / ODM", concept: "概念预览——最终颜色和表面效果以打样确认为准。", configure: "创建你的配置", configureLead: "先选择真实型号，再定义外观方向与配件组合。", machine: "咖啡机主体", body: "机身", lid: "盖子", cup: "杯子", finish: "表面效果", color: "颜色", accessories: "兼容配件", add: "添加", added: "已添加", compatible: "兼容当前所选型号", preview: "你的定制咖啡机", configuration: "配置摘要", configId: "配置编号", save: "保存到本机", saved: "已保存", copy: "复制英文摘要", copied: "已复制", logo: "客户 Logo", logoHelp: "支持 PNG、JPG 或 SVG，最大 5MB，仅用于本次概念预览和询盘。", upload: "上传 Logo", remove: "移除", logoScale: "Logo 大小", logoPosition: "Logo 位置", project: "项目类型", wholesale: "批发套装", privateLabel: "私牌项目", oem: "OEM", odm: "ODM", structural: "结构定制", structuralHelp: "请描述概念供工程评估。首版预览不模拟结构变化。", quantity: "预计采购数量", name: "姓名", company: "公司名称", email: "商务邮箱", country: "目标市场 / 国家", phone: "WhatsApp / 电话", verification: "验证", submit: "提交定制需求", submitting: "正在提交…", success: "配置已收到。销售团队会进行评估并通过邮件回复。", error: "提交失败，请检查表单后重试。", ecosystem: "一台主机，多种可能。", ecosystemLead: "以已确认的机器和配件组合旅行、户外、车载、办公室或礼赠产品方案。", process: "从创意到生产", processLead: "清晰务实的 OEM / ODM 路径，每项技术细节均在项目评估中确认。", steps: ["项目需求", "配置评估", "样品开发", "测试确认", "量产规划"], finalTitle: "创建你的下一款咖啡产品", finalLead: "将配置提交给 Bowie 与 Leo，获得针对采购项目的实际评估。", value: "性价比选项", premium: "高端主推型号", standard: "可选型号", noAccessory: "暂未选择配件",
  },
  ar: {
    metaTitle: "Coffee Lab Studio | إعداد OEM", metaDescription: "أنشئ تصورًا تجاريًا باستخدام الطرز الحقيقية والملحقات المتوافقة وخيارات العلامة الخاصة.", eyebrow: "أنظمة قهوة معيارية", title: "Coffee Lab Studio", subtitle: "أنشئ تصور منتجك من جهاز حقيقي وملحقات متوافقة وخيارات العلامة التجارية.", start: "ابدأ الإعداد", oemCta: "ناقش OEM / ODM", concept: "معاينة تصورية — اللون والتشطيب النهائيان يخضعان لاعتماد العينة.", configure: "أنشئ إعدادك", configureLead: "اختر جهازًا حقيقيًا ثم حدد الاتجاه البصري والملحقات.", machine: "الجهاز", body: "الهيكل", lid: "الغطاء", cup: "الكوب", finish: "التشطيب", color: "اللون", accessories: "ملحقات متوافقة", add: "إضافة", added: "تمت الإضافة", compatible: "متوافق مع الطراز المحدد", preview: "جهازك المخصص", configuration: "ملخص الإعداد", configId: "رقم الإعداد", save: "حفظ على هذا الجهاز", saved: "تم الحفظ", copy: "نسخ الملخص الإنجليزي", copied: "تم النسخ", logo: "شعار العميل", logoHelp: "PNG أو JPG أو SVG حتى 5 ميغابايت. للاستخدام في هذا التصور والاستفسار فقط.", upload: "رفع الشعار", remove: "إزالة", logoScale: "حجم الشعار", logoPosition: "موضع الشعار", project: "نوع المشروع", wholesale: "حزمة جملة", privateLabel: "علامة خاصة", oem: "OEM", odm: "ODM", structural: "تخصيص هيكلي", structuralHelp: "صف الفكرة للمراجعة الهندسية. لا تتم محاكاة التغييرات الهيكلية هنا.", quantity: "الكمية المتوقعة", name: "الاسم", company: "الشركة", email: "البريد التجاري", country: "السوق / الدولة", phone: "واتساب / الهاتف", verification: "التحقق", submit: "إرسال الطلب", submitting: "جارٍ الإرسال…", success: "تم استلام إعدادك وسيرد فريقنا عبر البريد الإلكتروني.", error: "تعذر الإرسال. تحقق من الحقول.", ecosystem: "جهاز واحد. إمكانات متعددة.", ecosystemLead: "أنشئ عرضًا للسفر أو الهواء الطلق أو السيارة أو المكتب أو الهدايا بخيارات مؤكدة.", process: "من الفكرة إلى الإنتاج", processLead: "مسار OEM / ODM عملي مع تأكيد التفاصيل الفنية أثناء المراجعة.", steps: ["ملخص المشروع", "مراجعة الإعداد", "تطوير العينة", "الاختبار والتأكيد", "تخطيط الإنتاج"], finalTitle: "أنشئ منتج القهوة القادم", finalLead: "أرسل الإعداد إلى Bowie وLeo للمراجعة.", value: "خيار اقتصادي", premium: "الطراز المتميز", standard: "طراز متاح", noAccessory: "لم يتم اختيار ملحقات",
  },
  ru: {
    metaTitle: "Coffee Lab Studio | OEM-конфигуратор", metaDescription: "Создайте B2B-концепцию на основе реальных моделей, совместимых аксессуаров и private label.", eyebrow: "МОДУЛЬНЫЕ КОФЕЙНЫЕ СИСТЕМЫ", title: "Coffee Lab Studio", subtitle: "Создайте концепцию продукта на основе реальной машины, совместимых аксессуаров и брендинга.", start: "Начать настройку", oemCta: "Обсудить OEM / ODM", concept: "Концептуальный просмотр — финальные цвет и покрытие подтверждаются образцом.", configure: "Создайте конфигурацию", configureLead: "Выберите реальную модель, затем визуальное направление и аксессуары.", machine: "Машина", body: "Корпус", lid: "Крышка", cup: "Чашка", finish: "Покрытие", color: "Цвет", accessories: "Совместимые аксессуары", add: "Добавить", added: "Добавлено", compatible: "Совместимо с выбранной моделью", preview: "Ваша кофемашина", configuration: "Сводка", configId: "ID конфигурации", save: "Сохранить на устройстве", saved: "Сохранено", copy: "Копировать английскую сводку", copied: "Скопировано", logo: "Логотип клиента", logoHelp: "PNG, JPG или SVG до 5 МБ. Только для этой концепции и запроса.", upload: "Загрузить логотип", remove: "Удалить", logoScale: "Размер логотипа", logoPosition: "Положение логотипа", project: "Тип проекта", wholesale: "Оптовый комплект", privateLabel: "Private label", oem: "OEM", odm: "ODM", structural: "Изменение конструкции", structuralHelp: "Опишите идею для инженерной оценки. Изменения конструкции здесь не моделируются.", quantity: "Ориентировочное количество", name: "Имя", company: "Компания", email: "Рабочий email", country: "Рынок / страна", phone: "WhatsApp / телефон", verification: "Проверка", submit: "Отправить запрос", submitting: "Отправка…", success: "Конфигурация получена. Команда ответит по email.", error: "Не удалось отправить. Проверьте поля.", ecosystem: "Одна машина. Много возможностей.", ecosystemLead: "Создайте предложение для путешествий, природы, автомобиля, офиса или подарков из подтверждённых вариантов.", process: "От идеи к производству", processLead: "Практичный OEM / ODM-процесс с подтверждением технических деталей.", steps: ["Задание", "Проверка конфигурации", "Разработка образца", "Тестирование", "Планирование производства"], finalTitle: "Создайте следующий кофейный продукт", finalLead: "Отправьте конфигурацию Bowie и Leo.", value: "Выгодный вариант", premium: "Премиальная модель", standard: "Доступная модель", noAccessory: "Аксессуары не выбраны",
  },
};

export const coffeeLabColors = [
  { id: "espresso", name: "Espresso", value: "#2f1b14" },
  { id: "graphite", name: "Graphite", value: "#363737" },
  { id: "silver", name: "Silver", value: "#b7b9b5" },
  { id: "oat", name: "Oat", value: "#e7d8c0" },
  { id: "moss", name: "Moss", value: "#6c7653" },
  { id: "clay", name: "Clay", value: "#bc5c36" },
  { id: "custom", name: "Custom", value: "#d97732" },
];

export const coffeeLabFinishes = ["Matte", "Satin", "Gloss", "Metallic"] as const;

export function createCoffeeLabFormSeed() {
  const bytes = crypto.getRandomValues(new Uint8Array(2));
  return {
    startedAt: new Date().getTime(),
    a: (bytes[0] % 7) + 2,
    b: (bytes[1] % 7) + 2,
  };
}
