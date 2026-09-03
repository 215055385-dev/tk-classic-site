import { Resend } from "resend";
import { uiCopy } from "@/lib/localized-ui";
import { company, type Lang } from "@/lib/site-data";
import { getDatabase } from "@/lib/database";
import { recordCustomerActivity } from "@/lib/customer-service";
import { getNextLeadAssignee } from "@/lib/lead-assignment";

export type InquiryAttachmentMeta = {
  filename: string;
  contentType: string;
  size: number;
};

export type InquiryEmailAttachment = InquiryAttachmentMeta & {
  content: Buffer;
};

export type InquiryPayload = {
  formType: "full" | "quick";
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  product: string;
  accessories: string;
  quantity: string;
  branding: string;
  message: string;
  lang: string;
  source: string;
  sourcePage: string;
  referrer: string;
  startedAt: number;
  challengeA: number;
  challengeB: number;
  verificationAnswer: string;
  attachments: InquiryAttachmentMeta[];
  website?: string;
};

export type SavedInquiry = InquiryPayload & {
  id: string;
  createdAt: string;
  assignedTo: string;
  attachmentFiles?: InquiryEmailAttachment[];
};

export type InquiryDeliveryStatus = {
  salesEmailSent: boolean;
  customerEmailSent: boolean;
  emailError: string;
  salesEmailId?: string;
  customerEmailId?: string;
};

export type InquiryEmailMessage = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  product: string;
  accessories: string;
  quantity: string;
  branding: string;
  message: string;
  lang: string;
  source: string;
  sourcePage: string;
  referrer: string;
  assignedTo: string;
  attachmentFiles?: InquiryEmailAttachment[];
};

export type InquiryEmailRetryRecord = InquiryEmailMessage & {
  salesEmailSent: boolean | null;
  customerEmailSent: boolean | null;
  emailError: string;
  emailLastAttemptAt: string;
};

let resendClient: Resend | null = null;

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function getResend() {
  if (!resendClient) {
    resendClient = new Resend(requiredEnv("RESEND_API_KEY"));
  }
  return resendClient;
}

export function normalizeInquiry(input: Partial<InquiryPayload>): InquiryPayload {
  const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
  return {
    formType: input.formType === "quick" ? "quick" : "full",
    name: clean(input.name, 120),
    email: clean(input.email, 254).toLowerCase(),
    company: clean(input.company, 160),
    phone: clean(input.phone, 80),
    country: clean(input.country, 120),
    product: clean(input.product, 80),
    accessories: clean(input.accessories, 500),
    quantity: clean(input.quantity, 80),
    branding: clean(input.branding, 500),
    message: clean(input.message, 4000),
    lang: clean(input.lang ?? "en", 12),
    source: clean(input.source ?? input.sourcePage ?? "website", 200),
    sourcePage: clean(input.sourcePage ?? input.source ?? "website", 500),
    referrer: clean(input.referrer, 500),
    startedAt: Number(input.startedAt ?? 0),
    challengeA: Number(input.challengeA ?? 0),
    challengeB: Number(input.challengeB ?? 0),
    verificationAnswer: clean(input.verificationAnswer, 20),
    attachments: Array.isArray(input.attachments) ? input.attachments : [],
    website: clean(input.website, 200),
  };
}

