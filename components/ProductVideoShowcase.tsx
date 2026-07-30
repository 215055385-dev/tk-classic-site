"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";

export type ProductVideo = {
  src: string;
  poster: string;
  label: string;
  title: string;
  summary: string;
};

type ProductVideoShowcaseProps = {
  videos: ProductVideo[];
  loadLabel?: string;
  soundNote?: string;
};

export function ProductVideoShowcase({
  videos,
  loadLabel = "Scroll to load video",
  soundNote = "Sound is off until you choose to play it.",
}: ProductVideoShowcaseProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = showcaseRef.current;
    if (!root || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div ref={showcaseRef} className="product-video-showcase">
      <div className="product-video-grid">
        {videos.map((video, index) => (
          <article className="product-video-card" key={video.src}>
            <div className="product-video-media">
              {shouldLoad ? (
                <video
                  className="product-video-player"
                  controls
                  playsInline
                  preload="none"
                  poster={video.poster}
                  aria-label={`${video.label} product video`}
                >
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="product-video-placeholder" aria-label="Product video preview">
                  <Image
                    src={video.poster}
                    alt=""
                    fill
                    sizes="(max-width: 720px) 100vw, 50vw"
                  />
                  <span><Play size={16} aria-hidden="true" /> {loadLabel}</span>
                </div>
              )}
            </div>
            <div className="product-video-copy">
              <span className="product-video-kicker">
                <Play size={13} fill="currentColor" aria-hidden="true" />
                {video.label}
              </span>
              <span className="product-video-index" aria-hidden="true">0{index + 1}</span>
              <h3>{video.title}</h3>
              <p>{video.summary}</p>
              <span className="product-video-note">
                <Volume2 size={14} aria-hidden="true" />
                {soundNote}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
