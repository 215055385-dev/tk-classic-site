import type { Lang, Product } from "@/lib/site-data";
import { localizeFeatureLabel, localizeTerm } from "@/lib/localized-ui";

type ProductGeoRecord = {
  seoTitle: string;
  productName: string;
  productType: string;
};

const productGeoRecords: Record<string, ProductGeoRecord> = {
  "DQ-001": {
    seoTitle: "DQ-001 BrewHandy 25 Bar Portable Espresso Machine",
    productName: "DQ-001 BrewHandy 25 Bar Portable Espresso Machine with Capsule and Ground-Coffee Adapters",
    productType: "Portable espresso machine",
  },
  "DQ-002": {
    seoTitle: "DQ-002 2-in-1 Portable Espresso Machine | Capsule & Ground Coffee",
    productName: "DQ-002 2-in-1 Portable Espresso Machine for Capsules and Ground Coffee",
    productType: "2-in-1 portable espresso machine",
  },
  "DQ-005": {
    seoTitle: "DQ-005 25 Bar Portable Coffee Machine | Three Coffee Formats",
    productName: "DQ-005 25 Bar Portable Coffee Machine for Capsules and Ground Coffee",
    productType: "Multi-format portable coffee machine",
  },
  "DQ-008": {
    seoTitle: "DQ-008 Double-Cup Portable Coffee Maker for Shared Use",
    productName: "DQ-008 Double-Cup Portable Coffee Maker for Shared Use",
    productType: "Double-cup portable coffee maker",
  },
  "DQ-010": {
    seoTitle: "DQ-010 Premium LCD Portable Coffee Maker with 325 mL Cup",
    productName: "DQ-010 Premium LCD Portable Coffee Maker for Capsules, Ground Coffee and Portable Drip Use",
    productType: "Premium LCD multi-format portable coffee machine",
  },
  "DQ-011": {
    seoTitle: "DQ-011 285 mL Portable Espresso Machine for Premium Gift Sets",
    productName: "DQ-011 285 mL Portable Espresso Machine for Premium Gift Sets and Private Label",
    productType: "Portable espresso machine for gift programs",
  },
};

