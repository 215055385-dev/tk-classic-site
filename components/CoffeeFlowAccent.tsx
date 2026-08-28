"use client";

import { m, useReducedMotion } from "framer-motion";

const flowEase = [0.45, 0, 0.55, 1] as const;

export function CoffeeFlowAccent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.span
      className="hero-coffee-drop"
      aria-hidden="true"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <m.span
        className="hero-coffee-stream"
        animate={
          shouldReduceMotion
            ? { opacity: 0.72, scaleY: 0.76 }
            : { opacity: [0, 1, 1, 0], scaleY: [0.08, 1, 1, 0.22] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 2.8, times: [0, 0.24, 0.76, 1], repeat: Infinity, ease: flowEase }
        }
      />
      <m.i
        animate={shouldReduceMotion ? undefined : { scaleX: [0.86, 1.04, 0.9] }}
        transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.span
        className="hero-coffee-ripple"
        animate={
          shouldReduceMotion
            ? { opacity: 0.42, scale: 0.86 }
            : { opacity: [0, 0, 0.72, 0], scale: [0.45, 0.45, 0.82, 1.24] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 2.8, times: [0, 0.34, 0.58, 1], repeat: Infinity, ease: "easeOut" }
        }
      />
    </m.span>
  );
}
