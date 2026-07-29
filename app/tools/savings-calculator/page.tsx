import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ToolPageShell } from "@/components/ToolPageShell";
import type { Metadata } from "next";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wholesale Coffee Bundle Savings Calculator | TK Classic",
  description: "Estimate portable coffee machine order value and compare how volume, accessories and packaging affect a buyer plan.",
  keywords: ["wholesale savings calculator", "coffee machine order calculator", "portable coffee bundle pricing"],
  alternates: { canonical: "/tools/savings-calculator", languages: languageAlternates("/tools/savings-calculator") },
};

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function SavingsCalculatorPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return (
    <ToolPageShell lang={lang} eyebrow="Savings calculator" title="Make volume planning easier to explain." lead={t.intro}>
      <SavingsCalculator lang={lang} />
    </ToolPageShell>
  );
}
