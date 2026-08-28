import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Award, BadgeCheck, FileCheck2, Leaf, Radio, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { SiteFooter } from "@/components/SiteFooter";
import { certifications, copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { certificationRequestCopy } from "@/lib/certification-copy";
import { brandTagline } from "@/lib/translation-copy";
import { PrimaryNav } from "@/components/PrimaryNav";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
function getLang(value: string | string[] | undefined): Lang { const code = Array.isArray(value) ? value[0] : value; return languages.some((language) => language.code === code) ? (code as Lang) : "en"; }
function queryFor(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams; const lang = getLang(params?.lang); const t = copy[lang];
  return { title: { absolute: `${t.sectionTitles.certs} | TK Classic` }, description: t.certs.join(" "), keywords: ["portable coffee machine certifications", "CE RoHS coffee machine", "coffee machine compliance documents"], alternates: { canonical: localizedUrl("/certifications", lang), languages: languageAlternates("/certifications") } };
}

export default async function CertificationsPage({ searchParams }: PageProps) {
  const params = await searchParams; const lang = getLang(params?.lang); const query = queryFor(lang); const t = copy[lang]; const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const pageCopy = {
    en: { title: "Compliance at a glance.", lead: "Available documents are confirmed for the selected model and destination market.", preview: "Protected document preview" },
    es: { title: "Cumplimiento de un vistazo.", lead: "Los documentos disponibles se confirman según el modelo y el mercado de destino.", preview: "Vista protegida de documentos" },
    pt: { title: "Conformidade em resumo.", lead: "Os documentos disponíveis são confirmados conforme o modelo e o mercado de destino.", preview: "Prévia protegida dos documentos" },
    fr: { title: "La conformité en un coup d’œil.", lead: "Les documents disponibles sont confirmés selon le modèle et le marché de destination.", preview: "Aperçu protégé des documents" },
    ar: { title: "الامتثال في نظرة واحدة.", lead: "تُؤكد الوثائق المتاحة حسب الطراز والسوق المستهدف.", preview: "معاينة محمية للوثائق" },
    zh: { title: "认证支持，一目了然。", lead: "可提供的资料根据所选型号和目标市场确认。", preview: "受保护的资料缩略预览" },
    ru: { title: "Соответствие — кратко и ясно.", lead: "Доступные документы подтверждаются по выбранной модели и рынку назначения.", preview: "Защищённый предпросмотр документов" },
  }[lang];
  const icons = [Leaf, Radio, ShieldCheck, UtensilsCrossed, BadgeCheck, Award, FileCheck2] as const;
  return <main className="inner-page" dir={dir} lang={lang}>
    <header className="site-header detail-header"><Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link><PrimaryNav lang={lang} ariaLabel="Certifications navigation" /><LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/certifications${language === "en" ? "" : `?lang=${language}`}`} /></header>
    <SectionFloatNav lang={lang} path="/certifications" label={t.sectionTitles.certs} />
    <section className="section certification-editorial">
      <div className="certification-editorial-copy"><p className="eyebrow">{t.nav.certs}</p><h1>{pageCopy.title}</h1><p className="inner-hero-lead">{pageCopy.lead}</p><Link className="primary-action" href={`/contact${query}#inquiry-form`}>{t.hero.primaryCta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <figure className="certification-editorial-preview"><Image src="/images/certifications/certification-overview.webp" alt="TK Classic certification and test report protected preview" width={1440} height={810} sizes="(max-width: 760px) 100vw, 58vw" priority draggable={false}/><figcaption><ShieldCheck size={16} aria-hidden="true"/>{pageCopy.preview}</figcaption></figure>
      <div className="certification-editorial-icons">{certifications.map((cert, index) => { const Icon=icons[index] ?? ShieldCheck; return <div key={cert.name}><Icon size={20} aria-hidden="true"/><strong>{cert.name}</strong></div>; })}</div>
      <p className="certification-editorial-note">{certificationRequestCopy[lang]}</p>
    </section>
    <SiteFooter lang={lang} />
  </main>;
}
