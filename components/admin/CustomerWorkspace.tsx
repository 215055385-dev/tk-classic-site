"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarClock, ChevronDown, Mail, Pencil, RefreshCw, Save, Search, SlidersHorizontal, Tags, UserPlus, UserRoundCheck, UsersRound, X } from "lucide-react";

type CustomerStatus = "new" | "contacted" | "follow_up" | "qualified" | "won" | "inactive";
type Customer = {
  id: string; name: string; email: string; firstChannel: string; lastChannel: string;
  firstSourcePage: string; lastSourcePage: string; inquiryCount: number; chatCount: number;
  firstSeenAt: string; lastSeenAt: string; isTest: boolean; status: CustomerStatus;
  owner: "Bowie" | "Leo" | ""; tags: string; nextFollowUpAt: string; adminNote: string; updatedAt: string; ownerSyncPending: boolean;
};
type CustomerDraft = Pick<Customer, "status" | "owner" | "tags" | "adminNote"> & { nextFollowUpAt: string };
type TimelineItem = { id: string; type: "inquiry" | "chat" | "customer_update"; title: string; detail: string; occurredAt: string; product: string; sourcePage: string; actor: string };

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
  const [followUpWindow, setFollowUpWindow] = useState<"" | "due" | "today" | "overdue" | "unscheduled">("");
  const [showTests, setShowTests] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState<CustomerDraft | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [expandedTimeline, setExpandedTimeline] = useState("");
  const [timelineRows, setTimelineRows] = useState<Record<string, TimelineItem[]>>({});
  const [timelineLoading, setTimelineLoading] = useState("");
  const [confirmingAssignment, setConfirmingAssignment] = useState(false);
  const [assigning, setAssigning] = useState(false);

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
    const email = new URLSearchParams(window.location.search).get("email")?.trim() ?? "";
    const timer = window.setTimeout(() => {
      if (email) setQuery(email);
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const realRows = useMemo(() => rows.filter((row) => !row.isTest), [rows]);
  const channels = useMemo(() => Array.from(new Set((showTests ? rows : realRows).map((row) => row.lastChannel).filter(Boolean))), [rows, realRows, showTests]);
  const todayBounds = useMemo(() => {
    if (currentTime === null) return { start: 0, end: 0 };
    const start = new Date(currentTime); start.setHours(0, 0, 0, 0);
    return { start: start.getTime(), end: start.getTime() + 86_400_000 };
  }, [currentTime]);
  const overdueCount = useMemo(() => realRows.filter((row) => row.nextFollowUpAt && new Date(row.nextFollowUpAt).getTime() < todayBounds.start && !["won", "inactive"].includes(row.status)).length, [realRows, todayBounds.start]);
  const todayCount = useMemo(() => realRows.filter((row) => { const time = row.nextFollowUpAt ? new Date(row.nextFollowUpAt).getTime() : 0; return time >= todayBounds.start && time < todayBounds.end && !["won", "inactive"].includes(row.status); }).length, [realRows, todayBounds]);
  const unscheduledCount = useMemo(() => realRows.filter((row) => !row.nextFollowUpAt && !["won", "inactive"].includes(row.status)).length, [realRows]);
  const unassignedCount = useMemo(() => realRows.filter((row) => !row.owner && !["won", "inactive"].includes(row.status)).length, [realRows]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (!showTests && row.isTest) return false;
      if (channel && row.lastChannel !== channel) return false;
      if (status && row.status !== status) return false;
      if (owner === "__none" && row.owner) return false;
      if (owner && owner !== "__none" && row.owner !== owner) return false;
      const followUpTime = row.nextFollowUpAt ? new Date(row.nextFollowUpAt).getTime() : 0;
      if (followUpWindow === "due" && (!followUpTime || currentTime === null || followUpTime > currentTime || ["won", "inactive"].includes(row.status))) return false;
      if (followUpWindow === "today" && (!followUpTime || followUpTime < todayBounds.start || followUpTime >= todayBounds.end || ["won", "inactive"].includes(row.status))) return false;
      if (followUpWindow === "overdue" && (!followUpTime || followUpTime >= todayBounds.start || ["won", "inactive"].includes(row.status))) return false;
      if (followUpWindow === "unscheduled" && (followUpTime || ["won", "inactive"].includes(row.status))) return false;
      if (!term) return true;
      return [row.name, row.email, row.firstChannel, row.lastChannel, row.tags, row.owner, row.adminNote].some((value) => value.toLowerCase().includes(term));
    }).sort((a, b) => {
      const aTime = a.nextFollowUpAt ? new Date(a.nextFollowUpAt).getTime() : Number.POSITIVE_INFINITY;
      const bTime = b.nextFollowUpAt ? new Date(b.nextFollowUpAt).getTime() : Number.POSITIVE_INFINITY;
      const aActive = ["won", "inactive"].includes(a.status) ? 1 : 0;
      const bActive = ["won", "inactive"].includes(b.status) ? 1 : 0;
      return aActive - bActive || aTime - bTime || new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    });
  }, [channel, currentTime, followUpWindow, owner, query, rows, showTests, status, todayBounds]);

  function resetFilters() {
    setChannel(""); setStatus(""); setOwner(""); setFollowUpWindow(""); setShowTests(false);
  }

  function openFocus(view: "today" | "overdue" | "unscheduled" | "unassigned" | "qualified") {
    resetFilters();
    if (view === "unassigned") setOwner("__none");
    else if (view === "qualified") setStatus("qualified");
    else setFollowUpWindow(view);
  }

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

  async function toggleTimeline(row: Customer) {
    if (expandedTimeline === row.id) { setExpandedTimeline(""); return; }
    setExpandedTimeline(row.id);
    if (timelineRows[row.id]) return;
    setTimelineLoading(row.id); setNotice("");
    try {
      const response = await fetch(`/api/admin/customers/${encodeURIComponent(row.id)}/timeline`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "客户记录加载失败。");
      setTimelineRows((current) => ({ ...current, [row.id]: body.timeline || [] }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "客户记录加载失败。");
      setExpandedTimeline("");
    } finally { setTimelineLoading(""); }
  }

  async function assignUnowned() {
    setAssigning(true); setNotice("");
    try {
      const response = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign-unowned" }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "客户分配失败。");
      await load();
      setNotice(body.message);
      setConfirmingAssignment(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "客户分配失败。");
    } finally { setAssigning(false); }
  }

  return <section className="customer-workspace">
    <header className="cms-page-heading"><div><span>销售任务中心</span><h1>客户管理</h1><p>先处理需要行动的客户，再查看完整档案。</p></div><button className="cms-secondary" onClick={() => void load()} disabled={loading}><RefreshCw size={16}/>{loading ? "加载中" : "刷新"}</button></header>
    <div className="customer-summary"><div><UsersRound/><strong>{realRows.length}</strong><span>真实客户</span></div><div><CalendarClock/><strong>{todayCount}</strong><span>今日跟进</span></div><div><CalendarClock/><strong>{overdueCount}</strong><span>已经超期</span></div><div><strong>{realRows.filter((row) => row.status === "won").length}</strong><span>已成交客户</span></div></div>
    <div className="customer-focus-queues" aria-label="销售任务快捷视图">
      <button className={followUpWindow === "overdue" ? "is-active is-urgent" : "is-urgent"} onClick={() => openFocus("overdue")}><span>逾期待跟进</span><strong>{overdueCount}</strong></button>
      <button className={followUpWindow === "today" ? "is-active" : undefined} onClick={() => openFocus("today")}><span>今日需联系</span><strong>{todayCount}</strong></button>
      <button className={followUpWindow === "unscheduled" ? "is-active" : undefined} onClick={() => openFocus("unscheduled")}><span>未安排跟进</span><strong>{unscheduledCount}</strong></button>
      <button className={owner === "__none" ? "is-active" : undefined} onClick={() => openFocus("unassigned")}><span>未分配负责人</span><strong>{unassignedCount}</strong></button>
      <button className={status === "qualified" ? "is-active" : undefined} onClick={() => openFocus("qualified")}><span>有效客户</span><strong>{realRows.filter((row) => row.status === "qualified").length}</strong></button>
    </div>
    <div className="customer-search-bar"><label><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、邮箱、标签或备注"/></label><span>{visible.length} 位客户</span>{query || channel || status || owner || followUpWindow || showTests ? <button type="button" onClick={() => { setQuery(""); resetFilters(); }}><X size={14}/>清除条件</button> : null}</div>
    <details className="customer-filter-disclosure">
      <summary><span><SlidersHorizontal size={16}/>高级筛选与负责人队列</span><ChevronDown size={15}/></summary>
      <div className="cms-toolbar customer-toolbar">
        <select aria-label="按客户状态筛选" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">全部状态</option>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <select aria-label="按负责人筛选" value={owner} onChange={(event) => setOwner(event.target.value)}><option value="">全部负责人</option><option value="Bowie">Bowie</option><option value="Leo">Leo</option><option value="__none">未分配</option></select>
        <select aria-label="按渠道筛选" value={channel} onChange={(event) => setChannel(event.target.value)}><option value="">全部渠道</option>{channels.map((value) => <option key={value} value={value}>{channelLabel(value)}</option>)}</select>
        <select aria-label="按跟进时间筛选" value={followUpWindow} onChange={(event) => setFollowUpWindow(event.target.value as typeof followUpWindow)}><option value="">全部跟进时间</option><option value="today">今天需要跟进</option><option value="overdue">已经超期</option><option value="due">截至现在待跟进</option><option value="unscheduled">尚未安排</option></select>
        <label className="customer-test-toggle"><input type="checkbox" checked={showTests} onChange={(event) => setShowTests(event.target.checked)}/>测试数据</label>
      </div>
      <div className="customer-owner-queues" aria-label="负责人快捷视图"><button className={owner === "Bowie" ? "is-active" : undefined} onClick={() => setOwner(owner === "Bowie" ? "" : "Bowie")}>Bowie <strong>{realRows.filter((row) => row.owner === "Bowie" && !["won", "inactive"].includes(row.status)).length}</strong></button><button className={owner === "Leo" ? "is-active" : undefined} onClick={() => setOwner(owner === "Leo" ? "" : "Leo")}>Leo <strong>{realRows.filter((row) => row.owner === "Leo" && !["won", "inactive"].includes(row.status)).length}</strong></button><button className="customer-assign-trigger" type="button" disabled={!unassignedCount || assigning} onClick={() => setConfirmingAssignment(true)}><UserPlus size={14}/>均衡分配未分配客户</button></div>
    </details>
    {confirmingAssignment ? <div className="customer-bulk-confirm" role="alert"><div><strong>确认均衡分配？</strong><p>仅分配真实、活跃且当前没有负责人的客户；已分配客户、成交客户和测试数据不会改变。</p></div><button type="button" className="cms-secondary" onClick={() => setConfirmingAssignment(false)} disabled={assigning}>取消</button><button type="button" className="cms-primary" onClick={() => void assignUnowned()} disabled={assigning}>{assigning ? "分配中…" : "确认分配"}</button></div> : null}
    {notice ? <p className="cms-notice" role="status">{notice}</p> : null}
    <div className="customer-list">{visible.map((row) => {
      const isDue = currentTime !== null && Boolean(row.nextFollowUpAt) && new Date(row.nextFollowUpAt).getTime() <= currentTime && !["won", "inactive"].includes(row.status);
      return <article className={editingId === row.id ? "is-editing" : undefined} key={row.id}>
        <div className="customer-identity"><span>{(row.name || row.email).slice(0, 1).toUpperCase()}</span><div><h2>{row.name || "未填写姓名"}{row.isTest ? <small>测试数据</small> : null}</h2><a href={`mailto:${row.email.replace(/[\r\n]/g, "")}`}><Mail size={14}/>{row.email}</a>{row.tags ? <p className="customer-tags"><Tags size={12}/>{row.tags}</p> : null}</div></div>
        <div><small>客户状态</small><span className={`customer-crm-status is-${row.status}`}>{statusLabel(row.status)}</span><p><UserRoundCheck size={12}/>{row.owner || "未分配负责人"}</p>{row.ownerSyncPending ? <em className="customer-owner-sync-pending">负责人同步待重试</em> : null}</div>
        <div><small>业务记录</small><strong>{row.inquiryCount} 次询盘 · {row.chatCount} 次聊天</strong><p>{channelLabel(row.lastChannel)} · {row.inquiryCount + row.chatCount > 1 ? "回访客户" : "新客户"}</p></div>
        <div><small>下次跟进</small><strong className={isDue ? "is-due" : undefined}>{row.nextFollowUpAt ? formatDate(row.nextFollowUpAt) : "尚未安排"}</strong><p>最近互动：{formatDate(row.lastSeenAt)}</p></div>
        <div className="customer-row-actions"><button type="button" onClick={() => void toggleTimeline(row)}><Activity size={14}/>{timelineLoading === row.id ? "加载中" : expandedTimeline === row.id ? "收起记录" : "客户记录"}<ChevronDown className={expandedTimeline === row.id ? "is-open" : undefined} size={13}/></button><button type="button" onClick={() => editingId === row.id ? (setEditingId(""), setDraft(null)) : openEditor(row)}>{editingId === row.id ? <X size={14}/> : <Pencil size={14}/>} {editingId === row.id ? "取消编辑" : "管理客户"}</button></div>
        {editingId === row.id && draft ? <div className="customer-manage-panel">
          <label><span>客户状态</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as CustomerStatus })}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label><span>负责人</span><select value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value as Customer["owner"] })}><option value="">未分配</option><option value="Bowie">Bowie</option><option value="Leo">Leo</option></select></label>
          <label><span>下次跟进时间</span><input type="datetime-local" value={draft.nextFollowUpAt} onChange={(event) => setDraft({ ...draft, nextFollowUpAt: event.target.value })}/></label>
          <label><span>客户标签</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="例如：美国批发商, DQ-010, 样品沟通"/></label>
          <label className="is-wide"><span>内部备注</span><textarea value={draft.adminNote} onChange={(event) => setDraft({ ...draft, adminNote: event.target.value })} placeholder="记录客户偏好、报价、样品和下一步计划…"/></label>
          <div className="customer-manage-actions"><button type="button" className="cms-secondary" onClick={() => { setEditingId(""); setDraft(null); }}><X size={15}/>取消</button><button type="button" className="cms-primary" disabled={saving} onClick={() => void saveCustomer(row)}><Save size={15}/>{saving ? "保存中…" : "保存跟进信息"}</button></div>
        </div> : null}
        {expandedTimeline === row.id ? <div className="customer-timeline-panel"><header><div><Activity size={17}/><strong>客户互动时间轴</strong></div><span>{timelineRows[row.id]?.length ?? 0} 条记录</span></header>{timelineLoading === row.id ? <p className="customer-timeline-empty">正在加载客户历史…</p> : timelineRows[row.id]?.length ? <ol>{timelineRows[row.id].map((item) => <li className={`is-${item.type}`} key={item.id}><span className="customer-timeline-dot"/><div><div><strong>{item.title}</strong><time>{formatDate(item.occurredAt)}</time></div><p>{item.detail}</p><small>{item.actor}{item.sourcePage ? ` · 来源页面：${item.sourcePage}` : ""}</small></div></li>)}</ol> : <p className="customer-timeline-empty">该客户暂时没有可显示的历史记录。</p>}</div> : null}
      </article>;
    })}</div>
    {!loading && !visible.length ? <div className="cms-empty">暂无符合条件的客户。</div> : null}
  </section>;
}
