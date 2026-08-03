"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackConversionEvent } from "@/lib/client-analytics";

export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    const localeFromPath = pathname.split("/").filter(Boolean)[0];
    const supportedLocales = new Set(["en", "es", "pt", "fr", "ar", "zh", "ru"]);
    const lang = new URLSearchParams(window.location.search).get("lang")
      ?? (localeFromPath && supportedLocales.has(localeFromPath) ? localeFromPath : "en");
    const payload = JSON.stringify({ path: pathname, lang, referrer: document.referrer });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/visit", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/analytics/visit", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
    }
  }, [pathname]);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

    const productMatch = pathname.match(/^\/(?:(?:en|es|pt|fr|ar|zh|ru)\/)?products\/(dq-\d+)/i);
    if (productMatch?.[1]) {
      const product = productMatch[1].toUpperCase();
      const storageKey = `tk-product-view:${pathname}`;
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, "1");
        trackConversionEvent("product_view", { product });
      }
    }

    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.href;
      const text = (anchor.textContent ?? "").trim().slice(0, 120);
      const product = anchor.closest<HTMLElement>("[data-product-model]")?.dataset.productModel ?? "";
      if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
        trackConversionEvent("whatsapp_click", { product, metadata: { label: text } });
        return;
      }
      if (/\/downloads\/.*brochure.*\.pdf/i.test(href)) {
        trackConversionEvent("brochure_download", { product, metadata: { label: text } });
        return;
      }
      const isQuoteTarget = /#(?:contact|inquiry-form)/i.test(href)
        || (/\/contact(?:[/?#]|$)/i.test(href) && anchor.matches(".primary-action, .quote-link, .mobile-sticky-cta a"));
      if (isQuoteTarget) {
        trackConversionEvent("quote_click", { product, metadata: { label: text } });
      }
    }

    const form = document.getElementById("inquiry-form");
    const startKey = `tk-form-start:${pathname}`;
    function handleFormStart() {
      if (sessionStorage.getItem(startKey)) return;
      sessionStorage.setItem(startKey, "1");
      const selectedProduct = form?.querySelector<HTMLSelectElement>('select[name="product"]')?.value ?? "";
      trackConversionEvent("form_start", { product: selectedProduct });
    }

    document.addEventListener("click", handleClick);
    form?.addEventListener("focusin", handleFormStart, { once: true });
    return () => {
      document.removeEventListener("click", handleClick);
      form?.removeEventListener("focusin", handleFormStart);
    };
  }, [pathname]);

  return null;
}
