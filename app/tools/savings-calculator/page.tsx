import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ToolPageShell } from "@/components/ToolPageShell";
import { copy, languages, type Lang } from "@/lib/site-data";

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
