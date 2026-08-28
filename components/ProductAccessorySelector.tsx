"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, PackagePlus } from "lucide-react";
import { useState } from "react";
import { accessories } from "@/lib/accessory-data";
import type { Lang } from "@/lib/site-data";
import { getAccessoryDisplay } from "@/lib/translation-copy";

type ProductAccessorySelectorProps = {
  lang: Lang;
  model: string;
};

const labels: Record<Lang, {
  eyebrow: string;
  title: string;
  lead: string;
  optional: string;
  selected: string;
  none: string;
  addToInquiry: string;
}> = {
  en: { eyebrow: "Optional add-ons", title: "Choose accessories for this model.", lead: "Every listed accessory can be selected for every TK Classic model. We confirm the final combination with your order brief.", optional: "Optional for every model", selected: "Selected", none: "No accessories selected yet", addToInquiry: "Add selection to inquiry" },
  es: { eyebrow: "Accesorios opcionales", title: "Elija accesorios para este modelo.", lead: "Cada accesorio listado puede seleccionarse para cualquier modelo TK Classic. Confirmamos la combinación final con su solicitud.", optional: "Opcional para todos los modelos", selected: "Seleccionados", none: "Aún no hay accesorios seleccionados", addToInquiry: "Añadir a la consulta" },
  pt: { eyebrow: "Acessórios opcionais", title: "Escolha acessórios para este modelo.", lead: "Todos os acessórios listados podem ser selecionados para qualquer modelo TK Classic. Confirmamos a combinação final no seu pedido.", optional: "Opcional para todos os modelos", selected: "Selecionados", none: "Nenhum acessório selecionado", addToInquiry: "Adicionar à consulta" },
  fr: { eyebrow: "Accessoires optionnels", title: "Choisissez les accessoires de ce modèle.", lead: "Chaque accessoire listé peut être sélectionné pour chaque modèle TK Classic. Nous confirmons la combinaison finale avec votre brief.", optional: "Optionnel pour chaque modèle", selected: "Sélectionnés", none: "Aucun accessoire sélectionné", addToInquiry: "Ajouter à la demande" },
  ar: { eyebrow: "ملحقات اختيارية", title: "اختر الملحقات لهذا الطراز.", lead: "يمكن اختيار كل ملحق مع كل طراز من TK Classic. نؤكد التركيبة النهائية مع تفاصيل طلبك.", optional: "اختياري لكل الطرازات", selected: "المحدد", none: "لم يتم اختيار ملحقات بعد", addToInquiry: "إضافة الاختيار إلى الاستفسار" },
  zh: { eyebrow: "可选配件", title: "为此型号选择配件。", lead: "当前展示的每个配件都可以与每个 TK Classic 型号组合选配，最终组合会在询盘中确认。", optional: "所有型号均可选配", selected: "已选择", none: "暂未选择配件", addToInquiry: "将选配加入询盘" },
  ru: { eyebrow: "Опциональные аксессуары", title: "Выберите аксессуары для этой модели.", lead: "Каждый представленный аксессуар можно выбрать для любой модели TK Classic. Финальную комбинацию мы подтвердим в заявке.", optional: "Опция для каждой модели", selected: "Выбрано", none: "Аксессуары пока не выбраны", addToInquiry: "Добавить выбор в заявку" },
};

export function ProductAccessorySelector({ lang, model }: ProductAccessorySelectorProps) {
  const selectableAccessories = accessories.filter((item) => item.modelSelectable !== false);
  const t = labels[lang];
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug]);
  }

  const selectedNames = selectableAccessories.filter((item) => selected.includes(item.slug)).map((item) => getAccessoryDisplay(item.slug, lang, item).title);
  const languageParam = lang === "en" ? "" : `&lang=${lang}`;
  const inquiryHref = `/contact?product=${encodeURIComponent(model)}${selectedNames.length ? `&accessories=${encodeURIComponent(selectedNames.join(", "))}` : ""}${languageParam}`;

  return (
    <section id="accessory-selector" className="section product-accessory-selector" aria-labelledby="accessory-selector-title">
      <div className="section-heading align-left">
        <span><PackagePlus size={16} aria-hidden="true" />{t.eyebrow}</span>
        <h2 id="accessory-selector-title">{t.title}</h2>
        <p>{t.lead}</p>
      </div>
      <div className="product-accessory-grid">
        {selectableAccessories.map((accessory) => {
          const isSelected = selected.includes(accessory.slug);
          return (
            <button
              className={`product-accessory-option${isSelected ? " is-selected" : ""}`}
              type="button"
              aria-pressed={isSelected}
              key={accessory.slug}
              onClick={() => toggle(accessory.slug)}
            >
              <span className="product-accessory-option-image"><Image src={accessory.image} alt={accessory.title} fill sizes="(max-width: 720px) 42vw, 150px" quality={75} /></span>
              <span className="product-accessory-option-copy"><strong>{getAccessoryDisplay(accessory.slug, lang, accessory).title}</strong><small>{t.optional}</small></span>
              <span className="product-accessory-check" aria-hidden="true"><Check size={15} /></span>
            </button>
          );
        })}
      </div>
      <div className="product-accessory-summary">
        <div>
          <span>{t.selected}: {selected.length}</span>
          <p>{selectedNames.length ? selectedNames.join(", ") : t.none}</p>
        </div>
        <Link className="primary-action" href={inquiryHref}>{t.addToInquiry}</Link>
      </div>
    </section>
  );
}
