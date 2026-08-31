import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, Box, Coffee, Layers3, Palette, ShieldCheck } from "lucide-react";
import { CoffeeLabConfigurator } from "@/components/CoffeeLabConfigurator";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { SiteFooter } from "@/components/SiteFooter";
import { coffeeLabCopy, coffeeLabNav, createCoffeeLabFormSeed, getCoffeeLabCatalog } from "@/lib/coffee-lab-data";
import { languageAlternates, localizedPath, localizedUrl } from "@/lib/seo";
import { brandTagline } from "@/lib/translation-copy";
import { company, languages, type Lang } from "@/lib/site-data";
import { PrimaryNav } from "@/components/PrimaryNav";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = coffeeLabCopy[lang];
  return {
    title: { absolute: `${t.metaTitle} | ${company.brand}` },
    description: t.metaDescription,
    alternates: { canonical: localizedUrl("/coffee-lab", lang), languages: languageAlternates("/coffee-lab") },
    openGraph: { title: t.metaTitle, description: t.metaDescription, url: localizedUrl("/coffee-lab", lang), images: [{ url: "/optimized/hero-products/dq-010.webp", alt: "DQ-010 portable coffee machine Coffee Lab configuration" }] },
  };
}

export default async function CoffeeLabPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = coffeeLabCopy[lang];
  const catalog = await getCoffeeLabCatalog(lang);
  const formSeed = createCoffeeLabFormSeed();
  const dq010 = catalog.models.find((model) => model.model === "DQ-010") ?? catalog.models[0];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.metaTitle,
    description: t.metaDescription,
    url: localizedUrl("/coffee-lab", lang),
    isPartOf: { "@id": `${company.siteUrl}#website` },
    about: { "@type": "Service", name: "Portable coffee machine OEM and ODM configuration", provider: { "@id": `${company.siteUrl}#organization` } },
  };

  return (
    <main className="inner-page coffee-lab-page" dir={dir} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header coffee-lab-header">
        <Link className="brand" href={localizedPath("/", lang)} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link>
        <PrimaryNav lang={lang} current="coffee-lab" ariaLabel="Coffee Lab navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => localizedPath("/coffee-lab", language)} />
      </header>
      <SectionFloatNav lang={lang} path="/coffee-lab" label={coffeeLabNav[lang]} />

      <section className="coffee-lab-hero">
        <div className="coffee-lab-hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{lang === "zh" ? <><span>Coffee Lab</span><em>咖啡创新实验室</em></> : t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="coffee-lab-hero-actions"><a href="#configurator">{t.start}<ArrowDown size={18} /></a><a href="#coffee-lab-inquiry">{t.oemCta}<ArrowRight size={18} /></a></div>
          <small>{t.concept}</small>
        </div>
        <div className="coffee-lab-hero-visual">
          <div className="coffee-lab-hero-disc" aria-hidden="true" />
          <div className="coffee-lab-hero-contour" aria-hidden="true" />
          <Image
            src={dq010.image}
            alt="Real DQ-010 portable coffee machine featured in Coffee Lab Studio"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 800px) 90vw, 52vw"
          />
          {catalog.accessories.slice(0, 4).map((accessory, index) => <div className={`coffee-lab-floating-part part-${index + 1}`} key={accessory.slug}><Image src={accessory.image} alt="" fill sizes="120px" /><span>{accessory.title}</span></div>)}
          <div className="coffee-lab-model-stamp"><span>BASE MODEL</span><strong>DQ-010</strong></div>
        </div>
      </section>

      <section className="coffee-lab-principles" aria-label="Coffee Lab capabilities">
        <article><Layers3 size={22} /><span>REAL</span><strong>{lang === "zh" ? "基于真实型号" : "Real machine bases"}</strong></article>
        <article><Palette size={22} /><span>DIY</span><strong>{lang === "zh" ? "分部件做概念预览" : "Layered visual concepts"}</strong></article>
        <article><Box size={22} /><span>SET</span><strong>{lang === "zh" ? "组合兼容配件" : "Compatible accessory sets"}</strong></article>
        <article><ShieldCheck size={22} /><span>REVIEW</span><strong>{lang === "zh" ? "提交工程评估" : "Engineering review"}</strong></article>
      </section>

      <CoffeeLabConfigurator lang={lang} catalog={catalog} copy={t} formSeed={formSeed} />

      <section className="coffee-lab-ecosystem">
        <div><p className="eyebrow">06 / ECOSYSTEM</p><h2>{t.ecosystem}</h2><p>{t.ecosystemLead}</p></div>
        <div className="coffee-lab-scenario-flow"><span><Coffee size={20} />{lang === "zh" ? "真实咖啡机" : "Real machine"}</span><i aria-hidden="true" /><span><Layers3 size={20} />{lang === "zh" ? "模块化组合" : "Modular set"}</span><i aria-hidden="true" /><span><Box size={20} />{lang === "zh" ? "市场应用" : "Market use"}</span></div>
        <div className="coffee-lab-scenarios">{["Travel", "Camping", "Car", "Office", "Gifting"].map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="coffee-lab-process">
        <div className="coffee-lab-section-heading"><p className="eyebrow">07 / OEM · ODM</p><h2>{t.process}</h2><p>{t.processLead}</p></div>
        <ol>{t.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol>
        <p className="coffee-lab-process-note">{t.structuralHelp}</p>
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
