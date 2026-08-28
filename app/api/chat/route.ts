import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { CHAT_COOKIE, findVisitorConversation, hashVisitorToken, newVisitorToken, notifyChatMessage, notifyNewChat, requestIp } from "@/lib/chat-service";
import { getPrisma } from "@/lib/prisma";
import { safeChatLang } from "@/lib/chat-translation";
import { recordCustomerActivity } from "@/lib/customer-service";
import { getNextLeadAssignee } from "@/lib/lead-assignment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_CHAT_BODY_BYTES = 16 * 1024;

const startSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(160).optional().default(""),
  country: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(2).max(3000),
  sourcePage: z.string().trim().max(500).optional().default("/"),
  productModel: z.string().trim().max(60).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),
  locale: z.string().trim().max(12).optional().default("en"),
  source: z.string().trim().max(200).optional().default("website-chat"),
  website: z.string().max(0).optional().default(""),
});

const messageSchema = z.object({ message: z.string().trim().min(1).max(3000) });

function serialize(conversation: NonNullable<Awaited<ReturnType<typeof findVisitorConversation>>>) {
  return {
    id: conversation.id,
    status: conversation.status,
    visitorName: conversation.visitorName,
    locale: conversation.locale,
    messages: conversation.messages.map((message) => ({ id: message.id, sender: message.sender, body: message.body, translatedBody: message.translatedBody, translatedLang: message.translatedLang, createdAt: message.createdAt.toISOString() })),
  };
}

export async function GET() {
  const token = (await cookies()).get(CHAT_COOKIE)?.value || "";
  const conversation = await findVisitorConversation(token);
  if (!conversation) return Response.json({ ok: true, conversation: null });
  await getPrisma().chatConversation.update({ where: { id: conversation.id }, data: { visitorLastReadAt: new Date() } });
  return Response.json({ ok: true, conversation: serialize(conversation) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > MAX_CHAT_BODY_BYTES) {
      return Response.json({ ok: false, error: "Message is too large." }, { status: 413 });
    }
    const input = startSchema.parse(await request.json());
    if (input.website) return Response.json({ ok: false, error: "Unable to start chat." }, { status: 400 });
    const headerStore = await headers();
    const ip = requestIp(headerStore);
    const db = getPrisma();
    const recent = await db.chatConversation.count({ where: { ip, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } } });
    if (ip !== "unknown" && recent >= 4) return Response.json({ ok: false, error: "Too many chat attempts. Please try again later." }, { status: 429 });

    const token = newVisitorToken();
    const assignedTo = await getNextLeadAssignee();
    const conversation = await db.chatConversation.create({
      data: {
        visitorTokenHash: hashVisitorToken(token), visitorName: input.name, visitorEmail: input.email,
        visitorCompany: input.company || null, visitorCountry: input.country || null, locale: safeChatLang(input.locale),
        assignedTo,
        sourcePage: input.sourcePage || "/", productModel: input.productModel || null,
        referrer: input.referrer || null, ip, userAgent: headerStore.get("user-agent") || null, lastNotifiedAt: new Date(),
        messages: { create: { sender: "VISITOR", body: input.message, language: safeChatLang(input.locale) } },
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    const cookieStore = await cookies();
    cookieStore.set(CHAT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    after(async () => {
      await Promise.allSettled([
        notifyNewChat({ id: conversation.id, name: input.name, email: input.email, body: input.message, sourcePage: input.sourcePage }),
        recordCustomerActivity({ name: input.name, email: input.email, source: input.source, sourcePage: input.sourcePage, referrer: input.referrer, activity: "chat" }),
      ]);
    });
    return Response.json({ ok: true, conversation: serialize(conversation) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ ok: false, error: error.issues[0]?.message || "Please check your details." }, { status: 400 });
    console.error(error); return Response.json({ ok: false, error: "Chat is temporarily unavailable." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > MAX_CHAT_BODY_BYTES) {
      return Response.json({ ok: false, error: "Message is too large." }, { status: 413 });
    }
    const input = messageSchema.parse(await request.json());
    const token = (await cookies()).get(CHAT_COOKIE)?.value || "";
    const conversation = await findVisitorConversation(token);
    if (!conversation) return Response.json({ ok: false, error: "Chat session not found." }, { status: 404 });
    if (conversation.status === "CLOSED") return Response.json({ ok: false, error: "This chat has ended. Start a new inquiry if you need more help." }, { status: 409 });
    const db = getPrisma();
    const recent = await db.chatMessage.count({ where: { conversationId: conversation.id, sender: "VISITOR", createdAt: { gt: new Date(Date.now() - 60_000) } } });
    if (recent >= 12) return Response.json({ ok: false, error: "Please wait before sending another message." }, { status: 429 });
    const shouldNotify = !conversation.lastNotifiedAt || conversation.lastNotifiedAt < new Date(Date.now() - 5 * 60_000);
    await db.$transaction([
      db.chatMessage.create({ data: { conversationId: conversation.id, sender: "VISITOR", body: input.message, language: conversation.locale } }),
      db.chatConversation.update({ where: { id: conversation.id }, data: { status: "OPEN", lastMessageAt: new Date(), ...(shouldNotify ? { lastNotifiedAt: new Date() } : {}) } }),
    ]);
    if (shouldNotify) after(async () => { await notifyChatMessage({ id: conversation.id, name: conversation.visitorName, email: conversation.visitorEmail, body: input.message, sourcePage: conversation.sourcePage }).catch(console.error); });
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ ok: false, error: error.issues[0]?.message || "Message is invalid." }, { status: 400 });
    console.error(error); return Response.json({ ok: false, error: "Message could not be sent." }, { status: 500 });
  }
}
