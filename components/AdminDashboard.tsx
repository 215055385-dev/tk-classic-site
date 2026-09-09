"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CircleAlert, Inbox, MessagesSquare, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import type {
  AdminInquiry,
  AdminStats,
  InquiryStatus,
} from "@/lib/admin-service";

type Status = InquiryStatus;
type Inquiry = AdminInquiry;
type Stats = AdminStats;

const statuses: Array<{ value: Status; label: string }> = [
  { value: "new", label: "新询盘" },
  { value: "contacted", label: "已联系" },
  { value: "qualified", label: "有效客户" },
  { value: "sample_discussion", label: "样品沟通" },
  { value: "sample_sent", label: "样品已发" },
  { value: "quoted", label: "已报价" },
  { value: "negotiating", label: "谈判中" },
  { value: "won", label: "已成交" },
  { value: "closed", label: "已关闭" },
];

const emptyStats: Stats = {
  totalInquiries: 0,
  newInquiries: 0,
  quotedInquiries: 0,
  wonInquiries: 0,
  totalVisits: 0,
  visitsLast7Days: 0,
  organicVisitsLast30Days: 0,
  organicInquiriesLast30Days: 0,
  organicConversionRate: 0,
  eventsLast7Days: 0,
  quoteClicksLast30Days: 0,
  formStartsLast30Days: 0,
  leadsLast30Days: 0,
  formCompletionRate: 0,
  salesReadyLeadsLast30Days: 0,
  wonLeadsLast30Days: 0,
  leadQualificationRate: 0,
  leadWinRate: 0,
  emailDeliveryIssues: 0,
  topProducts: [],
  topPaths: [],
  topReferrers: [],
  topOrganicPaths: [],
  topSearchEngines: [],
  topLanguages: [],
  dailyVisits: [],
  conversionEvents: [],
};

