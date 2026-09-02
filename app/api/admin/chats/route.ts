import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin-permissions";
import { getDatabase } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";
import { safeChatLang, translateChatText, translationConfigured } from "@/lib/chat-translation";
import { listCrmCustomers } from "@/lib/customer-service";
import { getNextLeadAssignee } from "@/lib/lead-assignment";
import { ensureAuditLogSchema } from "@/lib/audit-log-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().trim().min(1).max(3000).optional(),
  status: z.enum(["OPEN", "PENDING", "CLOSED"]).optional(),
  markRead: z.boolean().optional(),
  translateTo: z.string().max(12).optional(),
  messageId: z.string().uuid().optional(),
  sendTranslated: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
  assignedTo: z.string().trim().max(100).nullable().optional(),
  followUpAt: z.string().datetime().nullable().optional(),
  convertToInquiry: z.boolean().optional(),
}).refine((input) => input.message || input.status || input.markRead || (input.messageId && input.translateTo) || input.tags || input.assignedTo !== undefined || input.followUpAt !== undefined || input.convertToInquiry, "未提供任何更改。");

export async function GET() {
  try {
    await requireAdmin();
    const [rows, customers] = await Promise.all([
      getPrisma().chatConversation.findMany({ include: { messages: { orderBy: { createdAt: "asc" }, take: 200 } }, orderBy: { lastMessageAt: "desc" }, take: 200 }),
      listCrmCustomers().catch((error) => { console.warn("Customer identity lookup unavailable", error); return []; }),
    ]);
    const customerByEmail = new Map(customers.map((customer) => [customer.email.toLowerCase(), customer]));
    return Response.json({ ok: true, translationConfigured: translationConfigured(), conversations: rows.map((row) => ({
      ...row, visitorTokenHash: undefined, ip: undefined, userAgent: undefined,
      createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), lastMessageAt: row.lastMessageAt.toISOString(),
      visitorLastReadAt: row.visitorLastReadAt?.toISOString() || null, adminLastReadAt: row.adminLastReadAt?.toISOString() || null,
      followUpAt: row.followUpAt?.toISOString() || null, lastNotifiedAt: row.lastNotifiedAt?.toISOString() || null,
      customer: row.visitorEmail ? customerByEmail.get(row.visitorEmail.toLowerCase()) || null : null,
      messages: row.messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() })),
    })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return adminErrorResponse(error); }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin(true, request); const input = patchSchema.parse(await request.json()); const db = getPrisma();
    await ensureAuditLogSchema();
    if (input.messageId && input.translateTo) {
      const message = await db.chatMessage.findFirst({ where: { id: input.messageId, conversationId: input.conversationId } });
      if (!message) return Response.json({ error: "未找到该消息。" }, { status: 404 });
      const translated = await translateChatText(message.body, input.translateTo, message.language || undefined);
      await db.chatMessage.update({ where: { id: message.id }, data: { translatedBody: translated, translatedLang: safeChatLang(input.translateTo) } });
      return Response.json({ ok: true, translated });
    }

    const conversation = await db.chatConversation.findUnique({ where: { id: input.conversationId }, include: { messages: { orderBy: { createdAt: "asc" } } } });
    if (!conversation) return Response.json({ error: "未找到该会话。" }, { status: 404 });

    if (input.convertToInquiry) {
      if (conversation.convertedInquiryId) return Response.json({ ok: true, inquiryId: conversation.convertedInquiryId, alreadyConverted: true });
      const inquiryId = crypto.randomUUID();
      const assignedTo = conversation.assignedTo || await getNextLeadAssignee();
      const transcript = conversation.messages.map((item) => `[${item.sender}] ${item.body}`).join("\n\n").slice(0, 12000);
      const sql = getDatabase();
      await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to text`;
      await sql`INSERT INTO inquiries (id,name,email,company,phone,country,product,accessories,quantity,branding,message,lang,source,source_page,referrer,attachments,status,admin_note,assigned_to,sales_email_sent,customer_email_sent) VALUES (${inquiryId},${conversation.visitorName || "Website chat visitor"},${conversation.visitorEmail || "unknown@chat.local"},${conversation.visitorCompany || ""},${""},${conversation.visitorCountry || ""},${conversation.productModel || "General portable coffee inquiry"},${""},${"To be confirmed in follow-up"},${""},${transcript},${conversation.locale},${"website-chat"},${conversation.sourcePage || "/"},${conversation.referrer || ""},${JSON.stringify([])},${"new"},${`Converted from website chat ${conversation.id}`},${assignedTo},${true},${null})`;
      await db.chatConversation.update({ where: { id: conversation.id }, data: { convertedInquiryId: inquiryId, tags: Array.from(new Set([...conversation.tags, "已转询盘"])) } });
      await db.auditLog.create({ data: { actorId: admin.id, action: "CHAT_CONVERT_INQUIRY", entityType: "chat", entityId: conversation.id, after: { inquiryId } } });
      return Response.json({ ok: true, inquiryId });
    }

    const outgoing = input.message && input.sendTranslated ? await translateChatText(input.message, conversation.locale, "zh") : input.message;
    await db.$transaction(async (tx) => {
      if (outgoing) await tx.chatMessage.create({ data: { conversationId: input.conversationId, sender: "ADMIN", body: outgoing, language: input.sendTranslated ? conversation.locale : "en", translatedBody: input.sendTranslated ? input.message : null, translatedLang: input.sendTranslated ? "zh" : null, authorId: admin.id } });
      await tx.chatConversation.update({ where: { id: input.conversationId }, data: {
        ...(input.status ? { status: input.status } : {}), ...(outgoing ? { lastMessageAt: new Date(), adminLastReadAt: new Date(), status: "PENDING" as const } : {}),
        ...(input.markRead ? { adminLastReadAt: new Date() } : {}), ...(input.tags ? { tags: Array.from(new Set(input.tags)) } : {}),
        ...(input.assignedTo !== undefined ? { assignedTo: input.assignedTo || null } : {}), ...(input.followUpAt !== undefined ? { followUpAt: input.followUpAt ? new Date(input.followUpAt) : null } : {}),
      } });
      await tx.auditLog.create({ data: { actorId: admin.id, action: input.message ? "CHAT_REPLY" : "CHAT_UPDATE", entityType: "chat", entityId: input.conversationId } });
    });
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || "聊天内容无效。" }, { status: 400 });
    if (error instanceof Error && error.message === "TRANSLATION_NOT_CONFIGURED") return Response.json({ error: "尚未配置翻译服务密钥。" }, { status: 503 });
    if (error instanceof Error && error.message === "TRANSLATION_FAILED") return Response.json({ error: "翻译服务暂时失败，请保留原文并稍后重试。" }, { status: 502 });
    return adminErrorResponse(error);
  }
}
