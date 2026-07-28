import type { Lang } from "@/lib/site-data";

export type AccessoryDisplay = {
  title: string;
  category: string;
  description: string;
  note: string;
};

export const accessoryDisplay: Record<Lang, Record<string, AccessoryDisplay>> = {
  en: {
    "dg-capsule-base": { title: "DG capsule base", category: "Capsule adapters", description: "Capsule-format base for portable coffee brewing configurations.", note: "Optional add-on · DG capsule format" },
    "nes-capsule-base": { title: "Nespresso capsule base", category: "Capsule adapters", description: "Capsule-format base for Nespresso-style portable brewing configurations.", note: "Optional add-on · Nespresso capsule format" },
    "piercing-needle": { title: "Piercing needle", category: "Brewing components", description: "Replacement piercing component for capsule-based extraction assemblies.", note: "Optional replacement component" },
    "coffee-powder-adapter": { title: "Coffee powder adapter", category: "Brewing components", description: "Powder-coffee component for a flexible portable brewing setup.", note: "Optional add-on · powder coffee format" },
    "american-drip-filter": { title: "American drip filter", category: "Brewing components", description: "Drip-style filter component for larger-format coffee preparation.", note: "Optional add-on · drip coffee format" },
    "brew-cup": { title: "Brew cup", category: "Serving accessories", description: "Integrated brew cup for a complete portable coffee ritual.", note: "Optional serving component" },
    "acrylic-stand-panels": { title: "Acrylic stand panels", category: "Display accessories", description: "Clear acrylic panel set for retail display and product presentation.", note: "Optional bundle display piece" },
    "acrylic-machine-stand": { title: "Acrylic machine stand", category: "Display accessories", description: "Clear stand for elevating the machine and cup in a presentation setup.", note: "Optional bundle display piece" },
  },
  es: {
    "dg-capsule-base": { title: "Base para cápsula DG", category: "Adaptadores de cápsula", description: "Base de formato cápsula para configuraciones portátiles de café.", note: "Accesorio opcional · formato DG" },
    "nes-capsule-base": { title: "Base para cápsula Nespresso", category: "Adaptadores de cápsula", description: "Base de cápsula para configuraciones portátiles tipo Nespresso.", note: "Accesorio opcional · formato Nespresso" },
    "piercing-needle": { title: "Aguja perforadora", category: "Componentes de extracción", description: "Componente de repuesto para conjuntos de extracción con cápsulas.", note: "Componente de repuesto opcional" },
    "coffee-powder-adapter": { title: "Adaptador para café molido", category: "Componentes de extracción", description: "Componente para café molido en una configuración portátil flexible.", note: "Accesorio opcional · café molido" },
    "american-drip-filter": { title: "Filtro drip americano", category: "Componentes de extracción", description: "Componente de filtro drip para preparar café en formato grande.", note: "Accesorio opcional · café drip" },
    "brew-cup": { title: "Vaso de preparación", category: "Accesorios de servicio", description: "Vaso de preparación para completar el ritual de café portátil.", note: "Componente de servicio opcional" },
    "acrylic-stand-panels": { title: "Paneles de soporte acrílico", category: "Accesorios de exposición", description: "Conjunto de paneles acrílicos transparentes para exposición retail.", note: "Pieza opcional para bundles" },
    "acrylic-machine-stand": { title: "Soporte acrílico para máquina", category: "Accesorios de exposición", description: "Soporte transparente para elevar la máquina y el vaso en exposición.", note: "Pieza opcional para bundles" },
  },
  pt: {
    "dg-capsule-base": { title: "Base para cápsula DG", category: "Adaptadores de cápsula", description: "Base de cápsula para configurações portáteis de café.", note: "Acessório opcional · formato DG" },
    "nes-capsule-base": { title: "Base para cápsula Nespresso", category: "Adaptadores de cápsula", description: "Base de cápsula para configurações portáteis tipo Nespresso.", note: "Acessório opcional · formato Nespresso" },
    "piercing-needle": { title: "Agulha perfuradora", category: "Componentes de extração", description: "Componente de reposição para conjuntos de extração com cápsulas.", note: "Componente de reposição opcional" },
    "coffee-powder-adapter": { title: "Adaptador para café moído", category: "Componentes de extração", description: "Componente para café moído em uma configuração portátil flexível.", note: "Acessório opcional · café moído" },
    "american-drip-filter": { title: "Filtro drip americano", category: "Componentes de extração", description: "Componente de filtro drip para preparo de café em formato maior.", note: "Acessório opcional · café drip" },
    "brew-cup": { title: "Copo de preparo", category: "Acessórios de serviço", description: "Copo de preparo para completar o ritual de café portátil.", note: "Componente de serviço opcional" },
    "acrylic-stand-panels": { title: "Painéis de suporte acrílico", category: "Acessórios de exposição", description: "Conjunto de painéis acrílicos transparentes para exposição retail.", note: "Peça opcional para bundles" },
    "acrylic-machine-stand": { title: "Suporte acrílico para máquina", category: "Acessórios de exposição", description: "Suporte transparente para elevar a máquina e o copo na exposição.", note: "Peça opcional para bundles" },
  },
  fr: {
    "dg-capsule-base": { title: "Base capsule DG", category: "Adaptateurs capsule", description: "Base au format capsule pour les configurations café portables.", note: "Option · format DG" },
    "nes-capsule-base": { title: "Base capsule Nespresso", category: "Adaptateurs capsule", description: "Base capsule pour les configurations portables de type Nespresso.", note: "Option · format Nespresso" },
    "piercing-needle": { title: "Aiguille de perçage", category: "Composants d’extraction", description: "Composant de remplacement pour les ensembles d’extraction à capsule.", note: "Composant optionnel" },
    "coffee-powder-adapter": { title: "Adaptateur café moulu", category: "Composants d’extraction", description: "Composant café moulu pour une configuration portable flexible.", note: "Option · café moulu" },
    "american-drip-filter": { title: "Filtre drip américain", category: "Composants d’extraction", description: "Filtre drip pour une préparation café de plus grand format.", note: "Option · café drip" },
    "brew-cup": { title: "Gobelet d’extraction", category: "Accessoires de service", description: "Gobelet pour compléter le rituel café portable.", note: "Composant de service optionnel" },
    "acrylic-stand-panels": { title: "Panneaux de support acrylique", category: "Accessoires de présentation", description: "Panneaux acryliques transparents pour la présentation retail.", note: "Pièce optionnelle pour bundle" },
    "acrylic-machine-stand": { title: "Support acrylique machine", category: "Accessoires de présentation", description: "Support transparent pour surélever la machine et le gobelet.", note: "Pièce optionnelle pour bundle" },
  },
  ar: {
    "dg-capsule-base": { title: "قاعدة كبسولة DG", category: "محولات الكبسولات", description: "قاعدة كبسولات لإعدادات تحضير القهوة المحمولة.", note: "إضافة اختيارية · صيغة DG" },
    "nes-capsule-base": { title: "قاعدة كبسولة Nespresso", category: "محولات الكبسولات", description: "قاعدة كبسولات لإعدادات تحضير محمولة بنمط Nespresso.", note: "إضافة اختيارية · صيغة Nespresso" },
    "piercing-needle": { title: "إبرة الثقب", category: "مكونات الاستخلاص", description: "مكوّن بديل لمجموعات الاستخلاص المعتمدة على الكبسولات.", note: "مكوّن بديل اختياري" },
    "coffee-powder-adapter": { title: "محول القهوة المطحونة", category: "مكونات الاستخلاص", description: "مكوّن للقهوة المطحونة ضمن إعداد تحضير محمول مرن.", note: "إضافة اختيارية · قهوة مطحونة" },
    "american-drip-filter": { title: "فلتر التقطير الأمريكي", category: "مكونات الاستخلاص", description: "مكوّن فلتر بالتقطير لتحضير قهوة بحجم أكبر.", note: "إضافة اختيارية · قهوة بالتقطير" },
    "brew-cup": { title: "كوب التحضير", category: "ملحقات التقديم", description: "كوب تحضير لإكمال تجربة القهوة المحمولة.", note: "مكوّن تقديم اختياري" },
    "acrylic-stand-panels": { title: "ألواح الحامل الأكريليك", category: "ملحقات العرض", description: "مجموعة ألواح أكريليك شفافة لعرض المنتجات.", note: "قطعة اختيارية ضمن الطقم" },
    "acrylic-machine-stand": { title: "حامل آلة أكريليك", category: "ملحقات العرض", description: "حامل شفاف لرفع الآلة والكوب أثناء العرض.", note: "قطعة اختيارية ضمن الطقم" },
  },
  zh: {
    "dg-capsule-base": { title: "DG 胶囊底座", category: "胶囊适配配件", description: "用于便携式咖啡冲煮配置的 DG 胶囊规格底座。", note: "可选配件 · DG 胶囊规格" },
    "nes-capsule-base": { title: "Nespresso 胶囊底座", category: "胶囊适配配件", description: "用于 Nespresso 风格便携式冲煮配置的胶囊底座。", note: "可选配件 · Nespresso 胶囊规格" },
    "piercing-needle": { title: "刺针", category: "冲煮组件", description: "用于胶囊萃取组件的替换刺穿部件。", note: "可选替换组件" },
    "coffee-powder-adapter": { title: "咖啡粉适配器", category: "冲煮组件", description: "适用于咖啡粉冲煮方式的便携式组件。", note: "可选配件 · 咖啡粉规格" },
    "american-drip-filter": { title: "美式滴滤配件", category: "冲煮组件", description: "用于更大容量咖啡冲煮的滴滤组件。", note: "可选配件 · 滴滤规格" },
    "brew-cup": { title: "手冲杯", category: "盛装配件", description: "用于完成便携式咖啡冲煮体验的配套杯体。", note: "可选盛装组件" },
    "acrylic-stand-panels": { title: "亚克力支架面板", category: "展示配件", description: "用于零售陈列和产品展示的透明亚克力面板组。", note: "可选套餐展示配件" },
    "acrylic-machine-stand": { title: "亚克力咖啡机支架", category: "展示配件", description: "用于展示时抬高咖啡机和杯体的透明支架。", note: "可选套餐展示配件" },
  },
  ru: {
    "dg-capsule-base": { title: "Основание для капсул DG", category: "Адаптеры капсул", description: "Основание формата капсул для портативного приготовления кофе.", note: "Опция · формат DG" },
    "nes-capsule-base": { title: "Основание для капсул Nespresso", category: "Адаптеры капсул", description: "Основание для портативных конфигураций формата Nespresso.", note: "Опция · формат Nespresso" },
    "piercing-needle": { title: "Прокалывающая игла", category: "Компоненты экстракции", description: "Запасной компонент для капсульных систем экстракции.", note: "Опциональный запасной компонент" },
    "coffee-powder-adapter": { title: "Адаптер для молотого кофе", category: "Компоненты экстракции", description: "Компонент для молотого кофе в гибкой портативной конфигурации.", note: "Опция · молотый кофе" },
    "american-drip-filter": { title: "Американский drip-фильтр", category: "Компоненты экстракции", description: "Фильтр для приготовления кофе большего объёма.", note: "Опция · drip-кофе" },
    "brew-cup": { title: "Чашка для приготовления", category: "Аксессуары для подачи", description: "Чашка для завершения портативного кофейного ритуала.", note: "Опциональный компонент для подачи" },
    "acrylic-stand-panels": { title: "Акриловые панели подставки", category: "Аксессуары для выкладки", description: "Прозрачные акриловые панели для розничной выкладки.", note: "Опциональная деталь комплекта" },
    "acrylic-machine-stand": { title: "Акриловая подставка для машины", category: "Аксессуары для выкладки", description: "Прозрачная подставка для демонстрации машины и чашки.", note: "Опциональная деталь комплекта" },
  },
};

