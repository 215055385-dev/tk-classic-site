import { ArrowDown, Box, Layers3, Palette, ShieldCheck } from "lucide-react";
import { CoffeeLabConfigurator } from "@/components/CoffeeLabConfigurator";
import {
  coffeeLabCopy,
  createCoffeeLabFormSeed,
  getCoffeeLabCatalog,
} from "@/lib/coffee-lab-data";
import type { Lang } from "@/lib/site-data";

const suiteCopy: Record<Lang, { eyebrow: string; capabilities: string }> = {
  en: { eyebrow: "OEM / ODM · Configuration studio", capabilities: "OEM and ODM configuration capabilities" },
  es: { eyebrow: "OEM / ODM · Estudio de configuración", capabilities: "Capacidades de configuración OEM y ODM" },
  pt: { eyebrow: "OEM / ODM · Estúdio de configuração", capabilities: "Recursos de configuração OEM e ODM" },
  fr: { eyebrow: "OEM / ODM · Studio de configuration", capabilities: "Possibilités de configuration OEM et ODM" },
  ar: { eyebrow: "OEM / ODM · استوديو التهيئة", capabilities: "إمكانات تهيئة OEM وODM" },
  zh: { eyebrow: "OEM / ODM · 定制配置工作室", capabilities: "OEM 与 ODM 定制配置能力" },
  ru: { eyebrow: "OEM / ODM · Студия конфигурации", capabilities: "Возможности конфигурации OEM и ODM" },
};

export async function OemCoffeeLab({ lang }: { lang: Lang }) {
  const copy = coffeeLabCopy[lang];
  const suite = suiteCopy[lang];
  const catalog = await getCoffeeLabCatalog(lang);
  const formSeed = createCoffeeLabFormSeed();

  return (
    <>
      <section className="section oem-lab-suite" id="coffee-lab" aria-labelledby="oem-lab-title">
        <div className="oem-lab-intro">
          <p className="eyebrow">{suite.eyebrow}</p>
          <h2 id="oem-lab-title">OEM / ODM · {copy.title}</h2>
          <p>{copy.subtitle}</p>
          <a href="#configurator">{copy.start}<ArrowDown size={17} aria-hidden="true" /></a>
        </div>
        <div className="oem-lab-capabilities" aria-label={suite.capabilities}>
          <article><Layers3 size={21} aria-hidden="true" /><span>01</span><strong>{copy.machine}</strong></article>
          <article><Palette size={21} aria-hidden="true" /><span>02</span><strong>{copy.color} · {copy.finish}</strong></article>
          <article><Box size={21} aria-hidden="true" /><span>03</span><strong>{copy.logo} · {copy.accessories}</strong></article>
          <article><ShieldCheck size={21} aria-hidden="true" /><span>04</span><strong>{copy.verification}</strong></article>
        </div>
        <p className="oem-lab-disclaimer">{copy.concept}</p>
      </section>
      <CoffeeLabConfigurator lang={lang} catalog={catalog} copy={copy} formSeed={formSeed} />
    </>
  );
}
