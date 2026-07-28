import { company, languages, type Lang } from "@/lib/site-data";

export function localizedUrl(path: string, lang: Lang): string {
  const query = lang === "en" ? "" : `?lang=${lang}`;
  return `${company.siteUrl}${path}${query}`;
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(languages.map((language) => [language.code, localizedUrl(path, language.code)])),
    "x-default": localizedUrl(path, "en"),
  };
}