export function getAccessoryDisplay(slug: string, lang: Lang, fallback: AccessoryDisplay): AccessoryDisplay {
  return accessoryDisplay[lang]?.[slug] ?? fallback;
}

export const accessoryPageCopy: Record<Lang, {
  heroTitle: string; heroLead: string; bundleCta: string; exploreCta: string; photoLabel: string;
  catalogEyebrow: string; catalogTitle: string; catalogLead: string; planningEyebrow: string; planningTitle: string; planningLead: string; planningCta: string;
  matrixEyebrow: string; matrixTitle: string; matrixLead: string; modelLabel: string; optionalLabel: string;
}> = {
  en: { heroTitle: "Build the right coffee ritual around your machine.", heroLead: "Choose optional capsule adapters, brewing components, serving pieces and retail display elements for a machine order or a tailored bundle.", bundleCta: "Build an accessory bundle", exploreCta: "Explore machines", photoLabel: "Real TK Classic accessory photography", catalogEyebrow: "Optional add-ons", catalogTitle: "Choose the right extras for each order.", catalogLead: "Accessories can be selected individually or combined into a retail-ready coffee bundle after we confirm the machine and market requirements.", planningEyebrow: "Optional bundle planning", planningTitle: "Need a machine-plus-accessory set?", planningLead: "Tell us your target machine, capsule format and retail presentation. We will map the right optional combination for your program.", planningCta: "Start a conversation", matrixEyebrow: "Model compatibility", matrixTitle: "Every model can be configured with every add-on.", matrixLead: "All cells below are optional selections. Choose a model to open its accessory selector, then include the final combination in your inquiry.", modelLabel: "Model", optionalLabel: "Optional" },
  es: { heroTitle: "Crea el ritual de café adecuado para tu máquina.", heroLead: "Elige adaptadores de cápsula, componentes de preparación, piezas de servicio y elementos de exposición como opciones para tu pedido o bundle.", bundleCta: "Crear un bundle de accesorios", exploreCta: "Ver máquinas", photoLabel: "Fotografías reales de accesorios TK Classic", catalogEyebrow: "Accesorios opcionales", catalogTitle: "Elige los extras adecuados para cada pedido.", catalogLead: "Los accesorios pueden elegirse por separado o combinarse en un bundle retail después de confirmar el modelo y el mercado.", planningEyebrow: "Planificación de bundles", planningTitle: "¿Necesitas un set de máquina y accesorios?", planningLead: "Indícanos el modelo, el formato de cápsula y la presentación retail. Te propondremos la combinación opcional adecuada.", planningCta: "Iniciar conversación", matrixEyebrow: "Compatibilidad por modelo", matrixTitle: "Todos los modelos pueden configurarse con todos los accesorios.", matrixLead: "Todas las celdas representan opciones. Abre un modelo para seleccionar accesorios y añadirlos a tu consulta.", modelLabel: "Modelo", optionalLabel: "Opcional" },
  pt: { heroTitle: "Monte o ritual de café certo para a sua máquina.", heroLead: "Escolha adaptadores de cápsula, componentes de preparo, peças de serviço e elementos de exposição como opções para o pedido ou bundle.", bundleCta: "Montar bundle de acessórios", exploreCta: "Explorar máquinas", photoLabel: "Fotografias reais de acessórios TK Classic", catalogEyebrow: "Acessórios opcionais", catalogTitle: "Escolha os extras certos para cada pedido.", catalogLead: "Os acessórios podem ser escolhidos individualmente ou combinados em um bundle retail após confirmar o modelo e o mercado.", planningEyebrow: "Planejamento de bundle", planningTitle: "Precisa de um conjunto máquina + acessórios?", planningLead: "Informe o modelo, o formato de cápsula e a apresentação retail. Vamos indicar a combinação opcional adequada.", planningCta: "Iniciar conversa", matrixEyebrow: "Compatibilidade por modelo", matrixTitle: "Todos os modelos podem ser configurados com todos os acessórios.", matrixLead: "Todas as células são opções. Abra um modelo para selecionar acessórios e adicioná-los à consulta.", modelLabel: "Modelo", optionalLabel: "Opcional" },
  fr: { heroTitle: "Créez le rituel café adapté à votre machine.", heroLead: "Choisissez des adaptateurs capsule, composants d’extraction, pièces de service et éléments de présentation en option pour votre commande ou votre bundle.", bundleCta: "Créer un bundle d’accessoires", exploreCta: "Découvrir les machines", photoLabel: "Photos réelles des accessoires TK Classic", catalogEyebrow: "Accessoires optionnels", catalogTitle: "Choisissez les extras adaptés à chaque commande.", catalogLead: "Les accessoires peuvent être sélectionnés séparément ou combinés dans un bundle retail après confirmation du modèle et du marché.", planningEyebrow: "Planification de bundle", planningTitle: "Besoin d’un ensemble machine + accessoires ?", planningLead: "Indiquez le modèle, le format de capsule et la présentation retail. Nous proposerons la combinaison optionnelle adaptée.", planningCta: "Démarrer la conversation", matrixEyebrow: "Compatibilité par modèle", matrixTitle: "Chaque modèle peut être configuré avec tous les accessoires.", matrixLead: "Chaque cellule correspond à une option. Ouvrez un modèle pour sélectionner les accessoires et les ajouter à votre demande.", modelLabel: "Modèle", optionalLabel: "Option" },
  ar: { heroTitle: "أنشئ تجربة القهوة المناسبة لآلتك.", heroLead: "اختر محولات الكبسولات ومكونات التحضير وقطع التقديم وعناصر العرض كإضافات لطلب الآلة أو للطقم المخصص.", bundleCta: "إنشاء طقم ملحقات", exploreCta: "استكشف الآلات", photoLabel: "صور حقيقية لملحقات TK Classic", catalogEyebrow: "إضافات اختيارية", catalogTitle: "اختر الإضافات المناسبة لكل طلب.", catalogLead: "يمكن اختيار الملحقات بشكل منفصل أو جمعها في طقم للبيع بالتجزئة بعد تأكيد الطراز والسوق.", planningEyebrow: "تخطيط الطقم الاختياري", planningTitle: "هل تحتاج إلى مجموعة آلة وملحقات؟", planningLead: "أرسل الطراز وصيغة الكبسولة وطريقة العرض. سنقترح التركيبة الاختيارية المناسبة.", planningCta: "ابدأ المحادثة", matrixEyebrow: "التوافق حسب الطراز", matrixTitle: "يمكن تجهيز كل طراز مع جميع الإضافات.", matrixLead: "كل خلية تمثل خياراً اختيارياً. افتح الطراز لاختيار الملحقات وإضافتها إلى الاستفسار.", modelLabel: "الطراز", optionalLabel: "اختياري" },
  zh: { heroTitle: "为你的咖啡机搭配合适的咖啡体验。", heroLead: "可根据机器订单或定制套餐选择胶囊适配、冲煮组件、盛装配件和零售展示配件。", bundleCta: "组合配件套餐", exploreCta: "查看咖啡机", photoLabel: "TK Classic 真实配件图片", catalogEyebrow: "可选配件", catalogTitle: "为每个订单选择合适的配件。", catalogLead: "配件可以单独选配，也可以在确认型号和市场需求后组合成零售套餐。", planningEyebrow: "可选套餐规划", planningTitle: "需要咖啡机 + 配件组合吗？", planningLead: "告诉我们目标型号、胶囊规格和展示方式，我们会为你的项目整理合适的选配组合。", planningCta: "开始沟通", matrixEyebrow: "型号兼容关系", matrixTitle: "每个型号都可以组合全部配件。", matrixLead: "下方每个单元格都代表可选项。点击型号即可打开配件选择器，并将组合带入询盘。", modelLabel: "型号", optionalLabel: "可选" },
  ru: { heroTitle: "Соберите подходящий кофейный ритуал вокруг вашей машины.", heroLead: "Выбирайте адаптеры капсул, компоненты приготовления, элементы подачи и выкладки как опции к машине или индивидуальному комплекту.", bundleCta: "Собрать комплект аксессуаров", exploreCta: "Открыть машины", photoLabel: "Реальные фотографии аксессуаров TK Classic", catalogEyebrow: "Опциональные аксессуары", catalogTitle: "Выберите нужные дополнения для каждого заказа.", catalogLead: "Аксессуары можно выбрать отдельно или объединить в розничный комплект после подтверждения модели и рынка.", planningEyebrow: "Планирование комплекта", planningTitle: "Нужен комплект машина + аксессуары?", planningLead: "Укажите модель, формат капсул и выкладку. Мы предложим подходящую опциональную комбинацию.", planningCta: "Начать разговор", matrixEyebrow: "Совместимость моделей", matrixTitle: "Каждую модель можно настроить со всеми аксессуарами.", matrixLead: "Каждая ячейка является опцией. Откройте модель, выберите аксессуары и добавьте их в заявку.", modelLabel: "Модель", optionalLabel: "Опция" },
};

