import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SiteFooter } from "@/components/SiteFooter";
import { company, products } from "@/lib/site-data";
import { getProductGeo } from "@/lib/product-geo";
import { getSolution, solutions } from "@/lib/solutions";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return solutions.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug }=await params; const solution=getSolution(slug); if(!solution)return {}; return { title: { absolute: `${solution.title} | TK Classic` }, description: solution.description, alternates: { canonical: `${company.siteUrl}/solutions/${slug}` }, openGraph: { title: solution.title, description: solution.description, url: `${company.siteUrl}/solutions/${slug}`, type: "article" } }; }

export default async function SolutionDetailPage({ params }: Props) {
  const { slug }=await params; const solution=getSolution(slug); if(!solution)notFound();
  const matchingProducts=products.filter((product)=>solution.modelSlugs.includes(product.slug));
  const url=`${company.siteUrl}/solutions/${solution.slug}`;
  const schema=[
    { "@context":"https://schema.org", "@type":"WebPage", "@id":`${url}#page`, url, name:solution.title, description:solution.description, about:matchingProducts.map((product)=>({"@id":`${company.siteUrl}/products/${product.slug}#product`})) },
    { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:company.siteUrl},{"@type":"ListItem",position:2,name:"Solutions",item:`${company.siteUrl}/solutions`},{"@type":"ListItem",position:3,name:solution.title,item:url}] },
    { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:solution.faq.map((item)=>({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}})) },
  ];
  return <main className="inner-page" lang="en"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><header className="site-header detail-header"><Link className="brand" href="/"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><PrimaryNav lang="en" current="resources" ariaLabel="Solution navigation" /></header><section className="inner-hero section"><Link className="back-link" href="/solutions"><ArrowLeft size={17}/>All solutions</Link><p className="eyebrow">{solution.eyebrow}</p><h1>{solution.title}</h1><p className="inner-hero-lead">{solution.answer}</p><Link className="primary-action" href="/contact#inquiry-form">Discuss this requirement <ArrowRight size={17}/></Link></section><section className="section"><div className="section-heading"><span>Matching published models</span><h2>Models connected to this scenario by their current product records.</h2></div><div className="product-grid featured-grid">{matchingProducts.map((product)=>{const geo=getProductGeo(product,"en");return <article className="product-card" key={product.model}><Link className="product-image-link" href={`/products/${product.slug}`}><Image src={product.hero} alt={geo.primaryAlt} width={720} height={720} sizes="(max-width:720px) 100vw, 33vw"/></Link><div className="product-card-body"><h3>{geo.productName}</h3><p>{product.summary.en}</p><Link className="card-link" href={`/products/${product.slug}`}>View model data <ArrowRight size={16}/></Link></div></article>})}</div></section><section className="section split-section"><div className="section-heading align-left"><span>Buyer checklist</span><h2>Confirm the details that affect this use scenario.</h2></div><div className="factory-list">{solution.checks.map((item)=><div key={item}><CheckCircle2 size={20}/><p>{item}</p></div>)}</div></section><section className="section faq-section"><div className="section-heading align-left"><span>FAQ</span><h2>Questions about this solution.</h2></div><div className="faq-list">{solution.faq.map((item)=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section><SiteFooter lang="en"/></main>;
}
