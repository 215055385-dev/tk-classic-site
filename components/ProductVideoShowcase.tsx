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
};

export function ProductVideoShowcase({ videos }: ProductVideoShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const activeVideo = videos[activeIndex] ?? videos[0];

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

  if (!activeVideo) {
    return null;
  }

  return (
    <div ref={showcaseRef} className="product-video-showcase">
      <div className="product-video-tabs" role="tablist" aria-label="Product videos">
        {videos.map((video, index) => (
          <button
            key={video.src}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls="product-video-panel"
            className={activeIndex === index ? "is-active" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            <span>0{index + 1}</span>
            <strong>{video.label}</strong>
          </button>
        ))}
      </div>

      <div id="product-video-panel" className="product-video-panel" role="tabpanel" tabIndex={0}>
        {shouldLoad ? (
          <video
            key={activeVideo.src}
            className="product-video-player"
            controls
            playsInline
            preload="metadata"
            poster={activeVideo.poster}
          >
            <source src={activeVideo.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="product-video-placeholder" aria-label="Product video preview">
            <Image src={activeVideo.poster} alt="" fill sizes="(max-width: 720px) 100vw, 56vw" />
            <span><Play size={16} aria-hidden="true" /> Scroll to load video</span>
          </div>
        )}
        <div className="product-video-copy">
          <span className="product-video-kicker"><Play size={13} fill="currentColor" aria-hidden="true" /> {activeVideo.label}</span>
          <h3>{activeVideo.title}</h3>
          <p>{activeVideo.summary}</p>
          <span className="product-video-note"><Volume2 size={14} aria-hidden="true" /> Sound is off until you choose to play it.</span>
        </div>
      </div>
    </div>
  );
}
