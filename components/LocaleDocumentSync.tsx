"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/site-data";

const localeDirections: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  pt: "ltr",
  fr: "ltr",
  ar: "rtl",
  zh: "ltr",
  ru: "ltr",
};

export function LocaleDocumentSync({ lang }: { lang: Lang }) {
  const pathname = usePathname();

  useEffect(() => {
    const pathLocale = pathname.split("/").filter(Boolean)[0];
    const queryLocale = new URLSearchParams(window.location.search).get("lang");
    const requestedLang = queryLocale && localeDirections[queryLocale]
      ? queryLocale
      : pathLocale && localeDirections[pathLocale]
        ? pathLocale
        : lang;
    const safeLang = localeDirections[requestedLang] ? requestedLang : "en";
    document.documentElement.lang = safeLang;
    document.documentElement.dir = localeDirections[safeLang];
  }, [lang, pathname]);

  return null;
}
