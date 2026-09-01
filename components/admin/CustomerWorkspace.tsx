"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Mail, Pencil, RefreshCw, Save, Search, Tags, UserRoundCheck, UsersRound, X } from "lucide-react";

type CustomerStatus = "new" | "contacted" | "follow_up" | "qualified" | "won" | "inactive";
type Customer = {
  id: string; name: string; email: string; firstChannel: string; lastChannel: string;
  firstSourcePage: string; lastSourcePage: string; inquiryCount: number; chatCount: number;
  firstSeenAt: string; lastSeenAt: string; isTest: boolean; status: CustomerStatus;
  owner: "Bowie" | "Leo" | ""; tags: string; nextFollowUpAt: string; adminNote: string; updatedAt: string;
};
type CustomerDraft = Pick<Customer, "status" | "owner" | "tags" | "adminNote"> & { nextFollowUpAt: string };

const statusOptions: Array<{ value: CustomerStatus; label: string }> = [
  { value: "new", label: "新客户" }, { value: "contacted", label: "已联系" },
  { value: "follow_up", label: "跟进中" }, { value: "qualified", label: "有效客户" },
  { value: "won", label: "已成交" }, { value: "inactive", label: "暂不跟进" },
];

const formatDate = (value: string) => new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const channelLabel = (value: string) => ({ "Website chat": "站内聊天", Direct: "直接访问" }[value] || value);
const statusLabel = (value: CustomerStatus) => statusOptions.find((item) => item.value === value)?.label ?? value;
const toLocalInput = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

