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
  firstTouchAt?: string;
  lastTouchAt?: string;
  last_utm_source?: string;
  last_utm_medium?: string;
  last_utm_campaign?: string;
  last_utm_content?: string;
  last_utm_term?: string;
  last_gclid?: string;
  last_msclkid?: string;
  lastLandingPage?: string;
  lastReferrerHost?: string;
};

type TouchAttribution = Omit<ClientAttribution,
  "firstTouchAt" | "lastTouchAt" | "last_utm_source" | "last_utm_medium" |
  "last_utm_campaign" | "last_utm_content" | "last_utm_term" | "last_gclid" |
  "last_msclkid" | "lastLandingPage" | "lastReferrerHost"
>;

type StoredAttribution = {
  capturedAt: string;
  expiresAt: number;
  data: TouchAttribution;
};

const legacyAttributionKey = "tk-first-touch-attribution";
const firstTouchKey = "tk-first-touch-attribution-v2";
const lastTouchKey = "tk-last-touch-attribution-v2";
const attributionLifetimeMs = 90 * 24 * 60 * 60 * 1000;
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
  const current: TouchAttribution = {
    landingPage: `${window.location.pathname}${window.location.search}`,
  };
  for (const key of attributionParams) {
    const value = params.get(key)?.trim();
    if (value) current[key] = value.slice(0, 200);
  }
  if (document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).hostname.toLowerCase();
      const currentHost = window.location.hostname.toLowerCase();
      const isInternal = referrerHost === currentHost
        || referrerHost === `www.${currentHost}`
        || currentHost === `www.${referrerHost}`;
      if (!isInternal) current.referrerHost = referrerHost.slice(0, 200);
    } catch {
      // Ignore malformed referrers supplied by privacy tools or extensions.
    }
  }

  const hasAcquisitionSignal = attributionParams.some((key) => Boolean(current[key])) || Boolean(current.referrerHost);
  const now = Date.now();
  const createStored = (data: TouchAttribution): StoredAttribution => ({
    capturedAt: new Date(now).toISOString(),
    expiresAt: now + attributionLifetimeMs,
    data,
  });
  const readStored = (key: string): StoredAttribution | undefined => {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<StoredAttribution>;
    if (!parsed.data || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= now) {
      localStorage.removeItem(key);
      return undefined;
    }
    return parsed as StoredAttribution;
  };

  try {
    let first = readStored(firstTouchKey);
    let last = readStored(lastTouchKey);

    if (!first) {
      const legacy = sessionStorage.getItem(legacyAttributionKey);
      if (legacy) {
        const legacyData = JSON.parse(legacy) as TouchAttribution;
        first = createStored(legacyData);
        localStorage.setItem(firstTouchKey, JSON.stringify(first));
        sessionStorage.removeItem(legacyAttributionKey);
      }
    }

    if (!first) {
      first = createStored(current);
      localStorage.setItem(firstTouchKey, JSON.stringify(first));
    }
    if (hasAcquisitionSignal || !last) {
      last = createStored(current);
      localStorage.setItem(lastTouchKey, JSON.stringify(last));
    }

    return {
      ...first.data,
      firstTouchAt: first.capturedAt,
      lastTouchAt: last.capturedAt,
      last_utm_source: last.data.utm_source,
      last_utm_medium: last.data.utm_medium,
      last_utm_campaign: last.data.utm_campaign,
      last_utm_content: last.data.utm_content,
      last_utm_term: last.data.utm_term,
      last_gclid: last.data.gclid,
      last_msclkid: last.data.msclkid,
      lastLandingPage: last.data.landingPage,
      lastReferrerHost: last.data.referrerHost,
    };
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
