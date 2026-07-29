import { InquiryBuilder } from "@/components/InquiryBuilder";
import { ToolPageShell } from "@/components/ToolPageShell";
import type { Metadata } from "next";
import { copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wholesale Coffee Inquiry Builder | TK Classic",
  description: "Prepare a concise wholesale, private-label or OEM/ODM brief before sending your portable coffee project inquiry.",
  keywords: ["coffee machine inquiry builder", "OEM coffee project brief", "private label coffee inquiry"],
  alternates: { canonical: "/tools/inquiry-builder", languages: languageAlternates("/tools/inquiry-builder") },
};

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function InquiryBuilderPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return (
    <ToolPageShell lang={lang} eyebrow="Inquiry builder" title="Send sales a brief they can act on." lead={t.contactLead}>
      <InquiryBuilder lang={lang} />
    </ToolPageShell>
  );
}
