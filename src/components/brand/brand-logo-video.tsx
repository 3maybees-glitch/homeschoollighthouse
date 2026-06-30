"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_VIDEO_SRC = "/brand/homeschool-lighthouse-logo.mp4";
const LOGO_POSTER_SRC = "/brand/homeschool-lighthouse-logo-poster.png";

export function BrandLogoVideo({
  className,
  plays = 2,
  showStaticFallback = true,
}: {
  className?: string;
  plays?: number;
  showStaticFallback?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playCountRef = useRef(0);
  const [useStaticLogo, setUseStaticLogo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setUseStaticLogo(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      playCountRef.current += 1;
      if (playCountRef.current < plays) {
        video.currentTime = 0;
        void video.play();
        return;
      }
      video.pause();
    };

    video.addEventListener("ended", handleEnded);
    playCountRef.current = 0;
    void video.play().catch(() => {
      setUseStaticLogo(true);
    });

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [plays]);

  if (useStaticLogo && showStaticFallback) {
    return (
      <img
        src={LOGO_POSTER_SRC}
        alt="Homeschool Lighthouse"
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={LOGO_VIDEO_SRC}
      poster={LOGO_POSTER_SRC}
      muted
      playsInline
      preload="auto"
      className={cn("object-contain", className)}
      aria-label="Homeschool Lighthouse logo animation"
    />
  );
}
