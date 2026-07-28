import { InquiryBuilder } from "@/components/InquiryBuilder";
import { ToolPageShell } from "@/components/ToolPageShell";
import { copy, languages, type Lang } from "@/lib/site-data";

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
