import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuickInquiryForm } from "@/components/QuickInquiryForm";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { company, products } from "@/lib/site-data";
import { buyerGuides } from "@/lib/buyer-guides";
import styles from "./page.module.css";

const dq001 = products.find((product) => product.model === "DQ-001")!;
const dq010 = products.find((product) => product.model === "DQ-010")!;
const relatedGuideSlugs = [
  "portable-espresso-machine-private-label-buying-guide",
  "25-bar-portable-coffee-machine-buying-checklist",
  "oem-packaging-checklist-portable-coffee-gift-sets",
  "portable-espresso-machine-sample-approval-checklist",
  "portable-espresso-machine-rfq-checklist-us-importers",
];
const relatedGuides = relatedGuideSlugs
  .map((slug) => buyerGuides.find((guide) => guide.slug === slug))
  .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));

export const metadata: Metadata = {
  title: "Portable Espresso Machine Wholesale for US Importers",
  description: "Compare verified DQ-001 and DQ-010 product, packing and master-carton data for US wholesale and private-label sourcing before requesting a quotation.",
  keywords: ["portable espresso machine wholesale USA", "portable coffee machine importer", "private label portable espresso machine", "DQ-001 wholesale", "DQ-010 wholesale"],
  alternates: { canonical: "/wholesale/usa" },
  openGraph: { title: "Portable Espresso Machine Wholesale for US Importers", description: "A verified sourcing comparison of DQ-001 and DQ-010 for US wholesale and private-label projects.", url: "/wholesale/usa", images: [{ url: dq010.hero, alt: "Official TK Classic DQ-010 portable coffee machine product image" }] },
};

const faqs = [
  { q: "How should a US wholesaler choose between DQ-001 and DQ-010?", a: "DQ-001 is the value-led starting point with capsule and ground-coffee adapters. DQ-010 is the premium starting point for buyers who need an LCD, a 325 mL cup and the published N-series, Dolce Gusto, ground-coffee and portable drip-cup formats. The final choice should be confirmed against the retail channel, coffee format, accessories and packaging brief." },
  { q: "Are wholesale prices and MOQ published on this page?", a: "No. Pricing and MOQ are confirmed after the model, estimated quantity, destination, branding, packaging and accessory requirements are reviewed." },
  { q: "Can I request a sample?", a: "Yes. Samples are charged. The sample fee can be refunded or deducted after a bulk order is placed and shipped, subject to the confirmed order terms." },
  { q: "Can the logo, packaging and accessories be customized?", a: "Logo and packaging customization and compatible accessory selection are supported. The exact scope is confirmed for each project." },
  { q: "What packing information is available for import planning?", a: "Both DQ-001 and DQ-010 are currently recorded as 16 pieces per master carton. The supplied DQ-001 retail package is 82 × 80.5 × 319 mm and its master carton is 342 × 342 × 315 mm at 15.8 kg gross. The supplied DQ-010 retail package is 90 × 90 × 335 mm and its master carton is 360 × 365 × 360 mm at 17.8 kg gross. Confirm the final packing record for the approved order configuration in the quotation." },
  { q: "When are compliance documents provided?", a: "Available certification and test documents are provided after inquiry according to the selected model and destination market. Buyers should request the applicable document set in the sourcing brief." },
];

const comparisonRows = [
  ["Wholesale position", "Value-led starting model", "Premium multi-format model"],
  ["Published coffee formats", "Capsule and ground coffee", "N-series, Dolce Gusto, ground coffee and portable drip cup"],
  ["Published pressure", dq001.spec.pressure, dq010.spec.pressure],
  ["Battery", dq001.spec.battery, dq010.spec.battery],
  ["Charging", dq001.spec.charging, "About 2 hours, USB Type-C"],
  ["Buyer-facing controls", "Standard operating controls", "LCD shows temperature, battery level and extraction mode"],
] as const;

const logisticsRows = [
  ["Product dimensions", "75 × 75 × 270 mm", "85 × 85 × 280 mm"],
  ["Retail package", "82 × 80.5 × 319 mm", "90 × 90 × 335 mm"],
  ["Case pack", "16 pieces", "16 pieces"],
  ["Master carton", "342 × 342 × 315 mm", "360 × 365 × 360 mm"],
  ["Master-carton gross weight", "15.8 kg", "17.8 kg"],
] as const;

const logisticsByModel = {
  "DQ-001": logisticsRows.map(([name, dq001Value]) => ({ "@type": "PropertyValue", name, value: dq001Value })),
  "DQ-010": logisticsRows.map(([name, , dq010Value]) => ({ "@type": "PropertyValue", name, value: dq010Value })),
} as const;

const verifiedFacts = [
  { label: "DQ-001 position", value: "Value-led capsule and ground-coffee model" },
  { label: "DQ-010 position", value: "Premium LCD model with a 325 mL cup" },
  { label: "Published pressure", value: "25 bar on both model records" },
  { label: "DQ-010 coffee formats", value: "N-series, Dolce Gusto, ground coffee and portable drip cup" },
  { label: "Sample policy", value: "Paid sample; fee may be refunded or credited after a bulk order ships" },
  { label: "Commercial terms", value: "Price, MOQ and project scope confirmed by written quotation" },
] as const;

