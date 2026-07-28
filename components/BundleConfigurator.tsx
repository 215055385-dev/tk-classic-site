"use client";

import { useMemo, useState } from "react";
import { Check, PackageCheck } from "lucide-react";
import Link from "next/link";
import type { Lang } from "@/lib/site-data";

type BundleConfiguratorProps = { lang: Lang };

const copy = {
  en: {
    bundle: "Bundle direction",
    packaging: "Packaging",
    branding: "Branding",
    quantity: "Planning quantity",
    starter: "Travel starter set",
    gift: "Retail gift set",
    launch: "Private label launch kit",
    standard: "Standard retail pack",
    premium: "Premium gift box",
    custom: "Custom packaging scope",
    logo: "Logo application",
    color: "Brand color matching",
    insert: "Retail insert card",
    summary: "Your starting brief",
    cta: "Send this bundle brief",
  },
  zh: {
    bundle: "套装方向", packaging: "包装方案", branding: "品牌定制", quantity: "计划数量", starter: "旅行入门套装", gift: "零售礼盒套装", launch: "私牌上市套装", standard: "标准零售包装", premium: "高级礼盒", custom: "定制包装方案", logo: "Logo 标识", color: "品牌配色", insert: "零售说明卡", summary: "你的套装概要", cta: "提交套装需求",
  },
} as const;

export function BundleConfigurator({ lang }: BundleConfiguratorProps) {
  const t = copy[lang === "zh" ? "zh" : "en"];
  const [bundle, setBundle] = useState("starter");
  const [packaging, setPackaging] = useState("standard");
  const [branding, setBranding] = useState<string[]>(["logo"]);
  const [quantity, setQuantity] = useState(500);

  const brandingOptions = useMemo(() => [
    ["logo", t.logo],
    ["color", t.color],
    ["insert", t.insert],
  ] as const, [t]);

  function toggleBranding(value: string) {
    setBranding((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <section className="tool-builder-panel" aria-label={t.summary}>
      <div className="tool-builder-grid">
        <div className="tool-builder-options">
          <div className="tool-builder-block">
            <div className="tool-builder-heading"><PackageCheck size={18} aria-hidden="true" /><h2>{t.bundle}</h2></div>
            <div className="tool-option-grid">
              {[["starter", t.starter], ["gift", t.gift], ["launch", t.launch]].map(([value, label]) => (
                <button className={bundle === value ? "is-selected" : ""} key={value} type="button" onClick={() => setBundle(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="tool-builder-block">
            <div className="tool-builder-heading"><PackageCheck size={18} aria-hidden="true" /><h2>{t.packaging}</h2></div>
            <div className="tool-option-grid">
              {[["standard", t.standard], ["premium", t.premium], ["custom", t.custom]].map(([value, label]) => (
                <button className={packaging === value ? "is-selected" : ""} key={value} type="button" onClick={() => setPackaging(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="tool-builder-block">
            <div className="tool-builder-heading"><Check size={18} aria-hidden="true" /><h2>{t.branding}</h2></div>
            <div className="tool-check-list">
              {brandingOptions.map(([value, label]) => (
                <button className={branding.includes(value) ? "is-selected" : ""} key={value} type="button" onClick={() => toggleBranding(value)}><Check size={15} aria-hidden="true" />{label}</button>
              ))}
            </div>
          </div>
          <label className="tool-builder-field"><span>{t.quantity}</span><input type="number" min={100} step={50} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
        </div>
        <aside className="tool-builder-summary">
          <span>{t.summary}</span>
          <strong>{bundle === "starter" ? t.starter : bundle === "gift" ? t.gift : t.launch}</strong>
          <p>{packaging === "standard" ? t.standard : packaging === "premium" ? t.premium : t.custom}</p>
          <dl>
            <div><dt>{t.branding}</dt><dd>{branding.length ? branding.map((item) => brandingOptions.find(([value]) => value === item)?.[1]).join(", ") : "—"}</dd></div>
            <div><dt>{t.quantity}</dt><dd>{quantity.toLocaleString()} pcs</dd></div>
          </dl>
          <Link className="primary-action" href="/#contact">{t.cta}</Link>
        </aside>
      </div>
    </section>
  );
}
