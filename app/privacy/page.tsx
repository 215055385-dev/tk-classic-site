import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { privacyCopy } from "@/lib/support-page-data";
import { languages, type Lang } from "@/lib/site-data";
import { languageAlternates } from "@/lib/seo";

type PrivacyPageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const runtime = "edge";

export const metadata: Metadata = {
  title: "TK Classic Privacy Policy",
  description: "How TK Classic handles information submitted through the website inquiry form.",
  keywords: ["TK Classic privacy policy", "portable coffee website privacy", "B2B inquiry data policy"],
  alternates: { canonical: "/privacy", languages: languageAlternates("/privacy") },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function langQuery(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const privacy = privacyCopy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const query = langQuery(lang);

  return (
    <main className="inner-page" dir={dir} lang={lang}>
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>Portable coffee OEM</small></span></Link>
        <nav aria-label="Privacy navigation">
          <Link href={`/${query}#products`}>Products</Link>
          <Link href={`/company${query}`}>Company</Link>
          <Link href={`/resources${query}`}>Resources</Link>
          <Link href={`/${query}#contact`}>Contact</Link>
        </nav>
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/privacy${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/privacy" label={privacy.title} />

      <section className="inner-hero section">
        <Link className="back-link" href={`/${query}`}><ArrowLeft size={17} aria-hidden="true" />Home</Link>
        <p className="eyebrow"><ShieldCheck size={16} aria-hidden="true" />{privacy.navLabel}</p>
        <h1>{privacy.title}</h1>
        <p className="inner-hero-lead">{privacy.intro}</p>
      </section>

      <section className="section policy-grid">
        {privacy.sections.map((section) => <RevealArticle className="policy-card" key={section.title}><h2>{section.title}</h2><p>{section.body}</p></RevealArticle>)}
        <Link className="policy-contact" href={`/contact${query}#inquiry-form`}><Mail size={19} aria-hidden="true" /><span>Contact TK Classic through the secure inquiry form</span></Link>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
