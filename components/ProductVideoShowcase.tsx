"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "framer-motion";

export type ProductVideo = {
  src: string;
  webmSrc?: string;
  poster: string;
  posterAlt: string;
  label: string;
  title: string;
  summary: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
  layout?: "media-left" | "media-right";
};

type ProductVideoShowcaseProps = {
  video: ProductVideo;
  loadLabel?: string;
  playLabel?: string;
  pauseLabel?: string;
  muteLabel?: string;
  unmuteLabel?: string;
  soundNote?: string;
};

export function ProductVideoShowcase({
  video,
  loadLabel = "Video loads when this section enters view",
  playLabel = "Play video",
  pauseLabel = "Pause video",
  muteLabel = "Mute sound",
  unmuteLabel = "Enable sound",
  soundNote = "Muted by default.",
}: ProductVideoShowcaseProps) {
  const showcaseRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const manuallyPausedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const root = showcaseRef.current;
    if (!root || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !shouldLoad) {
      return;
    }

    if (!isInView) {
      player.pause();
      return;
    }

    if (shouldReduceMotion || manuallyPausedRef.current) {
      return;
    }

    void player.play().catch(() => {
      setIsPlaying(false);
    });
  }, [isInView, shouldLoad, shouldReduceMotion]);

  async function togglePlayback() {
    const player = playerRef.current;
    if (!player) {
      setShouldLoad(true);
      return;
    }

    if (player.paused) {
      manuallyPausedRef.current = false;
      try {
        await player.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    manuallyPausedRef.current = true;
    player.pause();
  }

  function toggleSound() {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    player.muted = !player.muted;
    setIsMuted(player.muted);
  }

  const playbackLabel = isPlaying ? pauseLabel : playLabel;
  const layoutClass = video.layout === "media-right" ? "is-media-right" : "is-media-left";

  return (
    <article ref={showcaseRef} className={`product-video-story ${layoutClass}`}>
      <div className="editorial-video-media">
        {shouldLoad ? (
          <video
            ref={playerRef}
            className="product-video-player"
            autoPlay={!shouldReduceMotion}
            controls={false}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            poster={video.poster}
            aria-label={`${video.label}: ${video.title}`}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          >
            {video.webmSrc ? <source src={video.webmSrc} type="video/webm" /> : null}
            <source src={video.src} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        ) : (
          <div className="product-video-placeholder">
            <Image
              src={video.poster}
              alt={video.posterAlt}
              fill
              sizes="(max-width: 820px) 100vw, 68vw"
            />
            <span>{loadLabel}</span>
          </div>
        )}

        <button
          className="product-video-control"
          type="button"
          aria-label={playbackLabel}
          aria-pressed={isPlaying}
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} fill="currentColor" aria-hidden="true" />}
          <span>{playbackLabel}</span>
        </button>
        <button
          className="product-video-audio-control"
          type="button"
          aria-label={isMuted ? unmuteLabel : muteLabel}
          aria-pressed={!isMuted}
          title={soundNote}
          onClick={toggleSound}
        >
          {isMuted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
          <span>{isMuted ? unmuteLabel : muteLabel}</span>
        </button>
      </div>

      <div className="editorial-video-copy">
        <span className="product-video-kicker">{video.label}</span>
        <h2>{video.title}</h2>
        <p className="editorial-video-lead">{video.summary}</p>
        <ol className="product-video-steps">
          {video.steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        {video.primaryCta || video.secondaryCta ? (
          <div className="product-video-actions">
            {video.primaryCta ? (
              <a className="primary-action" href={video.primaryCta.href}>
                {video.primaryCta.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : null}
            {video.secondaryCta ? (
              <a className="secondary-action" href={video.secondaryCta.href}>
                {video.secondaryCta.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
