import { permanentRedirect } from "next/navigation";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function RetiredSavingsCalculatorPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawLang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const query = rawLang ? `?lang=${encodeURIComponent(rawLang)}` : "";
  permanentRedirect(`/tools/inquiry-builder${query}`);
}
