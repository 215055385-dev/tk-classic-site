import Link from "next/link";
import { Globe2 } from "lucide-react";
import { languages, type Lang } from "@/lib/site-data";

type LanguageSwitcherProps = {
  currentLang: Lang;
  hrefForLang: (lang: Lang) => string;
};

export function LanguageSwitcher({ currentLang, hrefForLang }: LanguageSwitcherProps) {
  const current = languages.find((language) => language.code === currentLang) ?? languages[0];

  return (
    <details className="language-switcher">
      <summary aria-label="Change language">
        <Globe2 size={18} aria-hidden="true" />
        <span>{current.label}</span>
      </summary>
      <div className="language-menu" role="list">
        {languages.map((language) => (
          <Link
            key={language.code}
            className={language.code === currentLang ? "active" : ""}
            href={hrefForLang(language.code)}
            hrefLang={language.code}
            role="listitem"
          >
            <span>{language.label}</span>
            <small>{language.native}</small>
          </Link>
        ))}
      </div>
    </details>
  );
}
