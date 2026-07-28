import { NextResponse } from "next/server";
import {
  normalizeInquiry,
  saveInquiry,
  sendInquiryEmail,
  validateInquiry,
} from "@/lib/inquiry-service";
import { uiCopy } from "@/lib/localized-ui";
import type { Lang } from "@/lib/site-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const inquiry = normalizeInquiry(body as Record<string, string>);
  const lang = getLang(inquiry.lang);
  const ui = uiCopy[lang];
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: formCheckMessage(lang), errors },
      { status: 400 },
    );
  }

  try {
    const headers = request.headers;
    const savedInquiry = await saveInquiry(inquiry, {
      ip:
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headers.get("x-real-ip") ??
        "unknown",
      userAgent: headers.get("user-agent") ?? "unknown",
    });

    let emailSent = true;
    try {
      await sendInquiryEmail(savedInquiry);
    } catch (emailError) {
      emailSent = false;
      console.error("Inquiry email failed", emailError);
    }

    return NextResponse.json({
      ok: true,
      id: savedInquiry.id,
      emailSent,
      message: ui.form.success,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isMissingConfig = message.startsWith("Missing ");

    return NextResponse.json(
      {
        ok: false,
        message: isMissingConfig
          ? serviceConfigMessage(lang)
          : ui.form.error,
      },
      { status: isMissingConfig ? 503 : 500 },
    );
  }
}

function getLang(lang: string): Lang {
  return lang in uiCopy ? (lang as Lang) : "en";
}

function formCheckMessage(lang: Lang) {
  return {
    en: "Please check the form fields.",
    es: "Revise los campos del formulario.",
    pt: "Verifique os campos do formulário.",
    fr: "Veuillez vérifier les champs du formulaire.",
    ar: "يرجى التحقق من حقول النموذج.",
    zh: "请检查表单字段。",
    ru: "Проверьте поля формы.",
  }[lang];
}

function serviceConfigMessage(lang: Lang) {
  return {
    en: "Inquiry service is not configured yet.",
    es: "El servicio de consultas aún no está configurado.",
    pt: "O serviço de consultas ainda não está configurado.",
    fr: "Le service de demande n'est pas encore configuré.",
    ar: "خدمة الاستفسارات غير مهيأة بعد.",
    zh: "询盘服务尚未配置完成。",
    ru: "Сервис запросов ещё не настроен.",
  }[lang];
}
