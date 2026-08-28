"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type CoffeeStat = {
  label: string;
  value: string;
};

type CoffeeScene = {
  model?: string;
  title: string;
  summary: string;
  label: string;
  src: string;
  alt: string;
  href?: string;
  stats?: CoffeeStat[];
  fit?: "cover" | "contain";
};

type CoffeeRitualStageProps = {
  model?: string;
  scenes: CoffeeScene[];
  stats?: CoffeeStat[];
  ctaLabel?: string;
  minimal?: boolean;
};

export function CoffeeRitualStage({
  model,
  scenes,
  ctaLabel = "View model",
}: CoffeeRitualStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shouldReduceMotion = useReducedMotion();
  const activeScene = scenes[activeIndex] ?? scenes[0];

  useEffect(() => {
    if (shouldReduceMotion || isPaused || scenes.length < 2) return;
    const timer = window.setTimeout(
      () => setActiveIndex((current) => (current + 1) % scenes.length),
      7200,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, scenes.length, shouldReduceMotion]);

  if (!activeScene) return null;

  const activeModel = activeScene.model ?? model ?? "TK Classic";
  const stageId = activeModel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const panelId = `${stageId}-scene-panel`;

  function moveFocus(index: number, delta: number) {
    const nextIndex = (index + delta + scenes.length) % scenes.length;
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      className="coffee-ritual-stage coffee-editorial-stage"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div
        id={panelId}
        className="coffee-ritual-frame"
        role="tabpanel"
        aria-labelledby={`${stageId}-scene-tab-${activeIndex}`}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={activeScene.src}
            className="coffee-ritual-media"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.018 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={activeScene.src}
              alt={activeScene.alt}
              fill
              className={activeScene.fit === "contain" ? "is-contain" : "is-cover"}
              draggable={false}
              sizes="(max-width: 760px) 100vw, 62vw"
              quality={75}
              priority={activeIndex === 0}
              loading="eager"
            />
          </m.div>
        </AnimatePresence>

        <div className="coffee-editorial-wash" aria-hidden="true" />
        {activeScene.href ? (
          <Link className="coffee-ritual-frame-link" href={activeScene.href} aria-label={`${activeModel}: ${ctaLabel}`} />
        ) : null}

        <div className="coffee-editorial-caption">
          <span>{activeScene.label}</span>
          <strong>{activeModel}</strong>
          {activeScene.href ? (
            <Link href={activeScene.href}>
              {ctaLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="coffee-editorial-index" role="tablist" aria-label="Product models">
        {scenes.map((scene, index) => (
          <button
            key={`${scene.model ?? scene.label}-${index}`}
            ref={(element) => { tabRefs.current[index] = element; }}
            type="button"
            role="tab"
            id={`${stageId}-scene-tab-${index}`}
            aria-selected={activeIndex === index}
            aria-controls={panelId}
            className={activeIndex === index ? "is-active" : undefined}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveFocus(index, 1);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveFocus(index, -1);
              }
            }}
          >
            <span>0{index + 1}</span>
            <strong>{scene.model ?? scene.label}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
