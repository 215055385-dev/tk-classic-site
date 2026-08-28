import { permanentRedirect } from "next/navigation";
import { languages, type Lang } from "@/lib/site-data";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function ExhibitionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  // Keep the explicit locale in the redirect. Dropping `en` here allowed a
  // previously saved language cookie to rewrite the destination unexpectedly.
  permanentRedirect(`/${lang}/factory#exhibitions`);
}
