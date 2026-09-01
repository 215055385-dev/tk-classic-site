import Link from "next/link";
import { ArrowUpRight, BookOpenText, PackageCheck, TentTree } from "lucide-react";
import type { Lang } from "@/lib/site-data";

const copy: Record<Lang, { eyebrow: string; title: string; lead: string; read: string }> = {
  en: { eyebrow: "Buyer resources", title: "Buyer guides, made practical.", lead: "Product selection, outdoor use and private-label planning.", read: "Read guide" },
  es: { eyebrow: "Recursos para compradores", title: "Guías prácticas para compradores.", lead: "Selección, uso exterior y planificación de marca propia.", read: "Leer guía" },
  pt: { eyebrow: "Recursos para compradores", title: "Guias práticos para compradores.", lead: "Seleção, uso outdoor e planejamento de marca própria.", read: "Ler guia" },
  fr: { eyebrow: "Ressources acheteurs", title: "Des guides d’achat pratiques.", lead: "Sélection, usage extérieur et marque privée.", read: "Lire le guide" },
  ar: { eyebrow: "موارد المشترين", title: "أدلة عملية للمشترين.", lead: "الاختيار والاستخدام الخارجي وتخطيط العلامة الخاصة.", read: "قراءة الدليل" },
  zh: { eyebrow: "采购资源", title: "实用采购指南。", lead: "产品选型、户外使用与私牌规划。", read: "阅读指南" },
  ru: { eyebrow: "Материалы для покупателей", title: "Практические руководства.", lead: "Выбор, использование на природе и private label.", read: "Читать" },
};

const guideCopy: Record<Lang, [string, string, string]> = {
  en: ["Portable coffee machine buying guide", "Choosing a portable espresso machine for camping", "Private label portable espresso sourcing guide"],
  es: ["Guía de compra de cafeteras portátiles", "Cómo elegir una cafetera espresso portátil para camping", "Guía de compra de espresso portátil para marca propia"],
  pt: ["Guia de compra de cafeteiras portáteis", "Como escolher uma cafeteira espresso portátil para camping", "Guia de sourcing para espresso portátil de marca própria"],
  fr: ["Guide d’achat d’une machine à café portable", "Choisir une machine espresso portable pour le camping", "Guide d’approvisionnement espresso portable en marque privée"],
  ar: ["دليل شراء ماكينة قهوة محمولة", "اختيار ماكينة إسبريسو محمولة للتخييم", "دليل توريد ماكينة إسبريسو للعلامة الخاصة"],
  zh: ["便携咖啡机采购指南", "露营便携意式咖啡机选型指南", "便携意式咖啡机私牌采购指南"],
  ru: ["Руководство по выбору портативной кофемашины", "Как выбрать портативную эспрессо-машину для кемпинга", "Руководство по private label закупкам"],
};

const guides = [
  { href: "/resources/portable-coffee-machine-buying-guide", Icon: BookOpenText },
  { href: "/resources/choose-portable-espresso-machine-for-camping", Icon: TentTree },
  { href: "/resources/portable-espresso-machine-private-label-buying-guide", Icon: PackageCheck },
] as const;

export function FeaturedBuyerGuides({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const titles = guideCopy[lang];
  return (
    <section className="section featured-guides-section" aria-labelledby="featured-guides-title">
      <div className="section-heading align-left">
        <span>{t.eyebrow}</span>
        <h2 id="featured-guides-title">{t.title}</h2>
        <p>{t.lead}</p>
      </div>
      <div className="featured-guide-grid">
        {guides.map(({ href, Icon }, index) => (
          <Link className="featured-guide-card" href={href} key={href}>
            <span className="featured-guide-icon"><Icon size={22} aria-hidden="true" /></span>
            <span className="featured-guide-index">0{index + 1}</span>
            <h3>{titles[index]}</h3>
            <span className="featured-guide-link">{t.read}<ArrowUpRight size={16} aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
