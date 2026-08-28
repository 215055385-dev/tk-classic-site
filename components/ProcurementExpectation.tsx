import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, CreditCard, FileCheck2, PackageCheck, Puzzle } from "lucide-react";
import type { Lang } from "@/lib/site-data";

type ProcurementCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  items: Array<[string, string]>;
  stepsTitle: string;
  steps: string[];
  cta: string;
};

const content: Record<Lang, ProcurementCopy> = {
  en: {
    eyebrow: "Procurement clarity",
    title: "Know what will be confirmed before you place an order.",
    lead: "Commercial terms are confirmed in writing for the selected model, destination market and customization plan.",
    items: [["MOQ", "Discussed after inquiry for the selected model and customization scope."], ["Paid sample", "The sample fee is credited against the bulk-order amount after a mass-production order is placed."], ["Timing", "Samples dispatch within 7 days. Mass production is generally around 35 days, subject to quantity and approved scope."], ["Payment", "T/T, PayPal and Western Union are supported."], ["Customization & accessories", "Full-process OEM/ODM, logo, packaging and compatible accessory selection are available, subject to written confirmation."], ["Compliance documents", "Available after inquiry according to the selected model and destination market."]],
    stepsTitle: "What happens after you submit",
    steps: ["We review the model, market, estimated quantity, branding, packaging and accessory brief.", "We confirm the sample configuration and collect the sample fee.", "You receive a written quotation covering MOQ, payment, approvals and lead-time planning.", "After sample approval, production is scheduled; the sample fee is credited when the bulk order is placed."],
    cta: "Review the OEM process",
  },
  es: {
    eyebrow: "Claridad de compra", title: "Sepa qué se confirmará antes de realizar el pedido.", lead: "Las condiciones comerciales se confirman por escrito según el modelo, el mercado de destino y el plan de personalización.",
    items: [["MOQ", "Se acuerda después de la consulta según el modelo y la personalización."], ["Muestra de pago", "El coste de la muestra se descuenta del pedido a granel tras formalizar el pedido de producción."], ["Plazos", "La muestra se envía en un plazo de 7 días. La producción suele tardar unos 35 días, según cantidad y alcance aprobado."], ["Pago", "Se acepta T/T, PayPal y Western Union."], ["Personalización y accesorios", "Se ofrece OEM/ODM integral, logotipo, embalaje y selección de accesorios compatibles, sujeto a confirmación escrita."], ["Documentos de conformidad", "Disponibles tras la consulta según el modelo y el mercado de destino."]],
    stepsTitle: "Qué ocurre después de enviar la consulta", steps: ["Revisamos modelo, mercado, cantidad estimada, marca, embalaje y accesorios.", "Confirmamos la configuración y cobramos la muestra.", "Recibe una cotización escrita con MOQ, pago, aprobaciones y planificación de plazos.", "Tras aprobar la muestra, se programa la producción y su coste se descuenta al realizar el pedido a granel."], cta: "Ver el proceso OEM",
  },
  pt: {
    eyebrow: "Clareza de compra", title: "Saiba o que será confirmado antes de fazer o pedido.", lead: "As condições comerciais são confirmadas por escrito conforme o modelo, o mercado de destino e o plano de personalização.",
    items: [["MOQ", "Definido após a consulta conforme modelo e personalização."], ["Amostra paga", "O valor da amostra é abatido do pedido em volume após a colocação do pedido de produção."], ["Prazos", "A amostra é enviada em até 7 dias. A produção leva geralmente cerca de 35 dias, conforme quantidade e escopo aprovado."], ["Pagamento", "Aceitamos T/T, PayPal e Western Union."], ["Personalização e acessórios", "OEM/ODM completo, logotipo, embalagem e acessórios compatíveis estão disponíveis, sujeitos a confirmação por escrito."], ["Documentos de conformidade", "Disponíveis após a consulta conforme o modelo e o mercado de destino."]],
    stepsTitle: "O que acontece após o envio", steps: ["Analisamos modelo, mercado, quantidade estimada, marca, embalagem e acessórios.", "Confirmamos a configuração e cobramos a amostra.", "Você recebe uma cotação escrita com MOQ, pagamento, aprovações e prazos.", "Após a aprovação da amostra, a produção é programada e o valor da amostra é abatido no pedido em volume."], cta: "Ver o processo OEM",
  },
  fr: {
    eyebrow: "Clarté des achats", title: "Sachez ce qui sera confirmé avant de commander.", lead: "Les conditions commerciales sont confirmées par écrit selon le modèle, le marché de destination et le plan de personnalisation.",
    items: [["MOQ", "Définie après demande selon le modèle et la personnalisation."], ["Échantillon payant", "Le coût de l'échantillon est déduit de la commande en volume après validation de la commande de production."], ["Délais", "L'échantillon est expédié sous 7 jours. La production prend généralement environ 35 jours, selon la quantité et le périmètre approuvé."], ["Paiement", "T/T, PayPal et Western Union sont acceptés."], ["Personnalisation et accessoires", "OEM/ODM complet, logo, emballage et accessoires compatibles sont proposés, sous réserve de confirmation écrite."], ["Documents de conformité", "Disponibles après demande selon le modèle et le marché de destination."]],
    stepsTitle: "Après l'envoi de votre demande", steps: ["Nous vérifions le modèle, le marché, la quantité estimée, la marque, l'emballage et les accessoires.", "Nous confirmons la configuration et facturons l'échantillon.", "Vous recevez un devis écrit couvrant MOQ, paiement, validations et délais.", "Après validation de l'échantillon, la production est planifiée et son coût est déduit de la commande en volume."], cta: "Voir le processus OEM",
  },
  ar: {
    eyebrow: "وضوح المشتريات", title: "اعرف ما سيتم تأكيده قبل تقديم الطلب.", lead: "تُؤكد الشروط التجارية كتابياً وفق الطراز والسوق المستهدف وخطة التخصيص.",
    items: [["الحد الأدنى للطلب", "يُناقش بعد الاستفسار وفق الطراز ونطاق التخصيص."], ["عينة مدفوعة", "تُخصم رسوم العينة من قيمة الطلب بالجملة بعد تقديم طلب الإنتاج."], ["المدة", "تُشحن العينة خلال 7 أيام. يستغرق الإنتاج عادة نحو 35 يوماً حسب الكمية والنطاق المعتمد."], ["الدفع", "تتوفر طرق T/T وPayPal وWestern Union."], ["التخصيص والملحقات", "يتوفر دعم OEM/ODM الكامل وتخصيص الشعار والتعبئة واختيار الملحقات المتوافقة، بعد التأكيد الكتابي."], ["مستندات المطابقة", "تتوفر بعد الاستفسار وفق الطراز والسوق المستهدف."]],
    stepsTitle: "ماذا يحدث بعد إرسال الاستفسار", steps: ["نراجع الطراز والسوق والكمية التقديرية والعلامة والتعبئة والملحقات.", "نؤكد تكوين العينة ونحصّل رسومها.", "تتلقى عرض سعر مكتوباً يشمل الحد الأدنى والدفع والموافقات والمدة.", "بعد اعتماد العينة يُجدول الإنتاج وتُخصم رسوم العينة عند تقديم الطلب بالجملة."], cta: "عرض عملية OEM",
  },
  zh: {
    eyebrow: "采购信息说明", title: "下单前，明确每一项需要书面确认的内容。", lead: "商业条款会根据所选型号、目标市场和定制方案以书面形式确认。",
    items: [["起订量", "根据所选型号和定制范围，在询盘后沟通确认。"], ["付费样品", "下达大货生产订单后，样品费可抵扣大货订单金额。"], ["交期", "样品下单后 7 天内发出；大货通常约 35 天，具体以数量和确认方案为准。"], ["付款方式", "支持 T/T、PayPal 和 Western Union。"], ["定制与配件", "支持全流程 OEM/ODM、Logo、包装和兼容配件选择，最终范围以书面确认为准。"], ["合规资料", "根据所选型号和目标市场，在询盘后按需提供。"]],
    stepsTitle: "提交询盘后会发生什么", steps: ["审核型号、市场、预计数量、品牌、包装和配件需求。", "确认样品配置并收取样品费。", "提供包含起订量、付款、审批和交期规划的书面报价。", "样品确认后安排生产；下达大货订单时抵扣样品费。"], cta: "查看 OEM 流程",
  },
  ru: {
    eyebrow: "Прозрачность закупки", title: "Узнайте, что будет подтверждено до размещения заказа.", lead: "Коммерческие условия письменно подтверждаются для выбранной модели, рынка назначения и плана персонализации.",
    items: [["MOQ", "Обсуждается после запроса с учетом модели и объема персонализации."], ["Платный образец", "Стоимость образца засчитывается в сумму оптового заказа после размещения производственного заказа."], ["Сроки", "Образец отправляется в течение 7 дней. Производство обычно занимает около 35 дней в зависимости от количества и утвержденного объема работ."], ["Оплата", "Поддерживаются T/T, PayPal и Western Union."], ["Персонализация и аксессуары", "Доступны полный цикл OEM/ODM, логотип, упаковка и выбор совместимых аксессуаров с письменным подтверждением."], ["Документы соответствия", "Предоставляются после запроса в зависимости от модели и рынка назначения."]],
    stepsTitle: "Что происходит после отправки запроса", steps: ["Мы проверяем модель, рынок, предполагаемый объем, брендинг, упаковку и аксессуары.", "Подтверждаем комплектацию и оплату образца.", "Вы получаете письменное предложение с MOQ, оплатой, согласованиями и сроками.", "После утверждения образца планируется производство; его стоимость засчитывается при размещении оптового заказа."], cta: "Посмотреть процесс OEM",
  },
};

const icons = [PackageCheck, BadgeCheck, Clock3, CreditCard, Puzzle, FileCheck2] as const;

export function ProcurementExpectation({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const copy = content[lang];
  const query = lang === "en" ? "" : `?lang=${lang}`;
  return (
    <div className={`procurement-expectation${compact ? " is-compact" : ""}`} aria-labelledby={`procurement-title-${compact ? "compact" : "full"}`}>
      <div className="procurement-intro">
        <span>{copy.eyebrow}</span>
        <h2 id={`procurement-title-${compact ? "compact" : "full"}`}>{copy.title}</h2>
        <p>{copy.lead}</p>
        <Link href={`/oem-odm${query}`}>{copy.cta}<ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="procurement-content">
        <div className="procurement-facts">
          {copy.items.map(([title, description], index) => {
            const Icon = icons[index];
            return <div key={title}><Icon size={18} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span></div>;
          })}
        </div>
        <div className="procurement-next-steps">
          <h3>{copy.stepsTitle}</h3>
          <ol>{copy.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
        </div>
      </div>
    </div>
  );
}
