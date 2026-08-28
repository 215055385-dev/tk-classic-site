import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { company, copy, languages, type Lang } from "@/lib/site-data";
import { inquiryCopy } from "@/lib/inquiry-copy";

type SuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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
  const pending = params?.delivery === "pending";
  const inquiryId = typeof params?.id === "string" ? params.id : "";
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const query = lang === "en" ? "" : `?lang=${lang}`;

  return (
    <main className="inner-page inquiry-success-page" dir={dir} lang={lang}>
      <section className={`section inquiry-success-card${pending ? " is-pending" : ""}`} aria-labelledby="inquiry-success-title">
        <span className="inquiry-success-icon">
          {pending ? <AlertCircle size={34} aria-hidden="true" /> : <CheckCircle2 size={34} aria-hidden="true" />}
        </span>
        <p className="eyebrow">{t.nav.contact}</p>
        <h1 id="inquiry-success-title">{pending ? ui.pendingTitle : ui.successTitle}</h1>
        <p>{pending ? ui.pendingBody : ui.successBody}</p>
        <small>{pending ? ui.pendingNext : ui.successNext}</small>
        {inquiryId ? <code className="inquiry-reference">{ui.referenceLabel}: {inquiryId}</code> : null}
        <div className="inquiry-success-actions">
          {pending ? (
            <a className="primary-action" href={`https://wa.me/${company.whatsappBowie.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
              <MessageCircle size={16} aria-hidden="true" />WhatsApp
            </a>
          ) : null}
          <Link className="primary-action" href={`/products${query}`}>
            {t.nav.products}<ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="secondary-action" href={`/contact${query}`}>
            {ui.backToContact}
          </Link>
        </div>
      </section>
    </main>
  );
}
