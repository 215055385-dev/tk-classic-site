export type ClientConversionEvent =
  | "product_view"
  | "quote_click"
  | "whatsapp_click"
  | "brochure_download"
  | "form_start"
  | "video_play"
  | "coffee_lab_concept"
  | "coffee_lab_download"
  | "generate_lead";

type EventDetails = {
  product?: string;
  metadata?: Record<string, unknown>;
};

type GoogleTagFunction = (...args: unknown[]) => void;

export type ClientAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  msclkid?: string;
  landingPage?: string;
  referrerHost?: string;
};

const attributionKey = "tk-first-touch-attribution";
const attributionParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "msclkid"] as const;

const supportedLocales = new Set(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

function currentLanguage() {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  return new URLSearchParams(window.location.search).get("lang")
    ?? (firstSegment && supportedLocales.has(firstSegment) ? firstSegment : "en");
}

export function getClientAttribution(): ClientAttribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const current: ClientAttribution = {
    landingPage: `${window.location.pathname}${window.location.search}`,
  };
  for (const key of attributionParams) {
    const value = params.get(key)?.trim();
    if (value) current[key] = value.slice(0, 200);
  }
  if (document.referrer) {
    try {
      current.referrerHost = new URL(document.referrer).hostname.slice(0, 200);
    } catch {
      // Ignore malformed referrers supplied by privacy tools or extensions.
    }
  }

  const hasCampaign = attributionParams.some((key) => Boolean(current[key]));
  try {
    const stored = sessionStorage.getItem(attributionKey);
    if (!hasCampaign && stored) return JSON.parse(stored) as ClientAttribution;
    if (hasCampaign || !stored) sessionStorage.setItem(attributionKey, JSON.stringify(current));
  } catch {
    // Analytics must never interfere with navigation or form submission.
  }
  return current;
}

export function trackConversionEvent(name: ClientConversionEvent, details: EventDetails = {}) {
  if (typeof window === "undefined") return;
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
  const gtag = (window as Window & { gtag?: GoogleTagFunction }).gtag;
  const eventMetadata = { ...getClientAttribution(), ...(details.metadata ?? {}) };
  if (gtag) {
    gtag("event", name, {
      product: details.product ?? "",
      page_path: window.location.pathname,
      ...eventMetadata,
    });
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
    const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
    if (name === "generate_lead" && /^AW-\d+$/i.test(adsId ?? "") && conversionLabel) {
      gtag("event", "conversion", { send_to: `${adsId}/${conversionLabel}` });
    }
  }
  const payload = JSON.stringify({
    name,
    path: window.location.pathname,
    lang: currentLanguage(),
    product: details.product ?? "",
    referrer: document.referrer,
    metadata: eventMetadata,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/event", new Blob([payload], { type: "application/json" }));
  } else {
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }
}
