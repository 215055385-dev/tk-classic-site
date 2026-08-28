import type { Lang } from "@/lib/site-data";

/** Public-facing certification wording. The underlying files stay private. */
export const certificationRequestCopy: Record<Lang, string> = {
  en: "Certification documents are provided after inquiry, based on the model and market.",
  es: "Los documentos de certificación se proporcionan después de la consulta, según el modelo y el mercado.",
  pt: "Os documentos de certificação são fornecidos após a consulta, de acordo com o modelo e o mercado.",
  fr: "Les documents de certification sont fournis après demande, selon le modèle et le marché.",
  ar: "تُقدَّم مستندات الشهادات بعد إرسال الاستفسار، وفقًا للطراز والسوق.",
  zh: "认证资料将在提交询盘后，根据型号和目标市场按需提供。",
  ru: "Сертификационные документы предоставляются после запроса с учетом модели и рынка.",
};

export const certificationPreviewCopy: Record<Lang, string> = {
  en: "Document overview · preview only",
  es: "Resumen documental · solo vista previa",
  pt: "Visão geral dos documentos · apenas pré-visualização",
  fr: "Aperçu des documents · consultation uniquement",
  ar: "نظرة عامة على المستندات · للمعاينة فقط",
  zh: "认证资料总览 · 仅供缩影展示",
  ru: "Обзор документов · только предпросмотр",
};

export const certificationCtaCopy: Record<Lang, string> = {
  en: "Request certification documents",
  es: "Solicitar documentos de certificación",
  pt: "Solicitar documentos de certificação",
  fr: "Demander les documents de certification",
  ar: "طلب مستندات الشهادات",
  zh: "询盘索取认证资料",
  ru: "Запросить сертификационные документы",
};