export function validateInquiry(inquiry: InquiryPayload) {
  const errors: Record<string, string> = {};
  const messages = cleanValidationMessages(getLang(inquiry.lang));
  if (!inquiry.name) errors.name = messages.name;
  if (!inquiry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    errors.email = messages.email;
  }
  if (!inquiry.product) errors.product = messages.product;
  if (!inquiry.quantity) errors.quantity = messages.quantity;
  if (!inquiry.message) errors.message = messages.message;
  if (inquiry.website) errors.website = messages.website;
  const formAge = Date.now() - inquiry.startedAt;
  if (
    !Number.isFinite(inquiry.startedAt) ||
    inquiry.startedAt <= 0 ||
    formAge < 1200 ||
    formAge > 24 * 60 * 60 * 1000
  ) {
    errors.startedAt = messages.verification;
  }
  if (
    !Number.isFinite(inquiry.challengeA) ||
    !Number.isFinite(inquiry.challengeB) ||
    !Number.isInteger(inquiry.challengeA) ||
    !Number.isInteger(inquiry.challengeB) ||
    inquiry.challengeA < 1 ||
    inquiry.challengeA > 9 ||
    inquiry.challengeB < 1 ||
    inquiry.challengeB > 9 ||
    !/^\d{1,2}$/.test(inquiry.verificationAnswer) ||
    Number(inquiry.verificationAnswer) !== inquiry.challengeA + inquiry.challengeB
  ) {
    errors.verificationAnswer = messages.verification;
  }
  if (inquiry.attachments.length > 3 || inquiry.attachments.some((file) => file.size > 5 * 1024 * 1024)) {
    errors.attachments = messages.attachments;
  }
  return errors;
}

export async function saveInquiry(inquiry: InquiryPayload, requestMeta: { ip: string; userAgent: string }) {
  const sql = getDatabase();
  const id = crypto.randomUUID();
  const assignedTo = await getNextLeadAssignee();

  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id uuid PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      email text NOT NULL,
      company text,
      phone text,
      country text,
      product text NOT NULL,
      accessories text,
      quantity text NOT NULL,
      branding text,
      message text NOT NULL,
      lang text,
      source text,
      source_page text,
      referrer text,
      attachments jsonb,
      ip text,
      user_agent text,
      status text NOT NULL DEFAULT 'new',
      admin_note text,
      assigned_to text,
      sales_email_sent boolean,
      customer_email_sent boolean,
      email_error text,
      email_last_attempt_at timestamptz,
      sales_email_id text,
      customer_email_id text,
      sales_delivery_status text,
      customer_delivery_status text,
      sales_delivered_at timestamptz,
      customer_delivered_at timestamptz,
      deleted_at timestamptz
    )
  `;

  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS accessories text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_note text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source_page text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS referrer text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS attachments jsonb`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_email_sent boolean`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_email_sent boolean`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email_error text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email_last_attempt_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_email_id text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_email_id text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_delivery_status text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_delivery_status text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS sales_delivered_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_delivered_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS deleted_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_id uuid`;
  await sql`CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS inquiries_customer_id_idx ON inquiries (customer_id)`;

  const customer = await recordCustomerActivity({
    name: inquiry.name,
    email: inquiry.email,
    source: inquiry.source,
    sourcePage: inquiry.sourcePage,
    referrer: inquiry.referrer,
    activity: "inquiry",
    owner: assignedTo,
  });

  const rows = await sql`
    INSERT INTO inquiries (
      id, name, email, company, phone, country, product, accessories, quantity,
      branding, message, lang, source, source_page, referrer, attachments, ip, user_agent, customer_id, assigned_to
    )
    VALUES (
      ${id}, ${inquiry.name}, ${inquiry.email}, ${inquiry.company}, ${inquiry.phone},
      ${inquiry.country}, ${inquiry.product}, ${inquiry.accessories}, ${inquiry.quantity},
      ${inquiry.branding}, ${inquiry.message}, ${inquiry.lang}, ${inquiry.source},
      ${inquiry.sourcePage}, ${inquiry.referrer}, ${JSON.stringify(inquiry.attachments)},
      ${requestMeta.ip}, ${requestMeta.userAgent}, ${customer.id}::uuid, ${assignedTo}
    )
    RETURNING id, created_at
  `;

  return {
    ...inquiry,
    id: rows[0].id as string,
    createdAt: rows[0].created_at as string,
    assignedTo,
  } satisfies SavedInquiry;
}

export async function hasReachedPersistentInquiryLimit(ip: string, limit = 5) {
  if (!ip || ip === "unknown") return false;

  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT count(*)::int AS count
      FROM inquiries
      WHERE ip = ${ip}
        AND created_at > now() - interval '10 minutes'
    `;
    return Number(rows[0]?.count ?? 0) >= limit;
  } catch (error) {
    // The in-memory guard still protects a fresh installation before the
    // inquiries table is created. Do not block legitimate leads if the
    // persistent limiter is temporarily unavailable.
    console.warn("Persistent inquiry rate limit unavailable", error);
    return false;
  }
}

