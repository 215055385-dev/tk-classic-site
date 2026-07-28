"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, PackageCheck, SlidersHorizontal } from "lucide-react";
import { ProductPriceTag } from "@/components/ProductPriceTag";
import type { Lang, ProductPrice } from "@/lib/site-data";

type InteractiveProduct = {
  model: string;
  summary: string;
  featureLabel: string;
  price: ProductPrice;
  spec: {
    pressure?: string;
    battery?: string;
    cup?: string;
    charging?: string;
    adapter?: string;
  };
};

type InteractiveBuyingToolsProps = {
  lang: Lang;
  products: InteractiveProduct[];
};

type BuyerScenario = "retail" | "gift" | "ecommerce" | "oem";
type BrandingChoice = "logo" | "box" | "color" | "bundle";
type AccessoryChoice = "adapter" | "bag" | "stand" | "filter";

const copy: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    lead: string;
    scenario: string;
    model: string;
    quantity: string;
    destination: string;
    branding: string;
    accessories: string;
    recommendation: string;
    quotePath: string;
    summary: string;
    copySummary: string;
    copied: string;
    sendInquiry: string;
    scenarioOptions: Record<BuyerScenario, string>;
    brandingOptions: Record<BrandingChoice, string>;
    accessoryOptions: Record<AccessoryChoice, string>;
    tierLabels: {
      sample: string;
      oem: string;
      packaging: string;
      odm: string;
    };
    fields: {
      pressure: string;
      battery: string;
      cup: string;
      charging: string;
      adapter: string;
    };
  }
