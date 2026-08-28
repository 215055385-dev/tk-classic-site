import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Factory, PackageCheck, Settings2, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PrimaryNav } from "@/components/PrimaryNav";
import { company, products } from "@/lib/site-data";
import { getProductGeo } from "@/lib/product-geo";

export const metadata: Metadata = {
  title: { absolute: "Portable Coffee Machine Manufacturer | TK Classic OEM & ODM" },
  description: "TK Classic manufactures a published range of portable coffee machines and supports wholesale, OEM/ODM, private label, packaging and accessory configuration projects.",
  alternates: { canonical: `${company.siteUrl}/manufacturer` },
  openGraph: { title: "Portable Coffee Machine Manufacturer | TK Classic", description: "Published portable coffee machine range, OEM workflow and factory-direct sourcing support.", url: `${company.siteUrl}/manufacturer`, type: "website" },
};

export default function ManufacturerPage() {
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", "@id": `${company.siteUrl}/manufacturer#page`, url: `${company.siteUrl}/manufacturer`, name: "Portable Coffee Machine Manufacturer", about: { "@id": `${company.siteUrl}#organization` } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: company.siteUrl }, { "@type": "ListItem", position: 2, name: "Manufacturer", item: `${company.siteUrl}/manufacturer` }] },
  ];
  const steps = [
    "Share the target model, market, estimated quantity and branding requirements.",
    "Confirm the sample, product configuration and required accessories.",
    "Review logo artwork, color, packaging and applicable documentation.",
    "Record the approved configuration before mass production and export packing.",
  ];

  return <main className="inner-page" lang="en">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="site-header detail-header"><Link className="brand" href="/"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><PrimaryNav lang="en" ariaLabel="Manufacturer navigation" /></header>
    <section className="inner-hero section"><p className="eyebrow">Factory-direct product programs</p><h1>Portable coffee machine manufacturer for wholesale and private label projects.</h1><p className="inner-hero-lead">TK Classic is the export-facing brand of {company.legalName}. The published range includes portable espresso machines, optional coffee accessories and configurable gift or retail sets.</p><Link className="primary-action" href="/contact#inquiry-form">Request a project quotation <ArrowRight size={17} /></Link></section>
    <section className="section product-catalog-section"><div className="section-heading"><span>Published range</span><h2>Six current portable coffee machine models.</h2><p>Specifications and images below link to the model-specific source of truth.</p></div><div className="product-grid featured-grid">{products.map((product) => { const geo = getProductGeo(product, "en"); return <article className="product-card" key={product.model}><Link className="product-image-link" href={`/products/${product.slug}`}><Image src={product.hero} alt={geo.primaryAlt} width={720} height={720} sizes="(max-width: 720px) 100vw, 33vw" /></Link><div className="product-card-body"><span className="card-label">{product.featureLabel}</span><h3>{geo.productName}</h3><p>{product.summary.en}</p><Link className="card-link" href={`/products/${product.slug}`}>View published specifications <ArrowRight size={16} /></Link></div></article>; })}</div></section>
    <section className="section split-section"><div className="section-heading align-left"><span>Manufacturing support</span><h2>What the current OEM/ODM program covers.</h2><p>Scope is confirmed for each model and order rather than presented as a universal commercial promise.</p></div><div className="factory-list"><div><Settings2 size={21} /><p>Laser engraving, silk screen printing, UV printing and water transfer printing.</p></div><div><PackageCheck size={21} /><p>Custom gift boxes, color matching and optional accessory configuration.</p></div><div><ShieldCheck size={21} /><p>Available compliance files supplied after inquiry according to model and destination market.</p></div><div><Factory size={21} /><p>Real production, assembly, testing and laser-marking photographs are available on the factory page.</p></div></div></section>
    <section className="section"><div className="section-heading"><span>Approval workflow</span><h2>From project brief to export packing.</h2></div><div className="process-grid">{steps.map((step, index) => <article className="process-card" key={step}><strong>{String(index + 1).padStart(2, "0")}</strong><p>{step}</p><CheckCircle2 size={19} /></article>)}</div></section>
    <section className="section final-cta-section"><div><span className="eyebrow">Project-specific confirmation</span><h2>Send the model, market and configuration you actually need.</h2><p>MOQ, price, timing, payment, shipping terms and final included accessories are confirmed in the formal quotation.</p></div><Link className="primary-action" href="/contact#inquiry-form">Start an inquiry <ArrowRight size={17} /></Link></section>
    <SiteFooter lang="en" />
  </main>;
}
