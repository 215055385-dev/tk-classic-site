import { NextResponse } from "next/server";
import {
  normalizeInquiry,
  saveInquiry,
  sendInquiryConfirmationEmail,
  sendInquiryEmail,
  validateInquiry,
  type InquiryAttachmentMeta,
  type InquiryEmailAttachment,
  type InquiryPayload,
} from "@/lib/inquiry-service";
import { uiCopy } from "@/lib/localized-ui";
import type { Lang } from "@/lib/site-data";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 15 * 1024 * 1024;
const MAX_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
]);
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, message: "Request is too large." }, { status: 413 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!allowRequest(ip)) {
    return NextResponse.json({ ok: false, message: "Too many inquiries. Please try again later." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid form submission." }, { status: 400 });
  }

  const uploadedFiles = formData.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0);
  if (uploadedFiles.length > MAX_FILES || uploadedFiles.some((file) => file.size > MAX_FILE_BYTES || !ALLOWED_TYPES.has(file.type))) {
    return NextResponse.json({ ok: false, message: "Please upload up to 3 supported files, 5 MB each." }, { status: 400 });
  }

  const attachmentFiles: InquiryEmailAttachment[] = await Promise.all(
    uploadedFiles.map(async (file) => ({
      filename: safeFileName(file.name),
      contentType: file.type || "application/octet-stream",
      size: file.size,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );
  const attachments: InquiryAttachmentMeta[] = attachmentFiles.map(({ filename, contentType, size }) => ({ filename, contentType, size }));
  const body: Partial<InquiryPayload> = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    company: text(formData, "company"),
    phone: text(formData, "phone"),
    country: text(formData, "country"),
    product: text(formData, "product"),
    accessories: text(formData, "accessories"),
    quantity: text(formData, "quantity"),
    branding: text(formData, "branding"),
    message: text(formData, "message"),
    lang: text(formData, "lang"),
    sourcePage: text(formData, "sourcePage"),
    referrer: text(formData, "referrer"),
    startedAt: Number(text(formData, "startedAt")),
    challengeA: Number(text(formData, "challengeA")),
    challengeB: Number(text(formData, "challengeB")),
    verificationAnswer: text(formData, "verificationAnswer"),
    attachments,
    website: text(formData, "website"),
  };

  const inquiry = normalizeInquiry(body);
  const lang = getLang(inquiry.lang);
  const ui = uiCopy[lang];
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, message: cleanFormCheckMessage(lang), errors }, { status: 400 });
  }

  try {
    const savedInquiry = await saveInquiry(inquiry, {
      ip,
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });
    const inquiryWithFiles = { ...savedInquiry, attachmentFiles };
    let salesEmailSent = true;
    let customerEmailSent = true;

    try {
      await sendInquiryEmail(inquiryWithFiles);
    } catch (emailError) {
      salesEmailSent = false;
      console.error("Inquiry sales email failed", emailError);
    }

    try {
      await sendInquiryConfirmationEmail(inquiryWithFiles);
    } catch (emailError) {
      customerEmailSent = false;
      console.error("Inquiry confirmation email failed", emailError);
    }

    return NextResponse.json({
      ok: true,
      id: savedInquiry.id,
      emailSent: salesEmailSent && customerEmailSent,
      salesEmailSent,
      customerEmailSent,
      message: ui.form.success,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isMissingConfig = message.startsWith("Missing ");
    return NextResponse.json(
      { ok: false, message: isMissingConfig ? cleanServiceConfigMessage(lang) : ui.form.error },
      { status: isMissingConfig ? 503 : 500 },
    );
  }
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120) || "inquiry-file";
}

function allowRequest(ip: string) {
  const now = Date.now();
  const current = rateBuckets.get(ip);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

function getLang(lang: string): Lang {
  return lang in uiCopy ? (lang as Lang) : "en";
}

function cleanFormCheckMessage(lang: Lang) {
  return {
    en: "Please check the form fields.",
    es: "Revise los campos del formulario.",
    pt: "Verifique os campos do formulário.",
    fr: "Veuillez vérifier les champs du formulaire.",
    ar: "يرجى التحقق من حقول النموذج.",
    zh: "请检查表单内容。",
    ru: "Проверьте поля формы.",
  }[lang];
}

function cleanServiceConfigMessage(lang: Lang) {
  return {
    en: "Inquiry service is not configured yet.",
    es: "El servicio de consultas aún no está configurado.",
    pt: "O serviço de consultas ainda não está configurado.",
    fr: "Le service de demande n'est pas encore configuré.",
    ar: "خدمة الاستفسارات غير مهيأة بعد.",
    zh: "询盘服务尚未完成配置。",
    ru: "Сервис запросов ещё не настроен.",
  }[lang];
}

// Compatibility helpers retained for existing imports.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formCheckMessage(lang: Lang) {
  return {
    en: "Please check the form fields.",
    es: "Revise los campos del formulario.",
    pt: "Verifique os campos do formulário.",
    fr: "Veuillez vérifier les champs du formulaire.",
    ar: "يرجى التحقق من حقول النموذج.",
    zh: "请检查表单内容。",
    ru: "Проверьте поля формы.",
  }[lang];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function serviceConfigMessage(lang: Lang) {
  return {
    en: "Inquiry service is not configured yet.",
    es: "El servicio de consultas aún no está configurado.",
    pt: "O serviço de consultas ainda não está configurado.",
    fr: "Le service de demande n'est pas encore configuré.",
    ar: "خدمة الاستفسارات غير مهيأة بعد.",
    zh: "询盘服务尚未完成配置。",
    ru: "Сервис запросов ещё не настроен.",
  }[lang];
}
