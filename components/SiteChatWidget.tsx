"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { chatCopy } from "@/lib/chat-copy";
import type { Lang } from "@/lib/site-data";
import { getClientAttribution } from "@/lib/client-analytics";

type Message = { id: string; sender: "VISITOR" | "ADMIN" | "SYSTEM"; body: string; createdAt: string };
type Conversation = { id: string; status: "OPEN" | "PENDING" | "CLOSED"; visitorName: string | null; locale: string; messages: Message[] };

const supportedLocales = new Set<Lang>(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

function resolveCurrentLanguage(pathname: string): Lang {
  const pathLocale = pathname.split("/").filter(Boolean)[0];
  const queryLocale = new URLSearchParams(window.location.search).get("lang");
  const documentLocale = document.documentElement.lang;
  const value = queryLocale || (pathLocale && supportedLocales.has(pathLocale as Lang) ? pathLocale : "") || documentLocale || "en";
  return supportedLocales.has(value as Lang) ? value as Lang : "en";
}

export function SiteChatWidget() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");
  const t = chatCopy[lang];
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [details, setDetails] = useState({ name: "", email: "", company: "", country: "", message: "", website: "" });
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/chat", { cache: "no-store" });
      const body = await response.json();
      if (response.ok && body.ok) setConversation(body.conversation);
    } catch { /* Offline state is shown only after a send attempt. */ }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLang(resolveCurrentLanguage(pathname));
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load, pathname]);
  useEffect(() => {
    if (!open || !conversation || conversation.status === "CLOSED") return;
    const timer = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(timer);
  }, [conversation, load, open]);
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversation?.messages.length, open]);

  async function start(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const path = `${window.location.pathname}${window.location.search}`;
      const productModel = window.location.pathname.match(/\/products\/(dq-[\w-]+)/i)?.[1]?.toUpperCase() || "";
      const attribution = getClientAttribution();
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...details, locale: lang, sourcePage: path, productModel, referrer: document.referrer, source: attribution.utm_source || attribution.referrerHost || "website-chat" }) });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || t.unavailable);
      setConversation(body.conversation);
    } catch (reason) { setError(reason instanceof Error ? reason.message : t.unavailable); }
    finally { setLoading(false); }
  }

  async function send(event: FormEvent) {
    event.preventDefault(); const message = draft.trim(); if (!message) return;
    setLoading(true); setError(""); setDraft("");
    try {
      const response = await fetch("/api/chat", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || t.failed);
      await load();
    } catch (reason) { setDraft(message); setError(reason instanceof Error ? reason.message : t.failed); }
    finally { setLoading(false); }
  }

  if (pathname.startsWith("/admin")) return null;

  return <div className={`site-chat ${open ? "is-open" : ""}`}>
    {open ? <section className="site-chat-panel" role="dialog" aria-label={t.launcher} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header><div><strong>TK Classic Sales</strong><span><i aria-hidden="true" /> {t.status}</span></div><button type="button" onClick={() => setOpen(false)} aria-label={t.close}><X size={19}/></button></header>
      {conversation ? <>
        <div className="site-chat-messages" aria-live="polite">
          <div className="site-chat-welcome">{conversation.visitorName ? `${conversation.visitorName}, ` : ""}{t.welcome}</div>
          {conversation.messages.map((message) => <div key={message.id} className={`site-chat-message is-${message.sender.toLowerCase()}`}><p>{message.body}</p><time>{new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(new Date(message.createdAt))}</time></div>)}
          {conversation.status === "CLOSED" ? <p className="site-chat-closed">{t.closed}</p> : null}
          <div ref={endRef}/>
        </div>
        {conversation.status !== "CLOSED" ? <form className="site-chat-compose" onSubmit={send}><textarea value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={3000} placeholder={t.message} aria-label={t.message}/><button disabled={loading || !draft.trim()} aria-label={t.send}><Send size={18}/></button></form> : null}
      </> : <form className="site-chat-start" onSubmit={start}>
        <div><span>{t.eyebrow}</span><h2>{t.title}</h2><p>{t.intro}</p></div>
        <label><span>{t.name} *</span><input required maxLength={100} autoComplete="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })}/></label>
        <label><span>{t.email} *</span><input required type="email" maxLength={254} autoComplete="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })}/></label>
        <div className="site-chat-two"><label><span>{t.company}</span><input maxLength={160} autoComplete="organization" value={details.company} onChange={(e) => setDetails({ ...details, company: e.target.value })}/></label><label><span>{t.country}</span><input maxLength={100} autoComplete="country-name" value={details.country} onChange={(e) => setDetails({ ...details, country: e.target.value })}/></label></div>
        <label><span>{t.question} *</span><textarea required minLength={2} maxLength={3000} value={details.message} onChange={(e) => setDetails({ ...details, message: e.target.value })} placeholder={t.questionHint}/></label>
        <input className="site-chat-hp" tabIndex={-1} autoComplete="off" value={details.website} onChange={(e) => setDetails({ ...details, website: e.target.value })}/>
        <button className="site-chat-primary" disabled={loading}>{loading ? t.starting : t.start}<Send size={17}/></button>
        <small>{t.privacy}</small>
      </form>}
      {error ? <p className="site-chat-error" role="alert">{error}</p> : null}
    </section> : null}
    <button className="site-chat-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? t.close : t.launcher}>{open ? <X/> : <MessageCircle/>}<span>{open ? t.close : t.launcher}</span></button>
  </div>;
}
