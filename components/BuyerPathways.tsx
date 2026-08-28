import Link from "next/link";
import { ArrowRight, Coffee, Mountain, ShoppingBag } from "lucide-react";
import type { Lang } from "@/lib/site-data";

const copy: Record<Lang, { eyebrow: string; title: string; lead: string; cards: Array<[string, string, string]> }> = {
  en: { eyebrow: "Choose your buying path", title: "Built around the questions different buyers actually ask.", lead: "Start with your route to market. Each guide keeps verified product facts separate from commercial items that must be confirmed in the quotation.", cards: [["Amazon & marketplace sellers", "Compare models, private label scope, packaging decisions and the information needed for a marketplace project.", "amazon-private-label"], ["Coffee brands", "Build an OEM brief around coffee formats, model data, branding, packaging and sample approval.", "coffee-brand-oem"], ["Outdoor wholesalers", "Review the models with published travel use cases and create a wholesale configuration without unverified durability claims.", "outdoor-wholesale"]] },
  es: { eyebrow: "Elija su ruta de compra", title: "Respuestas para cada tipo de comprador.", lead: "Empiece por su canal de venta y confirme los términos del proyecto en la cotización.", cards: [["Vendedores de marketplace", "Modelos, marca propia, packaging y datos necesarios para el proyecto.", "amazon-private-label"], ["Marcas de café", "Formatos de café, datos del modelo, marca, packaging y muestra.", "coffee-brand-oem"], ["Mayoristas outdoor", "Modelos con uso de viaje publicado y configuración mayorista verificable.", "outdoor-wholesale"]] },
  pt: { eyebrow: "Escolha seu caminho", title: "Respostas para cada tipo de comprador.", lead: "Comece pelo canal de venda e confirme os termos na cotação.", cards: [["Vendedores de marketplace", "Modelos, marca própria, embalagem e dados do projeto.", "amazon-private-label"], ["Marcas de café", "Formatos, dados do modelo, marca, embalagem e amostra.", "coffee-brand-oem"], ["Atacadistas outdoor", "Modelos com uso em viagens publicado e configuração verificável.", "outdoor-wholesale"]] },
  fr: { eyebrow: "Choisissez votre parcours", title: "Des réponses adaptées à chaque acheteur.", lead: "Partez de votre canal de vente et confirmez les conditions dans le devis.", cards: [["Vendeurs marketplace", "Modèles, marque blanche, packaging et données nécessaires.", "amazon-private-label"], ["Marques de café", "Formats, données modèle, identité, packaging et échantillon.", "coffee-brand-oem"], ["Grossistes outdoor", "Modèles associés au voyage et configuration vérifiable.", "outdoor-wholesale"]] },
  ar: { eyebrow: "اختر مسار الشراء", title: "إجابات تناسب كل نوع من المشترين.", lead: "ابدأ بقناة البيع ثم أكد شروط المشروع في عرض السعر.", cards: [["بائعو المنصات", "الطرازات والعلامة والتغليف وبيانات المشروع.", "amazon-private-label"], ["علامات القهوة", "صيغ القهوة وبيانات الطراز والعلامة والعينة.", "coffee-brand-oem"], ["تجار الجملة للأنشطة الخارجية", "طرازات السفر المنشورة وتكوين جملة قابل للتحقق.", "outdoor-wholesale"]] },
  zh: { eyebrow: "选择采购路径", title: "围绕不同采购商真正关心的问题展开。", lead: "从你的销售渠道开始，已核实的产品事实与需要在报价中确认的商业条款会分开说明。", cards: [["Amazon 与平台卖家", "比较型号、私牌范围、包装决策和平台项目所需信息。", "amazon-private-label"], ["咖啡品牌", "围绕咖啡规格、型号资料、品牌、包装和样品审批建立 OEM 需求。", "coffee-brand-oem"], ["户外用品批发商", "查看已公布旅行场景的型号，在不虚构耐用性数据的前提下配置批发方案。", "outdoor-wholesale"]] },
  ru: { eyebrow: "Выберите путь закупки", title: "Ответы для разных типов покупателей.", lead: "Начните с канала продаж и подтвердите условия проекта в предложении.", cards: [["Продавцы маркетплейсов", "Модели, private label, упаковка и данные проекта.", "amazon-private-label"], ["Кофейные бренды", "Форматы кофе, данные модели, брендинг, упаковка и образец.", "coffee-brand-oem"], ["Outdoor-оптовики", "Модели с опубликованными сценариями поездок и проверяемая комплектация.", "outdoor-wholesale"]] },
};

const icons = [ShoppingBag, Coffee, Mountain] as const;
const ctaLabel: Record<Lang, string> = {
  en: "Explore buyer path",
  es: "Explorar esta ruta",
  pt: "Explorar este caminho",
  fr: "Explorer ce parcours",
  ar: "استكشف مسار الشراء",
  zh: "查看采购路径",
  ru: "Открыть путь закупки",
};

export function BuyerPathways({ lang }: { lang: Lang }) {
  const content = copy[lang];
  return <section className="section buyer-pathways" aria-labelledby="buyer-pathways-title"><div className="section-heading align-left"><span>{content.eyebrow}</span><h2 id="buyer-pathways-title">{content.title}</h2><p>{content.lead}</p></div><div className="buyer-pathway-grid">{content.cards.map(([title, description, slug], index) => { const Icon=icons[index]; return <Link href={`/solutions/${slug}`} className="buyer-pathway-card" key={slug}><Icon size={24} aria-hidden="true" /><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p><strong>{ctaLabel[lang]}<ArrowRight size={16} aria-hidden="true" /></strong></Link>; })}</div></section>;
}
