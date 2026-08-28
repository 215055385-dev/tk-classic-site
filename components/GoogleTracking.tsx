import Script from "next/script";

function validId(value: string | undefined, pattern: RegExp) {
  const normalized = value?.trim() ?? "";
  return pattern.test(normalized) ? normalized : "";
}

export function GoogleTracking() {
  const analyticsId = validId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, /^G-[A-Z0-9]+$/i);
  const adsId = validId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d+$/i);
  const ids = Array.from(new Set([analyticsId, adsId].filter(Boolean)));
  if (!ids.length) return null;

  const primaryId = ids[0];
  const configuration = ids
    .map((id) => `gtag('config', ${JSON.stringify(id)}, { anonymize_ip: true });`)
    .join("\n");

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`} strategy="afterInteractive" />
      <Script id="tk-google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configuration}`}
      </Script>
    </>
  );
}
