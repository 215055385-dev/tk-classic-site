import { permanentRedirect } from "next/navigation";
import { languages, type Lang } from "@/lib/site-data";
import { localizedPath } from "@/lib/seo";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

export default async function CoffeeLabRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  permanentRedirect(`${localizedPath("/oem-odm", getLang(params?.lang))}#coffee-lab`);
}