> = {
  en: {
    eyebrow: "Interactive sourcing tools",
    title: "Build a quote-ready coffee machine program.",
    lead:
      "Choose use case, quantity, accessories and branding needs. The page generates a clearer model recommendation and inquiry summary before the buyer contacts sales.",
    scenario: "Use case",
    model: "Recommended model",
    quantity: "Purchase quantity",
    destination: "Destination market",
    branding: "Branding",
    accessories: "Accessories",
    recommendation: "Recommended setup",
    quotePath: "Quote path",
    summary: "Inquiry summary",
    copySummary: "Copy summary",
    copied: "Copied",
    sendInquiry: "Send with inquiry",
    scenarioOptions: {
      retail: "Retail shelf launch",
      gift: "Gift procurement",
      ecommerce: "Cross-border ecommerce",
      oem: "OEM / ODM private label",
    },
    brandingOptions: {
      logo: "Logo marking",
      box: "Gift box",
      color: "Private label color",
      bundle: "Retail bundle",
    },
    accessoryOptions: {
      adapter: "Capsule adapter",
      bag: "Carry bag",
      stand: "Display stand",
      filter: "Drip filter",
    },
    tierLabels: {
      sample: "Pilot order — confirm model and market fit first",
      oem: "OEM-ready path — logo customization and packaging can be scoped",
      packaging: "Packaging-efficient tier — stronger gift box and retail bundle planning",
      odm: "ODM-ready path — differentiated development can be scoped",
    },
    fields: {
      pressure: "Pressure",
      battery: "Battery",
      cup: "Cup",
      charging: "Charging",
      adapter: "Adapters",
    },
  },
  zh: {
    eyebrow: "互动采购工具",
    title: "先配置，再生成可询盘的咖啡机方案。",
    lead:
      "选择用途、数量、配件和品牌需求，页面会推荐型号、规划报价路径，并自动生成询盘摘要，降低买家沟通成本。",
    scenario: "采购用途",
    model: "推荐型号",
    quantity: "采购数量",
    destination: "目的市场",
    branding: "品牌定制",
    accessories: "配件组合",
    recommendation: "推荐套装",
    quotePath: "报价路径",
    summary: "询盘摘要",
    copySummary: "复制摘要",
    copied: "已复制",
    sendInquiry: "带去询盘",
    scenarioOptions: {
      retail: "零售上架",
      gift: "礼品采购",
      ecommerce: "跨境电商",
      oem: "OEM / ODM 私牌",
    },
    brandingOptions: {
      logo: "Logo 标识",
      box: "礼盒包装",
      color: "私牌颜色",
      bundle: "零售套装",
    },
    accessoryOptions: {
      adapter: "胶囊转接器",
      bag: "收纳包",
      stand: "陈列支架",
      filter: "滴滤配件",
    },
    tierLabels: {
      sample: "试单阶段：建议先确认型号和市场匹配度",
      oem: "OEM 路径：可规划 Logo 与包装定制",
      packaging: "包装优化等级：更适合礼盒、套装和零售包装规划",
      odm: "ODM 路径：可规划差异化开发",
    },
    fields: {
      pressure: "压力",
      battery: "电池",
      cup: "杯容量",
      charging: "充电",
      adapter: "转接器",
    },
  },
  es: {
    eyebrow: "Herramientas interactivas",
    title: "Configure un programa listo para cotizar.",
    lead: "Elija uso, cantidad, accesorios y branding para generar una recomendación y un resumen de consulta.",
    scenario: "Uso", model: "Modelo recomendado", quantity: "Cantidad", destination: "Mercado destino", branding: "Branding", accessories: "Accesorios", recommendation: "Setup recomendado", quotePath: "Ruta de cotización", summary: "Resumen", copySummary: "Copiar resumen", copied: "Copiado", sendInquiry: "Enviar consulta",
    scenarioOptions: { retail: "Lanzamiento retail", gift: "Compra de regalos", ecommerce: "Ecommerce cross-border", oem: "Private label OEM / ODM" },
    brandingOptions: { logo: "Logo", box: "Caja regalo", color: "Color private label", bundle: "Bundle retail" },
    accessoryOptions: { adapter: "Adaptador cápsula", bag: "Bolsa", stand: "Expositor", filter: "Filtro drip" },
    tierLabels: { sample: "Pedido piloto — confirmar modelo y mercado", oem: "Ruta OEM — definir logo y packaging", packaging: "Ruta de packaging — preparar cajas y bundles", odm: "Ruta ODM — definir desarrollo diferenciado" },
    fields: { pressure: "Presión", battery: "Batería", cup: "Taza", charging: "Carga", adapter: "Adaptadores" },
  },
  pt: {
    eyebrow: "Ferramentas interativas",
    title: "Configure um programa pronto para cotação.",
    lead: "Escolha uso, quantidade, acessórios e branding para gerar recomendação e resumo de consulta.",
    scenario: "Uso", model: "Modelo recomendado", quantity: "Quantidade", destination: "Mercado destino", branding: "Branding", accessories: "Acessórios", recommendation: "Setup recomendado", quotePath: "Rota de cotação", summary: "Resumo", copySummary: "Copiar resumo", copied: "Copiado", sendInquiry: "Enviar consulta",
    scenarioOptions: { retail: "Lançamento retail", gift: "Compra de brindes", ecommerce: "Ecommerce cross-border", oem: "Private label OEM / ODM" },
    brandingOptions: { logo: "Logo", box: "Caixa presente", color: "Cor private label", bundle: "Bundle retail" },
    accessoryOptions: { adapter: "Adaptador cápsula", bag: "Bolsa", stand: "Expositor", filter: "Filtro drip" },
    tierLabels: { sample: "Pedido piloto — confirmar modelo e mercado", oem: "Rota OEM — definir logo e embalagem", packaging: "Rota de embalagem — preparar caixas e bundles", odm: "Rota ODM — definir desenvolvimento diferenciado" },
    fields: { pressure: "Pressão", battery: "Bateria", cup: "Copo", charging: "Carga", adapter: "Adaptadores" },
  },
  fr: {
    eyebrow: "Outils interactifs",
    title: "Configurez un programme prêt à devis.",
    lead: "Choisissez usage, quantité, accessoires et branding pour générer recommandation et résumé.",
    scenario: "Usage", model: "Modèle recommandé", quantity: "Quantité", destination: "Marché cible", branding: "Branding", accessories: "Accessoires", recommendation: "Setup recommandé", quotePath: "Parcours de devis", summary: "Résumé", copySummary: "Copier", copied: "Copié", sendInquiry: "Envoyer",
    scenarioOptions: { retail: "Lancement retail", gift: "Achat cadeau", ecommerce: "Ecommerce cross-border", oem: "Private label OEM / ODM" },
    brandingOptions: { logo: "Logo", box: "Coffret cadeau", color: "Couleur private label", bundle: "Bundle retail" },
    accessoryOptions: { adapter: "Adaptateur capsule", bag: "Sac", stand: "Présentoir", filter: "Filtre drip" },
    tierLabels: { sample: "Commande pilote — confirmer modèle et marché", oem: "Parcours OEM — définir logo et packaging", packaging: "Parcours packaging — préparer coffrets et bundles", odm: "Parcours ODM — définir le développement différencié" },
    fields: { pressure: "Pression", battery: "Batterie", cup: "Tasse", charging: "Charge", adapter: "Adaptateurs" },
  },
  ar: {
    eyebrow: "أدوات شراء تفاعلية",
    title: "كوّن برنامج قهوة جاهزاً لطلب السعر.",
    lead: "اختر الاستخدام والكمية والملحقات والعلامة للحصول على توصية وملخص استفسار.",
    scenario: "الاستخدام", model: "النموذج المقترح", quantity: "الكمية", destination: "السوق", branding: "العلامة", accessories: "الملحقات", recommendation: "الإعداد المقترح", quotePath: "مسار عرض السعر", summary: "ملخص الاستفسار", copySummary: "نسخ الملخص", copied: "تم النسخ", sendInquiry: "إرسال الاستفسار",
    scenarioOptions: { retail: "إطلاق رفوف البيع", gift: "شراء الهدايا", ecommerce: "تجارة عابرة للحدود", oem: "علامة خاصة OEM / ODM" },
    brandingOptions: { logo: "شعار", box: "علبة هدية", color: "لون علامة خاصة", bundle: "حزمة بيع" },
    accessoryOptions: { adapter: "محول كبسولات", bag: "حقيبة", stand: "حامل عرض", filter: "فلتر تقطير" },
    tierLabels: { sample: "طلب تجريبي — تأكيد النموذج والسوق", oem: "مسار OEM — تحديد الشعار والتغليف", packaging: "مسار التغليف — إعداد الصناديق والحزم", odm: "مسار ODM — تحديد التطوير المميز" },
    fields: { pressure: "الضغط", battery: "البطارية", cup: "الكوب", charging: "الشحن", adapter: "المحولات" },
  },
  ru: {
    eyebrow: "Интерактивный подбор",
    title: "Соберите программу, готовую к запросу цены.",
    lead: "Выберите сценарий, количество, аксессуары и брендинг — сайт подготовит рекомендацию и резюме запроса.",
    scenario: "Сценарий", model: "Рекомендуемая модель", quantity: "Количество", destination: "Рынок", branding: "Брендинг", accessories: "Аксессуары", recommendation: "Рекомендуемый комплект", quotePath: "Путь к расчёту", summary: "Резюме запроса", copySummary: "Скопировать", copied: "Скопировано", sendInquiry: "Отправить запрос",
    scenarioOptions: { retail: "Запуск retail", gift: "Подарочная закупка", ecommerce: "Cross-border ecommerce", oem: "Private label OEM / ODM" },
    brandingOptions: { logo: "Логотип", box: "Подарочная коробка", color: "Цвет private label", bundle: "Retail-набор" },
    accessoryOptions: { adapter: "Адаптер капсул", bag: "Сумка", stand: "Стенд", filter: "Drip-фильтр" },
    tierLabels: { sample: "Пилотный заказ — проверить модель и рынок", oem: "Путь OEM — определить логотип и упаковку", packaging: "Путь упаковки — подготовить коробки и наборы", odm: "Путь ODM — определить отличающуюся разработку" },
    fields: { pressure: "Давление", battery: "Батарея", cup: "Чашка", charging: "Зарядка", adapter: "Адаптеры" },
  },
};

