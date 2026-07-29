import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { copy, languages, type Lang } from "@/lib/site-data";
import { inquiryCopy } from "@/lib/inquiry-copy";

type SuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Inquiry received | TK Classic",
  description: "Your TK Classic inquiry has been received.",
  robots: { index: false, follow: false },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function InquirySuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const ui = inquiryCopy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <main className="inner-page inquiry-success-page" dir={dir} lang={lang}>
      <section className="section inquiry-success-card" aria-labelledby="inquiry-success-title">
        <span className="inquiry-success-icon"><CheckCircle2 size={34} aria-hidden="true" /></span>
        <p className="eyebrow">{t.nav.contact}</p>
        <h1 id="inquiry-success-title">{ui.successTitle}</h1>
        <p>{ui.successBody}</p>
        <small>{ui.successNext}</small>
        <div className="inquiry-success-actions">
          <Link className="primary-action" href={`${prefix}/products`}>
            {t.nav.products}<ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="secondary-action" href={`${prefix}/contact`}>
            {ui.backToContact}
          </Link>
        </div>
      </section>
    </main>
  );
}
