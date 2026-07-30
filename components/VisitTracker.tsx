"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
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

  return null;
}
