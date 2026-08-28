import Link from "next/link";
import { copy, type Lang } from "@/lib/site-data";
import { localizedPath, localizedUrl } from "@/lib/seo";
import { coffeeLabNav } from "@/lib/coffee-lab-data";

type SectionFloatNavProps = {
  lang: Lang;
  path?: string;
  label?: string;
};

export function SectionFloatNav({ lang, path, label }: SectionFloatNavProps) {
  const t = copy[lang];
  const resources = { en: "Resources", es: "Recursos", pt: "Recursos", fr: "Ressources", ar: "الموارد", zh: "资源", ru: "Ресурсы" }[lang];
  const accessories = { en: "Accessories", es: "Accesorios", pt: "Acessórios", fr: "Accessoires", ar: "الملحقات", zh: "配件", ru: "Аксессуары" }[lang];

  const structuredData = path && label ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: localizedUrl("/", lang) },
      { "@type": "ListItem", position: 2, name: label, item: localizedUrl(path, lang) },
    ],
  } : null;

  return (
    <>
      {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /> : null}
      <nav className="section-float-nav detail-float-nav" aria-label="Quick section navigation">
        <Link href={localizedPath("/", lang)}>{t.nav.home}</Link>
        <Link href={localizedPath("/products", lang)}>{t.nav.products}</Link>
        <Link href={localizedPath("/accessories", lang)}>{accessories}</Link>
        <Link href={localizedPath("/coffee-lab", lang)}>{coffeeLabNav[lang]}</Link>
        <Link href={localizedPath("/oem-odm", lang)}>{t.nav.oem}</Link>
        <Link href={localizedPath("/factory", lang)}>{t.nav.factory}</Link>
        <Link href={localizedPath("/resources", lang)}>{resources}</Link>
        <Link href={localizedPath("/contact", lang)}>{t.nav.contact}</Link>
      </nav>
    </>
  );
}
