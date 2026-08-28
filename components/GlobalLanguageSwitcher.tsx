"use client";

import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";
import { languages, type Lang } from "@/lib/site-data";

const localeCodes = new Set<Lang>(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

function localizedDestination(pathname: string, lang: Lang) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && localeCodes.has(segments[0] as Lang)) segments.shift();
  const basePath = segments.length ? `/${segments.join("/")}` : "/";
  return lang === "en" ? basePath : `/${lang}${basePath === "/" ? "" : basePath}`;
}

export function GlobalLanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDetailsElement>(null);
  const current = languages.find((language) => language.code === currentLang) ?? languages[0];

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="global-language-dock">
      <details ref={rootRef} className="language-switcher">
        <summary aria-label="Change language">
          <Globe2 size={18} aria-hidden="true" />
          <span>{current.label}</span>
        </summary>
        <div className="language-menu" role="list">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              className={language.code === currentLang ? "active" : ""}
              role="listitem"
              lang={language.code}
              onClick={() => {
                document.cookie = `tk_site_lang=${language.code}; Max-Age=31536000; Path=/; SameSite=Lax`;
                const query = new URLSearchParams(window.location.search);
                query.delete("lang");
                const suffix = query.size ? `?${query.toString()}` : "";
                const hash = window.location.hash;
                rootRef.current?.removeAttribute("open");
                router.push(`${localizedDestination(pathname, language.code)}${suffix}${hash}`);
                router.refresh();
              }}
            >
              <span>{language.label}</span>
              <small>{language.native}</small>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
