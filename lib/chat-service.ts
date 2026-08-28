import { createHash, randomBytes } from "node:crypto";
import { Resend } from "resend";
import { getPrisma } from "@/lib/prisma";
import { company } from "@/lib/site-data";

export const CHAT_COOKIE = "tk_chat_session";
export const newVisitorToken = () => randomBytes(32).toString("base64url");
export const hashVisitorToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function requestIp(headers: Headers) {
  return (headers.get("x-forwarded-for")?.split(",")[0] || headers.get("x-real-ip") || "unknown").trim();
}

export async function findVisitorConversation(token: string) {
  if (!token || token.length < 32) return null;
  return getPrisma().chatConversation.findUnique({
    where: { visitorTokenHash: hashVisitorToken(token) },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 150 } },
  });
}

export async function notifyNewChat(input: { id: string; name: string | null; email: string | null; body: string; sourcePage: string | null }) {
  if (!process.env.RESEND_API_KEY) return;
  const recipients = (process.env.INQUIRY_TO_EMAILS || `${company.emailBowie},${company.emailLeo}`).split(",").map((x) => x.trim()).filter(Boolean);
  if (!recipients.length) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.INQUIRY_FROM_EMAIL || "TK Classic Website <onboarding@resend.dev>",
    to: recipients,
    replyTo: input.email || undefined,
    subject: `New website chat${input.name ? ` from ${input.name}` : ""}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New website chat</h2><p><b>Visitor:</b> ${escapeHtml(input.name || "Guest")}</p><p><b>Email:</b> ${escapeHtml(input.email || "Not provided")}</p><p><b>Page:</b> ${escapeHtml(input.sourcePage || "/")}</p><p><b>Message:</b><br>${escapeHtml(input.body)}</p><p><a href="https://portablecoffeemachine.com/admin/chats">Reply in the admin inbox</a></p></div>`,
  });
}

export async function notifyChatMessage(input: { id: string; name: string | null; email: string | null; body: string; sourcePage: string | null }) {
  if (!process.env.RESEND_API_KEY) return;
  const recipients = (process.env.INQUIRY_TO_EMAILS || `${company.emailBowie},${company.emailLeo}`).split(",").map((x) => x.trim()).filter(Boolean);
  if (!recipients.length) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.INQUIRY_FROM_EMAIL || "TK Classic Website <onboarding@resend.dev>", to: recipients,
    replyTo: input.email || undefined, subject: `New chat message${input.name ? ` from ${input.name}` : ""}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New website chat message</h2><p><b>Visitor:</b> ${escapeHtml(input.name || "Guest")}</p><p><b>Message:</b><br>${escapeHtml(input.body)}</p><p><a href="https://portablecoffeemachine.com/admin/chats">Open the chat inbox</a></p></div>`,
  });
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
