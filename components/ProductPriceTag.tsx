import type { Lang, ProductPrice } from "@/lib/site-data";

type ProductPriceTagProps = {
  lang: Lang;
  price: ProductPrice;
  compact?: boolean;
};

const priceLabels: Record<
  Lang,
  {
    badge: string;
    original: string;
    promo: string;
    unit: string;
    save: string;
    note: string;
  }
> = {
  en: { badge: "Wholesale pricing", original: "List price", promo: "Wholesale from", unit: "/ unit", save: "Save", note: "Indicative wholesale price. Final quote depends on quantity, packaging and customization." },
  es: { badge: "Precio mayorista", original: "Precio de lista", promo: "Mayorista desde", unit: "/ unidad", save: "Ahorro", note: "Precio mayorista orientativo. La cotización final depende de la cantidad, el embalaje y la personalización." },
  pt: { badge: "Preço de atacado", original: "Preço de lista", promo: "Atacado desde", unit: "/ un.", save: "Economize", note: "Preço grossista indicativo. A cotação final depende da quantidade, embalagem e personalização." },
  fr: { badge: "Tarif grossiste", original: "Prix catalogue", promo: "Grossiste dès", unit: "/ pièce", save: "Économie", note: "Prix de gros indicatif. Le devis final dépend de la quantité, de l’emballage et de la personnalisation." },
  ar: { badge: "سعر الجملة", original: "سعر القائمة", promo: "سعر الجملة من", unit: "/ قطعة", save: "التوفير", note: "سعر جملة إرشادي. يعتمد العرض النهائي على الكمية والتغليف والتخصيص." },
  zh: { badge: "批发价", original: "参考价", promo: "批发起订价", unit: "/ 台", save: "节省", note: "此为参考批发价，最终报价取决于采购数量、包装方案与定制要求。" },
  ru: { badge: "Оптовая цена", original: "Цена по каталогу", promo: "Опт от", unit: "/ шт.", save: "Экономия", note: "Ориентировочная оптовая цена. Итоговое предложение зависит от количества, упаковки и персонализации." },
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function ProductPriceTag({ lang, price, compact = false }: ProductPriceTagProps) {
  const labels = priceLabels[lang];
  const saving = price.regular - price.sale;

  return (
    <div className={compact ? "price-tag is-compact" : "price-tag"}>
      <div className="price-head">
        <span>{labels.badge}</span>
        <small>
          {labels.save} {formatUsd(saving)}
        </small>
      </div>
      <div className="price-values" aria-label={`${labels.original} ${formatUsd(price.regular)}, ${labels.promo} ${formatUsd(price.sale)}`}>
        <span>
          {labels.original}
          <del>{formatUsd(price.regular)}</del>
        </span>
        <strong>
          {formatUsd(price.sale)}
          <small>{labels.unit}</small>
        </strong>
      </div>
      {!compact ? <p className="price-note">{labels.note}</p> : null}
    </div>
  );
}
