import type { Metadata } from "next";
import { ScenarioLandingPage } from "@/components/ScenarioLandingPage";
import { company } from "@/lib/site-data";
import { getScenarioPage } from "@/lib/scenario-pages";

const page = getScenarioPage("camping-coffee-machine")!;
export const metadata: Metadata = { title: { absolute: `${page.title} | TK Classic` }, description: page.description, alternates: { canonical: `${company.siteUrl}/${page.slug}` }, openGraph: { title: page.title, description: page.description, url: `${company.siteUrl}/${page.slug}`, type: "website", images: [{ url: "/optimized/hero-products/dq-005.webp", alt: "DQ-005 portable coffee machine product image" }] } };
export default function CampingCoffeeMachinePage() { return <ScenarioLandingPage page={page} />; }