const labels: Record<Lang, {
  overview: string; overviewTitle: string; audience: string; scenarios: string; published: string;
  faq: string; faqTitle: string; whatQ: (model: string) => string; whoQ: (model: string) => string;
  specQ: (model: string) => string; formatQ: (model: string) => string; quoteQ: (model: string) => string;
  whatA: (model: string, summary: string) => string; whoA: (model: string, uses: string) => string;
  specA: (model: string, pressure: string, battery: string, cup: string) => string;
  formatA: (model: string, adapter: string) => string; quoteA: (model: string) => string;
}> = {
  en: {
    overview: "Product overview", overviewTitle: "What is this model designed for?", audience: "Suitable buyers and programs", scenarios: "Published use scenarios", published: "Published model information",
    faq: "Product FAQ", faqTitle: "Questions about this model",
    whatQ: (m) => `What is the ${m} portable coffee machine?`, whoQ: (m) => `Who is the ${m} suitable for?`, specQ: (m) => `What are the published specifications for ${m}?`, formatQ: (m) => `Which coffee formats or adapters are listed for ${m}?`, quoteQ: (m) => `How can I request an OEM or wholesale quotation for ${m}?`,
    whatA: (m, s) => `${m} is a TK Classic portable coffee machine. ${s}`,
    whoA: (m, u) => `${m} is positioned for the following published buying or use scenarios: ${u}. Final configuration should be confirmed for the intended market and order.`,
    specA: (m, p, b, c) => `The current ${m} record lists ${p} pressure, ${b} battery information and ${c} cup capacity or format. Refer to the specification table on this page for the complete published model data.`,
    formatA: (m, a) => `The current ${m} record lists: ${a}. Confirm the required adapters and included accessories in the formal quotation.`,
    quoteA: (m) => `Send the target quantity, destination market, branding, packaging and accessory requirements through the inquiry form. TK Classic will confirm the available ${m} configuration, commercial terms and applicable documents in the quotation.`,
  },
  es: {
    overview: "Descripción del producto", overviewTitle: "¿Para qué está diseñado este modelo?", audience: "Compradores y programas adecuados", scenarios: "Escenarios de uso publicados", published: "Información publicada del modelo", faq: "Preguntas del producto", faqTitle: "Preguntas sobre este modelo",
    whatQ: (m) => `¿Qué es la cafetera portátil ${m}?`, whoQ: (m) => `¿Para quién es adecuada la ${m}?`, specQ: (m) => `¿Cuáles son las especificaciones publicadas de ${m}?`, formatQ: (m) => `¿Qué formatos o adaptadores admite ${m}?`, quoteQ: (m) => `¿Cómo solicito una cotización OEM o mayorista para ${m}?`,
    whatA: (m, s) => `${m} es una cafetera portátil TK Classic. ${s}`, whoA: (m, u) => `${m} se presenta para estos escenarios de compra o uso publicados: ${u}. La configuración final debe confirmarse según el mercado y el pedido.`, specA: (m, p, b, c) => `La ficha actual de ${m} indica presión de ${p}, batería ${b} y capacidad o formato de taza ${c}. Consulte la tabla de esta página para ver todos los datos publicados.`, formatA: (m, a) => `La ficha actual de ${m} indica: ${a}. Confirme los adaptadores y accesorios incluidos en la cotización formal.`, quoteA: (m) => `Envíe la cantidad, destino, marca, embalaje y accesorios mediante el formulario. TK Classic confirmará la configuración disponible de ${m}, las condiciones comerciales y los documentos aplicables en la cotización.`,
  },
  pt: {
    overview: "Visão geral do produto", overviewTitle: "Para que este modelo foi desenvolvido?", audience: "Compradores e programas adequados", scenarios: "Cenários de uso publicados", published: "Informações publicadas do modelo", faq: "Perguntas do produto", faqTitle: "Perguntas sobre este modelo",
    whatQ: (m) => `O que é a cafeteira portátil ${m}?`, whoQ: (m) => `Para quem a ${m} é indicada?`, specQ: (m) => `Quais são as especificações publicadas da ${m}?`, formatQ: (m) => `Quais formatos ou adaptadores são listados para ${m}?`, quoteQ: (m) => `Como solicitar uma cotação OEM ou de atacado para ${m}?`,
    whatA: (m, s) => `${m} é uma cafeteira portátil TK Classic. ${s}`, whoA: (m, u) => `${m} é posicionada para estes cenários publicados de compra ou uso: ${u}. A configuração final deve ser confirmada para o mercado e o pedido.`, specA: (m, p, b, c) => `O registro atual da ${m} informa pressão de ${p}, bateria ${b} e capacidade ou formato de copo ${c}. Consulte a tabela desta página para todos os dados publicados.`, formatA: (m, a) => `O registro atual da ${m} informa: ${a}. Confirme os adaptadores e acessórios incluídos na cotação formal.`, quoteA: (m) => `Envie quantidade, destino, marca, embalagem e acessórios pelo formulário. A TK Classic confirmará a configuração disponível da ${m}, as condições comerciais e os documentos aplicáveis na cotação.`,
  },
  fr: {
    overview: "Présentation du produit", overviewTitle: "À quel usage ce modèle est-il destiné ?", audience: "Acheteurs et programmes concernés", scenarios: "Usages publiés", published: "Informations publiées du modèle", faq: "FAQ produit", faqTitle: "Questions sur ce modèle",
    whatQ: (m) => `Qu’est-ce que la machine à café portable ${m} ?`, whoQ: (m) => `À qui s’adresse la ${m} ?`, specQ: (m) => `Quelles sont les caractéristiques publiées de la ${m} ?`, formatQ: (m) => `Quels formats ou adaptateurs sont indiqués pour la ${m} ?`, quoteQ: (m) => `Comment demander un devis OEM ou grossiste pour la ${m} ?`,
    whatA: (m, s) => `${m} est une machine à café portable TK Classic. ${s}`, whoA: (m, u) => `${m} est présentée pour les usages ou programmes publiés suivants : ${u}. La configuration finale doit être confirmée selon le marché et la commande.`, specA: (m, p, b, c) => `La fiche actuelle de la ${m} indique une pression de ${p}, une batterie ${b} et une capacité ou un format de tasse ${c}. Consultez le tableau de cette page pour toutes les données publiées.`, formatA: (m, a) => `La fiche actuelle de la ${m} indique : ${a}. Confirmez les adaptateurs et accessoires inclus dans le devis formel.`, quoteA: (m) => `Envoyez la quantité, la destination, le marquage, l’emballage et les accessoires via le formulaire. TK Classic confirmera la configuration disponible de la ${m}, les conditions commerciales et les documents applicables dans le devis.`,
  },
  ar: {
    overview: "نظرة عامة على المنتج", overviewTitle: "ما الغرض من هذا الطراز؟", audience: "المشترون والبرامج المناسبة", scenarios: "سيناريوهات الاستخدام المنشورة", published: "بيانات الطراز المنشورة", faq: "أسئلة المنتج", faqTitle: "أسئلة حول هذا الطراز",
    whatQ: (m) => `ما هي ماكينة القهوة المحمولة ${m}؟`, whoQ: (m) => `لمن يناسب طراز ${m}؟`, specQ: (m) => `ما المواصفات المنشورة لطراز ${m}؟`, formatQ: (m) => `ما صيغ القهوة أو المحولات المدرجة لطراز ${m}؟`, quoteQ: (m) => `كيف أطلب عرض سعر OEM أو جملة لطراز ${m}؟`,
    whatA: (m, s) => `${m} ماكينة قهوة محمولة من TK Classic. ${s}`, whoA: (m, u) => `يُعرض طراز ${m} لسيناريوهات الشراء أو الاستخدام المنشورة التالية: ${u}. يجب تأكيد التكوين النهائي حسب السوق والطلب.`, specA: (m, p, b, c) => `تذكر بيانات ${m} الحالية ضغط ${p} وبطارية ${b} وسعة أو صيغة كوب ${c}. راجع جدول المواصفات في هذه الصفحة لجميع البيانات المنشورة.`, formatA: (m, a) => `تذكر بيانات ${m} الحالية: ${a}. يجب تأكيد المحولات والملحقات المطلوبة في عرض السعر الرسمي.`, quoteA: (m) => `أرسل الكمية والسوق والهوية والتغليف والملحقات عبر نموذج الاستفسار. ستؤكد TK Classic تكوين ${m} المتاح والشروط التجارية والوثائق المنطبقة في عرض السعر.`,
  },
  zh: {
    overview: "产品概述", overviewTitle: "这个型号适合什么用途？", audience: "适合的采购项目", scenarios: "已公布的使用场景", published: "已公布的型号信息", faq: "产品常见问题", faqTitle: "关于这个型号的问题",
    whatQ: (m) => `${m} 是什么类型的便携式咖啡机？`, whoQ: (m) => `${m} 适合哪些客户和项目？`, specQ: (m) => `${m} 已公布的参数有哪些？`, formatQ: (m) => `${m} 支持哪些咖啡规格或转接器？`, quoteQ: (m) => `如何获取 ${m} 的 OEM 或批发报价？`,
    whatA: (m, s) => `${m} 是 TK Classic 的便携式咖啡机。${s}`, whoA: (m, u) => `${m} 已公布的采购或使用场景包括：${u}。最终配置需要根据目标市场和订单要求确认。`, specA: (m, p, b, c) => `${m} 当前资料列出的压力为 ${p}，电池信息为 ${b}，杯容量或杯型为 ${c}。完整的已公布型号数据请查看本页参数表。`, formatA: (m, a) => `${m} 当前资料列出：${a}。所需转接器和包装内配件应在正式报价中确认。`, quoteA: (m) => `请通过询盘表提交预计数量、目的地、品牌、包装和配件需求。TK Classic 会在报价中确认 ${m} 可提供的配置、商务条款和适用资料。`,
  },
  ru: {
    overview: "Обзор продукта", overviewTitle: "Для каких задач предназначена эта модель?", audience: "Подходящие покупатели и программы", scenarios: "Опубликованные сценарии использования", published: "Опубликованные данные модели", faq: "Вопросы о продукте", faqTitle: "Вопросы об этой модели",
    whatQ: (m) => `Что представляет собой портативная кофемашина ${m}?`, whoQ: (m) => `Для кого подходит ${m}?`, specQ: (m) => `Какие характеристики опубликованы для ${m}?`, formatQ: (m) => `Какие форматы кофе или адаптеры указаны для ${m}?`, quoteQ: (m) => `Как запросить OEM- или оптовое предложение на ${m}?`,
    whatA: (m, s) => `${m} — портативная кофемашина TK Classic. ${s}`, whoA: (m, u) => `${m} позиционируется для следующих опубликованных сценариев закупки или использования: ${u}. Итоговую конфигурацию следует подтвердить для выбранного рынка и заказа.`, specA: (m, p, b, c) => `В текущих данных ${m} указаны давление ${p}, батарея ${b} и ёмкость или формат чашки ${c}. Полные опубликованные данные приведены в таблице на этой странице.`, formatA: (m, a) => `В текущих данных ${m} указано: ${a}. Требуемые адаптеры и комплект поставки подтверждаются в официальном предложении.`, quoteA: (m) => `Отправьте через форму количество, рынок назначения, требования к брендингу, упаковке и аксессуарам. TK Classic подтвердит доступную конфигурацию ${m}, коммерческие условия и применимые документы в предложении.`,
  },
};

