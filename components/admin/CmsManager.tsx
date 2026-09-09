"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Check, Edit3, ExternalLink, ImageIcon, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";

type Resource = "products" | "homepage" | "articles" | "seo" | "media";
type Item = Record<string, unknown> & { id: string };
type MediaOption = { id: string; originalName: string; publicUrl?: string | null };

const labels = {
  products: { eyebrow: "产品 CMS", title: "产品管理", description: "管理真实产品资料与发布状态。官方型号已锁定。", add: "新增产品" },
  media: { eyebrow: "资源中心", title: "媒体资源", description: "上传、分类、搜索和安全删除 Supabase Storage 中的真实图片与视频。", add: "上传媒体" },
  homepage: { eyebrow: "页面 CMS", title: "首页内容", description: "管理首页各内容区的标题、正文、按钮、排序和发布状态。", add: "新增板块" },
  articles: { eyebrow: "SEO / GEO 内容资产", title: "文章管理", description: "创建、编辑和发布真实买家指南与行业内容。", add: "新增文章" },
  seo: { eyebrow: "搜索优化", title: "页面 SEO", description: "管理每个路径和语言的标题、描述、关键词、Canonical 与抓取状态。", add: "新增页面 SEO" },
} as const;

const statusText: Record<string, string> = { DRAFT: "草稿", PUBLISHED: "已发布", ARCHIVED: "已归档", SCHEDULED: "定时发布" };
const categories = ["PRODUCT", "FACTORY", "EXHIBITION", "CERTIFICATION", "BANNER", "VIDEO_POSTER", "ARTICLE", "GENERAL"];

function empty(resource: Resource): Item {
  if (resource === "products") return { id: "", slug: "", model: "", name: "", summary: "", description: "", featureLabel: "", status: "DRAFT", sortOrder: 0, heroMediaId: null, galleryMediaIds: [], specs: {}, features: [], useCases: [], seoTitle: "", seoDescription: "", seoKeywords: [] };
  if (resource === "homepage") return { id: "", key: "", type: "content", status: "DRAFT", sortOrder: 0, title: "", subtitle: "", body: "", ctaLabel: "", ctaHref: "", settings: {} };
  if (resource === "articles") return { id: "", slug: "", status: "DRAFT", title: "", excerpt: "", content: "", category: "Buyer Guides", coverMediaId: null, seoTitle: "", seoDescription: "" };
  if (resource === "seo") return { id: "", path: "/", locale: "en", title: "", description: "", keywords: [], canonicalUrl: "", noIndex: false, schemaData: null };
  return { id: "", originalName: "", altText: "", category: "GENERAL" };
}

function text(value: unknown) { return typeof value === "string" ? value : ""; }
function lines(value: unknown) { return Array.isArray(value) ? value.join("\n") : ""; }
function dateText(value: unknown) { return typeof value === "string" ? new Date(value).toLocaleString("zh-CN") : "—"; }
function specRows(value: unknown) { return Object.entries((value && typeof value === "object" ? value : {}) as Record<string, unknown>).map(([key, item]) => ({ key, value: text(item) })); }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function productPublishIssues(item: Item) {
  const issues: string[] = [];
  if (!item.heroMediaId) issues.push("官方主图");
  if (!item.lockedModel && (!Array.isArray(item.galleryMediaIds) || !item.galleryMediaIds.length)) issues.push("至少 1 张详情展示图");
  if (specRows(item.specs).filter((row) => row.key.trim() && row.value.trim()).length < 3) issues.push("至少 3 项真实参数");
  if (!Array.isArray(item.features) || !item.features.length) issues.push("核心卖点");
  if (!Array.isArray(item.useCases) || !item.useCases.length) issues.push("应用场景");
  if (!text(item.seoTitle).trim()) issues.push("SEO 标题");
  if (!text(item.seoDescription).trim()) issues.push("SEO 描述");
  return issues;
}

