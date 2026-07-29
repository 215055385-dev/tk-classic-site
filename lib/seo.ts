import { company, languages, type Lang } from "@/lib/site-data";

export function localizedUrl(path: string, lang: Lang): string {
  const normalizedPath = path === "/" ? "" : path;
  const prefix = lang === "en" ? "" : `/${lang}`;
  return `${company.siteUrl}${prefix}${normalizedPath}`;
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(languages.map((language) => [language.code, localizedUrl(path, language.code)])),
    "x-default": localizedUrl(path, "en"),
  };
}
