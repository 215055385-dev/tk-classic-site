import { Resend } from "resend";
import { uiCopy } from "@/lib/localized-ui";
import type { Lang } from "@/lib/site-data";
import { getDatabase } from "@/lib/database";

export type InquiryPayload = {
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
  website?: string;
};

type SavedInquiry = InquiryPayload & {
  id: string;
  createdAt: string;
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
  return {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim().toLowerCase(),
    company: String(input.company ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    country: String(input.country ?? "").trim(),
    product: String(input.product ?? "").trim(),
    accessories: String(input.accessories ?? "").trim(),
    quantity: String(input.quantity ?? "").trim(),
    branding: String(input.branding ?? "").trim(),
    message: String(input.message ?? "").trim(),
    lang: String(input.lang ?? "en").trim(),
    source: String(input.source ?? "website").trim(),
    website: String(input.website ?? "").trim(),
  };
}

export function validateInquiry(inquiry: InquiryPayload) {
  const errors: Record<string, string> = {};
  const messages = validationMessages(getLang(inquiry.lang));
  if (!inquiry.name) errors.name = messages.name;
  if (!inquiry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    errors.email = messages.email;
  }
  if (!inquiry.product) errors.product = messages.product;
  if (!inquiry.quantity) errors.quantity = messages.quantity;
  if (!inquiry.message) errors.message = messages.message;
  if (inquiry.website) errors.website = messages.website;
  return errors;
}

export async function saveInquiry(inquiry: InquiryPayload, requestMeta: {
  ip: string;
  userAgent: string;
}) {
  const sql = getDatabase();
  const id = crypto.randomUUID();

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
      ip text,
      user_agent text
      ,status text NOT NULL DEFAULT 'new'
      ,admin_note text
    )
  `;

  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS accessories text`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_note text`;
  await sql`CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC)`;

  const rows = await sql`
    INSERT INTO inquiries (
      id, name, email, company, phone, country, product, accessories, quantity,
      branding, message, lang, source, ip, user_agent
    )
    VALUES (
      ${id}, ${inquiry.name}, ${inquiry.email}, ${inquiry.company},
      ${inquiry.phone}, ${inquiry.country}, ${inquiry.product},
      ${inquiry.accessories}, ${inquiry.quantity}, ${inquiry.branding}, ${inquiry.message},
      ${inquiry.lang}, ${inquiry.source}, ${requestMeta.ip}, ${requestMeta.userAgent}
    )
    RETURNING id, created_at
  `;

  return {
    ...inquiry,
    id: rows[0].id as string,
    createdAt: rows[0].created_at as string,
  } satisfies SavedInquiry;
}

export async function sendInquiryEmail(inquiry: SavedInquiry) {
  const resend = getResend();
  const recipients = (process.env.INQUIRY_TO_EMAILS ?? "ryan@tkclassic.com,fyhi7576@outlook.com")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const from = process.env.INQUIRY_FROM_EMAIL ?? "TK Classic Website <onboarding@resend.dev>";
  const subject = `New TK Classic inquiry - ${inquiry.product}`;
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
      <p><strong>Optional accessories:</strong> ${escapeHtml(inquiry.accessories || "-")}</p>
      <p><strong>Branding / Packaging:</strong> ${escapeHtml(inquiry.branding || "-")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(inquiry.message).replaceAll("\n", "<br />")}</p>
      <hr />
      <p style="color:#71685d;font-size:13px">
        Inquiry ID: ${inquiry.id}<br />
        Language: ${escapeHtml(inquiry.lang)}<br />
        Source: ${escapeHtml(inquiry.source)}
      </p>
    </div>
  `;

  const { error } = await resend.emails.send(
    {
      from,
      to: recipients,
      replyTo: inquiry.email,
      subject,
      html,
    },
    {
      headers: {
        "Idempotency-Key": `tk-inquiry-${inquiry.id}`,
      },
    },
  );

  if (error) throw new Error(error.message);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLang(lang: string): Lang {
  return lang in uiCopy ? (lang as Lang) : "en";
}

function validationMessages(lang: Lang) {
  const quantity = uiCopy[lang].form.quantity;
  return {
    en: {
      name: "Name is required.",
      email: "A valid email is required.",
      product: "Product interest is required.",
      quantity: `${quantity} is required.`,
      message: "Message is required.",
      website: "Spam protection triggered.",
    },
    es: {
      name: "El nombre es obligatorio.",
      email: "Se requiere un email válido.",
      product: "El producto de interés es obligatorio.",
      quantity: `La ${quantity.toLowerCase()} es obligatoria.`,
      message: "El mensaje es obligatorio.",
      website: "Protección anti-spam activada.",
    },
    pt: {
      name: "O nome é obrigatório.",
      email: "É necessário um e-mail válido.",
      product: "O produto de interesse é obrigatório.",
      quantity: `A ${quantity.toLowerCase()} é obrigatória.`,
      message: "A mensagem é obrigatória.",
      website: "Proteção anti-spam acionada.",
    },
    fr: {
      name: "Le nom est obligatoire.",
      email: "Une adresse email valide est obligatoire.",
      product: "Le produit d'intérêt est obligatoire.",
      quantity: `La ${quantity.toLowerCase()} est obligatoire.`,
      message: "Le message est obligatoire.",
      website: "Protection anti-spam déclenchée.",
    },
    ar: {
      name: "الاسم مطلوب.",
      email: "البريد الإلكتروني الصحيح مطلوب.",
      product: "المنتج المطلوب إلزامي.",
      quantity: "الكمية التقديرية مطلوبة.",
      message: "الرسالة مطلوبة.",
      website: "تم تفعيل حماية الرسائل المزعجة.",
    },
    zh: {
      name: "请填写姓名。",
      email: "请填写有效邮箱。",
      product: "请选择感兴趣的产品。",
      quantity: "请填写预计数量。",
      message: "请填写留言内容。",
      website: "已触发防垃圾提交保护。",
    },
    ru: {
      name: "Укажите имя.",
      email: "Укажите корректный email.",
      product: "Укажите интересующий продукт.",
      quantity: "Укажите ориентировочное количество.",
      message: "Укажите сообщение.",
      website: "Сработала защита от спама.",
    },
  }[lang];
}