function contentReadinessIssues(resource: Resource, item: Item) {
  if (resource === "products") return productPublishIssues(item);
  const issues: string[] = [];
  if (resource === "homepage") {
    if (!text(item.title).trim() && !text(item.body).trim()) issues.push("标题或正文");
    if (text(item.ctaLabel).trim() && !text(item.ctaHref).trim()) issues.push("按钮链接");
  }
  if (resource === "articles") {
    if (!text(item.title).trim()) issues.push("标题");
    if (!text(item.slug).trim()) issues.push("URL 路径");
    if (!text(item.excerpt).trim()) issues.push("摘要");
    if (!text(item.content).trim()) issues.push("正文");
    if (!text(item.seoTitle).trim()) issues.push("SEO 标题");
    if (!text(item.seoDescription).trim()) issues.push("SEO 描述");
  }
  if (resource === "seo") {
    if (!text(item.title).trim()) issues.push("SEO 标题");
    if (!text(item.description).trim()) issues.push("SEO 描述");
    if (!text(item.canonicalUrl).trim()) issues.push("Canonical");
  }
  if (resource === "media" && !text(item.altText).trim()) issues.push("图片说明");
  return issues;
}

export function CmsManager({ resource }: { resource: Resource }) {
  const meta = labels[resource]; const [items, setItems] = useState<Item[]>([]); const [media, setMedia] = useState<MediaOption[]>([]);
  const [loading, setLoading] = useState(true); const [query, setQuery] = useState(""); const [editing, setEditing] = useState<Item | null>(null);
  const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  const [contentView, setContentView] = useState<"all" | "primary" | "secondary" | "incomplete">("all");
  const searchRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true); setMessage("");
    const url = resource === "media" ? "/api/admin/cms/media" : `/api/admin/cms/${resource}`;
    const response = await fetch(url, { cache: "no-store" }); const body = await response.json();
    if (!response.ok) setMessage(body.error || "加载失败"); else { setItems(body.items || []); setMedia(body.media || []); }
    setLoading(false);
  }, [resource]);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !editing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [editing]);
  useEffect(() => {
    const controller = new AbortController();
    const url = resource === "media" ? "/api/admin/cms/media" : `/api/admin/cms/${resource}`;
    void fetch(url, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) setMessage(body.error || "加载失败");
      else { setItems(body.items || []); setMedia(body.media || []); }
      setLoading(false);
    }).catch((error) => { if (error instanceof Error && error.name !== "AbortError") setMessage("加载失败"); });
    return () => controller.abort();
  }, [resource]);

  const filtered = useMemo(() => items.filter((item) => {
    if (!JSON.stringify(item).toLowerCase().includes(query.toLowerCase())) return false;
    if (contentView === "incomplete") return contentReadinessIssues(resource, item).length > 0;
    if (contentView === "primary") {
      if (resource === "seo") return !item.noIndex;
      if (resource === "media") return Number(item.referenceCount) > 0;
      return item.status === "PUBLISHED";
    }
    if (contentView === "secondary") {
      if (resource === "seo") return Boolean(item.noIndex);
      if (resource === "media") return Number(item.referenceCount) === 0;
      return item.status === "DRAFT";
    }
    return true;
  }), [contentView, items, query, resource]);
  const productSummary = useMemo(() => resource !== "products" ? null : {
    total: items.length,
    published: items.filter((item) => item.status === "PUBLISHED").length,
    draft: items.filter((item) => item.status === "DRAFT").length,
    incomplete: items.filter((item) => productPublishIssues(item).length).length,
  }, [items, resource]);
  const contentSummary = useMemo(() => resource === "products" ? null : {
    total: items.length,
    primary: items.filter((item) => resource === "seo" ? !item.noIndex : resource === "media" ? Number(item.referenceCount) > 0 : item.status === "PUBLISHED").length,
    secondary: items.filter((item) => resource === "seo" ? Boolean(item.noIndex) : resource === "media" ? Number(item.referenceCount) === 0 : item.status === "DRAFT").length,
    incomplete: items.filter((item) => contentReadinessIssues(resource, item).length > 0).length,
  }, [items, resource]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return; setSaving(true); setMessage("");
    const url = resource === "media" ? "/api/admin/cms/media" : `/api/admin/cms/${resource}`;
    const payload = editing.id ? editing : Object.fromEntries(Object.entries(editing).filter(([key]) => key !== "id"));
    const response = await fetch(url, { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json(); setSaving(false); if (!response.ok) return setMessage(body.error || "保存失败"); setEditing(null); setMessage("已保存并同步到数据库"); await load();
  }

  async function remove(item: Item) {
    const warning = resource === "products" && item.lockedModel ? "官方型号不会被物理删除，而会安全归档。确认继续？" : "确认删除？被其他内容引用的媒体不会被删除。";
    if (!window.confirm(warning)) return;
    const url = resource === "media" ? "/api/admin/cms/media" : `/api/admin/cms/${resource}`;
    const response = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) }); const body = await response.json();
    if (!response.ok) setMessage(body.error || "删除失败"); else { setMessage(resource === "products" && item.lockedModel ? "产品已归档" : "已删除"); await load(); }
  }

  return <section className="cms-manager" aria-busy={loading}>
    <header className="cms-page-heading"><div><span>{meta.eyebrow}</span><h1>{meta.title}</h1><p>{meta.description}</p></div>{resource !== "media" ? <button className="cms-primary" onClick={() => setEditing(empty(resource))}><Plus size={17}/>{meta.add}</button> : null}</header>
    {resource === "media" ? <MediaUploader onUploaded={load}/> : null}
    {productSummary ? <div className="cms-product-summary" aria-label="产品发布概览">
      <div><span>全部产品</span><strong>{productSummary.total}</strong></div>
      <div><span>已发布</span><strong>{productSummary.published}</strong></div>
      <div><span>草稿</span><strong>{productSummary.draft}</strong></div>
      <div className={productSummary.incomplete ? "is-warning" : "is-ready"}><span>待补资料</span><strong>{productSummary.incomplete}</strong></div>
    </div> : null}
    {contentSummary ? <div className="cms-content-overview" aria-label="内容状态概览">
      <button className={contentView === "all" ? "is-active" : undefined} onClick={() => setContentView("all")}><span>全部</span><strong>{contentSummary.total}</strong></button>
      <button className={contentView === "primary" ? "is-active" : undefined} onClick={() => setContentView("primary")}><span>{resource === "seo" ? "允许索引" : resource === "media" ? "使用中" : "已发布"}</span><strong>{contentSummary.primary}</strong></button>
      <button className={contentView === "secondary" ? "is-active" : undefined} onClick={() => setContentView("secondary")}><span>{resource === "seo" ? "禁止索引" : resource === "media" ? "未使用" : "草稿"}</span><strong>{contentSummary.secondary}</strong></button>
      <button className={`${contentView === "incomplete" ? "is-active " : ""}is-warning`} onClick={() => setContentView("incomplete")}><span>待补资料</span><strong>{contentSummary.incomplete}</strong></button>
    </div> : null}
    <div className="cms-toolbar"><label><Search size={17}/><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索当前内容" aria-label="搜索当前内容" /><kbd>Ctrl K</kbd></label><button onClick={() => void load()} disabled={loading}><RefreshCw size={16}/>{loading ? "加载中…" : "刷新"}</button><span>共 {filtered.length} 条</span></div>
    {message ? <p className="cms-notice" role="status">{message}</p> : null}
    {resource === "media" ? <MediaGrid items={filtered} onEdit={setEditing} onDelete={remove}/> : <DataTable resource={resource} items={filtered} onEdit={setEditing} onDelete={remove}/>} 
    {!loading && !filtered.length ? <div className="cms-empty">暂无内容。点击右上角开始创建真实数据。</div> : null}
    {editing ? <Editor resource={resource} item={editing} media={media} setItem={setEditing} close={() => setEditing(null)} save={save} saving={saving}/> : null}
  </section>;
}

