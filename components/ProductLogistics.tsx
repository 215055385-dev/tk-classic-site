import Link from "next/link";
import { ArrowRight, Box, PackageCheck } from "lucide-react";
import { packingSpecifications } from "@/lib/commercial-data";
import type { Lang } from "@/lib/site-data";

const labels: Record<Lang, {
  eyebrow: string; title: string; lead: string; empty: string; note: string; cta: string;
  fields: string[];
}> = {
  en: { eyebrow: "Packing & logistics", title: "Plan cartons, freight and receiving with real model data.", lead: "Published packing details for procurement and logistics planning.", empty: "Packing specifications for this model are not published yet. Request the current packing sheet with your inquiry.", note: "Figures are supplier-provided planning data. Reconfirm the final configuration and packing details in the formal quotation before shipment.", cta: "Request the current packing sheet", fields: ["Product size", "Packaging size", "Product weight (as provided)", "Units / carton", "Master carton size", "Master carton gross weight"] },
  es: { eyebrow: "Embalaje y logística", title: "Planifique cajas, transporte y recepción con datos reales del modelo.", lead: "Datos de embalaje publicados para la planificación de compras y logística.", empty: "Las especificaciones de embalaje de este modelo aún no están publicadas. Solicite la ficha actualizada en su consulta.", note: "Datos de planificación facilitados por el proveedor. Confirme la configuración y el embalaje finales en la cotización antes del envío.", cta: "Solicitar ficha de embalaje", fields: ["Dimensiones del producto", "Dimensiones del embalaje", "Peso del producto (facilitado)", "Unidades / caja", "Dimensiones de la caja máster", "Peso bruto de la caja máster"] },
  pt: { eyebrow: "Embalagem e logística", title: "Planeje caixas, frete e recebimento com dados reais do modelo.", lead: "Dados de embalagem publicados para planejamento de compras e logística.", empty: "As especificações de embalagem deste modelo ainda não foram publicadas. Solicite a ficha atual na consulta.", note: "Dados de planejamento fornecidos pelo fornecedor. Confirme a configuração e a embalagem finais na cotação antes do envio.", cta: "Solicitar ficha de embalagem", fields: ["Dimensões do produto", "Dimensões da embalagem", "Peso do produto (informado)", "Unidades / caixa", "Dimensões da caixa master", "Peso bruto da caixa master"] },
  fr: { eyebrow: "Emballage et logistique", title: "Planifiez cartons, transport et réception avec les données réelles du modèle.", lead: "Données d'emballage publiées pour la planification des achats et de la logistique.", empty: "Les caractéristiques d'emballage de ce modèle ne sont pas encore publiées. Demandez la fiche actuelle avec votre demande.", note: "Données de planification fournies par le fournisseur. Confirmez la configuration et l'emballage définitifs dans le devis avant expédition.", cta: "Demander la fiche d'emballage", fields: ["Dimensions du produit", "Dimensions de l'emballage", "Poids du produit (fourni)", "Unités / carton", "Dimensions du carton maître", "Poids brut du carton maître"] },
  ar: { eyebrow: "التعبئة والخدمات اللوجستية", title: "خطط للكرتون والشحن والاستلام باستخدام بيانات حقيقية لكل طراز.", lead: "بيانات تعبئة منشورة لتخطيط المشتريات والخدمات اللوجستية.", empty: "لم تُنشر بعد مواصفات تعبئة هذا الطراز. اطلب ورقة التعبئة الحالية مع استفسارك.", note: "هذه بيانات تخطيط مقدمة من المورد. يجب إعادة تأكيد التكوين والتعبئة النهائية في عرض السعر الرسمي قبل الشحن.", cta: "اطلب ورقة التعبئة الحالية", fields: ["أبعاد المنتج", "أبعاد العبوة", "وزن المنتج (كما تم تقديمه)", "الوحدات / الكرتون", "أبعاد الكرتون الرئيسي", "الوزن الإجمالي للكرتون الرئيسي"] },
  zh: { eyebrow: "包装与物流", title: "使用真实型号数据规划装箱、运输与收货。", lead: "用于采购和物流规划的已确认包装资料。", empty: "该型号的包装规格暂未发布，请在询盘时索取最新包装资料。", note: "以上为供应商提供的规划数据；出货前请以正式报价单再次确认最终配置和包装资料。", cta: "索取最新包装资料", fields: ["产品尺寸", "包装尺寸", "产品重量（按提供资料）", "装箱数量", "整箱尺寸", "整箱毛重"] },
  ru: { eyebrow: "Упаковка и логистика", title: "Планируйте коробки, перевозку и приемку по реальным данным модели.", lead: "Опубликованные данные об упаковке для закупок и логистики.", empty: "Характеристики упаковки этой модели пока не опубликованы. Запросите актуальный упаковочный лист вместе с заявкой.", note: "Данные для планирования предоставлены поставщиком. Подтвердите окончательную комплектацию и упаковку в официальном предложении до отгрузки.", cta: "Запросить упаковочный лист", fields: ["Размер изделия", "Размер упаковки", "Вес изделия (по данным поставщика)", "Штук / короб", "Размер мастер-короба", "Вес брутто мастер-короба"] },
};

export function ProductLogistics({ model, lang, compact = false }: { model: string; lang: Lang; compact?: boolean }) {
  const specification = packingSpecifications[model];
  const copy = labels[lang];
  const query = lang === "en" ? "" : `?lang=${lang}`;
  const values = specification ? [specification.productSize, specification.packagingSize, specification.productWeight, specification.unitsPerCarton, specification.masterCartonSize, specification.masterCartonGrossWeight] : [];

  return (
    <section className={`product-logistics${compact ? " is-compact" : ""}`} aria-labelledby={`packing-title-${model}`}>
      <div className="product-logistics-intro">
        <span><Box size={16} aria-hidden="true" />{copy.eyebrow}</span>
        <h2 id={`packing-title-${model}`}>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      {specification ? (
        <>
          <dl className="packing-spec-grid">
            {copy.fields.map((field, index) => <div key={field}><dt>{field}</dt><dd>{values[index]}</dd></div>)}
          </dl>
          <p className="packing-data-note"><PackageCheck size={17} aria-hidden="true" />{copy.note}</p>
        </>
      ) : <p className="packing-empty-state">{copy.empty}</p>}
      <Link className="packing-sheet-link" href={`/contact${query}#inquiry-form`}>{copy.cta}<ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
  );
}
