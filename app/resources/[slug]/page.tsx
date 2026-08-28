import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, CalendarDays, CheckCircle2, Clock3, FileCheck2 } from "lucide-react";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SiteFooter } from "@/components/SiteFooter";
import { buyerGuides, getBuyerGuide } from "@/lib/buyer-guides";
import { company, products } from "@/lib/site-data";

type GuidePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return buyerGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getBuyerGuide(slug);
  if (!guide) return {};
  const url = `${company.siteUrl}/resources/${guide.slug}`;

  return {
    title: { absolute: `${guide.title} | TK Classic Buyer Guide` },
    description: guide.description,
    keywords: guide.keywords ?? [
      "portable espresso machine buying guide",
      "portable coffee machine wholesale",
      "private label coffee machine",
      "portable coffee machine OEM",
      "European coffee machine sourcing",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [company.brand],
      images: [{ url: `${company.siteUrl}${guide.heroImage}`, alt: guide.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [`${company.siteUrl}${guide.heroImage}`],
    },
  };
}

export default async function BuyerGuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getBuyerGuide(slug);
  if (!guide) notFound();

  const url = `${company.siteUrl}/resources/${guide.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: guide.title,
      description: guide.description,
      image: `${company.siteUrl}${guide.heroImage}`,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: company.brand, url: `${company.siteUrl}/company` },
      publisher: { "@type": "Organization", name: company.legalName, url: company.siteUrl },
      about: ["Portable espresso machines", "Wholesale sourcing", "OEM and private label procurement"],
      ...(guide.keywords ? { keywords: guide.keywords.join(", ") } : {}),
      ...(guide.directAnswer ? { abstract: guide.directAnswer } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: company.siteUrl },
        { "@type": "ListItem", position: 2, name: "Buyer guides", item: `${company.siteUrl}/resources` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main className="inner-page buyer-guide-page" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header">
        <Link className="brand" href="/" aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <PrimaryNav lang="en" current="resources" ariaLabel="Buyer guide navigation" />
        <LanguageSwitcher currentLang="en" hrefForLang={() => `/resources/${guide.slug}`} />
      </header>
      <SectionFloatNav lang="en" />

      <article className="buyer-guide-article">
        <header className="buyer-guide-hero section">
          <Link className="back-link" href="/resources"><ArrowLeft size={17} aria-hidden="true" />Buyer guides</Link>
          <p className="eyebrow">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p className="buyer-guide-deck">{guide.description}</p>
          <div className="buyer-guide-meta" aria-label="Article information">
            <span><CalendarDays size={16} aria-hidden="true" /><time dateTime={guide.publishedAt}>Published 4 August 2026</time></span>
            <span><Clock3 size={16} aria-hidden="true" />{guide.readTime}</span>
            <span><BookOpenCheck size={16} aria-hidden="true" />Reviewed by TK Classic</span>
          </div>
        </header>

        <div className="section buyer-guide-visual">
          <Image src={guide.heroImage} alt={guide.heroAlt} width={1254} height={1254} sizes="(max-width: 760px) calc(100vw - 32px), 920px" priority />
        </div>

        <div className="section buyer-guide-layout">
          <aside className="buyer-guide-takeaways" aria-labelledby="guide-takeaways-title">
            <span>Decision summary</span>
            <h2 id="guide-takeaways-title">What the buyer should retain</h2>
            <ul>{guide.keyTakeaways.map((item) => <li key={item}><CheckCircle2 size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            <Link href="/contact#inquiry-form">Prepare an inquiry <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </aside>

          <div className="buyer-guide-body">
            {guide.directAnswer ? (
              <section className="buyer-guide-direct-answer" aria-labelledby="buyer-guide-direct-answer-title">
                <p className="eyebrow">Short answer</p>
                <h2 id="buyer-guide-direct-answer-title">How should a buyer choose?</h2>
                <p><strong>{guide.directAnswer}</strong></p>
              </section>
            ) : null}
            {guide.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              </section>
            ))}
          </div>
        </div>

        {guide.relatedLinks?.length ? (
          <nav className="section buyer-guide-related-links" aria-label="Related buyer resources">
            <span>Continue the research</span>
            <div>{guide.relatedLinks.map((item) => <Link key={item.href} href={item.href}>{item.label} <ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div>
          </nav>
        ) : null}

        {guide.showModelTable ? (
          <section className="section buyer-guide-models" aria-labelledby="published-model-data-title">
            <div className="section-heading align-left"><span>Published model data</span><h2 id="published-model-data-title">Compare only model-specific information.</h2><p>These values come from the current TK Classic product records. Open the product page for the full specification and matching images.</p></div>
            <div className="buyer-guide-table-wrap">
              <table>
                <thead><tr><th>Model</th><th>Position</th><th>Pressure</th><th>Battery</th><th>Cup</th><th>Charging</th></tr></thead>
                <tbody>{products.map((product) => <tr key={product.model}><th><Link href={`/products/${product.slug}`}>{product.model}</Link></th><td>{product.featureLabel}</td><td>{product.spec.pressure}</td><td>{product.spec.battery}</td><td>{product.spec.cup}</td><td>{product.spec.charging}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="section buyer-guide-faq" aria-labelledby="buyer-guide-faq-title">
          <div className="section-heading align-left"><span>Buyer questions</span><h2 id="buyer-guide-faq-title">Questions buyers ask before approval</h2></div>
          <div className="faq-list">{guide.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="section buyer-guide-source-note" aria-label="Editorial and sourcing note">
          <FileCheck2 size={22} aria-hidden="true" />
          <div><strong>Evidence policy</strong><p>This guide uses current TK Classic product records and published OEM capabilities. Model pages remain the source of truth. Commercial terms and model-specific documents are confirmed in the quotation and inquiry process.</p></div>
        </section>

        <section className="section buyer-guide-cta">
          <div><span>Project-ready next step</span><h2>Turn this checklist into a model-specific quotation.</h2><p>Send the model, quantity, target market, branding and accessory requirements. The sales team will confirm the open commercial items.</p></div>
          <Link className="primary-action" href="/contact#inquiry-form">Request a quotation <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </section>
      </article>

      <SiteFooter lang="en" />
    </main>
  );
}