function DataTable({ resource, items, onEdit, onDelete }: { resource: Resource; items: Item[]; onEdit: (x: Item) => void; onDelete: (x: Item) => void }) {
  return <div className="cms-table-wrap"><table className="cms-table"><thead><tr><th>内容</th><th>状态 / 语言</th><th>路径 / 类型</th><th>排序 / 更新时间</th><th>操作</th></tr></thead><tbody>{items.map((item) => {
    const title = resource === "products" ? `${text(item.model)} · ${text(item.name)}` : resource === "homepage" ? text(item.title) || text(item.key) : text(item.title);
    const detail = resource === "products" ? text(item.summary) : resource === "articles" ? text(item.excerpt) : resource === "seo" ? text(item.description) : text(item.subtitle);
    const publishIssues = contentReadinessIssues(resource, item);
    return <tr key={item.id}><td><strong>{title || "未命名"}</strong><small>{detail || "—"}</small><span className={`cms-readiness-chip ${publishIssues.length ? "is-incomplete" : "is-ready"}`} title={publishIssues.join("、")}>{publishIssues.length ? `待补 ${publishIssues.length} 项` : "资料完整"}</span>{resource === "products" && item.heroUrl ? <Image unoptimized className="cms-row-thumb" src={text(item.heroUrl)} alt="" width={48} height={48}/> : null}</td><td><span className={`cms-status is-${text(item.status || (item.noIndex ? "ARCHIVED" : "PUBLISHED")).toLowerCase()}`}>{statusText[text(item.status)] || (item.noIndex ? "禁止索引" : text(item.locale))}</span></td><td>{text(item.slug || item.path || item.type)}</td><td>{item.sortOrder !== undefined ? String(item.sortOrder) : dateText(item.updatedAt)}</td><td><div className="cms-actions">{resource === "products" && item.slug ? <a href={`/products/${text(item.slug)}`} target="_blank" rel="noreferrer" aria-label="预览前台"><ExternalLink size={16}/></a> : null}<button aria-label="编辑" onClick={() => onEdit(item)}><Edit3 size={16}/></button><button className="is-danger" aria-label="删除" onClick={() => void onDelete(item)}><Trash2 size={16}/></button></div></td></tr>;
  })}</tbody></table></div>;
}

