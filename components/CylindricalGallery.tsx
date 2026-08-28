"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Grab, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery-data";
import styles from "./CylindricalGallery.module.css";

type CylindricalGalleryProps = {
  images: GalleryImage[];
  title: string;
  subtitle: string;
  eyebrow?: string;
  autoRotate?: boolean;
  priorityFirst?: boolean;
  showIntro?: boolean;
  controls?: { hint: string; region: string; carousel: string; open: string; bring: string; viewer: string; close: string; previous: string; next: string };
};

const normalizeAngle = (angle: number) => ((angle + 180) % 360 + 360) % 360 - 180;
const modulo = (value: number, length: number) => ((value % length) + length) % length;

export function CylindricalGallery({
  images,
  title,
  subtitle,
  eyebrow = "Drag to explore",
  autoRotate = true,
  priorityFirst = false,
  showIntro = true,
  controls = { hint: "Drag or swipe", region: "Drag horizontally to rotate", carousel: "3D image carousel", open: "Open", bring: "Bring to the front", viewer: "image viewer", close: "Close image viewer", previous: "Previous image", next: "Next image" },
}: CylindricalGalleryProps) {
  const shellRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const pointerRef = useRef({ id: -1, x: 0, time: 0, moved: false });
  const suppressClickUntilRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [idle, setIdle] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [geometry, setGeometry] = useState({ cardWidth: 440, cardHeight: 410, radius: 470 });
  const step = 360 / Math.max(images.length, 1);

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const markActivity = useCallback(() => {
    setIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIdle(true), 4800);
  }, []);

  const renderRotation = useCallback((rotation: number) => {
    rotationRef.current = rotation;
    if (cylinderRef.current) {
      cylinderRef.current.style.transform = "translate(-50%, -50%)";
    }
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const facingAngle = normalizeAngle(rotation + index * step);
      const distance = Math.abs(facingAngle);
      const proximity = Math.max(0, 1 - distance / 105);
      const angleRadians = facingAngle * (Math.PI / 180);
      const offsetX = Math.sin(angleRadians) * Math.min(geometry.radius * 1.08, geometry.cardWidth * 0.96);
      const offsetY = Math.abs(Math.sin(angleRadians)) * 24;
      const scale = 0.78 + proximity * 0.22;
      const tilt = Math.max(-10, Math.min(10, facingAngle * -0.13));
      card.style.setProperty("--gallery-proximity", proximity.toFixed(3));
      card.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px) scale(${scale}) rotateY(${tilt}deg)`;
      card.style.zIndex = String(Math.round(proximity * 100));
      card.style.opacity = String(Math.max(0.06, 0.14 + proximity * 0.86));
      card.style.pointerEvents = distance < 118 ? "auto" : "none";
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    setActiveIndex((current) => (current === nearest ? current : nearest));
  }, [geometry.cardWidth, geometry.radius, step]);

  const animateTo = useCallback((target: number, duration = 520) => {
    stopFrame();
    const start = rotationRef.current;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / (reducedMotion ? 1 : duration));
      const eased = 1 - Math.pow(1 - progress, 4);
      renderRotation(start + (target - start) * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else frameRef.current = null;
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [reducedMotion, renderRotation, stopFrame]);

  const targetForIndex = useCallback((index: number) => {
    const base = -index * step;
    return base + Math.round((rotationRef.current - base) / 360) * 360;
  }, [step]);

  const snapToNearest = useCallback(() => {
    const nearest = modulo(Math.round(-rotationRef.current / step), images.length);
    animateTo(targetForIndex(nearest));
  }, [animateTo, images.length, step, targetForIndex]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.28 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const update = () => {
      const width = node.clientWidth;
      const mobile = width < 680;
      const cardWidth = mobile ? Math.min(342, width * 0.72) : Math.min(520, width * 0.39);
      const cardHeight = mobile ? Math.min(390, cardWidth * 1.12) : Math.min(460, cardWidth * 0.84);
      const idealRadius = cardWidth / (2 * Math.tan(Math.PI / Math.max(images.length, 5)));
      const radius = mobile
        ? Math.min(width * 0.55, Math.max(cardWidth * 0.82, idealRadius * 0.72))
        : Math.min(width * 0.48, Math.max(cardWidth * 0.88, idealRadius));
      setGeometry({ cardWidth, cardHeight, radius });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    renderRotation(rotationRef.current);
  }, [geometry, renderRotation]);

  useEffect(() => {
    idleTimerRef.current = setTimeout(() => setIdle(true), 4800);
    return () => {
      stopFrame();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [stopFrame]);

  useEffect(() => {
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowPowerDevice = navigator.hardwareConcurrency <= 4 || deviceMemory <= 4;
    if (!autoRotate || lowPowerDevice || !idle || !inView || hovered || dragging || lightboxIndex !== null || reducedMotion) return;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(34, now - previous);
      previous = now;
      renderRotation(rotationRef.current - elapsed * 0.0024);
      frameRef.current = requestAnimationFrame(tick);
    };
    stopFrame();
    frameRef.current = requestAnimationFrame(tick);
    return stopFrame;
  }, [autoRotate, dragging, hovered, idle, inView, lightboxIndex, reducedMotion, renderRotation, stopFrame]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      stopFrame();
      markActivity();
      renderRotation(rotationRef.current - Math.max(-24, Math.min(24, event.deltaX * 0.12)));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        snapToNearest();
        setIdle(true);
      }, 180);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [markActivity, renderRotation, snapToNearest, stopFrame]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") setLightboxIndex((index) => index === null ? null : modulo(index - 1, images.length));
      if (event.key === "ArrowRight") setLightboxIndex((index) => index === null ? null : modulo(index + 1, images.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, lightboxIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    stopFrame();
    markActivity();
    pointerRef.current = { id: event.pointerId, x: event.clientX, time: performance.now(), moved: false };
    velocityRef.current = 0;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || pointerRef.current.id !== event.pointerId) return;
    const now = performance.now();
    const delta = event.clientX - pointerRef.current.x;
    const elapsed = Math.max(8, now - pointerRef.current.time);
    if (Math.abs(delta) > 2) pointerRef.current.moved = true;
    velocityRef.current = Math.max(-0.22, Math.min(0.22, (delta * 0.19) / elapsed));
    pointerRef.current.x = event.clientX;
    pointerRef.current.time = now;
    renderRotation(rotationRef.current + delta * 0.19);
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current.id !== event.pointerId) return;
    setDragging(false);
    if (pointerRef.current.moved) suppressClickUntilRef.current = performance.now() + 280;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pointerRef.current.id = -1;
    const initialVelocity = velocityRef.current;
    if (reducedMotion || Math.abs(initialVelocity) < 0.015) {
      snapToNearest();
      return;
    }
    let velocity = initialVelocity;
    let previous = performance.now();
    const coast = (now: number) => {
      const elapsed = Math.min(32, now - previous);
      previous = now;
      velocity *= Math.pow(0.88, elapsed / 16.67);
      renderRotation(rotationRef.current + velocity * elapsed);
      if (Math.abs(velocity) > 0.012) frameRef.current = requestAnimationFrame(coast);
      else snapToNearest();
    };
    frameRef.current = requestAnimationFrame(coast);
  };

  const cardStyles = useMemo(() => images.map((_, index) => ({
    opacity: index === 0 ? 1 : 0,
    transform: index === 0 ? "translateX(0)" : "translateX(0) scale(0.78)",
  })), [images]);

  const active = images[activeIndex];

  return (
    <section ref={shellRef} className={styles.shell} aria-label={title}>
      <div className={`${styles.header} ${showIntro ? "" : styles.headerCompact}`}>
        {showIntro ? (
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        ) : null}
        <span className={styles.hint}><Grab size={15} aria-hidden="true" /> {controls.hint}</span>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="region"
        aria-roledescription={controls.carousel}
        aria-label={`${title}. ${controls.region}.`}
      >
        <div
          ref={cylinderRef}
          className={styles.cylinder}
          style={{
            "--card-width": `${geometry.cardWidth}px`,
            "--card-height": `${geometry.cardHeight}px`,
          } as React.CSSProperties}
        >
          {images.map((image, index) => (
            <button
              ref={(node) => { cardRefs.current[index] = node; }}
              key={image.src}
              className={styles.card}
              style={cardStyles[index]}
              data-active={index === activeIndex}
              type="button"
              aria-label={index === activeIndex ? `${controls.open}: ${image.title}` : `${controls.bring}: ${image.title}`}
              onClick={() => {
                if (performance.now() < suppressClickUntilRef.current) return;
                markActivity();
                if (index === activeIndex) setLightboxIndex(index);
                else animateTo(targetForIndex(index));
              }}
            >
              <span className={styles.cardInner}>
                <Image
                  className={styles.image}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 720px) 72vw, 40vw"
                  priority={priorityFirst && index === 0}
                  loading={priorityFirst && index === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
                <span className={styles.imageIndex}>{String(index + 1).padStart(2, "0")}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.caption} aria-live="polite">
        <span className={styles.counter}>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <div><strong>{active.title}</strong><p>{active.description}</p></div>
        <span className={styles.category}>{active.category}</span>
      </div>

      {lightboxIndex !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`${images[lightboxIndex].title} · ${controls.viewer}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}>
          <button className={styles.closeButton} type="button" aria-label={controls.close} onClick={() => setLightboxIndex(null)}><X aria-hidden="true" /></button>
          <button className={styles.iconButton} type="button" aria-label={controls.previous} onClick={() => setLightboxIndex(modulo(lightboxIndex - 1, images.length))}><ChevronLeft aria-hidden="true" /></button>
          <figure className={styles.lightboxFigure}>
            <div className={styles.lightboxMedia}>
              <Image className={styles.lightboxImage} src={images[lightboxIndex].src} alt={images[lightboxIndex].alt} fill sizes="90vw" priority />
            </div>
            <figcaption className={styles.lightboxCaption}><strong>{images[lightboxIndex].title}</strong><span>{lightboxIndex + 1} / {images.length}</span></figcaption>
          </figure>
          <button className={styles.iconButton} type="button" aria-label={controls.next} onClick={() => setLightboxIndex(modulo(lightboxIndex + 1, images.length))}><ChevronRight aria-hidden="true" /></button>
        </div>
      )}
    </section>
  );
}
