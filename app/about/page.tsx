import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Globe2, Mail, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PrimaryNav } from "@/components/PrimaryNav";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: { absolute: "About TK Classic | Portable Coffee Machine OEM Manufacturer" },
  description: "Learn about TK Classic, the export-facing portable coffee equipment brand of Daqian Classic (Shenzhen) Industrial Co., Ltd., serving wholesale, private label and OEM/ODM buyers.",
  alternates: { canonical: `${company.siteUrl}/about` },
  openGraph: { title: "About TK Classic", description: "Company identity, product focus and buyer services for portable coffee equipment sourcing.", url: `${company.siteUrl}/about`, type: "website" },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${company.siteUrl}/about#page`,
    url: `${company.siteUrl}/about`,
    name: "About TK Classic",
    mainEntity: { "@id": `${company.siteUrl}#organization` },
  };

  return <main className="inner-page" lang="en">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="site-header detail-header"><Link className="brand" href="/"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><PrimaryNav lang="en" ariaLabel="About navigation" /></header>
    <section className="inner-hero section"><p className="eyebrow">Company identity</p><h1>About TK Classic</h1><p className="inner-hero-lead">TK Classic is the export-facing brand of {company.legalName}, focused on portable coffee machines, coffee accessories and OEM/ODM programs for wholesale and private label buyers.</p><Link className="primary-action" href="/contact#inquiry-form">Contact the sales team <ArrowRight size={17} /></Link></section>
    <section className="section split-section">
      <div className="section-heading align-left"><span>Who we are</span><h2>A portable coffee equipment partner for international sourcing teams.</h2><p>We organize model-specific product information, optional accessories, branding and packaging requirements so buyers can compare the published range and request a project-specific quotation.</p></div>
      <div className="factory-list">
        <div><Building2 size={21} /><p><strong>Legal company:</strong> {company.legalName}</p></div>
        <div><BadgeCheck size={21} /><p><strong>Published experience:</strong> 15+ years in OEM programs</p></div>
        <div><Globe2 size={21} /><p><strong>Published market reach:</strong> 50+ countries and markets</p></div>
        <div><ShieldCheck size={21} /><p><strong>Evidence policy:</strong> product and compliance documents are matched to the selected model and destination after inquiry.</p></div>
      </div>
    </section>
    <section className="section proof-section"><div className="section-heading"><span>What we provide</span><h2>Products, project support and verifiable information.</h2></div><div className="proof-grid"><article className="proof-card"><h3>Portable coffee products</h3><p>Six published portable coffee machine models, optional accessories and configurable sets.</p><Link href="/products">View products <ArrowRight size={16} /></Link></article><article className="proof-card"><h3>OEM and private label</h3><p>Logo methods, color matching, packaging and artwork review based on the confirmed project brief.</p><Link href="/oem-odm">Review the process <ArrowRight size={16} /></Link></article><article className="proof-card"><h3>Factory and documentation</h3><p>Real factory photographs and available compliance files presented without unverified capacity claims.</p><Link href="/factory">Inside the factory <ArrowRight size={16} /></Link></article></div></section>
    <section className="section contact-section"><div><div className="section-heading align-left"><span>Direct contact</span><h2>Discuss a real model and market requirement.</h2><p>Include the model, estimated quantity, destination, branding, packaging and accessory requirements.</p></div><div className="contact-methods"><a href={`mailto:${company.emailBowie}`}><Mail size={19} /><span>{company.emailBowie}</span></a></div></div></section>
    <SiteFooter lang="en" />
  </main>;
}
