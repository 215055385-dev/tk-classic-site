"use client";

import { useMemo, useState } from "react";
import { Clipboard, FileText } from "lucide-react";
import Link from "next/link";
import type { Lang } from "@/lib/site-data";

type InquiryBuilderProps = { lang: Lang };

export function InquiryBuilder({ lang }: InquiryBuilderProps) {
  const isZh = lang === "zh";
  const [model, setModel] = useState("DQ-010");
  const [quantity, setQuantity] = useState("500");
  const [market, setMarket] = useState("EU / UK");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const summary = useMemo(() => `${isZh ? "型号" : "Model"}: ${model}\n${isZh ? "数量" : "Quantity"}: ${quantity} pcs\n${isZh ? "目标市场" : "Target market"}: ${market}\n${isZh ? "定制需求" : "Customization"}: ${notes || "—"}`, [isZh, market, model, notes, quantity]);

  async function copySummary() {
    await navigator.clipboard?.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="tool-builder-panel" aria-label={isZh ? "询盘生成器" : "Inquiry builder"}>
      <div className="inquiry-builder-layout">
        <div className="tool-builder-options">
          <div className="tool-builder-heading"><FileText size={18} aria-hidden="true" /><h2>{isZh ? "整理你的采购需求" : "Shape your buying brief"}</h2></div>
          <label className="tool-builder-field"><span>{isZh ? "意向型号" : "Target model"}</span><select value={model} onChange={(event) => setModel(event.target.value)}><option>DQ-001</option><option>DQ-005</option><option>DQ-010</option><option>DQ-011</option></select></label>
          <label className="tool-builder-field"><span>{isZh ? "采购数量" : "Quantity"}</span><input type="number" min={100} step={50} value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
          <label className="tool-builder-field"><span>{isZh ? "目标市场" : "Target market"}</span><input value={market} onChange={(event) => setMarket(event.target.value)} /></label>
          <label className="tool-builder-field"><span>{isZh ? "Logo、包装或配件需求" : "Logo, packaging or accessory needs"}</span><textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={isZh ? "例如：礼盒、颜色、Logo 位置" : "For example: gift box, color, logo placement"} /></label>
        </div>
        <aside className="inquiry-builder-summary">
          <span>{isZh ? "询盘摘要" : "Inquiry summary"}</span>
          <pre>{summary}</pre>
          <button type="button" onClick={copySummary}><Clipboard size={16} aria-hidden="true" />{copied ? (isZh ? "已复制" : "Copied") : (isZh ? "复制摘要" : "Copy summary")}</button>
          <Link className="primary-action" href="/#contact">{isZh ? "提交真实询盘" : "Submit real inquiry"}</Link>
        </aside>
      </div>
    </section>
  );
}
