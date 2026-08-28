import type { Lang } from "@/lib/site-data";

type CommercialCopy = {
  orderTermsTitle: string;
  orderTerms: string;
  shippingTitle: string;
  shipping: string;
  leadTimeTitle: string;
  leadTime: string;
  warrantyTitle: string;
  warranty: string;
  proofTitle: string;
  proofLead: string;
  proofItems: string[];
  qualityTitle: string;
  qualityLead: string;
  qualityItems: string[];
};

export const commercialCopy: Record<Lang, CommercialCopy> = {
  en: {
    orderTermsTitle: "Pricing & order terms",
    orderTerms: "MOQ is discussed after inquiry. Payment methods are T/T, PayPal and Western Union; the final quantity, pricing, Incoterms and quotation validity are confirmed in the formal quotation.",
    shippingTitle: "Shipping & export files",
    shipping: "Export packing, destination-market documents and shipping options are confirmed with the quotation for each market.",
    leadTimeTitle: "Lead time planning",
    leadTime: "Paid samples are dispatched within 7 days of the sample order. Mass-production lead time depends on quantity and approved scope, and is generally around 35 days.",
    warrantyTitle: "Warranty & after-sales",
    warranty: "Warranty coverage, replacement handling and spare-part support are confirmed by model and destination before order approval.",
    proofTitle: "Buyer-ready proof",
    proofLead: "We use documented product and compliance evidence in the quotation process, without publishing unverified customer claims.",
    proofItems: ["Product brochure and model comparison", "CE / RoHS / FCC / UKCA documents", "LFGB / FDA food-contact reports", "ISO 9001 and EU conformity files"],
    qualityTitle: "Quality checkpoints",
    qualityLead: "Each project follows a documented path from product selection to approved packing.",
    qualityItems: ["Model, market and compatible-accessory selection", "Paid sample, logo and packaging artwork approval", "Functional, charging, extraction and appearance checks", "Final packing review and written production confirmation"],
  },
  es: {
    orderTermsTitle: "Precios y condiciones del pedido",
    orderTerms: "El precio unitario, la cantidad, las condiciones de pago, los Incoterms y la validez de la oferta se confirman en la cotización formal tras revisar el modelo y la personalización.",
    shippingTitle: "Envío y documentación de exportación",
    shipping: "El embalaje de exportación, los documentos del mercado de destino y las opciones logísticas se confirman con la cotización.",
    leadTimeTitle: "Planificación de plazos",
    leadTime: "El calendario de muestras y producción se confirma después de revisar modelo, marca, packaging y plan de pedido.",
    warrantyTitle: "Garantía y posventa",
    warranty: "La cobertura de garantía, los reemplazos y los repuestos se confirman por modelo y destino antes de aprobar el pedido.",
    proofTitle: "Pruebas para compradores",
    proofLead: "Usamos documentación de producto y conformidad en la cotización, sin publicar afirmaciones de clientes que no estén verificadas.",
    proofItems: ["Catálogo y comparación de modelos", "Documentos CE / RoHS / FCC / UKCA", "Informes LFGB / FDA de contacto alimentario", "ISO 9001 y declaración de conformidad UE"],
    qualityTitle: "Puntos de control de calidad",
    qualityLead: "Cada proyecto sigue un proceso claro desde el brief hasta el embalaje de exportación.",
    qualityItems: ["Brief y revisión del mercado objetivo", "Aprobación de muestra y artes", "Controles funcionales, de carga y apariencia", "Inspección final y revisión del embalaje"],
  },
  pt: {
    orderTermsTitle: "Preços e condições do pedido",
    orderTerms: "O preço unitário, a quantidade, as condições de pagamento, os Incoterms e a validade da proposta são confirmados na cotação formal após a revisão do modelo e da personalização.",
    shippingTitle: "Envio e documentos de exportação",
    shipping: "A embalagem de exportação, os documentos do mercado de destino e as opções logísticas são confirmados com a cotação.",
    leadTimeTitle: "Planejamento de prazos",
    leadTime: "O prazo de amostra e produção é confirmado após a revisão do modelo, da marca, da embalagem e do plano do pedido.",
    warrantyTitle: "Garantia e pós-venda",
    warranty: "A cobertura de garantia, os procedimentos de substituição e o suporte de peças são confirmados por modelo e destino.",
    proofTitle: "Evidências para compradores",
    proofLead: "Usamos documentos de produto e conformidade na cotação, sem publicar afirmações de clientes que não estejam verificadas.",
    proofItems: ["Catálogo e comparação de modelos", "Documentos CE / RoHS / FCC / UKCA", "Relatórios LFGB / FDA de contato com alimentos", "ISO 9001 e declaração de conformidade UE"],
    qualityTitle: "Pontos de controle de qualidade",
    qualityLead: "Cada projeto segue um processo claro do briefing à embalagem de exportação.",
    qualityItems: ["Briefing e revisão do mercado-alvo", "Aprovação de amostra e arte", "Testes funcionais, de carga e aparência", "Inspeção final e revisão da embalagem"],
  },
  fr: {
    orderTermsTitle: "Prix et conditions de commande",
    orderTerms: "Le prix unitaire, la quantité, les conditions de paiement, les Incoterms et la validité de l'offre sont confirmés dans le devis formel après revue du modèle et de la personnalisation.",
    shippingTitle: "Expédition et dossiers export",
    shipping: "L'emballage export, les documents du marché cible et les options logistiques sont confirmés avec le devis.",
    leadTimeTitle: "Planification des délais",
    leadTime: "Le délai d'échantillon et de production est confirmé après revue du modèle, de la marque, du packaging et du plan de commande.",
    warrantyTitle: "Garantie et après-vente",
    warranty: "La couverture de garantie, le remplacement et les pièces détachées sont confirmés par modèle et destination avant validation.",
    proofTitle: "Preuves pour les acheteurs",
    proofLead: "Nous utilisons les documents produit et conformité dans le devis, sans publier de témoignages clients non vérifiés.",
    proofItems: ["Catalogue et comparaison des modèles", "Dossiers CE / RoHS / FCC / UKCA", "Rapports LFGB / FDA contact alimentaire", "ISO 9001 et déclaration UE de conformité"],
    qualityTitle: "Points de contrôle qualité",
    qualityLead: "Chaque projet suit un parcours clair du brief à l'emballage export.",
    qualityItems: ["Brief et revue du marché cible", "Validation de l'échantillon et des visuels", "Contrôles fonctionnels, charge et aspect", "Inspection finale et revue de l'emballage"],
  },
  ar: {
    orderTermsTitle: "الأسعار وشروط الطلب",
    orderTerms: "يتم تأكيد سعر الوحدة والكمية وشروط الدفع وقواعد Incoterms ومدة صلاحية العرض في عرض السعر الرسمي بعد مراجعة الطراز ونطاق التخصيص.",
    shippingTitle: "الشحن وملفات التصدير",
    shipping: "يتم تأكيد تغليف التصدير ومستندات السوق وخيارات الشحن ضمن عرض السعر لكل سوق.",
    leadTimeTitle: "تخطيط المواعيد",
    leadTime: "يتم تأكيد موعد العينة والإنتاج بعد مراجعة النموذج والعلامة والتغليف وخطة الطلب.",
    warrantyTitle: "الضمان وخدمة ما بعد البيع",
    warranty: "يتم تأكيد تغطية الضمان والاستبدال ودعم قطع الغيار حسب النموذج والوجهة قبل اعتماد الطلب.",
    proofTitle: "أدلة جاهزة للمشتري",
    proofLead: "نستخدم مستندات المنتج والمطابقة في عرض السعر، ولا ننشر ادعاءات عملاء غير موثقة.",
    proofItems: ["كتالوج ومقارنة النماذج", "مستندات CE / RoHS / FCC / UKCA", "تقارير LFGB / FDA للمواد الملامسة للطعام", "ISO 9001 وإقرار المطابقة الأوروبي"],
    qualityTitle: "نقاط مراقبة الجودة",
    qualityLead: "يتبع كل مشروع مساراً واضحاً من ملخص المتطلبات إلى تغليف التصدير.",
    qualityItems: ["مراجعة المتطلبات والسوق المستهدف", "اعتماد العينة والتصاميم", "فحوص الوظائف والشحن والمظهر", "الفحص النهائي ومراجعة تغليف التصدير"],
  },
  zh: {
    orderTermsTitle: "价格与订单条款",
    orderTerms: "单价、订单数量、付款条款、Incoterms 和报价有效期，会在确认型号与定制范围后写入正式报价单。",
    shippingTitle: "出货与出口资料",
    shipping: "出口包装、目的市场资料和物流方式，会在报价阶段结合具体市场确认。",
    leadTimeTitle: "交期规划",
    leadTime: "样品和量产交期，会在确认型号、品牌、包装和订单方案后沟通。",
    warrantyTitle: "质保与售后",
    warranty: "质保范围、换货处理和备件支持，会在订单确认前按型号和目的地说明。",
    proofTitle: "采购商可核验资料",
    proofLead: "报价过程中提供产品与合规文件，不公开未经核实的客户背书。​",
    proofItems: ["产品画册与型号对比", "CE / RoHS / FCC / UKCA 资料", "LFGB / FDA 食品接触材料报告", "ISO 9001 与 EU DoC 文件"],
    qualityTitle: "质量检查节点",
    qualityLead: "每个项目从需求确认到出口包装，都有清晰的确认节点。",
    qualityItems: ["需求与目标市场审核", "样品和设计稿确认", "功能、充电与外观检查", "最终检验与出口包装确认"],
  },
  ru: {
    orderTermsTitle: "Цена и условия заказа",
    orderTerms: "Цена за единицу, объём, условия оплаты, Incoterms и срок действия предложения подтверждаются в официальной котировке после согласования модели и объёма кастомизации.",
    shippingTitle: "Доставка и экспортные документы",
    shipping: "Экспортная упаковка, документы для рынка назначения и варианты доставки подтверждаются в коммерческом предложении.",
    leadTimeTitle: "Планирование сроков",
    leadTime: "Сроки образца и производства подтверждаются после проверки модели, брендинга, упаковки и плана заказа.",
    warrantyTitle: "Гарантия и сервис",
    warranty: "Гарантия, замена и поддержка запасных частей подтверждаются по модели и направлению поставки до утверждения заказа.",
    proofTitle: "Подтверждения для закупщика",
    proofLead: "В расчёте используются документы на продукцию и соответствие, без публикации непроверенных отзывов клиентов.",
    proofItems: ["Каталог и сравнение моделей", "Документы CE / RoHS / FCC / UKCA", "Отчёты LFGB / FDA для контакта с пищей", "ISO 9001 и декларация соответствия ЕС"],
    qualityTitle: "Контрольные точки качества",
    qualityLead: "Каждый проект проходит понятный путь от брифа до экспортной упаковки.",
    qualityItems: ["Бриф и проверка целевого рынка", "Согласование образца и макетов", "Функциональная проверка, зарядка и внешний вид", "Финальная инспекция и экспортная упаковка"],
  },
};

