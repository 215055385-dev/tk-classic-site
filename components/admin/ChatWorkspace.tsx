"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Languages, Mail, MessageCircle, RefreshCw, Search, Send, Tags, UserRoundCheck } from "lucide-react";

type Message = { id: string; sender: "VISITOR" | "ADMIN" | "SYSTEM"; body: string; translatedBody: string | null; translatedLang: string | null; createdAt: string };
type Conversation = {
  id: string; visitorName: string | null; visitorEmail: string | null; visitorCompany: string | null; visitorCountry: string | null;
  locale: string; status: "OPEN" | "PENDING" | "CLOSED"; sourcePage: string | null; productModel: string | null;
  lastMessageAt: string; adminLastReadAt: string | null; messages: Message[]; tags: string[]; assignedTo: string | null;
  followUpAt: string | null; convertedInquiryId: string | null;
  customer: { firstChannel:string; lastChannel:string; inquiryCount:number; chatCount:number } | null;
};

const quickReplies = [
  "感谢您的咨询。请告诉我们您关注的型号、目标市场和预计采购数量，我们会据此确认方案。",
  "我们支持全流程 OEM/ODM，Logo 和包装均可定制，具体方案以项目沟通和样品确认为准。",
  "样品收费，客户下单大货后可用样品费抵扣大货金额。样品订单通常在 7 天内发货。",
  "大货交期以实际数量和定制范围为准，一般约 35 天。",
  "付款方式支持 T/T、PayPal 和 Western Union。MOQ 在了解型号、市场和包装需求后确认。",
];

function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value); const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
const customerChannelLabel = (value:string) => ({ "Website chat":"站内聊天", "Direct":"直接访问" }[value] || value);

