import type { Lang } from "@/lib/site-data";

export const inquiryCopy: Record<Lang, {
  attachments: string;
  attachmentHint: string;
  verification: string;
  verificationHint: string;
  successTitle: string;
  successBody: string;
  successNext: string;
  pendingTitle: string;
  pendingBody: string;
  pendingNext: string;
  referenceLabel: string;
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
    pendingTitle: "Your inquiry is safely saved.",
    pendingBody: "Your request is in our database, but one email notification is still pending. You do not need to submit the form again.",
    pendingNext: "If your request is urgent, contact us on WhatsApp and share the reference below.",
    referenceLabel: "Inquiry reference",
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
    pendingTitle: "Tu consulta se ha guardado de forma segura.",
    pendingBody: "Tu solicitud está en nuestra base de datos, pero una notificación por email sigue pendiente. No es necesario volver a enviarla.",
    pendingNext: "Si es urgente, escríbenos por WhatsApp e indica la referencia que aparece abajo.",
    referenceLabel: "Referencia de la consulta",
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
    pendingTitle: "O seu pedido foi guardado com segurança.",
    pendingBody: "O pedido está na nossa base de dados, mas uma notificação por email continua pendente. Não precisa de o enviar novamente.",
    pendingNext: "Se for urgente, contacte-nos pelo WhatsApp e indique a referência abaixo.",
    referenceLabel: "Referência do pedido",
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
    pendingTitle: "Votre demande est bien enregistrée.",
    pendingBody: "Votre demande est dans notre base de données, mais une notification par email est encore en attente. Il n'est pas nécessaire de la renvoyer.",
    pendingNext: "Si votre demande est urgente, contactez-nous sur WhatsApp en indiquant la référence ci-dessous.",
    referenceLabel: "Référence de la demande",
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
    pendingTitle: "تم حفظ طلبك بأمان.",
    pendingBody: "طلبك محفوظ في قاعدة بياناتنا، لكن أحد إشعارات البريد الإلكتروني ما زال قيد الإرسال. لا حاجة إلى إعادة تقديم الطلب.",
    pendingNext: "إذا كان الطلب عاجلاً، تواصل معنا عبر واتساب وأرسل الرقم المرجعي أدناه.",
    referenceLabel: "الرقم المرجعي للطلب",
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
    pendingTitle: "你的询盘已安全保存",
    pendingBody: "询盘已写入我们的数据库，但其中一封邮件通知仍待发送。请不要重复提交。",
    pendingNext: "如需求紧急，请通过 WhatsApp 联系我们，并提供下方询盘编号。",
    referenceLabel: "询盘编号",
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
    pendingTitle: "Ваш запрос надёжно сохранён.",
    pendingBody: "Запрос находится в нашей базе данных, но одно почтовое уведомление ещё ожидает отправки. Повторно отправлять форму не нужно.",
    pendingNext: "Если запрос срочный, напишите нам в WhatsApp и укажите номер ниже.",
    referenceLabel: "Номер запроса",
    backToContact: "Отправить новый запрос",
  },
};