const eventLabels: Record<string, string> = {
  product_view: "产品详情浏览",
  quote_click: "报价按钮点击",
  whatsapp_click: "WhatsApp 点击",
  brochure_download: "画册下载",
  form_start: "开始填写询盘",
  video_play: "产品视频播放",
  coffee_lab_concept: "Coffee Lab 生成方案",
  coffee_lab_download: "Coffee Lab 下载方案",
  generate_lead: "成功提交询盘",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function AdminDashboard({
  initialAuthenticated = false,
  initialData,
}: {
  initialAuthenticated?: boolean;
  initialData?: { inquiries: Inquiry[]; stats: Stats };
}) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [username, setUsername] = useState("215055385");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminUrlCopied, setAdminUrlCopied] = useState(false);
  const [rows, setRows] = useState<Inquiry[]>(initialData?.inquiries ?? []);
  const [stats, setStats] = useState<Stats>(initialData?.stats ?? emptyStats);
  const [loading, setLoading] = useState(initialAuthenticated && !initialData);
  const [filters, setFilters] = useState({
    status: "",
    product: "",
    country: "",
    from: "",
    to: "",
  });
  const [message, setMessage] = useState("");

  const products = useMemo(
    () => Array.from(new Set(rows.map((row) => row.product).filter(Boolean))),
    [rows],
  );

  async function loadData(nextFilters = filters) {
    setLoading(true);
    setMessage("");
    const params = new URLSearchParams(
      Object.entries(nextFilters).filter(([, value]) => value),
    );
    let response: Response;
    try {
      response = await fetch(`/api/admin/inquiries?${params.toString()}`, {
        cache: "no-store",
      });
    } catch {
      setAuthenticated(false);
      setLoginError("后台暂时无法访问，请稍后重试。");
      setLoading(false);
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    if (!response.ok || !data.ok) {
      setAuthenticated(false);
      setLoginError(data.message ?? "后台尚未完成配置。");
      setLoading(false);
      return;
    }
    setAuthenticated(true);
    setRows(data.inquiries ?? []);
    setStats(data.stats ?? emptyStats);
    setLoading(false);
  }

  useEffect(() => {
    if (!initialAuthenticated || initialData) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadData();
    });
    return () => {
      cancelled = true;
    };
    // The dashboard performs one session check on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAuthenticated, initialData]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      setLoginError(data.message ?? "密码不正确。");
      return;
    }
    setPassword("");
    await loadData();
  }

  async function copyAdminUrl() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/admin`);
      setAdminUrlCopied(true);
    } catch {
      setLoginError("无法自动复制，请直接收藏当前页面。");
    }
  }

  async function updateRow(row: Inquiry, status: Status, adminNote: string) {
    const response = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: row.id,
        status,
        adminNote,
        assignedTo: row.assignedTo,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      setMessage(data.message ?? "询盘状态更新失败。");
      return;
    }
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status, adminNote } : item,
      ),
    );
    setMessage("询盘状态已保存。");
  }

  function exportCsv() {
    const header = [
      "时间",
      "姓名",
      "公司",
      "邮箱",
      "电话",
      "国家",
      "产品",
      "配件",
      "数量",
      "销售邮件",
      "客户确认邮件",
      "邮件错误",
      "状态",
      "品牌需求",
      "留言",
    ];
    const lines = rows.map((row) =>
      [
        formatDate(row.createdAt),
        row.name,
        row.company,
        row.email,
        row.phone,
        row.country,
        row.product,
        row.accessories,
        row.quantity,
        row.salesEmailSent === null
          ? "未记录"
          : row.salesEmailSent
            ? "已发送"
            : "失败",
        row.customerEmailSent === null
          ? "未记录"
          : row.customerEmailSent
            ? "已发送"
            : "失败",
        row.emailError,
        row.status,
        row.branding,
        row.message,
      ]
        .map(escapeCsv)
        .join(","),
    );
    const blob = new Blob(
      [`\uFEFF${[header.map(escapeCsv).join(","), ...lines].join("\n")}`],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tk-classic-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (authenticated === false)
    return (
      <main className="admin-shell admin-login-shell">
        <section className="admin-login-card">
          <span className="admin-kicker">TK CLASSIC / PRIVATE AREA</span>
          <h1>中文内容管理后台</h1>
          <p>
            登录后管理产品、首页内容、媒体、文章与客户询盘。本页面不会被搜索引擎收录。
          </p>
          <form onSubmit={handleLogin}>
            <label htmlFor="admin-username">管理员用户名</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
            <label htmlFor="admin-password">管理员密码</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            {loginError ? (
              <small className="admin-error">{loginError}</small>
            ) : null}
            <button className="admin-primary-button" type="submit">
              登录后台
            </button>
          </form>
          <div className="admin-login-shortcuts">
            <button type="button" onClick={() => void copyAdminUrl()}>
              {adminUrlCopied ? "后台网址已复制" : "复制后台网址"}
            </button>
            <Link href="/">返回网站首页</Link>
            <small>
              快捷进入：收藏本页（Ctrl + D），或使用桌面的“TK Classic
              后台”快捷方式。
            </small>
          </div>
        </section>
      </main>
    );
  return (
    <AdminShell title="数据总览" description="今日重点、询盘与增长数据">
      <div className="admin-dashboard-content">
        <header className="admin-header">
          <div>
            <span className="admin-kicker">TODAY / OVERVIEW</span>
            <h1>今天先处理什么</h1>
            <p>先跟进新询盘与邮件异常，再查看流量和内容表现。</p>
          </div>
          <div className="admin-header-actions">
            <button
              className="admin-quiet-button"
              onClick={() => void loadData()}
            >
              刷新数据
            </button>
          </div>
        </header>
        <section
          className="admin-stat-grid admin-priority-stats"
          aria-label="今日重点"
        >
          <article className={stats.newInquiries ? "is-priority" : ""}>
            <span>新询盘</span>
            <strong>{stats.newInquiries}</strong>
            <small>
              {stats.newInquiries ? "需要优先跟进" : "当前没有待处理询盘"}
            </small>
          </article>
          <article>
            <span>累计询盘</span>
            <strong>{stats.totalInquiries}</strong>
            <small>全部有效记录</small>
          </article>
          <article>
            <span>已成交</span>
            <strong>{stats.wonInquiries}</strong>
            <small>已标记为成交</small>
          </article>
          <article className={stats.emailDeliveryIssues ? "is-alert" : ""}>
            <span>邮件异常</span>
            <strong>{stats.emailDeliveryIssues}</strong>
            <small>
              {stats.emailDeliveryIssues ? "请检查邮件配置" : "邮件投递正常"}
            </small>
          </article>
        </section>
        <section
          className="admin-operations"
          aria-labelledby="admin-operations-title"
        >
          <div className="admin-operations-heading">
            <div>
              <span className="admin-kicker">TODAY / OPERATIONS</span>
              <h2 id="admin-operations-title">今日运营中心</h2>
              <p>先处理客户，再更新内容；所有入口都直达对应的真实管理模块。</p>
            </div>
            <Link className="admin-operations-primary" href="/admin/inquiries">
              <Inbox size={18} />
              <span>进入询盘跟进</span>
              <strong>{stats.newInquiries}</strong>
            </Link>
          </div>
          <div className="admin-task-grid">
            <Link
              href="/admin/inquiries"
              className={stats.newInquiries ? "is-priority" : ""}
            >
              <Inbox size={19} />
              <div>
                <strong>
                  {stats.newInquiries
                    ? `${stats.newInquiries} 条新询盘待处理`
                    : "新询盘已处理"}
                </strong>
                <span>分配 Bowie / Leo、记录样品与报价进度</span>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className={stats.emailDeliveryIssues ? "is-warning" : ""}
            >
              {stats.emailDeliveryIssues ? (
                <CircleAlert size={19} />
              ) : (
                <MessagesSquare size={19} />
              )}
              <div>
                <strong>
                  {stats.emailDeliveryIssues
                    ? `${stats.emailDeliveryIssues} 条邮件异常`
                    : "邮件投递状态正常"}
                </strong>
                <span>检查通知配置、系统状态和数据备份</span>
              </div>
            </Link>
            <Link href="/admin/seo">
              <Search size={19} />
              <div>
                <strong>SEO / GEO 内容管理</strong>
                <span>维护页面标题、描述、文章与搜索内容</span>
              </div>
            </Link>
          </div>
        </section>
        <details className="admin-dashboard-disclosure">
          <summary>
            <span>
              <b>流量与转化分析</b>
              <small>自然搜索、访问来源、热门页面和询盘漏斗</small>
            </span>
            <strong>{stats.organicVisitsLast30Days} 次自然访问</strong>
          </summary>
          <section
            className="admin-stat-grid admin-growth-stats"
            aria-label="增长数据"
          >
            <article>
              <span>累计访问</span>
              <strong>{stats.totalVisits}</strong>
              <small>近 7 天：{stats.visitsLast7Days}</small>
            </article>
            <article>
              <span>自然搜索访问</span>
              <strong>{stats.organicVisitsLast30Days}</strong>
              <small>近 30 天</small>
            </article>
            <article>
              <span>自然搜索询盘</span>
              <strong>{stats.organicInquiriesLast30Days}</strong>
              <small>按首次来源</small>
            </article>
            <article>
              <span>自然询盘转化率</span>
              <strong>{stats.organicConversionRate}%</strong>
              <small>自然询盘 ÷ 自然访问</small>
            </article>
          </section>
          <section className="admin-analytics-grid">
            <article className="admin-panel admin-funnel-panel">
              <div className="admin-panel-heading">
                <h2>询盘转化漏斗</h2>
                <span>近 30 天</span>
              </div>
              <div className="admin-funnel-stages">
                <div>
                  <span>报价意向</span>
                  <strong>{stats.quoteClicksLast30Days}</strong>
                  <small>点击报价按钮</small>
                </div>
                <i aria-hidden="true">→</i>
                <div>
                  <span>开始填写</span>
                  <strong>{stats.formStartsLast30Days}</strong>
                  <small>打开询盘表单</small>
                </div>
                <i aria-hidden="true">→</i>
                <div className="is-result">
                  <span>成功询盘</span>
                  <strong>{stats.leadsLast30Days}</strong>
                  <small>完成提交</small>
                </div>
              </div>
              <div className="admin-funnel-rate">
                <span>表单完成率</span>
                <strong>{stats.formCompletionRate}%</strong>
              </div>
              <p className="admin-funnel-note">
                按近 30
                天事件汇总，用于判断页面转化趋势，并非同一访客的逐一追踪。
              </p>
            </article>
            <article className="admin-panel admin-lead-quality-panel">
              <div className="admin-panel-heading">
                <h2>询盘质量漏斗</h2>
                <span>近 30 天</span>
              </div>
              <div className="admin-lead-quality-grid">
                <div><span>收到询盘</span><strong>{stats.leadsLast30Days}</strong><small>网站成功提交</small></div>
                <div><span>进入业务推进</span><strong>{stats.salesReadyLeadsLast30Days}</strong><small>有效、样品、报价或谈判</small></div>
                <div className="is-result"><span>已成交</span><strong>{stats.wonLeadsLast30Days}</strong><small>已标记成交</small></div>
              </div>
              <div className="admin-quality-rates"><div><span>有效推进率</span><strong>{stats.leadQualificationRate}%</strong></div><div><span>询盘成交率</span><strong>{stats.leadWinRate}%</strong></div></div>
              <p className="admin-funnel-note">按询盘当前状态计算；请及时更新客户阶段，数据才会准确。</p>
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>自然搜索引擎</h2>
                <span>近 30 天</span>
              </div>
              {stats.topSearchEngines.length ? (
                stats.topSearchEngines.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  Google、Bing 等自然搜索访客到达后，这里会显示来源。
                </p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>近 30 天互动事件</h2>
                <span>近 7 天总事件：{stats.eventsLast7Days}</span>
              </div>
              {stats.conversionEvents.length ? (
                stats.conversionEvents.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{eventLabels[item.label] ?? item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  访客点击产品、报价或 WhatsApp 后，这里会显示转化数据。
                </p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>自然搜索落地页</h2>
                <span>近 30 天</span>
              </div>
              {stats.topOrganicPaths.length ? (
                stats.topOrganicPaths.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  产生自然搜索访问后，这里会显示首先获得流量的页面。
                </p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>热门产品</h2>
                <span>按询盘数量</span>
              </div>
              {stats.topProducts.length ? (
                stats.topProducts.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  收到第一条询盘后，这里会显示产品数据。
                </p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>热门页面</h2>
                <span>按访问次数</span>
              </div>
              {stats.topPaths.length ? (
                stats.topPaths.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  访客浏览网站后，这里会显示访问数据。
                </p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>访问来源</h2>
                <span>按访问次数</span>
              </div>
              {stats.topReferrers.length ? (
                stats.topReferrers.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  有访问来源后，这里会显示渠道数据。
                </p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-heading">
                <h2>语言分布</h2>
                <span>按访问次数</span>
              </div>
              {stats.topLanguages.length ? (
                stats.topLanguages.map((item) => (
                  <div className="admin-bar-row" key={item.label}>
                    <span>{item.label.toUpperCase()}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">
                  有页面访问后，这里会显示语言数据。
                </p>
              )}
            </article>
            <article className="admin-panel admin-trend-panel">
              <div className="admin-panel-heading">
                <h2>近 14 天访问趋势</h2>
                <span>UTC 日期</span>
              </div>
              {stats.dailyVisits.length ? (
                <div className="admin-trend-list">
                  {stats.dailyVisits.map((item) => (
                    <div className="admin-trend-row" key={item.label}>
                      <span>{item.label.slice(5)}</span>
                      <div>
                        <i
                          style={{
                            width: `${Math.max(8, Math.min(100, (item.value / Math.max(...stats.dailyVisits.map((entry) => entry.value), 1)) * 100))}%`,
                          }}
                        />
                        <strong>{item.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-muted">
                  累计访问后，这里会显示近 14 天趋势。
                </p>
              )}
            </article>
          </section>
        </details>
        <details className="admin-dashboard-disclosure admin-records-disclosure">
          <summary>
            <span>
              <b>历史询盘快速查看</b>
              <small>筛选与导出；完整跟进请进入“客户询盘”</small>
            </span>
            <strong>{loading ? "更新中" : `${rows.length} 条记录`}</strong>
          </summary>
          <section className="admin-panel admin-inquiry-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>询盘记录</h2>
                <span>
                  {loading ? "正在更新…" : `当前显示 ${rows.length} 条`}
                </span>
              </div>
              <button
                className="admin-primary-button admin-export-button"
                onClick={exportCsv}
                disabled={!rows.length}
              >
                导出 CSV
              </button>
            </div>
            <form
              className="admin-filter-row"
              onSubmit={(event) => {
                event.preventDefault();
                void loadData();
              }}
            >
              <select
                aria-label="询盘状态"
                value={filters.status}
                onChange={(event) =>
                  setFilters({ ...filters, status: event.target.value })
                }
              >
                <option value="">全部状态</option>
                {statuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="产品型号"
                value={filters.product}
                onChange={(event) =>
                  setFilters({ ...filters, product: event.target.value })
                }
              >
                <option value="">全部型号</option>
                {products.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
              <input
                aria-label="国家或市场"
                placeholder="国家 / 市场"
                value={filters.country}
                onChange={(event) =>
                  setFilters({ ...filters, country: event.target.value })
                }
              />
              <input
                aria-label="开始日期"
                type="date"
                value={filters.from}
                onChange={(event) =>
                  setFilters({ ...filters, from: event.target.value })
                }
              />
              <input
                aria-label="结束日期"
                type="date"
                value={filters.to}
                onChange={(event) =>
                  setFilters({ ...filters, to: event.target.value })
                }
              />
              <button className="admin-quiet-button" type="submit">
                筛选
              </button>
            </form>
            {message ? <p className="admin-message">{message}</p> : null}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>客户</th>
                    <th>产品 / 数量</th>
                    <th>市场</th>
                    <th>配件</th>
                    <th>邮件状态</th>
                    <th>需求</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>
                        <strong>{row.name}</strong>
                        <small>{row.company || row.email}</small>
                        <small>{row.email}</small>
                      </td>
                      <td>
                        <strong>{row.product}</strong>
                        <small>{row.quantity}</small>
                      </td>
                      <td>{row.country || "—"}</td>
                      <td>{row.accessories || "—"}</td>
                      <td>
                        <div className="admin-delivery-status">
                          <span
                            className={
                              row.salesEmailSent === false
                                ? "is-failed"
                                : row.salesEmailSent
                                  ? "is-sent"
                                  : "is-unknown"
                            }
                          >
                            销售：
                            {row.salesEmailSent === null
                              ? "未记录"
                              : row.salesEmailSent
                                ? "已发送"
                                : "失败"}
                          </span>
                          <span
                            className={
                              row.customerEmailSent === false
                                ? "is-failed"
                                : row.customerEmailSent
                                  ? "is-sent"
                                  : "is-unknown"
                            }
                          >
                            客户：
                            {row.customerEmailSent === null
                              ? "未记录"
                              : row.customerEmailSent
                                ? "已发送"
                                : "失败"}
                          </span>
                          {row.emailError ? (
                            <small title={row.emailError}>
                              {row.emailError}
                            </small>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <p>{row.message}</p>
                        <small>{row.branding || "—"}</small>
                      </td>
                      <td>
                        <select
                          value={row.status}
                          aria-label={`${row.name} 状态`}
                          onChange={(event) =>
                            void updateRow(
                              row,
                              event.target.value as Status,
                              row.adminNote,
                            )
                          }
                        >
                          {statuses.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <input
                          className="admin-note-input"
                          aria-label={`${row.name} 备注`}
                          placeholder="内部备注"
                          defaultValue={row.adminNote}
                          onBlur={(event) => {
                            if (event.target.value !== row.adminNote)
                              void updateRow(
                                row,
                                row.status,
                                event.target.value,
                              );
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rows.length ? (
                <p className="admin-empty">没有符合筛选条件的询盘。</p>
              ) : null}
            </div>
          </section>
        </details>
      </div>
    </AdminShell>
  );
}
