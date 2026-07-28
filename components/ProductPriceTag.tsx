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
  }
> = {
  en: { badge: "Wholesale pricing", original: "List price", promo: "Wholesale from", unit: "/ unit", save: "Save" },
  es: { badge: "Precio mayorista", original: "Precio de lista", promo: "Mayorista desde", unit: "/ unidad", save: "Ahorro" },
  pt: { badge: "Preço de atacado", original: "Preço de lista", promo: "Atacado desde", unit: "/ un.", save: "Economize" },
  fr: { badge: "Tarif grossiste", original: "Prix catalogue", promo: "Grossiste dès", unit: "/ pièce", save: "Économie" },
  ar: { badge: "سعر الجملة", original: "سعر القائمة", promo: "سعر الجملة من", unit: "/ قطعة", save: "التوفير" },
  zh: { badge: "批发价", original: "参考价", promo: "批发起订价", unit: "/ 台", save: "节省" },
  ru: { badge: "Оптовая цена", original: "Цена по каталогу", promo: "Опт от", unit: "/ шт.", save: "Экономия" },
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
    </div>
  );
}