export function CustomerWorkspace() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("");
  const [dueOnly, setDueOnly] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState<CustomerDraft | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const load = useCallback(async () => {
    setLoading(true); setNotice("");
    try {
      const response = await fetch("/api/admin/customers", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "客户数据加载失败。");
      setRows(body.customers || []);
      setCurrentTime(Date.now());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "客户数据加载失败。");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const realRows = useMemo(() => rows.filter((row) => !row.isTest), [rows]);
  const channels = useMemo(() => Array.from(new Set((showTests ? rows : realRows).map((row) => row.lastChannel).filter(Boolean))), [rows, realRows, showTests]);
  const dueCount = useMemo(() => realRows.filter((row) => row.nextFollowUpAt && new Date(row.nextFollowUpAt).getTime() <= currentTime && !["won", "inactive"].includes(row.status)).length, [currentTime, realRows]);
  const returning = realRows.filter((row) => row.inquiryCount + row.chatCount > 1).length;
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (!showTests && row.isTest) return false;
      if (channel && row.lastChannel !== channel) return false;
      if (status && row.status !== status) return false;
      if (owner === "__none" && row.owner) return false;
      if (owner && owner !== "__none" && row.owner !== owner) return false;
      if (dueOnly && (!row.nextFollowUpAt || new Date(row.nextFollowUpAt).getTime() > currentTime || ["won", "inactive"].includes(row.status))) return false;
      if (!term) return true;
      return [row.name, row.email, row.firstChannel, row.lastChannel, row.tags, row.owner, row.adminNote].some((value) => value.toLowerCase().includes(term));
    });
  }, [channel, currentTime, dueOnly, owner, query, rows, showTests, status]);

  function openEditor(row: Customer) {
    setEditingId(row.id);
    setDraft({ status: row.status, owner: row.owner, tags: row.tags, adminNote: row.adminNote, nextFollowUpAt: toLocalInput(row.nextFollowUpAt) });
    setNotice("");
  }

  async function saveCustomer(row: Customer) {
    if (!draft) return;
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/admin/customers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, ...draft, nextFollowUpAt: draft.nextFollowUpAt ? new Date(draft.nextFollowUpAt).toISOString() : "" }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "客户跟进信息保存失败。");
      setRows((current) => current.map((item) => item.id === row.id ? body.customer : item));
      setEditingId(""); setDraft(null); setNotice(body.message);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "客户跟进信息保存失败。");
    } finally { setSaving(false); }
  }

  return <section className="customer-workspace">
    <header className="cms-page-heading"><div><span>邮箱唯一身份</span><h1>客户管理</h1><p>统一管理客户状态、负责人、标签和下一次跟进时间。</p></div><button className="cms-secondary" onClick={() => void load()} disabled={loading}><RefreshCw size={16}/>{loading ? "加载中" : "刷新"}</button></header>
    <div className="customer-summary"><div><UsersRound/><strong>{realRows.length}</strong><span>真实客户</span></div><div><CalendarClock/><strong>{dueCount}</strong><span>待跟进</span></div><div><strong>{returning}</strong><span>回访客户</span></div><div><strong>{realRows.filter((row) => row.status === "won").length}</strong><span>已成交客户</span></div></div>
    <div className="cms-toolbar customer-toolbar">
      <label><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、邮箱、标签或备注"/></label>
      <select aria-label="按客户状态筛选" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">全部状态</option>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      <select aria-label="按负责人筛选" value={owner} onChange={(event) => setOwner(event.target.value)}><option value="">全部负责人</option><option value="Bowie">Bowie</option><option value="Leo">Leo</option><option value="__none">未分配</option></select>
      <select aria-label="按渠道筛选" value={channel} onChange={(event) => setChannel(event.target.value)}><option value="">全部渠道</option>{channels.map((value) => <option key={value} value={value}>{channelLabel(value)}</option>)}</select>
      <button className={dueOnly ? "is-active" : undefined} onClick={() => setDueOnly((current) => !current)}><CalendarClock size={15}/>{dueOnly ? "显示全部" : "只看待跟进"}</button>
      <label className="customer-test-toggle"><input type="checkbox" checked={showTests} onChange={(event) => setShowTests(event.target.checked)}/>测试数据</label><span>{visible.length} 位客户</span>
    </div>
    {notice ? <p className="cms-notice" role="status">{notice}</p> : null}
    <div className="customer-list">{visible.map((row) => {
      const isDue = Boolean(row.nextFollowUpAt) && new Date(row.nextFollowUpAt).getTime() <= currentTime && !["won", "inactive"].includes(row.status);
      return <article className={editingId === row.id ? "is-editing" : undefined} key={row.id}>
        <div className="customer-identity"><span>{(row.name || row.email).slice(0, 1).toUpperCase()}</span><div><h2>{row.name || "未填写姓名"}{row.isTest ? <small>测试数据</small> : null}</h2><a href={`mailto:${row.email.replace(/[\r\n]/g, "")}`}><Mail size={14}/>{row.email}</a>{row.tags ? <p className="customer-tags"><Tags size={12}/>{row.tags}</p> : null}</div></div>
        <div><small>客户状态</small><span className={`customer-crm-status is-${row.status}`}>{statusLabel(row.status)}</span><p><UserRoundCheck size={12}/>{row.owner || "未分配负责人"}</p></div>
        <div><small>业务记录</small><strong>{row.inquiryCount} 次询盘 · {row.chatCount} 次聊天</strong><p>{channelLabel(row.lastChannel)} · {row.inquiryCount + row.chatCount > 1 ? "回访客户" : "新客户"}</p></div>
        <div><small>下次跟进</small><strong className={isDue ? "is-due" : undefined}>{row.nextFollowUpAt ? formatDate(row.nextFollowUpAt) : "尚未安排"}</strong><p>最近互动：{formatDate(row.lastSeenAt)}</p></div>
        <div className="customer-row-actions"><button type="button" onClick={() => editingId === row.id ? (setEditingId(""), setDraft(null)) : openEditor(row)}>{editingId === row.id ? <X size={14}/> : <Pencil size={14}/>} {editingId === row.id ? "取消编辑" : "管理客户"}</button></div>
        {editingId === row.id && draft ? <div className="customer-manage-panel">
          <label><span>客户状态</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as CustomerStatus })}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label><span>负责人</span><select value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value as Customer["owner"] })}><option value="">未分配</option><option value="Bowie">Bowie</option><option value="Leo">Leo</option></select></label>
          <label><span>下次跟进时间</span><input type="datetime-local" value={draft.nextFollowUpAt} onChange={(event) => setDraft({ ...draft, nextFollowUpAt: event.target.value })}/></label>
          <label><span>客户标签</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="例如：美国批发商, DQ-010, 样品沟通"/></label>
          <label className="is-wide"><span>内部备注</span><textarea value={draft.adminNote} onChange={(event) => setDraft({ ...draft, adminNote: event.target.value })} placeholder="记录客户偏好、报价、样品和下一步计划…"/></label>
          <div className="customer-manage-actions"><button type="button" className="cms-secondary" onClick={() => { setEditingId(""); setDraft(null); }}><X size={15}/>取消</button><button type="button" className="cms-primary" disabled={saving} onClick={() => void saveCustomer(row)}><Save size={15}/>{saving ? "保存中…" : "保存跟进信息"}</button></div>
        </div> : null}
      </article>;
    })}</div>
    {!loading && !visible.length ? <div className="cms-empty">暂无符合条件的客户。</div> : null}
  </section>;
}
