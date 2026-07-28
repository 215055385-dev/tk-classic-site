"use client";

import { useMemo, useState } from "react";
import { Calculator, TrendingDown } from "lucide-react";
import Link from "next/link";
import type { Lang } from "@/lib/site-data";

type SavingsCalculatorProps = { lang: Lang };

export function SavingsCalculator({ lang }: SavingsCalculatorProps) {
  const isZh = lang === "zh";
  const [quantity, setQuantity] = useState(500);
  const [unitPrice, setUnitPrice] = useState(34);
  const result = useMemo(() => {
    const listPrice = unitPrice + 12;
    const total = quantity * unitPrice;
    const listTotal = quantity * listPrice;
    return { total, listTotal, saved: listTotal - total };
  }, [quantity, unitPrice]);

  return (
    <section className="tool-builder-panel" aria-label={isZh ? "节省计算器" : "Savings calculator"}>
      <div className="calculator-layout">
        <div className="tool-builder-options">
          <div className="tool-builder-block">
            <div className="tool-builder-heading"><Calculator size={18} aria-hidden="true" /><h2>{isZh ? "输入订单计划" : "Plan your order"}</h2></div>
            <label className="tool-builder-field"><span>{isZh ? "采购数量" : "Purchase quantity"}</span><input type="number" min={100} step={50} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
            <label className="tool-builder-field"><span>{isZh ? "批发单价（美元）" : "Wholesale unit price (USD)"}</span><input type="number" min={1} step={1} value={unitPrice} onChange={(event) => setUnitPrice(Number(event.target.value))} /></label>
          </div>
          <div className="calculator-note"><TrendingDown size={18} aria-hidden="true" /><p>{isZh ? "这是用于项目早期规划的估算，最终价格会根据型号、包装和定制范围确认。" : "Use this as an early planning estimate. Final pricing is confirmed by model, packaging and customization scope."}</p></div>
        </div>
        <aside className="calculator-result">
          <span>{isZh ? "预估采购总额" : "Estimated order value"}</span>
          <strong>${result.total.toLocaleString()}</strong>
          <div><span>{isZh ? "参考价" : "Reference total"}</span><b>${result.listTotal.toLocaleString()}</b></div>
          <div><span>{isZh ? "预估节省" : "Estimated saving"}</span><b className="calculator-saving">${result.saved.toLocaleString()}</b></div>
          <Link className="primary-action" href="/#contact">{isZh ? "带去询盘" : "Use in inquiry"}</Link>
        </aside>
      </div>
    </section>
  );
}
