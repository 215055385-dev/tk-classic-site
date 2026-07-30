import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { certifications, copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { certificationRequestCopy } from "@/lib/certification-copy";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const runtime = "edge";
function getLang(value: string | string[] | undefined): Lang { const code = Array.isArray(value) ? value[0] : value; return languages.some((language) => language.code === code) ? (code as Lang) : "en"; }
function queryFor(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams; const lang = getLang(params?.lang); const t = copy[lang];
  return { title: { absolute: `${t.sectionTitles.certs} | TK Classic` }, description: t.certs.join(" "), keywords: ["portable coffee machine certifications", "CE RoHS coffee machine", "coffee machine compliance documents"], alternates: { canonical: localizedUrl("/certifications", lang), languages: languageAlternates("/certifications") } };
}

export default async function CertificationsPage({ searchParams }: PageProps) {
  const params = await searchParams; const lang = getLang(params?.lang); const query = queryFor(lang); const t = copy[lang]; const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  return <main className="inner-page" dir={dir} lang={lang}>
    <header className="site-header detail-header"><Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><nav aria-label="Certifications navigation"><Link href={`/products${query}`}>{t.nav.products}</Link><Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link><Link href={`/oem-odm${query}`}>{t.nav.oem}</Link><Link href={`/factory${query}`}>{t.nav.factory}</Link><Link href={`/certifications${query}`} aria-current="page">{t.nav.certs}</Link><Link href={`/contact${query}`}>{t.nav.contact}</Link></nav><LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/certifications${language === "en" ? "" : `?lang=${language}`}`} /></header>
    <SectionFloatNav lang={lang} path="/certifications" label={t.sectionTitles.certs} />
    <section className="inner-hero section"><Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link><p className="eyebrow">{t.nav.certs}</p><h1>{t.sectionTitles.certs}</h1><p className="inner-hero-lead">{t.certs.join(" ")}</p><Link className="primary-action" href={`/contact${query}`}>{t.hero.primaryCta}<ArrowUpRight size={17} aria-hidden="true" /></Link></section>
    <RevealSection className="section cert-section" aria-labelledby="certifications-title"><div className="section-heading align-left"><span>{t.nav.certs}</span><h2 id="certifications-title">{t.sectionTitles.certs}</h2><p>{t.certs.join(" ")}</p><p className="certification-request-note">{certificationRequestCopy[lang]}</p></div><div className="cert-grid">{certifications.map((cert) => <div key={cert.name}><ShieldCheck size={22} aria-hidden="true" /><span>{cert.name}</span><small>{certificationRequestCopy[lang]}</small></div>)}</div></RevealSection>
    <SiteFooter lang={lang} />
  </main>;
}
