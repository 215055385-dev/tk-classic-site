"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, CircleAlert, DatabaseBackup, ExternalLink, RefreshCw, ScrollText, ShieldCheck } from "lucide-react";

type AuditItem = { id: string; action: string; entityType: string; entityId?: string | null; createdAt: string; actor?: { username: string; displayName?: string | null } | null };
type GrowthReadiness = { ga4: boolean; googleAds: boolean; leadConversion: boolean; usLandingPage: boolean; inquiryTracking: boolean; readyForPaidTraffic: boolean };
type EmailHealth = { ready: boolean; senderAddress: string; siteDomain: string; domainStatus: string; recipientCount: number; checkedAt: string; error: string };
type SystemData = { counts: { products: number; media: number; articles: number; inquiries: number; auditLogs: number }; growthReadiness: GrowthReadiness; emailHealth: EmailHealth; logs: AuditItem[] };
const actionLabels: Record<string, string> = { CREATE: "创建", UPDATE: "更新", DELETE: "删除", UPLOAD: "上传", ARCHIVE: "归档", LOGIN: "登录" };
const entityLabels: Record<string, string> = { products: "产品", product: "产品", homepage: "首页内容", media: "媒体", articles: "文章", seo: "SEO", inquiry: "询盘" };

export function SystemWorkspace() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setMessage("");
    try { const response = await fetch("/api/admin/system", { cache: "no-store" }); const body = await response.json(); if (!response.ok || !body.ok) throw new Error(body.error || "系统信息加载失败。"); setData(body); }
    catch (error) { setMessage(error instanceof Error ? error.message : "系统信息加载失败。"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const controller = new AbortController(); fetch("/api/admin/system", { cache: "no-store", signal: controller.signal }).then(async (response) => ({ response, body: await response.json() })).then(({ response, body }) => { if (!response.ok || !body.ok) throw new Error(body.error || "系统信息加载失败。"); setData(body); }).catch((error: unknown) => { if (error instanceof Error && error.name !== "AbortError") setMessage(error.message); }).finally(() => setLoading(false)); return () => controller.abort(); }, []);
  const logs = useMemo(() => { const term = query.trim().toLowerCase(); return term ? (data?.logs || []).filter((log) => `${log.action} ${log.entityType} ${log.actor?.username || ""}`.toLowerCase().includes(term)) : data?.logs || []; }, [data?.logs, query]);

  return <section className="system-workspace">
    <header className="cms-page-heading"><div><span>系统与安全</span><h1>系统设置</h1><p>后台保持纯中文。这里提供数据概览、操作审计和完整 JSON 备份，不包含多语言管理。</p></div><a className="cms-primary" href="/api/admin/system?mode=backup"><DatabaseBackup size={17}/>下载完整 JSON 备份</a></header>
    <div className="system-security-note"><ShieldCheck size={22}/><div><strong>后台权限保护已启用</strong><p>未登录用户不能访问管理页面或数据接口；写入操作仅允许管理员和编辑角色。</p></div></div>
    {data ? <div className={`system-email-health ${data.emailHealth.ready ? "is-ready" : "is-warning"}`}>{data.emailHealth.ready ? <CheckCircle2 size={22}/> : <CircleAlert size={22}/>}<div><span>询盘邮件基础设施</span><strong>{data.emailHealth.ready ? "Resend 邮件服务正常" : "邮件服务需要处理"}</strong><p>{data.emailHealth.ready ? `${data.emailHealth.siteDomain} 已验证；当前配置 ${data.emailHealth.recipientCount} 个销售收件人。` : data.emailHealth.error || `域名状态：${data.emailHealth.domainStatus}；请检查自定义发件地址。`}</p><small>发件地址：{data.emailHealth.senderAddress || "未配置"} · 最近检查：{new Date(data.emailHealth.checkedAt).toLocaleString("zh-CN")}</small></div></div> : null}
    {data ? <section className="growth-readiness-panel" aria-labelledby="growth-readiness-title">
      <div className="growth-readiness-head">
        <div><span>获客基础设施</span><h2 id="growth-readiness-title"><BarChart3 size={20}/>广告与转化准备度</h2><p>只有统计、广告代码和询盘转化三项全部完成后，才建议小额充值测试。</p></div>
        <strong className={data.growthReadiness.readyForPaidTraffic ? "is-ready" : "is-missing"}>{data.growthReadiness.readyForPaidTraffic ? "已具备测试条件" : "暂勿充值"}</strong>
      </div>
      <div className="growth-readiness-grid">
        {[
          ["GA4 访问统计", data.growthReadiness.ga4, "用于识别访问来源与落地页表现"],
          ["Google Ads 基础代码", data.growthReadiness.googleAds, "用于广告点击与再营销归因"],
          ["询盘转化标签", data.growthReadiness.leadConversion, "用于统计真实表单询盘"],
          ["美国采购落地页", data.growthReadiness.usLandingPage, "已建立 /wholesale/usa"],
          ["询盘来源与 CRM", data.growthReadiness.inquiryTracking, "已记录 UTM、GCLID 与跟进状态"],
        ].map(([label, ready, detail]) => <div className={`growth-status ${ready ? "is-ready" : "is-missing"}`} key={String(label)}>
          {ready ? <CheckCircle2 size={18}/> : <CircleAlert size={18}/>}<div><strong>{label}</strong><span>{ready ? "已配置" : "待配置"} · {detail}</span></div>
        </div>)}
      </div>
      <div className="growth-readiness-actions">
        <a className="cms-secondary" href="https://analytics.google.com/analytics/web/" target="_blank" rel="noreferrer">打开 Google Analytics<ExternalLink size={15}/></a>
        <a className="cms-secondary" href="https://ads.google.com/" target="_blank" rel="noreferrer">打开 Google Ads<ExternalLink size={15}/></a>
        <a className="cms-primary" href="https://ads.google.com/aw/billing/summary" target="_blank" rel="noreferrer">官方充值入口<ExternalLink size={15}/></a>
      </div>
      <p className="growth-readiness-footnote">付款只在 Google 官方页面完成。后台不会读取、保存银行卡或账单资料。</p>
    </section> : null}
    {data ? <div className="inquiry-summary-strip system-counts"><div><strong>{data.counts.products}</strong><span>产品</span></div><div><strong>{data.counts.media}</strong><span>媒体文件</span></div><div><strong>{data.counts.articles}</strong><span>文章</span></div><div><strong>{data.counts.inquiries}</strong><span>询盘</span></div></div> : null}
    <div className="cms-toolbar"><label><ScrollText size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索操作类型、内容类型或管理员" /></label><button onClick={() => void load()} disabled={loading}><RefreshCw size={16}/>{loading ? "加载中…" : "刷新"}</button><span>最近 {logs.length} 条</span></div>
    {message ? <p className="cms-notice" role="status">{message}</p> : null}
    <div className="cms-table-wrap"><table className="cms-table system-log-table"><thead><tr><th>时间</th><th>管理员</th><th>操作</th><th>内容类型</th><th>记录编号</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{new Date(log.createdAt).toLocaleString("zh-CN")}</td><td>{log.actor?.displayName || log.actor?.username || "系统"}</td><td><span className="cms-status">{actionLabels[log.action] || log.action}</span></td><td>{entityLabels[log.entityType] || log.entityType}</td><td><code>{log.entityId || "—"}</code></td></tr>)}</tbody></table>{!loading && !logs.length ? <p className="cms-empty">暂无符合条件的操作记录。</p> : null}</div>
  </section>;
}
