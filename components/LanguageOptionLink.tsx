"use client";

import type { ReactNode } from "react";
import type { Lang } from "@/lib/site-data";

export function LanguageOptionLink({
  children,
  className,
  href,
  language,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  language: Lang;
}) {
  return (
    <a
      className={className}
      href={href}
      hrefLang={language}
      role="listitem"
      onClick={() => {
        document.cookie = `tk_site_lang=${language}; Max-Age=31536000; Path=/; SameSite=Lax`;
      }}
    >
      {children}
    </a>
  );
}
