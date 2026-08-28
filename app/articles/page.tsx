import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getPublishedArticles } from "@/lib/cms-content";
import { company } from "@/lib/site-data";

export const runtime = "nodejs";
export async function generateMetadata(): Promise<Metadata> {
  const articles = await getPublishedArticles();
  return {
    title: `Buyer Guides | ${company.brand}`,
    description: "Real buyer guides for portable espresso machine sourcing, OEM, product selection and private label planning.",
    alternates: { canonical: `${company.siteUrl}/articles` },
    robots: articles.length ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  return <main className="inner-page cms-articles-page">
    <header className="site-header detail-header"><Link className="brand" href="/"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><PrimaryNav lang="en" current="resources" ariaLabel="Buyer guides navigation" /></header>
    <section className="section inner-hero"><p className="eyebrow">SEO · GEO CONTENT</p><h1>Portable Coffee Buyer Guides</h1><p className="inner-hero-lead">Practical sourcing content maintained by TK Classic. Published articles appear here automatically from the CMS.</p></section>
    <section className="section cms-article-grid">{articles.map((article) => { const t = article.translations.find((x) => x.locale === "en") ?? article.translations[0]; if (!t) return null; return <article key={article.id} className="cms-public-article-card">{article.coverMedia?.publicUrl ? <Image src={article.coverMedia.publicUrl} alt={article.coverMedia.altText ?? t.title} width={960} height={640}/> : null}<div><span>{article.category?.name ?? "Buyer Guide"}</span><h2>{t.title}</h2>{t.excerpt ? <p>{t.excerpt}</p> : null}<Link href={`/articles/${article.slug}`}>Read guide <ArrowRight size={16}/></Link></div></article>; })}{!articles.length ? <p>No CMS articles have been published yet.</p> : null}</section>
    <SiteFooter lang="en" />
  </main>;
}
