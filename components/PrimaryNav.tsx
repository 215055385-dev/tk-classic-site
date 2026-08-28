import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { coffeeLabNav } from "@/lib/coffee-lab-data";
import { copy, type Lang } from "@/lib/site-data";
import { localizedPath } from "@/lib/seo";

type NavKey = "home" | "products" | "accessories" | "coffee-lab" | "oem" | "factory" | "resources" | "contact";

type PrimaryNavProps = {
  lang: Lang;
  current?: NavKey;
  ariaLabel?: string;
};

function navigationPath(path: string, lang: Lang) {
  if (lang !== "en") return localizedPath(path, lang);
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/en${normalizedPath}`;
}

const resourcesCopy: Record<Lang, { label: string; guides: [string, string]; scenarios: [string, string]; wholesale: [string, string] }> = {
  en: { label: "Resources", guides: ["Buyer guides", "Practical sourcing answers"], scenarios: ["Use scenarios", "Camping, travel and car coffee"], wholesale: ["USA wholesale", "DQ-001 and DQ-010 sourcing"] },
  es: { label: "Recursos", guides: ["Guías de compra", "Respuestas prácticas de sourcing"], scenarios: ["Escenarios de uso", "Camping, viaje y automóvil"], wholesale: ["Mayoristas en EE. UU.", "Sourcing de DQ-001 y DQ-010"] },
  pt: { label: "Recursos", guides: ["Guias de compra", "Respostas práticas de sourcing"], scenarios: ["Cenários de uso", "Camping, viagem e carro"], wholesale: ["Atacado nos EUA", "Sourcing de DQ-001 e DQ-010"] },
  fr: { label: "Ressources", guides: ["Guides d’achat", "Réponses pratiques de sourcing"], scenarios: ["Scénarios d’usage", "Camping, voyage et voiture"], wholesale: ["Grossistes aux États-Unis", "Sourcing DQ-001 et DQ-010"] },
  ar: { label: "الموارد", guides: ["أدلة الشراء", "إجابات عملية للمشتريات"], scenarios: ["سيناريوهات الاستخدام", "التخييم والسفر والسيارة"], wholesale: ["البيع بالجملة في الولايات المتحدة", "توريد DQ-001 وDQ-010"] },
  zh: { label: "资源", guides: ["采购指南", "真实资料整理的采购答案"], scenarios: ["使用场景", "露营、旅行与车载咖啡"], wholesale: ["美国批发", "DQ-001 与 DQ-010 采购"] },
  ru: { label: "Ресурсы", guides: ["Руководства покупателя", "Практические ответы по закупкам"], scenarios: ["Сценарии использования", "Кемпинг, путешествия и автомобиль"], wholesale: ["Оптовые поставки в США", "Закупка DQ-001 и DQ-010"] },
};

export function PrimaryNav({ lang, current, ariaLabel = "Main navigation" }: PrimaryNavProps) {
  const t = copy[lang];
  const resources = resourcesCopy[lang];
  const accessories = { en: "Accessories", es: "Accesorios", pt: "Acessórios", fr: "Accessoires", ar: "الملحقات", zh: "配件", ru: "Аксессуары" }[lang];
  const menuLabel = { en: "Menu", es: "Menú", pt: "Menu", fr: "Menu", ar: "القائمة", zh: "菜单", ru: "Меню" }[lang];
  const navItems: Array<{ key: NavKey; href: string; label: string }> = [
    { key: "home", href: navigationPath("/", lang), label: t.nav.home },
    { key: "products", href: navigationPath("/products", lang), label: t.nav.products },
    { key: "accessories", href: navigationPath("/accessories", lang), label: accessories },
    { key: "coffee-lab", href: navigationPath("/coffee-lab", lang), label: coffeeLabNav[lang] },
    { key: "oem", href: navigationPath("/oem-odm", lang), label: t.nav.oem },
    { key: "factory", href: navigationPath("/factory", lang), label: t.nav.factory },
    { key: "resources", href: navigationPath("/resources", lang), label: resources.label },
    { key: "contact", href: navigationPath("/contact", lang), label: t.nav.contact },
  ];

  return (
    <>
    <nav className="primary-nav" aria-label={ariaLabel}>
      <Link href={navigationPath("/", lang)} aria-current={current === "home" ? "page" : undefined}>{t.nav.home}</Link>
      <Link href={navigationPath("/products", lang)} aria-current={current === "products" ? "page" : undefined}>{t.nav.products}</Link>
      <Link href={navigationPath("/accessories", lang)} aria-current={current === "accessories" ? "page" : undefined}>{accessories}</Link>
      <Link href={navigationPath("/coffee-lab", lang)} aria-current={current === "coffee-lab" ? "page" : undefined}>{coffeeLabNav[lang]}</Link>
      <Link href={navigationPath("/oem-odm", lang)} aria-current={current === "oem" ? "page" : undefined}>{t.nav.oem}</Link>
      <Link href={navigationPath("/factory", lang)} aria-current={current === "factory" ? "page" : undefined}>{t.nav.factory}</Link>
      <div className="resources-nav-group">
        <Link
          className="resources-nav-direct"
          href={navigationPath("/resources", lang)}
          aria-current={current === "resources" ? "page" : undefined}
        >
          {resources.label}
        </Link>
        <details className="resources-nav-menu">
          <summary aria-label={`${resources.label} menu`}>
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div className="resources-nav-panel">
            <Link href={navigationPath("/resources", lang)}><span>{resources.guides[0]}</span><small>{resources.guides[1]}</small></Link>
            <Link href={navigationPath("/solutions", lang)}><span>{resources.scenarios[0]}</span><small>{resources.scenarios[1]}</small></Link>
            <Link href={navigationPath("/wholesale/usa", lang)}><span>{resources.wholesale[0]}</span><small>{resources.wholesale[1]}</small></Link>
          </div>
        </details>
      </div>
      <Link href={navigationPath("/contact", lang)} aria-current={current === "contact" ? "page" : undefined}>{t.nav.contact}</Link>
    </nav>
    <details className="mobile-primary-nav">
      <summary aria-label={menuLabel}><Menu size={20} aria-hidden="true" /><span>{menuLabel}</span></summary>
      <nav className="mobile-primary-nav-panel" aria-label={`${ariaLabel} — ${menuLabel}`}>
        {navItems.map((item) => (
          <Link href={item.href} aria-current={current === item.key ? "page" : undefined} key={item.key}>
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
    </>
  );
}