type PrivacyCopy = {
  navLabel: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
};

export const privacyCopy: Record<Lang, PrivacyCopy> = {
  en: {
    navLabel: "Privacy",
    title: "Privacy policy",
    intro: "TK Classic uses the information you submit to respond to sourcing inquiries, prepare quotations and improve buyer support.",
    sections: [
      { title: "Information we collect", body: "We may receive your name, email, company, phone or WhatsApp, destination market, product interest, quantity and message when you contact us." },
      { title: "How we use it", body: "We use inquiry information to reply, prepare product recommendations, arrange samples and keep a secure business lead record." },
      { title: "Storage and sharing", body: "Information is shared only with the TK Classic sales and operations team or service providers needed to operate the inquiry system. We do not sell inquiry data." },
      { title: "Your choices", body: "You may request access, correction or deletion of your inquiry information by emailing bowie@tkclassic.com." },
    ],
  },
  es: {
    navLabel: "Privacidad",
    title: "Política de privacidad",
    intro: "TK Classic utiliza la información enviada para responder consultas de sourcing, preparar cotizaciones y mejorar el soporte al comprador.",
    sections: [
      { title: "Información que recopilamos", body: "Podemos recibir nombre, email, empresa, teléfono o WhatsApp, mercado de destino, producto, cantidad y mensaje." },
      { title: "Cómo la usamos", body: "Usamos la información para responder, recomendar productos, organizar muestras y mantener un registro seguro de leads." },
      { title: "Almacenamiento y cesión", body: "Solo compartimos los datos con el equipo de TK Classic o proveedores necesarios para operar el sistema. No vendemos los datos." },
      { title: "Tus opciones", body: "Puedes solicitar acceso, corrección o eliminación escribiendo a bowie@tkclassic.com." },
    ],
  },
  pt: {
    navLabel: "Privacidade",
    title: "Política de privacidade",
    intro: "A TK Classic usa os dados enviados para responder consultas de sourcing, preparar cotações e melhorar o suporte ao comprador.",
    sections: [
      { title: "Informações coletadas", body: "Podemos receber nome, e-mail, empresa, telefone ou WhatsApp, mercado de destino, produto, quantidade e mensagem." },
      { title: "Como usamos", body: "Usamos os dados para responder, recomendar produtos, organizar amostras e manter um registro seguro de leads." },
      { title: "Armazenamento e compartilhamento", body: "Compartilhamos dados apenas com a equipe TK Classic ou fornecedores necessários ao sistema. Não vendemos dados de consultas." },
      { title: "Suas escolhas", body: "Solicite acesso, correção ou exclusão pelo e-mail bowie@tkclassic.com." },
    ],
  },
  fr: {
    navLabel: "Confidentialité",
    title: "Politique de confidentialité",
    intro: "TK Classic utilise les informations envoyées pour répondre aux demandes de sourcing, préparer les devis et améliorer l'accompagnement acheteur.",
    sections: [
      { title: "Informations collectées", body: "Nous pouvons recevoir votre nom, e-mail, entreprise, téléphone ou WhatsApp, marché cible, produit, quantité et message." },
      { title: "Utilisation", body: "Ces informations servent à répondre, recommander des produits, organiser des échantillons et conserver un registre sécurisé des demandes." },
      { title: "Stockage et partage", body: "Les données sont partagées uniquement avec l'équipe TK Classic ou les prestataires nécessaires au système. Nous ne vendons pas les données." },
      { title: "Vos choix", body: "Demandez l'accès, la correction ou la suppression à bowie@tkclassic.com." },
    ],
  },
  ar: {
    navLabel: "الخصوصية",
    title: "سياسة الخصوصية",
    intro: "تستخدم TK Classic المعلومات التي ترسلها للرد على استفسارات التوريد وإعداد عروض الأسعار وتحسين دعم المشترين.",
    sections: [
      { title: "المعلومات التي نجمعها", body: "قد نستلم الاسم والبريد والشركة والهاتف أو واتساب والسوق والمنتج والكمية والرسالة." },
      { title: "كيفية الاستخدام", body: "نستخدم المعلومات للرد وتقديم توصيات المنتجات وترتيب العينات وحفظ سجل آمن للاستفسارات." },
      { title: "التخزين والمشاركة", body: "تتم مشاركة المعلومات فقط مع فريق TK Classic أو مزودي الخدمات اللازمين لتشغيل النظام، ولا نبيع بيانات الاستفسارات." },
      { title: "خياراتك", body: "يمكنك طلب الوصول أو التصحيح أو الحذف عبر bowie@tkclassic.com." },
    ],
  },
  zh: {
    navLabel: "隐私政策",
    title: "隐私政策",
    intro: "TK Classic 仅使用你提交的信息来回复采购询盘、准备报价并改善买家服务。",
    sections: [
      { title: "我们收集的信息", body: "你提交询盘时，我们可能收到姓名、邮箱、公司、电话或 WhatsApp、目的市场、产品、数量和留言。" },
      { title: "信息用途", body: "这些信息用于回复询盘、推荐产品、安排样品，并保存安全的业务线索记录。" },
      { title: "保存与共享", body: "信息只会与 TK Classic 销售运营团队或必要的系统服务商共享，我们不会出售询盘数据。" },
      { title: "你的权利", body: "如需访问、更正或删除询盘信息，请联系 bowie@tkclassic.com。" },
    ],
  },
  ru: {
    navLabel: "Конфиденциальность",
    title: "Политика конфиденциальности",
    intro: "TK Classic использует отправленные данные для ответа на запросы поставок, подготовки расчётов и улучшения поддержки закупщиков.",
    sections: [
      { title: "Какие данные мы получаем", body: "Мы можем получить имя, e-mail, компанию, телефон или WhatsApp, рынок, товар, количество и сообщение." },
      { title: "Как мы их используем", body: "Данные нужны для ответа, рекомендаций, организации образцов и безопасного хранения делового запроса." },
      { title: "Хранение и передача", body: "Данные передаются только команде TK Classic или необходимым сервисным провайдерам. Мы не продаём данные запросов." },
      { title: "Ваши права", body: "Запросить доступ, исправление или удаление можно по адресу bowie@tkclassic.com." },
    ],
  },
};
