"use client";

import { useRef, useState } from "react";
import * as tus from "tus-js-client";
import { CheckCircle2, FileUp, LoaderCircle, Upload, XCircle } from "lucide-react";

const categories = ["PRODUCT", "FACTORY", "EXHIBITION", "CERTIFICATION", "BANNER", "VIDEO_POSTER", "ARTICLE", "GENERAL"] as const;
const categoryLabels: Record<(typeof categories)[number], string> = {
  PRODUCT: "产品图片", FACTORY: "工厂图片", EXHIBITION: "展会图片", CERTIFICATION: "认证资料",
  BANNER: "首页横幅", VIDEO_POSTER: "视频封面", ARTICLE: "文章图片", GENERAL: "其他资源",
};
type UploadState = { id: string; file: File; progress: number; status: "waiting" | "uploading" | "done" | "error"; error?: string };

export function MediaUploader({ onUploaded }: { onUploaded: () => Promise<void> }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("GENERAL");
  const [altText, setAltText] = useState("");
  const [queue, setQueue] = useState<UploadState[]>([]);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function choose(files: FileList | null) {
    if (!files) return;
    setQueue(Array.from(files).map((file) => ({ id: crypto.randomUUID(), file, progress: 0, status: "waiting" })));
  }
  function update(id: string, next: Partial<UploadState>) { setQueue((current) => current.map((item) => item.id === id ? { ...item, ...next } : item)); }

  async function uploadOne(item: UploadState) {
    update(item.id, { status: "uploading", progress: 0, error: undefined });
    const common = { name: item.file.name, type: item.file.type, size: item.file.size, category, altText };
    const prepareResponse = await fetch("/api/admin/cms/media/resumable", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "prepare", ...common }) });
    const prepared = await prepareResponse.json();
    if (!prepareResponse.ok || !prepared.ok) throw new Error(prepared.error || "无法创建上传任务。");

    await new Promise<void>((resolve, reject) => {
      const task = new tus.Upload(item.file, {
        endpoint: prepared.endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: { authorization: `Bearer ${prepared.authorization}`, "x-signature": prepared.token },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024,
        metadata: { bucketName: prepared.bucket, objectName: prepared.path, contentType: item.file.type, cacheControl: "31536000" },
        onError: reject,
        onProgress: (uploaded, total) => update(item.id, { progress: total ? Math.round((uploaded / total) * 100) : 0 }),
        onSuccess: () => resolve(),
      });
      void task.findPreviousUploads().then((previous) => { if (previous.length) task.resumeFromPreviousUpload(previous[0]); task.start(); }).catch(reject);
    });

    const completeResponse = await fetch("/api/admin/cms/media/resumable", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete", ...common, path: prepared.path }) });
    const completed = await completeResponse.json();
    if (!completeResponse.ok || !completed.ok) throw new Error(completed.error || "文件已上传，但登记媒体信息失败。");
    update(item.id, { status: "done", progress: 100 });
  }

  async function start() {
    if (!queue.length || running) return;
    setRunning(true);
    for (const item of queue) {
      if (item.status === "done") continue;
      try { await uploadOne(item); }
      catch (error) { update(item.id, { status: "error", error: error instanceof Error ? error.message : "上传失败" }); }
    }
    setRunning(false);
    await onUploaded();
  }

  return <section className="cms-batch-upload" aria-label="批量上传媒体">
    <div className="cms-upload-controls">
      <label><span>资源分类</span><select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>{categories.map((value) => <option value={value} key={value}>{categoryLabels[value]}</option>)}</select></label>
      <label className="cms-grow"><span>统一替代文字 / 说明（可选）</span><input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="准确描述这批图片或视频的真实内容" /></label>
      <input ref={inputRef} className="cms-hidden-file" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,video/mp4,video/webm" onChange={(event) => choose(event.target.files)} />
      <button className="cms-secondary" type="button" onClick={() => inputRef.current?.click()}><FileUp size={17}/>选择多个文件</button>
      <button className="cms-primary" type="button" disabled={!queue.length || running} onClick={() => void start()}>{running ? <LoaderCircle className="cms-spin" size={17}/> : <Upload size={17}/>} {running ? "正在上传" : `开始上传${queue.length ? `（${queue.length}）` : ""}`}</button>
    </div>
    {queue.length ? <div className="cms-upload-queue">{queue.map((item) => <div className={`cms-upload-item is-${item.status}`} key={item.id}><span>{item.status === "done" ? <CheckCircle2 size={16}/> : item.status === "error" ? <XCircle size={16}/> : <FileUp size={16}/>}</span><div><strong>{item.file.name}</strong><small>{(item.file.size / 1024 / 1024).toFixed(2)} MB{item.error ? ` · ${item.error}` : ""}</small><i><b style={{ width: `${item.progress}%` }}/></i></div><em>{item.progress}%</em></div>)}</div> : <p className="cms-upload-help">支持多选。大视频采用 6MB 分片并可自动重试，不再经过 Vercel 函数传输。</p>}
  </section>;
}
