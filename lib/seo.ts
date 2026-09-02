import { company, languages, type Lang } from "@/lib/site-data";

export function localizedPath(path: string, lang: Lang): string {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return lang === "en" ? normalizedPath || "/" : `/${lang}${normalizedPath}`;
}

export function localizedUrl(path: string, lang: Lang): string {
  return `${company.siteUrl}${localizedPath(path, lang)}`;
}

export function absoluteAssetUrl(value: string): string {
  try {
    return new URL(value, company.siteUrl).toString();
  } catch {
    return company.siteUrl;
  }
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(languages.map((language) => [language.code, localizedUrl(path, language.code)])),
    "x-default": localizedUrl(path, "en"),
  };
}
