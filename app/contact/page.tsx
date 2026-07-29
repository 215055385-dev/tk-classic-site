import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { SiteFooter } from "@/components/SiteFooter";
import { bundleCopy } from "@/lib/bundle-data";
import { company, copy, languages, products, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";

type ContactPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Contact TK Classic | Portable Coffee OEM",
  description: "Contact TK Classic for wholesale pricing, private-label programs, accessory sets and OEM/ODM portable coffee projects.",
  keywords: ["portable coffee machine quote", "coffee machine wholesale inquiry", "OEM coffee supplier contact", "private label coffee inquiry"],
  alternates: { canonical: "/contact", languages: languageAlternates("/contact") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  const bundles = bundleCopy[lang];
  const query = langQuery(lang);
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const requestedProduct = Array.isArray(params?.product) ? params?.product[0] : params?.product;
  const selectedProduct = products.some((product) => product.model === requestedProduct) ? requestedProduct ?? "DQ-001" : "DQ-001";
  const selectedAccessories = Array.isArray(params?.accessories) ? params?.accessories[0] ?? "" : params?.accessories ?? "";

  return (
    <main className="inner-page contact-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <nav aria-label="Contact navigation">
          <Link href={`/products${query}`}>{t.nav.products}</Link>
          <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
          <Link href={`/bundles${query}`}>{bundles.navLabel}</Link>
          <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
          <Link href={`/factory${query}`}>{t.nav.factory}</Link>
          <Link href={`/contact${query}`} aria-current="page">{t.nav.contact}</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/contact${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/contact" label={t.nav.contact} />

      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link>
        <p className="eyebrow">{t.nav.contact}</p>
        <h1>{t.contactTitle}</h1>
        <p className="inner-hero-lead">{t.contactLead}</p>
      </section>

      <section className="section contact-page-grid">
        <div className="contact-page-details">
          <div className="section-heading align-left"><span>{t.nav.contact}</span><h2>{t.contactTitle}</h2><p>{t.contactLead}</p></div>
          <div className="contact-methods">
            <a href={`mailto:${company.emailBowie}`}><Mail size={20} aria-hidden="true" /><span>{company.emailBowie}</span></a>
            <a href={`mailto:${company.emailLeo}`}><Mail size={20} aria-hidden="true" /><span>{company.emailLeo}</span></a>
            <a href={`https://wa.me/${company.whatsappBowie.replace("+", "")}`} target="_blank" rel="noreferrer"><MessageCircle size={20} aria-hidden="true" /><span>WhatsApp {company.whatsappBowie}</span></a>
            <a href={`tel:${company.phoneBowie}`}><Phone size={20} aria-hidden="true" /><span>{company.phoneBowie}</span></a>
          </div>
        </div>
        <InquiryForm lang={lang} selectedProduct={selectedProduct} selectedAccessories={selectedAccessories} />
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
