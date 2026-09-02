import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import {
  claimInquiryEmailRetry,
  getInquiryEmailRetryRecord,
  sendInquiryConfirmationEmail,
  sendInquiryEmail,
  updateInquiryDeliveryStatus,
} from "@/lib/inquiry-service";

export const runtime = "nodejs";

type RetryTarget = "sales" | "customer" | "failed";

function safeError(error: unknown) {
  return (error instanceof Error ? error.message : "未知邮件错误").slice(0, 500);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(true, request);
  } catch (error) {
    return adminErrorResponse(error);
  }

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ ok: false, message: "询盘编号无效。" }, { status: 400 });
  }

  let target: RetryTarget = "failed";
  try {
    const body = await request.json() as { target?: unknown };
    if (body.target === "sales" || body.target === "customer" || body.target === "failed") target = body.target;
  } catch {
    // An empty body intentionally retries every failed delivery.
  }

  const inquiry = await getInquiryEmailRetryRecord(id);
  if (!inquiry) return NextResponse.json({ ok: false, message: "未找到该询盘。" }, { status: 404 });

  const customerApplicable = inquiry.source !== "website-chat";
  const retrySales = target === "sales" || (target === "failed" && inquiry.salesEmailSent !== true);
  const retryCustomer = customerApplicable && (target === "customer" || (target === "failed" && inquiry.customerEmailSent !== true));

  if (target === "sales" && inquiry.salesEmailSent === true) {
    return NextResponse.json({ ok: false, message: "销售通知已经发送成功，无需重复发送。" }, { status: 409 });
  }
  if (target === "customer" && !customerApplicable) {
    return NextResponse.json({ ok: false, message: "站内聊天询盘不需要客户回执。" }, { status: 409 });
  }
  if (target === "customer" && inquiry.customerEmailSent === true) {
    return NextResponse.json({ ok: false, message: "客户回执已经发送成功，无需重复发送。" }, { status: 409 });
  }
  if (!retrySales && !retryCustomer) {
    return NextResponse.json({ ok: false, message: "没有需要重新发送的邮件。" }, { status: 409 });
  }

  if (!(await claimInquiryEmailRetry(id))) {
    return NextResponse.json({ ok: false, message: "邮件刚刚尝试过，请等待 15 秒后再操作。" }, {
      status: 429,
      headers: { "Retry-After": "15" },
    });
  }

  let salesEmailSent = inquiry.salesEmailSent === true;
  let customerEmailSent = customerApplicable ? inquiry.customerEmailSent === true : true;
  let salesEmailId = "";
  let customerEmailId = "";
  const errors: string[] = [];
  const attemptKey = `manual-${Date.now()}`;

  if (retrySales) {
    try {
      salesEmailId = await sendInquiryEmail(inquiry, attemptKey);
      salesEmailSent = true;
    } catch (error) {
      salesEmailSent = false;
      errors.push(`sales: ${safeError(error)}`);
    }
  }

  if (retryCustomer) {
    try {
      customerEmailId = await sendInquiryConfirmationEmail(inquiry, attemptKey);
      customerEmailSent = true;
    } catch (error) {
      customerEmailSent = false;
      errors.push(`customer: ${safeError(error)}`);
    }
  }

  await updateInquiryDeliveryStatus(id, {
    salesEmailSent,
    customerEmailSent,
    emailError: errors.join(" | "),
    salesEmailId,
    customerEmailId,
  });

  const complete = salesEmailSent && customerEmailSent;
  console.info(JSON.stringify({
    event: "admin_inquiry_email_retry",
    inquiryId: id,
    target,
    salesEmailSent,
    customerEmailSent,
  }));

  return NextResponse.json({
    ok: errors.length === 0,
    message: errors.length
      ? "部分邮件仍发送失败，请查看最新错误。"
      : complete
        ? "邮件已重新发送成功。"
        : "本次选择的邮件已重新发送成功。",
    inquiry: {
      salesEmailSent,
      customerEmailSent: customerApplicable ? customerEmailSent : inquiry.customerEmailSent,
      emailError: errors.join(" | "),
      emailLastAttemptAt: new Date().toISOString(),
      salesDeliveryStatus: salesEmailSent ? "sent" : "failed",
      customerDeliveryStatus: customerApplicable ? customerEmailSent ? "sent" : "failed" : "",
    },
  }, { status: errors.length ? 502 : 200 });
}
