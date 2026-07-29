import type { Lang } from "@/lib/site-data";

export const inquiryCopy: Record<Lang, {
  attachments: string;
  attachmentHint: string;
  verification: string;
  verificationHint: string;
  successTitle: string;
  successBody: string;
  successNext: string;
  backToContact: string;
}> = {
  en: {
    attachments: "Reference files",
    attachmentHint: "Optional: logo, packaging brief or purchase file. Up to 3 files, 5 MB each.",
    verification: "Quick verification",
    verificationHint: "This helps us block automated spam.",
    successTitle: "Your inquiry is on its way.",
    successBody: "We saved your request and sent it to the TK Classic sales team. You will receive a confirmation email shortly.",
    successNext: "Our team will review your model, quantity and branding notes before replying.",
    backToContact: "Send another inquiry",
  },
  es: {
    attachments: "Archivos de referencia",
    attachmentHint: "Opcional: logotipo, brief de packaging o documento de compra. Hasta 3 archivos de 5 MB cada uno.",
    verification: "Verificación rápida",
    verificationHint: "Ayuda a bloquear el spam automatizado.",
    successTitle: "Tu consulta ha sido enviada.",
    successBody: "Guardamos tu solicitud y la enviamos al equipo comercial de TK Classic. Recibirás un email de confirmación pronto.",
    successNext: "Revisaremos el modelo, la cantidad y las necesidades de marca antes de responder.",
    backToContact: "Enviar otra consulta",
  },
  pt: {
    attachments: "Ficheiros de referência",
    attachmentHint: "Opcional: logótipo, briefing de embalagem ou documento de compra. Até 3 ficheiros de 5 MB cada.",
    verification: "Verificação rápida",
    verificationHint: "Ajuda a bloquear spam automatizado.",
    successTitle: "O seu pedido foi enviado.",
    successBody: "Guardámos o seu pedido e enviámo-lo à equipa comercial da TK Classic. Receberá um email de confirmação em breve.",
    successNext: "Vamos rever o modelo, a quantidade e as necessidades de marca antes de responder.",
    backToContact: "Enviar outro pedido",
  },
  fr: {
    attachments: "Fichiers de référence",
    attachmentHint: "Facultatif : logo, brief packaging ou document d'achat. Jusqu'à 3 fichiers de 5 Mo chacun.",
    verification: "Vérification rapide",
    verificationHint: "Cela aide à bloquer les spams automatisés.",
    successTitle: "Votre demande a été envoyée.",
    successBody: "Nous avons enregistré votre demande et l'avons transmise à l'équipe commerciale TK Classic. Vous recevrez bientôt un email de confirmation.",
    successNext: "Nous vérifierons le modèle, la quantité et les besoins de marque avant de répondre.",
    backToContact: "Envoyer une autre demande",
  },
  ar: {
    attachments: "ملفات مرجعية",
    attachmentHint: "اختياري: الشعار أو موجز التغليف أو ملف الشراء. حتى 3 ملفات، 5 ميغابايت لكل ملف.",
    verification: "تحقق سريع",
    verificationHint: "يساعدنا ذلك على حظر الرسائل المزعجة الآلية.",
    successTitle: "تم إرسال طلبك.",
    successBody: "حفظنا طلبك وأرسلناه إلى فريق مبيعات TK Classic. ستصلك رسالة تأكيد قريباً.",
    successNext: "سنراجع الطراز والكمية واحتياجات العلامة التجارية قبل الرد.",
    backToContact: "إرسال طلب آخر",
  },
  zh: {
    attachments: "参考文件",
    attachmentHint: "可选：Logo、包装方案或采购文件。最多 3 个文件，每个不超过 5MB。",
    verification: "快速验证",
    verificationHint: "用于拦截自动化垃圾提交。",
    successTitle: "询盘已成功提交",
    successBody: "我们已保存你的需求，并同步发送给 TK Classic 销售团队。确认邮件会很快发送到你的邮箱。",
    successNext: "销售团队会先核对型号、数量和品牌需求，再与你联系。",
    backToContact: "继续提交新的询盘",
  },
  ru: {
    attachments: "Справочные файлы",
    attachmentHint: "Необязательно: логотип, бриф по упаковке или файл закупки. До 3 файлов по 5 МБ каждый.",
    verification: "Быстрая проверка",
    verificationHint: "Помогает блокировать автоматический спам.",
    successTitle: "Ваш запрос отправлен.",
    successBody: "Мы сохранили запрос и отправили его команде продаж TK Classic. Вскоре вы получите письмо-подтверждение.",
    successNext: "Перед ответом мы проверим модель, количество и требования к бренду.",
    backToContact: "Отправить новый запрос",
  },
};
