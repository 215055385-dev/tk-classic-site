import { MessageSquareQuote } from "lucide-react";
import type { Lang } from "@/lib/site-data";

type ProductPriceTagProps = {
  lang: Lang;
  compact?: boolean;
};

const quoteLabels: Record<Lang, { badge: string; title: string; note: string }> = {
  en: { badge: "Project quotation", title: "Pricing confirmed for your order", note: "Share the model, quantity, destination, packaging and branding requirements for a written quotation." },
  es: { badge: "Cotización de proyecto", title: "Precio confirmado para su pedido", note: "Indique modelo, cantidad, destino, embalaje y personalización para recibir una cotización por escrito." },
  pt: { badge: "Cotação do projeto", title: "Preço confirmado para o seu pedido", note: "Informe modelo, quantidade, destino, embalagem e personalização para receber uma cotação por escrito." },
  fr: { badge: "Devis de projet", title: "Tarif confirmé pour votre commande", note: "Indiquez le modèle, la quantité, la destination, l'emballage et la personnalisation pour recevoir un devis écrit." },
  ar: { badge: "عرض سعر للمشروع", title: "يتم تأكيد السعر حسب طلبك", note: "أرسل الطراز والكمية والوجهة والتغليف ومتطلبات العلامة التجارية للحصول على عرض سعر مكتوب." },
  zh: { badge: "项目报价", title: "按实际订单确认价格", note: "提交型号、数量、目的市场、包装和品牌定制要求，获取书面报价。" },
  ru: { badge: "Расчёт проекта", title: "Цена подтверждается для вашего заказа", note: "Укажите модель, объём, направление, упаковку и брендинг, чтобы получить письменное предложение." },
};

export function ProductPriceTag({ lang, compact = false }: ProductPriceTagProps) {
  const labels = quoteLabels[lang];

  return (
    <div className={compact ? "quote-scope-card is-compact" : "quote-scope-card"}>
      <MessageSquareQuote size={compact ? 17 : 20} aria-hidden="true" />
      <div>
        <span>{labels.badge}</span>
        <strong>{labels.title}</strong>
        {!compact ? <p>{labels.note}</p> : null}
      </div>
    </div>
  );
}
