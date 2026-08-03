export type ClientConversionEvent =
  | "product_view"
  | "quote_click"
  | "whatsapp_click"
  | "brochure_download"
  | "form_start"
  | "generate_lead";

type EventDetails = {
  product?: string;
  metadata?: Record<string, unknown>;
};

const supportedLocales = new Set(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

function currentLanguage() {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  return new URLSearchParams(window.location.search).get("lang")
    ?? (firstSegment && supportedLocales.has(firstSegment) ? firstSegment : "en");
}

export function trackConversionEvent(name: ClientConversionEvent, details: EventDetails = {}) {
  if (typeof window === "undefined") return;
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
  const payload = JSON.stringify({
    name,
    path: window.location.pathname,
    lang: currentLanguage(),
    product: details.product ?? "",
    referrer: document.referrer,
    metadata: details.metadata ?? {},
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/event", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  });
}
