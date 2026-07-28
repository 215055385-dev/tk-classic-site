"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Coffee } from "lucide-react";

type CoffeeScene = {
  title: string;
  summary: string;
  label: string;
  src: string;
  alt: string;
  fit?: "cover" | "contain";
};

type CoffeeStat = {
  label: string;
  value: string;
};

type CoffeeRitualStageProps = {
  model: string;
  scenes: CoffeeScene[];
  stats: CoffeeStat[];
};

export function CoffeeRitualStage({ model, scenes, stats }: CoffeeRitualStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeScene = scenes[activeIndex] ?? scenes[0];
  const stageId = model.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const activeTabId = `${stageId}-scene-tab-${activeIndex}`;
  const panelId = `${stageId}-scene-panel`;

  if (!activeScene) {
    return null;
  }

  return (
    <div className="coffee-ritual-stage">
      <div className="coffee-ritual-toolbar">
        <span className="coffee-ritual-brand">
          <Coffee size={15} aria-hidden="true" />
          <span>{model} / brew ritual</span>
        </span>
        <div className="coffee-ritual-tabs" role="tablist" aria-label="Product scenes">
          {scenes.map((scene, index) => (
            <button
              key={`${scene.label}-${index}`}
              type="button"
              role="tab"
              id={`${stageId}-scene-tab-${index}`}
              aria-selected={activeIndex === index}
              aria-controls={panelId}
              aria-label={scene.label}
              className={activeIndex === index ? "is-active" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <span>0{index + 1}</span>
              <strong>{scene.label}</strong>
            </button>
          ))}
        </div>
      </div>

      <div
        id={panelId}
        className="coffee-ritual-frame"
        role="tabpanel"
        aria-labelledby={activeTabId}
        tabIndex={0}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene.src}
            className="coffee-ritual-media"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={activeScene.src}
              alt={activeScene.alt}
              fill
              className={activeScene.fit === "contain" ? "is-contain" : "is-cover"}
              sizes="(max-width: 720px) 100vw, (max-width: 1100px) 86vw, 980px"
              quality={80}
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        <div className="coffee-ritual-vignette" aria-hidden="true" />
        <div className="coffee-ritual-caption">
          <span>{activeScene.label}</span>
          <strong>{activeScene.title}</strong>
          <p>{activeScene.summary}</p>
          <span className="coffee-ritual-caption-arrow" aria-hidden="true">
            <ArrowUpRight size={16} />
          </span>
        </div>
        <div className="coffee-ritual-specs" aria-label={`${model} product specifications`}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="coffee-ritual-progress" aria-hidden="true">
        {scenes.map((scene, index) => (
          <span key={`${scene.src}-progress`} className={activeIndex === index ? "is-active" : undefined} />
        ))}
      </div>
    </div>
  );
}
