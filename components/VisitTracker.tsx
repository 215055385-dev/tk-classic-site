"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    const lang = new URLSearchParams(window.location.search).get("lang") ?? "en";
    const payload = JSON.stringify({ path: pathname, lang, referrer: document.referrer });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/visit", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/analytics/visit", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
    }
  }, [pathname]);

  return null;
}
