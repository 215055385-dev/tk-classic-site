import { BundleConfigurator } from "@/components/BundleConfigurator";
import { ToolPageShell } from "@/components/ToolPageShell";
import type { Metadata } from "next";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Coffee Machine Bundle Configurator | TK Classic",
  description: "Build a portable coffee machine retail or private-label bundle with optional accessories and packaging direction.",
  keywords: ["coffee machine bundle configurator", "portable coffee gift set", "OEM coffee accessories"],
  alternates: { canonical: "/tools/bundle-configurator", languages: languageAlternates("/tools/bundle-configurator") },
};

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function BundleConfiguratorPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return (
    <ToolPageShell lang={lang} eyebrow="Bundle configurator" title="Turn one model into a complete retail offer." lead={t.contactLead}>
      <BundleConfigurator lang={lang} />
    </ToolPageShell>
  );
}