export default function UsaWholesalePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: "Portable Espresso Machine Wholesale for US Importers", description: "A verified factory-direct comparison of DQ-001 and DQ-010 product and packing data for US wholesale, retail and private-label sourcing.", url: `${company.siteUrl}/wholesale/usa`, inLanguage: "en-US", dateModified: "2026-09-03", audience: { "@type": "BusinessAudience", audienceType: "US importers, wholesalers and private-label buyers" }, about: [dq001.model, dq010.model], isPartOf: { "@id": `${company.siteUrl}#website` }, publisher: { "@id": `${company.siteUrl}#organization` }, subjectOf: relatedGuides.map((guide) => ({ "@type": "Article", name: guide.title, url: `${company.siteUrl}/resources/${guide.slug}` })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: company.siteUrl }, { "@type": "ListItem", position: 2, name: "US Wholesale", item: `${company.siteUrl}/wholesale/usa` }] },
      { "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      { "@type": "ItemList", name: "Portable espresso machines for US wholesale review", numberOfItems: 2, itemListElement: [dq001, dq010].map((product, index) => ({ "@type": "ListItem", position: index + 1, url: `${company.siteUrl}/products/${product.slug}`, item: { "@type": "Product", name: `${product.model} portable espresso machine`, model: product.model, image: `${company.siteUrl}${product.hero}`, description: product.summary.en, brand: { "@type": "Brand", name: company.brand }, additionalProperty: logisticsByModel[product.model as keyof typeof logisticsByModel] } })) },
    ],
  };
  return <main className={`inner-page ${styles.page}`} lang="en">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="site-header detail-header">
      <Link className="brand" href="/" aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
      <PrimaryNav lang="en" current="resources" ariaLabel="US wholesale navigation" />
      <LanguageSwitcher currentLang="en" hrefForLang={(language) => language === "en" ? "/wholesale/usa" : `/${language}/wholesale/usa`} />
    </header>
    <SectionFloatNav lang="en" path="/wholesale/usa" label="USA wholesale" />
    <section className={styles.hero}>
      <div className={styles.heroCopy}><span className={styles.eyebrow}>Factory-direct · US wholesale sourcing</span><h1>Portable espresso for retail, travel and outdoor programs.</h1><p>Compare a value-led starting model and a premium LCD multi-format option using current published product records. Commercial terms are confirmed privately for each project.</p><div className={styles.actions}><Link className={styles.primary} href="#models">Compare the two models</Link><Link className={styles.secondary} href="#contact">Contact the factory team</Link></div></div>
      <div className={styles.heroVisual}><Image src={dq010.hero} alt="DQ-010 Trailblazer portable coffee maker in official TK Classic product photography" width={900} height={900} loading="eager" fetchPriority="high" sizes="(max-width: 900px) 100vw, 50vw" /></div>
    </section>
    <section className={`${styles.section} ${styles.answer}`} aria-labelledby="us-wholesale-answer-title"><span className={styles.eyebrow}>Verified sourcing answer</span><h2 id="us-wholesale-answer-title">Which portable espresso machine should a US wholesaler start with?</h2><p><strong>Start with DQ-001 for a value-led capsule-and-ground-coffee retail program. Start with DQ-010 when the brief calls for an LCD, a larger 325 mL cup and more published coffee formats.</strong> Both are 25 bar, battery-powered portable coffee machines. The final order configuration, included adapters, branding, packaging, documents, MOQ and commercial terms are confirmed in writing for the actual project.</p><div className={styles.answerLinks}><Link href="/products/dq-001">Review DQ-001 evidence</Link><Link href="/products/dq-010">Review DQ-010 evidence</Link></div></section>
    <section className={`${styles.section} ${styles.comparison}`} aria-labelledby="verified-facts-title"><div className={styles.heading}><span className={styles.eyebrow}>Citation-ready summary</span><h2 id="verified-facts-title">Verified facts for a first US sourcing review.</h2><p>These statements summarize the current product records and confirmed commercial policy. They are not a substitute for the model-specific manual or formal quotation.</p></div><div className={styles.proof}>{verifiedFacts.map((fact) => <article key={fact.label}><span className={styles.eyebrow}>{fact.label}</span><h3>{fact.value}</h3></article>)}</div></section>
    <section className={styles.section} id="models"><div className={styles.heading}><span className={styles.eyebrow}>Two sourcing starting points</span><h2>Choose by product position, then confirm the project details.</h2><p>No public unit price or fixed MOQ is used here. The purpose of this comparison is to help a buyer select the right conversation.</p></div><div className={styles.models}>
      <article className={styles.card}><Image src={dq001.hero} alt="DQ-001 BrewHandy portable espresso machine official product image" width={620} height={620} sizes="(max-width: 600px) 100vw, 28vw"/><div><span className={styles.eyebrow}>Value-led range · DQ-001</span><h3>DQ-001</h3><p>{dq001.summary.en}</p><ul><li>{dq001.spec.pressure}</li><li>{dq001.spec.battery}</li><li>{dq001.spec.adapter}</li></ul><Link className={styles.primary} href="/products/dq-001">View published model data</Link></div></article>
      <article className={styles.card}><Image src={dq010.hero} alt="DQ-010 Trailblazer portable coffee maker official product image" width={620} height={620} sizes="(max-width: 600px) 100vw, 28vw"/><div><span className={styles.eyebrow}>Premium range · DQ-010</span><h3>DQ-010</h3><p>{dq010.summary.en}</p><ul><li>LCD shows temperature, battery level and extraction mode</li><li>{dq010.spec.battery}; about 2-hour charging</li><li>N-series, Dolce Gusto, ground coffee and documented portable drip cup</li></ul><Link className={styles.primary} href="/products/dq-010">View published model data</Link></div></article>
    </div></section>
    <section className={`${styles.section} ${styles.comparison}`} aria-labelledby="model-comparison-title"><div className={styles.heading}><span className={styles.eyebrow}>Verified model comparison</span><h2 id="model-comparison-title">DQ-001 or DQ-010: choose the buying brief before the quotation.</h2><p>This table uses the current published model records. Included components and project-specific commercial terms remain subject to written confirmation.</p></div><div className={styles.tableWrap}><table><thead><tr><th scope="col">Buyer check</th><th scope="col">DQ-001</th><th scope="col">DQ-010</th></tr></thead><tbody>{comparisonRows.map(([label, value001, value010]) => <tr key={label}><th scope="row">{label}</th><td>{value001}</td><td>{value010}</td></tr>)}</tbody></table></div></section>
    <section className={`${styles.section} ${styles.comparison}`} aria-labelledby="logistics-comparison-title"><div className={styles.heading}><span className={styles.eyebrow}>Import planning data</span><h2 id="logistics-comparison-title">Compare the supplied packing records before estimating freight.</h2><p>These dimensions and carton weights are the current manufacturer-supplied records for the two models. Final retail packaging, included accessories and shipping data must be reconfirmed for the approved order configuration.</p></div><div className={styles.tableWrap}><table><thead><tr><th scope="col">Packing check</th><th scope="col">DQ-001</th><th scope="col">DQ-010</th></tr></thead><tbody>{logisticsRows.map(([label, value001, value010]) => <tr key={label}><th scope="row">{label}</th><td>{value001}</td><td>{value010}</td></tr>)}</tbody></table></div><div className={styles.answerLinks}><Link href="/resources/portable-espresso-machine-rfq-checklist-us-importers">Use the US importer RFQ checklist</Link><Link href="/contact?product=DQ-010#inquiry-form">Confirm packing in a quotation</Link></div></section>
    <section className={`${styles.section} ${styles.dark}`} id="process"><div className={styles.heading}><span className={styles.eyebrow}>Buyer workflow</span><h2>A clear path from model review to a formal quotation.</h2><p>Final configuration, documents, MOQ and commercial terms remain project-specific.</p></div><div className={styles.proof}><article><span className={styles.eyebrow}>01 · Select</span><h3>Share the target model and market</h3><p>Tell us the buyer type, destination and intended channel so the team can review the correct configuration.</p></article><article><span className={styles.eyebrow}>02 · Confirm</span><h3>Review sample and customization needs</h3><p>Samples are charged. Logo, packaging and compatible accessories are confirmed from the actual project brief.</p></article><article><span className={styles.eyebrow}>03 · Quote</span><h3>Receive project-specific terms</h3><p>Pricing, MOQ, documents and production arrangements are recorded in the formal quotation rather than promised publicly.</p></article></div></section>
    <section className={`${styles.section} ${styles.formSection}`} id="contact"><div className={styles.heading}><span className={styles.eyebrow}>Quick contact</span><h2>Start with three details.</h2><p>Send your name, business email and buyer type. The sales team can then ask for the model, quantity, destination and customization brief.</p><div className={styles.actions}><Link className={styles.primary} href="/contact?product=DQ-001#inquiry-form">Open the full RFQ form</Link></div></div><QuickInquiryForm /></section>
    <section className={`${styles.section} ${styles.guides}`} aria-labelledby="us-buyer-guides-title"><div className={styles.heading}><span className={styles.eyebrow}>Buyer research</span><h2 id="us-buyer-guides-title">Prepare the sourcing brief before requesting terms.</h2><p>These evidence-led guides explain model review, sample approval and private-label packaging without publishing assumptions as commercial promises.</p></div><div className={styles.guideGrid}>{relatedGuides.map((guide, index) => <article key={guide.slug}><span className={styles.eyebrow}>Guide 0{index + 1}</span><h3>{guide.title}</h3><p>{guide.description}</p><Link href={`/resources/${guide.slug}`}>Read the buyer guide</Link></article>)}</div></section>
    <section className={`${styles.section} ${styles.faq}`}><div className={styles.heading}><span className={styles.eyebrow}>Procurement FAQ</span><h2>What buyers usually confirm first.</h2></div>{faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>
    <SiteFooter lang="en" />
  </main>;
}
