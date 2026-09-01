"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maximum));
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;
  return <div className="front-page-progress" aria-hidden="true"><span ref={barRef} /></div>;
}