export async function updateInquiryDeliveryStatus(id: string, delivery: InquiryDeliveryStatus) {
  const sql = getDatabase();
  await sql`
    UPDATE inquiries
    SET
      sales_email_sent = ${delivery.salesEmailSent},
      customer_email_sent = ${delivery.customerEmailSent},
      email_error = ${delivery.emailError.slice(0, 1000) || null},
      email_last_attempt_at = now(),
      sales_email_id = COALESCE(${delivery.salesEmailId || null}, sales_email_id),
      customer_email_id = COALESCE(${delivery.customerEmailId || null}, customer_email_id),
      sales_delivery_status = CASE WHEN ${delivery.salesEmailSent} THEN 'sent' ELSE 'failed' END,
      customer_delivery_status = CASE WHEN ${delivery.customerEmailSent} THEN 'sent' ELSE 'failed' END
    WHERE id = ${id}::uuid
  `;
}

export async function claimInquiryEmailRetry(id: string) {
  const sql = getDatabase();
  const rows = await sql`
    UPDATE inquiries
    SET email_last_attempt_at = now()
    WHERE id = ${id}::uuid
      AND (
        email_last_attempt_at IS NULL
        OR email_last_attempt_at < now() - interval '15 seconds'
      )
    RETURNING id
  `;
  return rows.length > 0;
}

export async function getInquiryEmailRetryRecord(id: string): Promise<InquiryEmailRetryRecord | null> {
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, name, email, company, phone, country, product, accessories, quantity,
      branding, message, lang, source, source_page, referrer, assigned_to,
      sales_email_sent, customer_email_sent, email_error, email_last_attempt_at
    FROM inquiries
    WHERE id = ${id}::uuid
      AND deleted_at IS NULL
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    phone: String(row.phone ?? ""),
    country: String(row.country ?? ""),
    product: String(row.product ?? ""),
    accessories: String(row.accessories ?? ""),
    quantity: String(row.quantity ?? ""),
    branding: String(row.branding ?? ""),
    message: String(row.message ?? ""),
    lang: String(row.lang ?? "en"),
    source: String(row.source ?? "website"),
    sourcePage: String(row.source_page ?? ""),
    referrer: String(row.referrer ?? ""),
    assignedTo: String(row.assigned_to ?? ""),
    salesEmailSent: typeof row.sales_email_sent === "boolean" ? row.sales_email_sent : null,
    customerEmailSent: typeof row.customer_email_sent === "boolean" ? row.customer_email_sent : null,
    emailError: String(row.email_error ?? ""),
    emailLastAttemptAt: row.email_last_attempt_at ? new Date(String(row.email_last_attempt_at)).toISOString() : "",
  };
}

