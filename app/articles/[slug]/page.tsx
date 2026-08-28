import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getPublishedArticle } from "@/lib/cms-content";
import { company } from "@/lib/site-data";

export const runtime = "nodejs";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const article = await getPublishedArticle(slug); const t = article?.translations.find((x) => x.locale === "en") ?? article?.translations[0]; if (!article || !t) return {}; return { title: t.seoTitle || t.title, description: t.seoDescription || t.excerpt || undefined, alternates: { canonical: `${company.siteUrl}/articles/${slug}` } }; }

export default async function ArticlePage({ params }: Props) { const { slug } = await params; const article = await getPublishedArticle(slug); const t = article?.translations.find((x) => x.locale === "en") ?? article?.translations[0]; if (!article || !t) notFound(); const body = typeof t.content === "string" ? t.content : JSON.stringify(t.content);
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: t.title, description: t.excerpt, datePublished: article.publishedAt?.toISOString(), dateModified: article.updatedAt.toISOString(), author: { "@type": "Organization", name: company.brand }, publisher: { "@type": "Organization", name: company.legalName } };
  return <main className="inner-page cms-article-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/><header className="site-header detail-header"><Link className="brand" href="/"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><PrimaryNav lang="en" current="resources" ariaLabel="Buyer guide navigation" /></header><article className="section cms-public-article"><Link className="back-link" href="/articles"><ArrowLeft size={16}/>All buyer guides</Link><span className="eyebrow">{article.category?.name ?? "Buyer Guide"}</span><h1>{t.title}</h1>{t.excerpt ? <p className="inner-hero-lead">{t.excerpt}</p> : null}{article.coverMedia?.publicUrl ? <Image className="cms-article-cover" src={article.coverMedia.publicUrl} alt={article.coverMedia.altText ?? t.title} width={1600} height={1000} priority/> : null}<div className="cms-article-content">{body}</div></article><SiteFooter lang="en"/></main>;
}
