"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const localeDirections: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  pt: "ltr",
  fr: "ltr",
  ar: "rtl",
  zh: "ltr",
  ru: "ltr",
};

export function LocaleDocumentSync() {
  const pathname = usePathname();

  useEffect(() => {
    const lang = new URLSearchParams(window.location.search).get("lang") ?? "en";
    const safeLang = localeDirections[lang] ? lang : "en";
    document.documentElement.lang = safeLang;
    document.documentElement.dir = localeDirections[safeLang];
  }, [pathname]);

  return null;
}