export function ChatWorkspace() {
  const [rows, setRows] = useState<Conversation[]>([]); const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState(""); const [draft, setDraft] = useState(""); const [translateReply, setTranslateReply] = useState(true);
  const [translationReady, setTranslationReady] = useState(false); const [loading, setLoading] = useState(true); const [notice, setNotice] = useState("");
  const [tags, setTags] = useState(""); const [assignedTo, setAssignedTo] = useState(""); const [followUpAt, setFollowUpAt] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch("/api/admin/chats", { cache: "no-store" }); const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "聊天数据加载失败。");
      setRows(body.conversations || []); setTranslationReady(Boolean(body.translationConfigured));
      setSelectedId((current) => current || body.conversations?.[0]?.id || "");
    } catch (error) { if (!quiet) setNotice(error instanceof Error ? error.message : "聊天数据加载失败。"); }
    finally { if (!quiet) setLoading(false); }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(true), 5000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load]);
  const filtered = useMemo(() => { const term = query.toLowerCase().trim(); return term ? rows.filter((x) => [x.visitorName,x.visitorEmail,x.visitorCompany,x.visitorCountry,x.productModel,x.messages.at(-1)?.body].some((value) => value?.toLowerCase().includes(term))) : rows; }, [query, rows]);
  const selected = rows.find((row) => row.id === selectedId) || null;
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTags(selected?.tags.join(", ") || "");
      setAssignedTo(selected?.assignedTo || "");
      setFollowUpAt(localDateTime(selected?.followUpAt || null));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedId, selected?.tags, selected?.assignedTo, selected?.followUpAt]);
  const unread = (row: Conversation) => row.messages.filter((message) => message.sender === "VISITOR" && (!row.adminLastReadAt || new Date(message.createdAt) > new Date(row.adminLastReadAt))).length;

  async function patch(payload: Record<string, unknown>) {
    if (!selected) return null;
    const response = await fetch("/api/admin/chats", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: selected.id, ...payload }) });
    const body = await response.json(); if (!response.ok || !body.ok) { setNotice(body.error || "操作失败。"); return null; }
    return body;
  }
  async function update(payload: { status?: Conversation["status"]; markRead?: boolean }) { const body = await patch(payload); if (!body) return; setNotice("会话状态已更新。"); await load(true); }
  async function reply(event: FormEvent) {
    event.preventDefault(); if (!selected || !draft.trim()) return;
    const shouldTranslate = translationReady && translateReply && selected.locale !== "zh";
    const body = await patch({ message: draft.trim(), sendTranslated: shouldTranslate }); if (!body) return;
    setDraft(""); setNotice(shouldTranslate ? "已翻译为客户语言并发送，中文原文已保留。" : "回复已按输入原文发送。"); await load(true);
  }
  async function translateMessage(message: Message) { const body = await patch({ messageId: message.id, translateTo: "zh" }); if (!body) return; await load(true); }
  async function select(row: Conversation) { setSelectedId(row.id); if (unread(row)) { await fetch("/api/admin/chats", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: row.id, markRead: true }) }); await load(true); } }
  async function saveCrm() {
    const body = await patch({ tags: tags.split(/[,，]/).map((value) => value.trim()).filter(Boolean), assignedTo: assignedTo.trim() || null, followUpAt: followUpAt ? new Date(followUpAt).toISOString() : null });
    if (!body) return; setNotice("客户标签、负责人和跟进时间已保存。"); await load(true);
  }
  async function convertInquiry() { const body = await patch({ convertToInquiry: true }); if (!body) return; setNotice(body.alreadyConverted ? "该会话已经转为询盘。" : "已转为客户询盘，可在询盘管理中继续跟进。"); await load(true); }

  return <section className="chat-workspace">
    <header className="cms-page-heading"><div><span>实时客户沟通</span><h1>站内聊天</h1><p>接收网站访客消息、查看来源页面和产品，并在中文后台直接回复、分配和转为询盘。</p></div><button className="cms-secondary" onClick={() => void load()}><RefreshCw size={16}/>{loading ? "加载中" : "刷新"}</button></header>
    <div className="chat-summary"><div><strong>{rows.length}</strong><span>全部会话</span></div><div><strong>{rows.filter((x) => x.status === "OPEN").length}</strong><span>待回复</span></div><div><strong>{rows.reduce((sum,row) => sum + unread(row),0)}</strong><span>未读消息</span></div></div>
    {notice ? <p className="cms-notice" role="status">{notice}</p> : null}
    <div className="chat-admin-layout"><aside className="chat-thread-list"><label><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索客户、邮箱、公司或型号"/></label><div>{filtered.map((row) => <button key={row.id} className={row.id === selectedId ? "is-active" : ""} onClick={() => void select(row)}><span className="chat-avatar">{(row.visitorName || "访").slice(0,1).toUpperCase()}</span><span><strong>{row.visitorName || "访客"}{unread(row) ? <b>{unread(row)}</b> : null}</strong><small>{row.messages.at(-1)?.body || "尚无消息"}</small><time>{new Intl.DateTimeFormat("zh-CN", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" }).format(new Date(row.lastMessageAt))}</time></span></button>)}</div></aside>
      <main className="chat-admin-conversation">{selected ? <><header><div><strong>{selected.visitorName || "访客"}</strong><span>{selected.visitorCompany || "未填写公司"} · {selected.visitorCountry || "未填写国家"} · 客户语言：{selected.locale.toUpperCase()}</span></div><select value={selected.status} onChange={(e) => void update({ status: e.target.value as Conversation["status"] })}><option value="OPEN">待回复</option><option value="PENDING">已回复</option><option value="CLOSED">结束会话</option></select></header>
        <div className="chat-contact-strip"><a href={`mailto:${selected.visitorEmail || ""}`}><Mail size={14}/>{selected.visitorEmail || "未填写邮箱"}</a><span>{selected.productModel || "未指定型号"}</span><span>{selected.customer ? `${selected.customer.inquiryCount + selected.customer.chatCount > 1 ? "回访客户" : "新客户"} · 渠道：${customerChannelLabel(selected.customer.lastChannel)}` : "客户识别同步中"}</span>{selected.sourcePage ? <a href={selected.sourcePage} target="_blank" rel="noreferrer">来源：{selected.sourcePage}</a> : null}</div>
        <section className="chat-crm-panel"><label><span><Tags size={13}/>客户标签</span><input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="例如：欧洲批发商, DQ-010"/></label><label><span><UserRoundCheck size={13}/>负责人</span><input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="例如：Bowie"/></label><label><span><CalendarClock size={13}/>下次跟进</span><input type="datetime-local" value={followUpAt} onChange={(e) => setFollowUpAt(e.target.value)}/></label><div><button className="cms-secondary" type="button" onClick={() => void saveCrm()}>保存客户信息</button><button className="cms-primary" type="button" disabled={Boolean(selected.convertedInquiryId)} onClick={() => void convertInquiry()}>{selected.convertedInquiryId ? "已转为询盘" : "转为询盘"}</button>{selected.convertedInquiryId ? <a href="/admin/inquiries">查看询盘</a> : null}</div></section>
        <div className="chat-admin-messages">{selected.messages.map((message) => <div key={message.id} className={`is-${message.sender.toLowerCase()}`}><p>{message.body}</p>{message.translatedBody ? <blockquote><b>{message.translatedLang === "zh" ? "中文译文" : "发送前中文原文"}</b>{message.translatedBody}</blockquote> : message.sender === "VISITOR" && selected.locale !== "zh" ? <button className="chat-translate-button" disabled={!translationReady} onClick={() => void translateMessage(message)}><Languages size={13}/>{translationReady ? "翻译为中文" : "翻译服务未配置"}</button> : null}<time>{new Intl.DateTimeFormat("zh-CN", { dateStyle:"short", timeStyle:"short" }).format(new Date(message.createdAt))}</time></div>)}</div>
        <form onSubmit={reply}><div className="chat-quick-replies">{quickReplies.map((text, index) => <button type="button" key={text} onClick={() => setDraft(text)}>快捷回复 {index + 1}</button>)}</div><textarea value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={3000} disabled={selected.status === "CLOSED"} placeholder={selected.status === "CLOSED" ? "会话已结束" : "输入回复内容……"}/><label className="chat-translate-toggle"><input type="checkbox" checked={translationReady && translateReply} disabled={!translationReady || selected.locale === "zh"} onChange={(e)=>setTranslateReply(e.target.checked)}/><span>{translationReady ? `将中文回复翻译成客户语言（${selected.locale.toUpperCase()}）后发送` : "翻译服务未配置；当前将按输入原文直接发送"}</span></label><button className="cms-primary" disabled={!draft.trim() || selected.status === "CLOSED"}><Send size={16}/>发送回复</button></form>
      </> : <div className="cms-empty"><MessageCircle size={28}/><p>选择一条会话开始处理。</p></div>}</main></div>
  </section>;
}
