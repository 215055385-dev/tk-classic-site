import { Globe2 } from "lucide-react";
import { languages, type Lang } from "@/lib/site-data";
import { LanguageOptionLink } from "@/components/LanguageOptionLink";

const localeCodes = new Set<Lang>(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

function canonicalLanguageHref(href: string, language: Lang) {
  const url = new URL(href, "https://tk-classic.local");
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] && localeCodes.has(segments[0] as Lang)) segments.shift();
  const basePath = segments.length ? `/${segments.join("/")}` : "/";

  url.searchParams.delete("lang");
  const pathname = language === "en" ? basePath : `/${language}${basePath === "/" ? "" : basePath}`;
  const query = url.searchParams.toString();
  return `${pathname}${query ? `?${query}` : ""}${url.hash}`;
}

type LanguageSwitcherProps = {
  currentLang: Lang;
  hrefForLang: (lang: Lang) => string;
};

export function LanguageSwitcher({ currentLang, hrefForLang }: LanguageSwitcherProps) {
  const current = languages.find((language) => language.code === currentLang) ?? languages[0];
  const switcherLabel: Record<Lang, string> = {
    en: "Change language",
    es: "Cambiar idioma",
    pt: "Alterar idioma",
    fr: "Changer de langue",
    ar: "تغيير اللغة",
    zh: "切换语言",
    ru: "Сменить язык",
  };

  return (
    <details className="language-switcher">
      <summary aria-label={switcherLabel[currentLang]}>
        <Globe2 size={18} aria-hidden="true" />
        <span>{current.label}</span>
      </summary>
      <div className="language-menu" role="list">
        {languages.map((language) => (
          <LanguageOptionLink
            key={language.code}
            className={language.code === currentLang ? "active" : ""}
            href={canonicalLanguageHref(hrefForLang(language.code), language.code)}
            language={language.code}
          >
            <span>{language.label}</span>
            <small>{language.native}</small>
          </LanguageOptionLink>
        ))}
      </div>
    </details>
  );
}
