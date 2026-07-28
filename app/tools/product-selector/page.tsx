import { InteractiveBuyingTools } from "@/components/InteractiveBuyingTools";
import { ToolPageShell } from "@/components/ToolPageShell";
import Link from "next/link";
import { copy, languages, type Lang } from "@/lib/site-data";
import { getInteractiveProducts } from "@/lib/tool-products";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function ProductSelectorPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];

  return (
    <ToolPageShell
      lang={lang}
      eyebrow="Product selector"
      title="Find the right portable coffee system for your market."
      lead="Choose the buying scenario, quantity, destination and branding direction. The selector creates a practical starting point for your quotation."
    >
      <InteractiveBuyingTools lang={lang} products={getInteractiveProducts(lang)} />
      <section className="tool-page-cta">
        <span>{t.nav.contact}</span>
        <h2>Have a specific program in mind?</h2>
        <p>{t.contactLead}</p>
        <Link className="primary-action" href="/#contact">Send an inquiry</Link>
      </section>
    </ToolPageShell>
  );
}
