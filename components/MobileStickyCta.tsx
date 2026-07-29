"use client";

import { useEffect, useState } from "react";

type MobileStickyCtaProps = {
  primaryLabel: string;
  whatsappHref: string;
  whatsappLabel?: string;
};

export function MobileStickyCta({ primaryLabel, whatsappHref, whatsappLabel = "WhatsApp" }: MobileStickyCtaProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero || !("IntersectionObserver" in window)) {
      const timer = window.setTimeout(() => setIsVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mobile-sticky-cta" aria-label="Mobile quick contact">
      <a href="#contact">{primaryLabel}</a>
      <a href={whatsappHref} target="_blank" rel="noreferrer">
        {whatsappLabel}
      </a>
    </div>
  );
}
