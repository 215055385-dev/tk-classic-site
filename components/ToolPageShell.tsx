import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import { languages, type Lang } from "@/lib/site-data";
import { brandTagline } from "@/lib/translation-copy";

type ToolPageShellProps = {
  lang: Lang;
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
};

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export function ToolPageShell({ lang, eyebrow, title, lead, children }: ToolPageShellProps) {
  const dir = languages.find((item) => item.code === lang)?.dir ?? "ltr";

  return (
    <main className="tool-page-shell" dir={dir}>
      <header className="tool-page-header">
        <Link className="brand" href={`/${langQuery(lang)}`} aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span>
            <strong>TK Classic</strong>
            <small>{brandTagline[lang]}</small>
          </span>
        </Link>
        <Link className="tool-back-link" href={`/${langQuery(lang)}#tools`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to tools
        </Link>
        <LanguageSwitcher
          currentLang={lang}
          hrefForLang={(language) => (language === "en" ? "/tools/product-selector" : `/tools/product-selector?lang=${language}`)}
        />
      </header>

      <section className="tool-page-intro">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{lead}</p>
      </section>

      {children}
      <SiteFooter lang={lang} />
    </main>
  );
}