export const bundleOptionalNote: Record<Lang, string> = {
  en: "Accessories are optional and can be combined into the final bundle after model and market fit are confirmed.",
  es: "Los accesorios son opcionales y pueden combinarse en el bundle final después de confirmar el modelo y el mercado.",
  pt: "Os acessórios são opcionais e podem ser combinados no bundle final após confirmar o modelo e o mercado.",
  fr: "Les accessoires sont optionnels et peuvent être combinés dans le bundle final après confirmation du modèle et du marché.",
  ar: "الملحقات اختيارية ويمكن جمعها في الطقم النهائي بعد تأكيد الطراز والسوق.",
  zh: "配件为可选项目，可在确认型号和市场需求后组合到最终套餐中。",
  ru: "Аксессуары являются опциями и могут быть объединены в финальный комплект после подтверждения модели и рынка.",
};

export const footerCopy: Record<
  Lang,
  { description: string; phoneLabel: string; whatsappLabel: string; city: string }
> = {
  en: { description: "Factory-direct portable coffee machines, accessories, and OEM/ODM support for wholesale and private label buyers.", phoneLabel: "Phone", whatsappLabel: "WhatsApp", city: "Shenzhen, China" },
  es: { description: "Máquinas de café portátiles, accesorios y soporte OEM/ODM directo de fábrica para mayoristas y marcas private label.", phoneLabel: "Teléfono", whatsappLabel: "WhatsApp", city: "Shenzhen, China" },
  pt: { description: "Máquinas de café portáteis, acessórios e suporte OEM/ODM direto da fábrica para grossistas e marcas private label.", phoneLabel: "Telefone", whatsappLabel: "WhatsApp", city: "Shenzhen, China" },
  fr: { description: "Machines à café portables, accessoires et accompagnement OEM/ODM direct usine pour grossistes et marques private label.", phoneLabel: "Téléphone", whatsappLabel: "WhatsApp", city: "Shenzhen, Chine" },
  ar: { description: "آلات قهوة محمولة وملحقات ودعم OEM/ODM مباشر من المصنع للمشترين بالجملة والعلامات الخاصة.", phoneLabel: "الهاتف", whatsappLabel: "واتساب", city: "شنتشن، الصين" },
  zh: { description: "工厂直供便携式咖啡机、配件及 OEM/ODM 支持，服务批发商与私牌客户。", phoneLabel: "电话", whatsappLabel: "WhatsApp", city: "中国深圳" },
  ru: { description: "Портативные кофемашины, аксессуары и поддержка OEM/ODM напрямую с фабрики для оптовых и private label покупателей.", phoneLabel: "Телефон", whatsappLabel: "WhatsApp", city: "Шэньчжэнь, Китай" },
};
