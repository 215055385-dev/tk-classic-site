"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Download, ExternalLink, Mail, MessageCircle, RefreshCw, RotateCcw, Search, Send, Trash2 } from "lucide-react";

type Status = "new" | "contacted" | "qualified" | "sample_discussion" | "sample_sent" | "quoted" | "negotiating" | "won" | "closed";
type Inquiry = {
  id: string; createdAt: string; name: string; email: string; company: string; phone: string;
  country: string; product: string; accessories: string; quantity: string; branding: string;
  message: string; lang: string; source: string; sourcePage: string; referrer: string;
  attachmentCount: number; status: Status; adminNote: string; salesEmailSent: boolean | null;
  customerEmailSent: boolean | null; emailError: string; emailLastAttemptAt: string;
  deletedAt: string;
  assignedTo: "Bowie" | "Leo" | "";
};
type EmailHealth = { ready: boolean; apiKeyConfigured: boolean; senderConfigured: boolean; senderAddress: string; siteDomain: string; domainStatus: string; recipientCount: number; checkedAt: string; error: string };

const statuses: Array<{ value: Status; label: string }> = [
  { value: "new", label: "新询盘" }, { value: "contacted", label: "已联系" },
  { value: "qualified", label: "有效询盘" }, { value: "sample_discussion", label: "样品沟通" },
  { value: "sample_sent", label: "样品已寄" },
  { value: "quoted", label: "已报价" }, { value: "won", label: "已成交" },
  { value: "negotiating", label: "商务谈判" },
  { value: "closed", label: "已关闭" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
function csvCell(value: string) { return `"${value.replaceAll('"', '""')}"`; }
function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}
function safeSourceHref(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : "";
  } catch { return ""; }
}

