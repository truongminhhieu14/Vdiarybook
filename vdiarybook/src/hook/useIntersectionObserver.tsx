"use client";
import React, { useEffect, useRef } from "react";

type VideoProps = {
  src: string;
  autoPlay?: boolean;
};

const AutoPauseVideo: React.FC<VideoProps> = ({ src, autoPlay = true }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Nếu video trong viewport thì play
            if (autoPlay) videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(videoEl);

    return () => {
      observer.unobserve(videoEl);
    };
  }, [autoPlay]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      muted
      playsInline
      loop
      className="w-full max-h-[400px] rounded-lg"
    />
  );
};

export default AutoPauseVideo;
