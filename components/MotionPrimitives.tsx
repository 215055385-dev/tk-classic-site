"use client";

import { m, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type MotionProps<T extends keyof HTMLElementTagNameMap> = HTMLMotionProps<T> & {
  children: ReactNode;
};

const softEase = [0.22, 1, 0.36, 1] as const;

function revealTransition(delay = 0) {
  return {
    delay,
    duration: 0.72,
    ease: softEase,
  };
}

export function HeroCopyMotion({ children, className }: MotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function HeroTitleMotion({ children, className }: MotionProps<"h1">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.h1
      className={className}
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
        show: { opacity: 1, y: 0, transition: revealTransition(0.04) },
      }}
    >
      {children}
    </m.h1>
  );
}

export function HeroTextMotion({ children, className }: MotionProps<"p">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.p
      className={className}
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
        show: { opacity: 1, y: 0, transition: revealTransition(0.02) },
      }}
    >
      {children}
    </m.p>
  );
}

export function HeroActionsMotion({ children, className }: MotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
        show: { opacity: 1, y: 0, transition: revealTransition(0.1) },
      }}
    >
      {children}
    </m.div>
  );
}

export function HeroVisualMotion({
  children,
  className,
  ...props
}: MotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.82, ease: softEase }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function MotionCta({ children, ...props }: MotionProps<"a">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.a
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.025 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
      transition={{ duration: 0.18, ease: softEase }}
      {...props}
    >
      {children}
    </m.a>
  );
}

export function RevealSection({ children, className, ...props }: MotionProps<"section">) {
  const shouldReduceMotion = useReducedMotion();

  // Keep large sections visible before IntersectionObserver runs. The
  // restrained vertical motion preserves the reveal without making the
  // content depend on JavaScript timing for visibility.
  return (
    <m.section
      className={className}
      initial={shouldReduceMotion ? false : { y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.82, ease: softEase }}
      {...props}
    >
      {children}
    </m.section>
  );
}

export function RevealArticle({ children, className, ...props }: MotionProps<"article">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.article
      className={className}
      initial={shouldReduceMotion ? false : { y: 18, scale: 0.99 }}
      whileInView={{ y: 0, scale: 1 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.015 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
      viewport={{ once: true, amount: 0.14, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.68, ease: softEase }}
      {...props}
    >
      {children}
    </m.article>
  );
}