export function getProductGeo(product: Product, lang: Lang) {
  const record = productGeoRecords[product.model] ?? {
    seoTitle: `${product.model} Portable Coffee Machine`,
    productName: `${product.model} Portable Coffee Machine`,
    productType: "Portable coffee machine",
  };
  const l = labels[lang];
  const uses = product.useCases.map((item) => localizeTerm(item, lang)).join(", ");
  const displayName = lang === "en" ? record.productName : `${product.model} — ${localizeFeatureLabel(product.featureLabel, lang)}`;
  const faqs = [
    { question: l.whatQ(product.model), answer: l.whatA(product.model, product.summary[lang]) },
    { question: l.whoQ(product.model), answer: l.whoA(product.model, uses) },
    { question: l.specQ(product.model), answer: l.specA(product.model, product.spec.pressure, product.spec.battery, product.spec.cup) },
    { question: l.formatQ(product.model), answer: l.formatA(product.model, product.spec.adapter) },
    { question: l.quoteQ(product.model), answer: l.quoteA(product.model) },
  ];

  return {
    ...record,
    displayName,
    directAnswer: l.whatA(product.model, product.summary[lang]),
    useCases: product.useCases.map((item) => localizeTerm(item, lang)),
    faqs,
    labels: l,
    primaryAlt: lang === "en" ? `${record.productName} in official TK Classic product photography` : `${product.model} — ${localizeFeatureLabel(product.featureLabel, lang)} — TK Classic`,
    galleryAlt: (index: number) => `${displayName} — TK Classic product view ${index + 1}`,
  };
}

export function getEnglishProductGeo(model: string) {
  return productGeoRecords[model];
}
