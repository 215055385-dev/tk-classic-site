import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { SiteFooter } from "@/components/SiteFooter";
import { company, copy, languages, products, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { phoneHref, whatsappHref } from "@/lib/contact";
import { brandTagline } from "@/lib/translation-copy";
import { ProcurementExpectation } from "@/components/ProcurementExpectation";
import { PrimaryNav } from "@/components/PrimaryNav";

type ContactPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export async function generateMetadata({ searchParams }: ContactPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return {
    title: { absolute: `${t.contactTitle} | TK Classic` },
    description: t.contactLead,
    keywords: ["portable coffee machine quote", "coffee machine wholesale inquiry", "OEM coffee supplier contact", "private label coffee inquiry"],
    alternates: { canonical: localizedUrl("/contact", lang), languages: languageAlternates("/contact") },
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const requestedProduct = Array.isArray(params?.product) ? params?.product[0] : params?.product;
  const selectedProduct = products.some((product) => product.model === requestedProduct) ? requestedProduct ?? "DQ-001" : "DQ-001";
  const selectedAccessories = Array.isArray(params?.accessories) ? params?.accessories[0] ?? "" : params?.accessories ?? "";

  return (
    <main className="inner-page contact-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link>
        <PrimaryNav lang={lang} current="contact" ariaLabel="Contact navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/contact${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/contact" label={t.nav.contact} />

      <section className="inner-hero section">
        <p className="eyebrow">{t.nav.contact}</p>
        <h1>{t.contactTitle}</h1>
        <p className="inner-hero-lead">{t.contactLead}</p>
      </section>

      <section className="section procurement-contact-section">
        <ProcurementExpectation lang={lang} compact />
      </section>

      <section className="section contact-page-grid">
        <div className="contact-page-details">
          <div className="section-heading align-left"><span>{t.nav.contact}</span><h2>{t.contactTitle}</h2><p>{t.contactLead}</p></div>
          <div className="contact-methods">
            <Link href="#inquiry-form"><Mail size={20} aria-hidden="true" /><span>{t.form.emailUs}</span></Link>
            <a href={whatsappHref(selectedProduct)} target="_blank" rel="noreferrer"><MessageCircle size={20} aria-hidden="true" /><span>{t.form.whatsapp} — {selectedProduct}</span></a>
            <a href={phoneHref(company.phoneBowie)}><Phone size={20} aria-hidden="true" /><span>{company.phoneBowie}</span></a>
          </div>
        </div>
        <InquiryForm lang={lang} selectedProduct={selectedProduct} selectedAccessories={selectedAccessories} />
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