function MediaGrid({ items, onEdit, onDelete }: { items: Item[]; onEdit: (x: Item) => void; onDelete: (x: Item) => void }) {
  return <div className="cms-media-grid">{items.map((item) => { const issues = contentReadinessIssues("media", item); return <article key={item.id} className="cms-media-card"><div className="cms-media-preview">{text(item.type) === "VIDEO" ? <video src={text(item.publicUrl)} muted preload="metadata"/> : item.publicUrl ? <Image unoptimized src={text(item.publicUrl)} alt={text(item.altText)} width={480} height={360}/> : <ImageIcon/>}</div><div><strong>{text(item.originalName)}</strong><small>{text(item.category)} · {Math.max(0, Number(item.bytes) / 1024 / 1024).toFixed(2)} MB</small><span className={Number(item.referenceCount) ? "cms-reference is-used" : "cms-reference"}>{Number(item.referenceCount) ? `已被 ${Number(item.referenceCount)} 处内容使用` : "当前未被引用"}</span><span className={`cms-readiness-chip ${issues.length ? "is-incomplete" : "is-ready"}`}>{issues.length ? "缺少图片说明" : "说明完整"}</span></div><div className="cms-actions"><a href={text(item.publicUrl)} target="_blank" rel="noreferrer" aria-label="查看"><ExternalLink size={16}/></a><button onClick={() => onEdit(item)} aria-label="编辑"><Edit3 size={16}/></button><button className="is-danger" onClick={() => void onDelete(item)} aria-label="删除"><Trash2 size={16}/></button></div></article>; })}</div>;
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) { return <label className={wide ? "cms-field is-wide" : "cms-field"}><span>{label}</span>{children}</label>; }
function ProductGalleryPicker({ item, media, change }: { item: Item; media: MediaOption[]; change: (key: string, value: unknown) => void }) {
  const selected = Array.isArray(item.galleryMediaIds) ? item.galleryMediaIds.filter((id): id is string => typeof id === "string") : [];
  const selectedMedia = selected.map((id) => media.find((entry) => entry.id === id)).filter((entry): entry is MediaOption => Boolean(entry));
  const toggle = (id: string) => {
    if (id === item.heroMediaId) return;
    if (selected.includes(id)) change("galleryMediaIds", selected.filter((entry) => entry !== id));
    else if (selected.length < 12) change("galleryMediaIds", [...selected, id]);
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    [next[index], next[target]] = [next[target], next[index]];
    change("galleryMediaIds", next);
  };
  return <section className="cms-field is-wide cms-product-gallery-picker">
    <div className="cms-gallery-heading"><div><span>产品详情图库</span><small>选择 1–12 张真实图片；下方顺序就是前台展示顺序。</small></div><strong>{selected.length}/12</strong></div>
    {selectedMedia.length ? <div className="cms-gallery-order" aria-label="已选详情图顺序">{selectedMedia.map((entry, index) => <article key={entry.id}><span>{index + 1}</span>{entry.publicUrl ? <Image unoptimized src={entry.publicUrl} alt={entry.originalName} width={96} height={96}/> : <ImageIcon/>}<p title={entry.originalName}>{entry.originalName}</p><div><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`上移 ${entry.originalName}`}><ArrowUp size={14}/></button><button type="button" onClick={() => move(index, 1)} disabled={index === selectedMedia.length - 1} aria-label={`下移 ${entry.originalName}`}><ArrowDown size={14}/></button><button type="button" className="is-remove" onClick={() => toggle(entry.id)} aria-label={`移除 ${entry.originalName}`}><X size={14}/></button></div></article>)}</div> : <p className="cms-gallery-empty">尚未选择详情图。新产品发布前至少需要 1 张；官方锁定型号会继续使用现有真实图库。</p>}
    <div className="cms-gallery-library" aria-label="可选产品图片">{media.map((entry) => { const isSelected = selected.includes(entry.id); const isHero = entry.id === item.heroMediaId; return <button type="button" key={entry.id} className={isSelected ? "is-selected" : ""} disabled={isHero} onClick={() => toggle(entry.id)} aria-pressed={isSelected} aria-label={`${isSelected ? "取消选择" : "选择"}详情图 ${entry.originalName}`}>{entry.publicUrl ? <Image unoptimized src={entry.publicUrl} alt={entry.originalName} width={128} height={128}/> : <ImageIcon/>}<span title={entry.originalName}>{isHero ? "主图" : entry.originalName}</span>{isSelected ? <i><Check size={13}/></i> : null}</button>; })}</div>
  </section>;
}
function Editor({ resource, item, media, setItem, close, save, saving }: { resource: Resource; item: Item; media: MediaOption[]; setItem: (x: Item) => void; close: () => void; save: (e: React.FormEvent<HTMLFormElement>) => void; saving: boolean }) {
  const change = (key: string, value: unknown) => setItem({ ...item, [key]: value });
  const updateSpecs = (rows: Array<{ key: string; value: string }>) => change("specs", Object.fromEntries(rows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value])));
  const currentSpecs = specRows(item.specs);
  const heroMedia = media.find((entry) => entry.id === item.heroMediaId);
  const publishIssues = resource === "products" ? productPublishIssues(item) : [];
  const publishBlocked = resource === "products" && item.status === "PUBLISHED" && publishIssues.length > 0;
  return <div className="cms-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}><form className="cms-modal" onSubmit={save}><header><div><span>{item.id ? "编辑" : "新增"}</span><h2>{labels[resource].title}</h2></div><button type="button" onClick={close} aria-label="关闭"><X/></button></header><div className="cms-form-grid">
    {resource === "products" ? <>
      <Field label="产品型号"><input value={text(item.model)} disabled={Boolean(item.lockedModel)} onChange={(e) => { const model = e.target.value.toUpperCase().replace(/[^A-Z0-9-]+/g, "-"); setItem({ ...item, model, ...(!item.id && !text(item.slug) ? { slug: slugify(model) } : {}) }); }} required /></Field><Field label="URL 路径"><input value={text(item.slug)} onChange={(e) => change("slug", slugify(e.target.value))} required /></Field>
      <Field label="英文产品名称"><input value={text(item.name)} onChange={(e) => change("name", e.target.value)} required /></Field><Status item={item} change={change}/><Field label="排序"><input type="number" min="0" value={Number(item.sortOrder)} onChange={(e) => change("sortOrder", Number(e.target.value))}/></Field>
      <div className="cms-field is-wide cms-product-media-picker"><span>官方主图</span><div><select aria-label="官方主图" value={text(item.heroMediaId)} onChange={(e) => { const heroMediaId = e.target.value || null; const galleryMediaIds = Array.isArray(item.galleryMediaIds) ? item.galleryMediaIds.filter((id) => id !== heroMediaId) : []; setItem({ ...item, heroMediaId, galleryMediaIds }); }}><option value="">暂不关联</option>{media.map((x) => <option key={x.id} value={x.id}>{x.originalName}</option>)}</select><a href="/admin/media">前往媒体库上传</a></div>{heroMedia?.publicUrl ? <Image unoptimized src={heroMedia.publicUrl} alt="当前选择的产品主图预览" width={180} height={180}/> : <small>请先把真实产品图片上传到“媒体资源”，分类选择“产品图片”。</small>}</div>
      <ProductGalleryPicker item={item} media={media} change={change}/>
      <Field label="一句话定位" wide><textarea value={text(item.summary)} onChange={(e) => change("summary", e.target.value)} required /></Field><Field label="详细介绍" wide><textarea rows={5} value={text(item.description)} onChange={(e) => change("description", e.target.value)} /></Field>
      <Field label="产品标签"><input value={text(item.featureLabel)} onChange={(e) => change("featureLabel", e.target.value)}/></Field><div className="cms-field is-wide cms-spec-editor"><span>产品参数</span><p>逐项维护参数，不需要编辑 JSON。参数名称建议保持英文键名，以确保前台标签正确匹配。</p>{currentSpecs.map((row, index) => <div className="cms-spec-row" key={index}><input aria-label={`参数 ${index + 1} 名称`} value={row.key} placeholder="例如 pressure" onChange={(e) => { const next = [...currentSpecs]; next[index] = { ...row, key: e.target.value }; updateSpecs(next); }}/><input aria-label={`参数 ${index + 1} 内容`} value={row.value} placeholder="例如 25 bar" onChange={(e) => { const next = [...currentSpecs]; next[index] = { ...row, value: e.target.value }; updateSpecs(next); }}/><button type="button" aria-label={`删除参数 ${index + 1}`} onClick={() => updateSpecs(currentSpecs.filter((_, i) => i !== index))}><Trash2 size={15}/></button></div>)}<button type="button" className="cms-inline-add" onClick={() => updateSpecs([...currentSpecs, { key: `parameter-${currentSpecs.length + 1}`, value: "" }])}><Plus size={15}/>添加参数</button></div>
      <Field label="核心卖点（每行一条）" wide><textarea rows={5} value={lines(item.features)} onChange={(e) => change("features", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}/></Field><Field label="应用场景（每行一条）" wide><textarea rows={4} value={lines(item.useCases)} onChange={(e) => change("useCases", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}/></Field>
      <Field label="SEO 标题" wide><input value={text(item.seoTitle)} onChange={(e) => change("seoTitle", e.target.value)}/></Field><Field label="SEO 描述" wide><textarea value={text(item.seoDescription)} onChange={(e) => change("seoDescription", e.target.value)}/></Field><Field label="SEO 关键词（逗号分隔）" wide><input value={lines(item.seoKeywords).replace(/\n/g, ", ")} onChange={(e) => change("seoKeywords", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}/></Field>
      <section className={publishIssues.length ? "cms-publish-readiness is-incomplete" : "cms-publish-readiness is-ready"}><strong>{publishIssues.length ? "发布前还需补充" : "已达到发布条件"}</strong><p>{publishIssues.length ? publishIssues.join("、") : "主图、参数、卖点、场景和基础 SEO 均已填写。"}</p><small>草稿可以随时保存；只有资料完整后才能发布到前台。</small></section>
    </> : null}
    {resource === "homepage" ? <><Field label="唯一标识"><input value={text(item.key)} onChange={(e) => change("key", e.target.value)} required/></Field><Field label="板块类型"><input value={text(item.type)} onChange={(e) => change("type", e.target.value)} required/></Field><Status item={item} change={change}/><Field label="排序"><input type="number" min="0" value={Number(item.sortOrder)} onChange={(e) => change("sortOrder", Number(e.target.value))}/></Field><Field label="英文标题" wide><input value={text(item.title)} onChange={(e) => change("title", e.target.value)}/></Field><Field label="副标题" wide><textarea value={text(item.subtitle)} onChange={(e) => change("subtitle", e.target.value)}/></Field><Field label="正文" wide><textarea rows={8} value={text(item.body)} onChange={(e) => change("body", e.target.value)}/></Field><Field label="按钮文字"><input value={text(item.ctaLabel)} onChange={(e) => change("ctaLabel", e.target.value)}/></Field><Field label="按钮链接"><input value={text(item.ctaHref)} onChange={(e) => change("ctaHref", e.target.value)}/></Field></> : null}
    {resource === "articles" ? <><Field label="英文标题" wide><input value={text(item.title)} onChange={(e) => change("title", e.target.value)} required/></Field><Field label="URL 路径"><input value={text(item.slug)} onChange={(e) => change("slug", e.target.value)} required/></Field><Field label="分类"><input value={text(item.category)} onChange={(e) => change("category", e.target.value)}/></Field><Status item={item} change={change} article/><Field label="封面图片"><select value={text(item.coverMediaId)} onChange={(e) => change("coverMediaId", e.target.value || null)}><option value="">暂不关联</option>{media.map((x) => <option key={x.id} value={x.id}>{x.originalName}</option>)}</select></Field><Field label="摘要" wide><textarea value={text(item.excerpt)} onChange={(e) => change("excerpt", e.target.value)}/></Field><Field label="正文（支持 Markdown）" wide><textarea rows={16} value={text(item.content)} onChange={(e) => change("content", e.target.value)}/></Field><Field label="SEO 标题" wide><input value={text(item.seoTitle)} onChange={(e) => change("seoTitle", e.target.value)}/></Field><Field label="SEO 描述" wide><textarea value={text(item.seoDescription)} onChange={(e) => change("seoDescription", e.target.value)}/></Field></> : null}
    {resource === "seo" ? <><Field label="页面路径"><input value={text(item.path)} onChange={(e) => change("path", e.target.value)} required/></Field><Field label="语言"><input value={text(item.locale)} onChange={(e) => change("locale", e.target.value)} required/></Field><Field label="SEO 标题" wide><input value={text(item.title)} onChange={(e) => change("title", e.target.value)} required/></Field><Field label="SEO 描述" wide><textarea value={text(item.description)} onChange={(e) => change("description", e.target.value)} required/></Field><Field label="关键词（逗号分隔）" wide><input value={lines(item.keywords).replace(/\n/g, ", ")} onChange={(e) => change("keywords", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}/></Field><Field label="Canonical URL" wide><input value={text(item.canonicalUrl)} onChange={(e) => change("canonicalUrl", e.target.value)}/></Field><label className="cms-check"><input type="checkbox" checked={Boolean(item.noIndex)} onChange={(e) => change("noIndex", e.target.checked)}/>禁止搜索引擎索引</label></> : null}
    {resource === "media" ? <><Field label="显示名称" wide><input value={text(item.originalName)} onChange={(e) => change("originalName", e.target.value)} required/></Field><Field label="分类"><select value={text(item.category)} onChange={(e) => change("category", e.target.value)}>{categories.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="替代文字 / 说明" wide><textarea value={text(item.altText)} onChange={(e) => change("altText", e.target.value)}/></Field></> : null}
  </div><footer><button type="button" className="cms-secondary" onClick={close}>取消</button><button className="cms-primary" disabled={saving || publishBlocked} title={publishBlocked ? `请先补充：${publishIssues.join("、")}` : undefined}>{saving ? "保存中…" : item.status === "DRAFT" ? "保存草稿" : "保存并同步"}</button></footer></form></div>;
}
function Status({ item, change, article = false }: { item: Item; change: (key: string, value: unknown) => void; article?: boolean }) { const values = article ? ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"] : ["DRAFT", "PUBLISHED", "ARCHIVED"]; return <Field label="发布状态"><select value={text(item.status)} onChange={(e) => change("status", e.target.value)}>{values.map((x) => <option key={x} value={x}>{statusText[x]}</option>)}</select></Field>; }