function salesRecipients() {
  const configured = process.env.INQUIRY_TO_EMAILS?.trim();
  return (configured || `${company.emailBowie},${company.emailLeo}`)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function sender() {
  return process.env.INQUIRY_FROM_EMAIL?.trim() || "TK Classic Website <onboarding@resend.dev>";
}

export async function sendInquiryEmail(inquiry: InquiryEmailMessage, attemptKey = "") {
  const resend = getResend();
  const attachments = inquiry.attachmentFiles?.map((file) => ({
    filename: file.filename,
    content: file.content,
  }));
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#15120e">
      <h2>New TK Classic inquiry</h2>
      <p><strong>Product:</strong> ${escapeHtml(inquiry.product)}</p>
      <p><strong>Quantity:</strong> ${escapeHtml(inquiry.quantity)}</p>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(inquiry.company || "-")}</p>
      <p><strong>WhatsApp / Phone:</strong> ${escapeHtml(inquiry.phone || "-")}</p>
      <p><strong>Country / Market:</strong> ${escapeHtml(inquiry.country || "-")}</p>
      <p><strong>Assigned sales:</strong> ${escapeHtml(inquiry.assignedTo)}</p>
      <p><strong>Optional accessories:</strong> ${escapeHtml(inquiry.accessories || "-")}</p>
      <p><strong>Branding / Packaging:</strong> ${escapeHtml(inquiry.branding || "-")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(inquiry.message).replaceAll("\n", "<br />")}</p>
      <hr />
      <p style="color:#71685d;font-size:13px">
        Inquiry ID: ${inquiry.id}<br />
        Language: ${escapeHtml(inquiry.lang)}<br />
        Marketing source: ${escapeHtml(inquiry.source || "Direct")}<br />
        Source page: ${escapeHtml(inquiry.sourcePage)}<br />
        Referrer: ${escapeHtml(inquiry.referrer || "Direct")}
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send(
    {
      from: sender(),
      to: salesRecipients(),
      replyTo: inquiry.email,
      subject: `New TK Classic inquiry - ${inquiry.product}`,
      html,
      ...(attachments?.length ? { attachments } : {}),
    },
    { headers: { "Idempotency-Key": `tk-inquiry-${inquiry.id}${attemptKey ? `-${attemptKey}` : ""}` } },
  );
  if (error) throw new Error(error.message);
  return data?.id ?? "";
}