const scenarioRecommendations: Record<BuyerScenario, string> = {
  retail: "DQ-001",
  gift: "DQ-011",
  ecommerce: "DQ-010",
  oem: "DQ-002",
};

const scenarioDefaults: Record<BuyerScenario, AccessoryChoice[]> = {
  retail: ["adapter", "stand"],
  gift: ["bag", "adapter"],
  ecommerce: ["filter", "adapter"],
  oem: ["adapter", "bag", "stand"],
};

export function InteractiveBuyingTools({ lang, products }: InteractiveBuyingToolsProps) {
  const t = copy[lang];
  const [scenario, setScenario] = useState<BuyerScenario>("retail");
  const [selectedModel, setSelectedModel] = useState(scenarioRecommendations.retail);
  const [quantity, setQuantity] = useState(500);
  const [destination, setDestination] = useState("EU / UK");
  const [branding, setBranding] = useState<BrandingChoice[]>(["logo", "box"]);
  const [accessories, setAccessories] = useState<AccessoryChoice[]>(scenarioDefaults.retail);
  const [copied, setCopied] = useState(false);

  const recommended = products.find((product) => product.model === selectedModel) ?? products[0];
  const tier = getTier(quantity, t.tierLabels);
  const summary = useMemo(
    () =>
      [
        `${t.scenario}: ${t.scenarioOptions[scenario]}`,
        `${t.model}: ${selectedModel}`,
        `${t.quantity}: ${quantity.toLocaleString()} pcs`,
        `${t.destination}: ${destination}`,
        `${t.branding}: ${branding.map((item) => t.brandingOptions[item]).join(", ") || "-"}`,
        `${t.accessories}: ${accessories.map((item) => t.accessoryOptions[item]).join(", ") || "-"}`,
        `${t.quotePath}: ${tier}`,
      ].join("\n"),
    [accessories, branding, destination, quantity, scenario, selectedModel, t, tier],
  );

  function updateScenario(nextScenario: BuyerScenario) {
    setScenario(nextScenario);
    setSelectedModel(scenarioRecommendations[nextScenario]);
    setAccessories(scenarioDefaults[nextScenario]);
  }

  function toggleOption<T extends string>(value: T, selected: T[], setSelected: (items: T[]) => void) {
    setSelected(selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]);
  }

  async function copyInquirySummary() {
    await navigator.clipboard?.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="section interactive-tools-section" aria-label={t.eyebrow}>
      <div className="section-heading">
        <span>{t.eyebrow}</span>
        <h2>{t.title}</h2>
        <p>{t.lead}</p>
      </div>

      <div className="interactive-tools-layout">
        <div className="configurator-panel">
          <div className="tool-block">
            <div className="tool-block-heading">
              <SlidersHorizontal size={18} aria-hidden="true" />
              <h3>{t.scenario}</h3>
            </div>
            <div className="option-grid">
              {(Object.keys(t.scenarioOptions) as BuyerScenario[]).map((item) => (
                <button
                  className={scenario === item ? "is-selected" : ""}
                  key={item}
                  type="button"
                  onClick={() => updateScenario(item)}
                >
                  {t.scenarioOptions[item]}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-block">
            <div className="tool-block-heading">
              <PackageCheck size={18} aria-hidden="true" />
              <h3>{t.recommendation}</h3>
            </div>
            <div className="model-selector-row">
              {products.slice(0, 6).map((product) => (
                <button
                  className={selectedModel === product.model ? "is-selected" : ""}
                  key={product.model}
                  type="button"
                  onClick={() => setSelectedModel(product.model)}
                >
                  {product.model}
                </button>
              ))}
            </div>
            <article className="recommended-card">
              <strong>{recommended.model}</strong>
              <ProductPriceTag compact lang={lang} price={recommended.price} />
              <p>{recommended.summary}</p>
              <dl>
                <div>
                  <dt>{t.fields.pressure}</dt>
                  <dd>{recommended.spec.pressure}</dd>
                </div>
                <div>
                  <dt>{t.fields.battery}</dt>
                  <dd>{recommended.spec.battery}</dd>
                </div>
                <div>
                  <dt>{t.fields.adapter}</dt>
                  <dd>{recommended.spec.adapter}</dd>
                </div>
              </dl>
            </article>
          </div>

          <div className="tool-block split-tool-block">
            <label>
              <span>{t.quantity}</span>
              <input
                min={100}
                step={50}
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <label>
              <span>{t.destination}</span>
              <input value={destination} onChange={(event) => setDestination(event.target.value)} />
            </label>
          </div>

          <div className="tool-block two-column-options">
            <div>
              <h3>{t.branding}</h3>
              <div className="check-option-list">
                {(Object.keys(t.brandingOptions) as BrandingChoice[]).map((item) => (
                  <button
                    className={branding.includes(item) ? "is-selected" : ""}
                    key={item}
                    type="button"
                    onClick={() => toggleOption(item, branding, setBranding)}
                  >
                    <Check size={15} aria-hidden="true" />
                    {t.brandingOptions[item]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3>{t.accessories}</h3>
              <div className="check-option-list">
                {(Object.keys(t.accessoryOptions) as AccessoryChoice[]).map((item) => (
                  <button
                    className={accessories.includes(item) ? "is-selected" : ""}
                    key={item}
                    type="button"
                    onClick={() => toggleOption(item, accessories, setAccessories)}
                  >
                    <Check size={15} aria-hidden="true" />
                    {t.accessoryOptions[item]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="inquiry-summary-panel">
          <div className="summary-card">
            <span>{t.quotePath}</span>
            <strong>{tier}</strong>
            <p>{recommended.featureLabel}</p>
          </div>
          <div className="summary-card">
            <span>{t.summary}</span>
            <pre>{summary}</pre>
            <div className="summary-actions">
              <button type="button" onClick={copyInquirySummary}>
                <Clipboard size={16} aria-hidden="true" />
                {copied ? t.copied : t.copySummary}
              </button>
              <a href="#contact">{t.sendInquiry}</a>
            </div>
          </div>
        </aside>
      </div>

    </section>
  );
}

function getTier(quantity: number, labels: (typeof copy.en)["tierLabels"]) {
  if (quantity >= 2000) return labels.odm;
  if (quantity >= 1000) return labels.packaging;
  if (quantity >= 500) return labels.oem;
  return labels.sample;
}