export function InquiryWorkspace() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [retrying, setRetrying] = useState("");
  const [emailHealth, setEmailHealth] = useState<EmailHealth | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [confirmingArchive, setConfirmingArchive] = useState("");
  const [archiving, setArchiving] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", product: "", country: "" });

  const load = useCallback(async () => {
    setLoading(true); setMessage("");
    try {
      const [response, healthResponse] = await Promise.all([
        fetch(`/api/admin/inquiries${showArchived ? "?archived=only" : ""}`, { cache: "no-store" }),
        fetch("/api/admin/system?mode=email-health", { cache: "no-store" }),
      ]);
      const [body, healthBody] = await Promise.all([response.json(), healthResponse.json()]);
      if (!response.ok || !body.ok) throw new Error(body.message || "询盘数据加载失败。");
      setRows(body.inquiries || []);
      if (healthResponse.ok && healthBody.ok) setEmailHealth(healthBody.emailHealth);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "询盘数据加载失败。");
    } finally { setLoading(false); }
  }, [showArchived]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`/api/admin/inquiries${showArchived ? "?archived=only" : ""}`, { cache: "no-store", signal: controller.signal }),
      fetch("/api/admin/system?mode=email-health", { cache: "no-store", signal: controller.signal }),
    ])
      .then(async ([response, healthResponse]) => ({
        response,
        healthResponse,
        body: await response.json(),
        healthBody: await healthResponse.json(),
      }))
      .then(({ response, healthResponse, body, healthBody }) => {
        if (!response.ok || !body.ok) throw new Error(body.message || "询盘数据加载失败。");
        setRows(body.inquiries || []);
        if (healthResponse.ok && healthBody.ok) setEmailHealth(healthBody.emailHealth);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") setMessage(error.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [showArchived]);

  const products = useMemo(() => Array.from(new Set(rows.map((row) => row.product).filter(Boolean))), [rows]);
  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const country = filters.country.trim().toLowerCase();
    return rows.filter((row) => {
      if (filters.status && row.status !== filters.status) return false;
      if (filters.product && row.product !== filters.product) return false;
      if (country && !row.country.toLowerCase().includes(country)) return false;
      if (!term) return true;
      return [row.name, row.company, row.email, row.phone, row.country, row.product, row.message]
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [filters.country, filters.product, filters.status, query, rows]);

  async function update(row: Inquiry, status: Status, adminNote: string, assignedTo = row.assignedTo) {
    const response = await fetch("/api/admin/inquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status, adminNote, assignedTo }) });
    const body = await response.json();
    if (!response.ok || !body.ok) { setMessage(body.message || "询盘更新失败。"); return; }
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, status, adminNote, assignedTo } : item));
    setMessage("询盘跟进信息已保存。");
  }

  async function retryEmail(row: Inquiry, target: "sales" | "customer" | "failed") {
    const operation = `${row.id}:${target}`;
    setRetrying(operation);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/inquiries/${encodeURIComponent(row.id)}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const body = await response.json();
      if (body.inquiry) {
        setRows((current) => current.map((item) => item.id === row.id ? { ...item, ...body.inquiry } : item));
      }
      setMessage(body.message || (response.ok ? "邮件已重新发送。" : "邮件重新发送失败。"));
    } catch {
      setMessage("网络异常，邮件未重新发送，请稍后再试。");
    } finally {
      setRetrying("");
    }
  }

  async function archiveInquiry(row: Inquiry, restore = false) {
    setArchiving(row.id);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/inquiries/${encodeURIComponent(row.id)}`, {
        method: restore ? "POST" : "DELETE",
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.message || (restore ? "询盘恢复失败。" : "询盘移除失败。"));
      setRows((current) => current.filter((item) => item.id !== row.id));
      setMessage(body.message);
      setConfirmingArchive("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "询盘操作失败，请稍后再试。");
    } finally {
      setArchiving("");
    }
  }

  function exportCsv() {
    const header = ["时间", "负责人", "姓名", "公司", "邮箱", "电话", "国家", "产品", "数量", "配件", "品牌需求", "留言", "状态", "内部备注"];
    const lines = visibleRows.map((row) => [formatDate(row.createdAt), row.assignedTo, row.name, row.company, row.email, row.phone, row.country, row.product, row.quantity, row.accessories, row.branding, row.message, row.status, row.adminNote].map(csvCell).join(","));
    const blob = new Blob([`\uFEFF${[header.map(csvCell).join(","), ...lines].join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `询盘-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  }

  return <section className="inquiry-workspace">
    <header className="cms-page-heading"><div><span>客户关系管理</span><h1>客户询盘</h1><p>集中处理真实询盘、联系客户、记录进度并导出数据。</p></div><button className="cms-primary" onClick={exportCsv} disabled={!visibleRows.length}><Download size={17}/>导出当前结果</button></header>
    {emailHealth ? <div className={`inquiry-email-health ${emailHealth.ready ? "is-ready" : "is-warning"}`} role="status">{emailHealth.ready ? <CheckCircle2 size={21}/> : <CircleAlert size={21}/>}<div><strong>{emailHealth.ready ? "邮件服务运行正常" : "邮件服务需要检查"}</strong><p>{emailHealth.ready ? emailHealth.domainStatus === "send_only_key" ? "Resend 使用安全的仅发送密钥；发件地址与销售收件人配置完整。" : `${emailHealth.siteDomain} 已通过 Resend 验证，询盘通知可以发送。` : emailHealth.error || `域名状态：${emailHealth.domainStatus}；请检查发件地址和域名验证。`}</p><span>发件：{emailHealth.senderAddress || "未配置自定义地址"} · 销售收件人：{emailHealth.recipientCount} 个 · 检查时间：{formatDate(emailHealth.checkedAt)}</span></div></div> : null}
    <div className="inquiry-summary-strip">
      <div><strong>{rows.length}</strong><span>{showArchived ? "回收站记录" : "当前询盘"}</span></div>
      <div><strong>{rows.filter((x) => x.status === "new").length}</strong><span>待处理</span></div>
      <div><strong>{rows.filter((x) => x.status === "quoted").length}</strong><span>已报价</span></div>
      <div><strong>{rows.filter((x) => x.status === "won").length}</strong><span>已成交</span></div>
    </div>
    <div className="cms-toolbar inquiry-toolbar">
      <label><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索姓名、公司、邮箱、产品或留言" /></label>
      <select aria-label="按跟进状态筛选" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">全部状态</option>{statuses.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select>
      <select aria-label="按产品筛选" value={filters.product} onChange={(e) => setFilters({ ...filters, product: e.target.value })}><option value="">全部产品</option>{products.map((x) => <option key={x}>{x}</option>)}</select>
      <input aria-label="按国家或市场筛选" value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} placeholder="国家 / 市场" />
      <button className={showArchived ? "is-active" : undefined} onClick={() => { setShowArchived((current) => !current); setConfirmingArchive(""); }}><Trash2 size={16}/>{showArchived ? "返回询盘" : "查看回收站"}</button>
      <button onClick={() => void load()} disabled={loading}><RefreshCw size={16}/>{loading ? "加载中…" : "刷新"}</button>
    </div>
    {message ? <p className="cms-notice" role="status">{message}</p> : null}
    <div className="inquiry-crm-list">
      {visibleRows.map((row) => <article className={`inquiry-crm-card${row.deletedAt ? " is-archived" : ""}`} key={row.id}>
        <div className="inquiry-crm-head"><div><span className={`cms-status is-${row.status}`}>{row.deletedAt ? "回收站" : statuses.find((x) => x.value === row.status)?.label}</span><time>{formatDate(row.createdAt)}</time></div><strong>{row.product || "未指定产品"} · {row.quantity || "数量待沟通"}</strong></div>
        <div className="inquiry-crm-grid">
          <div><small>客户</small><h2>{row.name || "未填写姓名"}</h2><p>{row.company || "未填写公司"} · {row.country || "未填写市场"}</p><div className="inquiry-contact-actions"><a href={`mailto:${row.email.replace(/[\r\n]/g, "")}`}><Mail size={15}/>邮件</a>{row.phone ? <a href={whatsappLink(row.phone)} target="_blank" rel="noreferrer"><MessageCircle size={15}/>WhatsApp</a> : null}{safeSourceHref(row.sourcePage) ? <a href={safeSourceHref(row.sourcePage)} target="_blank" rel="noreferrer"><ExternalLink size={15}/>来源页面</a> : null}</div></div>
          <div><small>采购需求</small><p>{row.message || "—"}</p>{row.branding ? <p><b>定制：</b>{row.branding}</p> : null}{row.accessories ? <p><b>配件：</b>{row.accessories}</p> : null}</div>
          <div className="inquiry-email-delivery"><small>邮件状态</small><p>销售通知：<b className={row.salesEmailSent ? "is-sent" : "is-failed"}>{row.salesEmailSent === null ? "未记录" : row.salesEmailSent ? "已发送" : "发送失败"}</b></p><p>客户回执：<b className={row.source === "website-chat" ? "is-muted" : row.customerEmailSent ? "is-sent" : "is-failed"}>{row.source === "website-chat" ? "不适用（站内聊天）" : row.customerEmailSent === null ? "未记录" : row.customerEmailSent ? "已发送" : "发送失败"}</b></p>{row.emailLastAttemptAt ? <time>最后尝试：{formatDate(row.emailLastAttemptAt)}</time> : null}{row.emailError ? <em>{row.emailError}</em> : null}{!row.deletedAt ? <div className="inquiry-email-actions">{row.salesEmailSent !== true ? <button type="button" disabled={Boolean(retrying)} onClick={() => void retryEmail(row, "sales")}><Send size={13}/>{retrying === `${row.id}:sales` ? "发送中…" : "重发销售通知"}</button> : null}{row.source !== "website-chat" && row.customerEmailSent !== true ? <button type="button" disabled={Boolean(retrying)} onClick={() => void retryEmail(row, "customer")}><Send size={13}/>{retrying === `${row.id}:customer` ? "发送中…" : "重发客户回执"}</button> : null}{row.salesEmailSent !== true && row.source !== "website-chat" && row.customerEmailSent !== true ? <button className="is-primary" type="button" disabled={Boolean(retrying)} onClick={() => void retryEmail(row, "failed")}><RefreshCw size={13}/>{retrying === `${row.id}:failed` ? "发送中…" : "全部重发"}</button> : null}</div> : null}</div>
          <div className="inquiry-followup"><label><span>负责人</span><select value={row.assignedTo} disabled={Boolean(row.deletedAt)} onChange={(e) => void update(row, row.status, row.adminNote, e.target.value as Inquiry["assignedTo"])}><option value="">未分配</option><option value="Bowie">Bowie</option><option value="Leo">Leo</option></select></label><label><span>跟进状态</span><select value={row.status} disabled={Boolean(row.deletedAt)} onChange={(e) => void update(row, e.target.value as Status, row.adminNote)}>{statuses.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></label><label><span>内部备注</span><textarea defaultValue={row.adminNote} disabled={Boolean(row.deletedAt)} placeholder="记录报价、样品、下一次联系时间…" onBlur={(e) => { if (e.target.value !== row.adminNote) void update(row, row.status, e.target.value); }}/></label><div className="inquiry-archive-actions">{row.deletedAt ? <button type="button" className="is-restore" disabled={Boolean(archiving)} onClick={() => void archiveInquiry(row, true)}><RotateCcw size={14}/>{archiving === row.id ? "恢复中…" : "恢复询盘"}</button> : confirmingArchive === row.id ? <div className="inquiry-archive-confirm"><p>确认移入回收站？客户档案和历史记录仍会保留。</p><button type="button" onClick={() => setConfirmingArchive("")}>取消</button><button type="button" className="is-confirm" disabled={Boolean(archiving)} onClick={() => void archiveInquiry(row)}>{archiving === row.id ? "处理中…" : "确认移除"}</button></div> : <button type="button" className="is-archive" onClick={() => setConfirmingArchive(row.id)}><Trash2 size={14}/>移入回收站</button>}</div></div>
        </div>
      </article>)}
      {!loading && !visibleRows.length ? <div className="cms-empty">没有符合条件的询盘。</div> : null}
    </div>
  </section>;
}