export async function sendInquiryConfirmationEmail(inquiry: InquiryEmailMessage, attemptKey = "") {
  const resend = getResend();
  const { data, error } = await resend.emails.send(
    {
      from: process.env.INQUIRY_CONFIRMATION_FROM_EMAIL ?? sender(),
      to: [inquiry.email],
      replyTo: salesRecipients()[0],
      subject: `TK Classic received your ${inquiry.product} inquiry`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#15120e">
          <h2>Thank you for contacting TK Classic</h2>
          <p>We received your inquiry for <strong>${escapeHtml(inquiry.product)}</strong>.</p>
          <p>Our sales team will review your quantity, target market and branding notes, then reply shortly.</p>
          <p style="color:#71685d;font-size:13px">Reference: ${inquiry.id}</p>
        </div>
      `,
    },
    { headers: { "Idempotency-Key": `tk-inquiry-confirmation-${inquiry.id}${attemptKey ? `-${attemptKey}` : ""}` } },
  );
  if (error) throw new Error(error.message);
  return data?.id ?? "";
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function getLang(lang: string): Lang {
  return lang in uiCopy ? (lang as Lang) : "en";
}

function cleanValidationMessages(lang: Lang) {
  const quantity = uiCopy[lang].form.quantity;
  return {
    en: { name: "Name is required.", email: "A valid email is required.", product: "Product interest is required.", quantity: `${quantity} is required.`, message: "Message is required.", website: "Spam protection triggered.", verification: "Please complete the verification.", attachments: "Please check the attachments." },
    es: { name: "El nombre es obligatorio.", email: "Se requiere un correo electrónico válido.", product: "El producto de interés es obligatorio.", quantity: `El ${quantity.toLowerCase()} es obligatorio.`, message: "El mensaje es obligatorio.", website: "Se activó la protección antispam.", verification: "Complete la verificación.", attachments: "Revise los archivos adjuntos." },
    pt: { name: "O nome é obrigatório.", email: "É necessário um e-mail válido.", product: "O produto de interesse é obrigatório.", quantity: `A ${quantity.toLowerCase()} é obrigatória.`, message: "A mensagem é obrigatória.", website: "A proteção antispam foi ativada.", verification: "Conclua a verificação.", attachments: "Verifique os anexos." },
    fr: { name: "Le nom est obligatoire.", email: "Une adresse e-mail valide est obligatoire.", product: "Le produit d’intérêt est obligatoire.", quantity: `La ${quantity.toLowerCase()} est obligatoire.`, message: "Le message est obligatoire.", website: "La protection antispam a été activée.", verification: "Terminez la vérification.", attachments: "Vérifiez les pièces jointes." },
    ar: { name: "الاسم مطلوب.", email: "يرجى إدخال بريد إلكتروني صالح.", product: "يرجى اختيار المنتج.", quantity: "الكمية مطلوبة.", message: "الرسالة مطلوبة.", website: "تم تفعيل حماية مكافحة الرسائل المزعجة.", verification: "أكمل عملية التحقق.", attachments: "تحقق من المرفقات." },
    zh: { name: "请填写姓名。", email: "请填写有效的邮箱。", product: "请选择感兴趣的产品。", quantity: "请填写预计采购数量。", message: "请填写留言内容。", website: "已触发防垃圾提交保护。", verification: "请完成验证。", attachments: "请检查附件。" },
    ru: { name: "Укажите имя.", email: "Укажите действительный адрес электронной почты.", product: "Выберите интересующий продукт.", quantity: "Укажите количество.", message: "Введите сообщение.", website: "Сработала защита от спама.", verification: "Пройдите проверку.", attachments: "Проверьте вложения." },
  }[lang];
}

// Kept as a compatibility alias for older imports; new validation uses the clean map above.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function validationMessages(lang: Lang) {
  const quantity = uiCopy[lang].form.quantity;
  return {
    en: { name: "Name is required.", email: "A valid email is required.", product: "Product interest is required.", quantity: `${quantity} is required.`, message: "Message is required.", website: "Spam protection triggered.", verification: "Please complete the verification.", attachments: "Please check the attachments." },
    es: { name: "El nombre es obligatorio.", email: "Se requiere un email válido.", product: "El producto de interés es obligatorio.", quantity: `La ${quantity.toLowerCase()} es obligatoria.`, message: "El mensaje es obligatorio.", website: "Protección anti-spam activada.", verification: "Complete la verificación.", attachments: "Revise los archivos adjuntos." },
    pt: { name: "O nome é obrigatório.", email: "É necessário um e-mail válido.", product: "O produto de interesse é obrigatório.", quantity: `A ${quantity.toLowerCase()} é obrigatória.`, message: "A mensagem é obrigatória.", website: "Proteção anti-spam acionada.", verification: "Conclua a verificação.", attachments: "Verifique os anexos." },
    fr: { name: "Le nom est obligatoire.", email: "Une adresse email valide est obligatoire.", product: "Le produit d'intérêt est obligatoire.", quantity: `La ${quantity.toLowerCase()} est obligatoire.`, message: "Le message est obligatoire.", website: "Protection anti-spam déclenchée.", verification: "Terminez la vérification.", attachments: "Vérifiez les pièces jointes." },
    ar: { name: "الاسم مطلوب.", email: "البريد الإلكتروني الصحيح مطلوب.", product: "يرجى اختيار المنتج.", quantity: "الكمية مطلوبة.", message: "الرسالة مطلوبة.", website: "تم تفعيل حماية الرسائل المزعجة.", verification: "أكمل التحقق.", attachments: "تحقق من الملفات المرفقة." },
    zh: { name: "请填写姓名。", email: "请填写有效邮箱。", product: "请选择产品。", quantity: "请填写预计数量。", message: "请填写留言内容。", website: "已触发防垃圾提交保护。", verification: "请完成验证。", attachments: "请检查附件。" },
    ru: { name: "Укажите имя.", email: "Укажите корректный email.", product: "Выберите интересующий продукт.", quantity: "Укажите количество.", message: "Введите сообщение.", website: "Сработала защита от спама.", verification: "Пройдите проверку.", attachments: "Проверьте вложения." },
  }[lang];
}
