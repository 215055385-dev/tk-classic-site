"use client";

import { useState } from "react";
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
  const activeVideo = videos[activeIndex] ?? videos[0];

  if (!activeVideo) {
    return null;
  }

  return (
    <div className="product-video-showcase">
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
