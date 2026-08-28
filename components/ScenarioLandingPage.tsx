import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Coffee, Compass, Factory, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { company, products } from "@/lib/site-data";
import { getProductGeo } from "@/lib/product-geo";
import type { ScenarioPageData } from "@/lib/scenario-pages";

export function ScenarioLandingPage({ page }: { page: ScenarioPageData }) {
  const heroProduct = products.find((product) => product.model === page.heroModel) ?? products[0];
  const matchingProducts = products.filter((product) => page.modelSlugs.includes(product.slug));
  const pageUrl = `${company.siteUrl}/${page.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      about: ["Portable coffee machines", "Portable espresso", page.eyebrow],
      publisher: { "@id": `${company.siteUrl}#organization` },
      mainEntity: { "@id": `${pageUrl}#faq` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: company.siteUrl },
        { "@type": "ListItem", position: 2, name: page.title, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: page.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Published TK Classic models relevant to ${page.title}`,
      itemListElement: matchingProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: getProductGeo(product, "en").displayName,
        url: `${company.siteUrl}/products/${product.slug}`,
      })),
    },
  ];

  return (
    <main className="inner-page scenario-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header">
        <Link className="brand" href="/" aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span><strong>TK Classic</strong><small>Portable coffee OEM</small></span>
        </Link>
        <PrimaryNav lang="en" current="resources" ariaLabel="Scenario page navigation" />
        <LanguageSwitcher currentLang="en" hrefForLang={(language) => language === "en" ? `/${page.slug}` : `/${language}/${page.slug}`} />
      </header>
      <SectionFloatNav lang="en" path={`/${page.slug}`} label={page.title} />

      <section className="scenario-hero">
        <div className="scenario-hero-copy">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="scenario-direct-answer">{page.directAnswer}</p>
          <div className="hero-actions">
            <Link className="primary-action" href="/products">Explore products <ArrowRight size={17} /></Link>
            <Link className="secondary-action" href="/contact#inquiry-form"><Factory size={17} /> Contact factory</Link>
          </div>
        </div>
        <figure className="scenario-hero-media">
          <Image src={heroProduct.hero} alt={getProductGeo(heroProduct, "en").primaryAlt} width={1000} height={1000} priority sizes="(max-width: 820px) 100vw, 48vw" />
          <figcaption><span>{heroProduct.model}</span><strong>Published product image</strong></figcaption>
        </figure>
      </section>

      <section className="section scenario-answer-section">
        <div className="section-heading align-left"><span>Direct answer</span><h2>{page.whyTitle}</h2></div>
        <div className="scenario-point-grid">
          {page.whyPoints.map((point, index) => (
            <article key={point.title}><small>0{index + 1}</small><Compass size={22} /><h3>{point.title}</h3><p>{point.description}</p></article>
          ))}
        </div>
      </section>

      <section className="section scenario-process-section">
        <div className="section-heading align-left"><span>Practical use</span><h2>{page.howTitle}</h2></div>
        <ol className="scenario-process-list">
          {page.howSteps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}
        </ol>
      </section>

      <section className="section scenario-type-section">
        <div className="scenario-type-copy"><Coffee size={28} /><p className="eyebrow">Selection guidance</p><h2>{page.typeTitle}</h2><p>{page.typeAnswer}</p></div>
        <aside><ShieldCheck size={25} /><strong>Reality check</strong><p>{page.caution}</p></aside>
      </section>

      <section className="section scenario-model-section">
        <div className="section-heading align-left"><span>Published model records</span><h2>Use verified model pages as the source of truth.</h2><p>These products are shown only where the current records support the connection described above.</p></div>
        <div className="scenario-model-grid">
          {matchingProducts.map((product) => {
            const geo = getProductGeo(product, "en");
            return <article key={product.model}><Link href={`/products/${product.slug}`}><Image src={product.hero} alt={geo.primaryAlt} width={720} height={720} sizes="(max-width:720px) 86vw, 40vw" /></Link><div><span>{product.model}</span><h3>{geo.displayName}</h3><p>{product.summary.en}</p><Link href={`/products/${product.slug}`}>View verified model data <ArrowRight size={16} /></Link></div></article>;
          })}
        </div>
      </section>

      <section className="section scenario-check-section">
        <div className="section-heading align-left"><span>Buyer checklist</span><h2>Confirm these details before approving the project.</h2></div>
        <div className="factory-list">{page.buyerChecks.map((check) => <div key={check}><CheckCircle2 size={20} /><p>{check}</p></div>)}</div>
      </section>

      <section className="section faq-section">
        <div className="section-heading align-left"><span>FAQ</span><h2>Questions buyers ask about this scenario.</h2></div>
        <div className="faq-list">{page.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
      </section>

      <section className="section scenario-closing-cta"><p className="eyebrow">Wholesale · OEM · Private label</p><h2>Turn the use scenario into a confirmed product brief.</h2><p>Share the model, quantity, destination, coffee format, accessories and branding requirements for a written quotation.</p><div className="hero-actions"><Link className="primary-action" href="/contact#inquiry-form">Contact the factory <ArrowRight size={17} /></Link>{page.guideSlug ? <Link className="secondary-action" href={`/resources/${page.guideSlug}`}>Read the buyer guide <ArrowRight size={17} /></Link> : null}</div></section>
      <SiteFooter lang="en" />
    </main>
  );
}
