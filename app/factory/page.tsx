import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { uiCopy } from "@/lib/localized-ui";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const runtime = "edge";
function getLang(value: string | string[] | undefined): Lang { const code = Array.isArray(value) ? value[0] : value; return languages.some((language) => language.code === code) ? (code as Lang) : "en"; }
function queryFor(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams; const lang = getLang(params?.lang); const t = copy[lang];
  return { title: { absolute: `${t.sectionTitles.factory} | TK Classic` }, description: t.factory.join(" "), keywords: ["portable coffee machine factory", "coffee machine OEM manufacturing", "portable espresso production", "Shenzhen OEM factory"], alternates: { canonical: localizedUrl("/factory", lang), languages: languageAlternates("/factory") } };
}

export default async function FactoryPage({ searchParams }: PageProps) {
  const params = await searchParams; const lang = getLang(params?.lang); const query = queryFor(lang); const t = copy[lang]; const ui = uiCopy[lang]; const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  return <main className="inner-page" dir={dir} lang={lang}>
    <header className="site-header detail-header"><Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><nav aria-label="Factory navigation"><Link href={`/products${query}`}>{t.nav.products}</Link><Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link><Link href={`/oem-odm${query}`}>{t.nav.oem}</Link><Link href={`/factory${query}`} aria-current="page">{t.nav.factory}</Link><Link href={`/certifications${query}`}>{t.nav.certs}</Link><Link href={`/contact${query}`}>{t.nav.contact}</Link></nav><LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/factory${language === "en" ? "" : `?lang=${language}`}`} /></header>
    <SectionFloatNav lang={lang} path="/factory" label={t.sectionTitles.factory} />
    <section className="inner-hero section"><Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />{t.nav.home}</Link><p className="eyebrow">{t.nav.factory}</p><h1>{t.sectionTitles.factory}</h1><p className="inner-hero-lead">{t.intro}</p><Link className="primary-action" href={`/contact${query}`}>{t.hero.primaryCta}<ArrowUpRight size={17} aria-hidden="true" /></Link></section>
    <RevealSection className="section factory-section" aria-labelledby="factory-strength-title"><div><div className="section-heading align-left"><span>{t.nav.factory}</span><h2 id="factory-strength-title">{t.sectionTitles.factory}</h2></div><div className="factory-list">{t.factory.map((item) => <div key={item}><BadgeCheck size={21} aria-hidden="true" /><p>{item}</p></div>)}</div></div><div className="metric-panel"><div><strong>15+</strong><span>{ui.proof.years}</span></div><div><strong>50+</strong><span>{ui.proof.markets}</span></div><div><strong>CE / FDA</strong><span>{ui.proof.compliance}</span></div><div><strong>ISO 9001</strong><span>{ui.proof.compliance}</span></div></div></RevealSection>
    <SiteFooter lang={lang} />
  </main>;
}
