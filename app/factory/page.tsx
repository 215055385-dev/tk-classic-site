import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { uiCopy } from "@/lib/localized-ui";
import { CylindricalGallery } from "@/components/CylindricalGallery";
import { exhibitionGalleryImages, factoryGalleryImages } from "@/lib/gallery-data";
import { galleryText, localizeGalleryImages } from "@/lib/gallery-localization";
import { brandTagline } from "@/lib/translation-copy";
import { PrimaryNav } from "@/components/PrimaryNav";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
function getLang(value: string | string[] | undefined): Lang { const code = Array.isArray(value) ? value[0] : value; return languages.some((language) => language.code === code) ? (code as Lang) : "en"; }
function queryFor(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams; const lang = getLang(params?.lang); const t = copy[lang]; const gallery = galleryText[lang];
  return { title: { absolute: `${t.sectionTitles.factory} & ${gallery.exhibition.title} | TK Classic` }, description: `${gallery.factory.subtitle} ${gallery.exhibition.subtitle}`, keywords: ["portable coffee machine factory", "coffee machine OEM manufacturing", "portable espresso production", "portable coffee machine exhibitions"], alternates: { canonical: localizedUrl("/factory", lang), languages: languageAlternates("/factory") } };
}

export default async function FactoryPage({ searchParams }: PageProps) {
  const params = await searchParams; const lang = getLang(params?.lang); const query = queryFor(lang); const t = copy[lang]; const ui = uiCopy[lang]; const gallery = galleryText[lang]; const factoryImages = localizeGalleryImages(factoryGalleryImages, lang, "factory"); const exhibitionImages = localizeGalleryImages(exhibitionGalleryImages, lang, "exhibition"); const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  return <main className="inner-page" dir={dir} lang={lang}>
    <header className="site-header detail-header"><Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link><PrimaryNav lang={lang} current="factory" ariaLabel="Factory navigation" /><LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/factory${language === "en" ? "" : `?lang=${language}`}`} /></header>
    <SectionFloatNav lang={lang} path="/factory" label={t.sectionTitles.factory} />
    <section className="inner-hero section"><p className="eyebrow">{t.nav.factory} · {gallery.exhibition.eyebrow}</p><h1>{gallery.factory.title}</h1><p className="inner-hero-lead">{gallery.factory.subtitle}</p><div className="factory-exhibition-actions"><a className="primary-action" href="#factory-gallery">{gallery.factory.title}</a><a className="secondary-action" href="#exhibitions">{gallery.exhibition.title}</a><Link className="text-action" href={`/contact${query}`}>{t.hero.primaryCta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
    <section id="factory-gallery" className="section immersive-gallery-section factory-gallery-page">
      <CylindricalGallery images={factoryImages} eyebrow={gallery.factory.eyebrow} title={gallery.factory.title} subtitle={gallery.factory.subtitle} controls={gallery.controls} autoRotate priorityFirst showIntro={false} />
    </section>
    <RevealSection className="section factory-section" aria-labelledby="factory-strength-title"><div><div className="section-heading align-left"><span>{t.nav.factory}</span><h2 id="factory-strength-title">{t.sectionTitles.factory}</h2></div><div className="factory-list">{t.factory.map((item) => <div key={item}><BadgeCheck size={21} aria-hidden="true" /><p>{item}</p></div>)}</div></div><div className="metric-panel"><div><strong>15+</strong><span>{ui.proof.years}</span></div><div><strong>50+</strong><span>{ui.proof.markets}</span></div><div><strong>CE / FDA</strong><span>{ui.proof.compliance}</span></div><div><strong>ISO 9001</strong><span>{ui.proof.compliance}</span></div></div></RevealSection>
    <section id="exhibitions" className="section immersive-gallery-section exhibition-gallery-page">
      <CylindricalGallery images={exhibitionImages} eyebrow={gallery.exhibition.eyebrow} title={gallery.exhibition.title} subtitle={gallery.exhibition.subtitle} controls={gallery.controls} autoRotate priorityFirst={false} showIntro />
    </section>
    <section className="section gallery-truth-note">
      <p className="eyebrow">{gallery.exhibition.truthEyebrow}</p>
      <h2>{gallery.exhibition.truthTitle}</h2>
      <p>{gallery.exhibition.truthBody}</p>
    </section>
    <SiteFooter lang={lang} />
  </main>;
}
