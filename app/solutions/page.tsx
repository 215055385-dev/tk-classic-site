import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Coffee, Compass, Gift, Mountain, ShoppingBag, Users } from "lucide-react";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SiteFooter } from "@/components/SiteFooter";
import { company } from "@/lib/site-data";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = { title: { absolute: "Portable Coffee Machine Buyer Solutions | OEM, Wholesale and Private Label" }, description: "Explore verified TK Classic buying paths for marketplace sellers, coffee brands and outdoor wholesalers, plus travel, office, gift and shared-use scenarios.", alternates: { canonical: `${company.siteUrl}/solutions` } };
const iconBySlug = { "amazon-private-label": ShoppingBag, "coffee-brand-oem": Coffee, "outdoor-wholesale": Mountain, "travel-coffee": Compass, "office-coffee": Coffee, "gift-programs": Gift, "shared-use": Users } as const;

export default function SolutionsPage() {
      return <main className="inner-page" lang="en"><header className="site-header detail-header"><Link className="brand" href="/"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link><PrimaryNav lang="en" current="resources" ariaLabel="Solutions navigation" /></header><section className="inner-hero section"><p className="eyebrow">Published use scenarios</p><h1>Portable coffee machine solutions based on current product records.</h1><p className="inner-hero-lead">Choose a real buying or use scenario, then compare only the models whose published records support it.</p></section><section className="section"><div className="proof-grid">{solutions.map((solution) => { const Icon=iconBySlug[solution.slug as keyof typeof iconBySlug] ?? Coffee; return <article className="proof-card" key={solution.slug}><Icon size={23} /><span className="eyebrow">{solution.eyebrow}</span><h2>{solution.title}</h2><p>{solution.description}</p><Link href={`/solutions/${solution.slug}`}>Explore this solution <ArrowRight size={16} /></Link></article>; })}</div></section><SiteFooter lang="en" /></main>;
}
