import { ArrowDown, Box, Layers3, Palette, ShieldCheck } from "lucide-react";
import { CoffeeLabConfigurator } from "@/components/CoffeeLabConfigurator";
import {
  coffeeLabCopy,
  createCoffeeLabFormSeed,
  getCoffeeLabCatalog,
} from "@/lib/coffee-lab-data";
import type { Lang } from "@/lib/site-data";

export async function OemCoffeeLab({ lang }: { lang: Lang }) {
  const copy = coffeeLabCopy[lang];
  const catalog = await getCoffeeLabCatalog(lang);
  const formSeed = createCoffeeLabFormSeed();

  return (
    <>
      <section className="section oem-lab-suite" id="coffee-lab" aria-labelledby="oem-lab-title">
        <div className="oem-lab-intro">
          <p className="eyebrow">OEM / ODM · CONFIGURATION STUDIO</p>
          <h2 id="oem-lab-title">OEM / ODM · {copy.title}</h2>
          <p>{copy.subtitle}</p>
          <a href="#configurator">{copy.start}<ArrowDown size={17} aria-hidden="true" /></a>
        </div>
        <div className="oem-lab-capabilities" aria-label="OEM and ODM configuration capabilities">
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
