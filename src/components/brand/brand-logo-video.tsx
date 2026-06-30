"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_VIDEO_SRC = "/brand/homeschool-lighthouse-logo.mp4";
const LOGO_POSTER_SRC = "/brand/homeschool-lighthouse-logo-poster.png";

export function BrandLogoVideo({
  className,
  plays = 2,
}: {
  className?: string;
  plays?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playCountRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    playCountRef.current = 0;
  }, [plays]);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    void video.play()
      .then(() => {
        setHasStarted(true);
      })
      .catch(() => {
        // Autoplay can fail before the file is ready; keep the video element and retry.
      });
  }, [prefersReducedMotion]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    playCountRef.current += 1;
    if (playCountRef.current < plays) {
      video.currentTime = 0;
      void video.play();
      return;
    }

    video.pause();
  }, [plays]);

  if (prefersReducedMotion) {
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
      poster={hasStarted ? undefined : LOGO_POSTER_SRC}
      muted
      autoPlay
      playsInline
      preload="auto"
      onLoadedData={attemptPlay}
      onCanPlay={attemptPlay}
      onPlaying={() => setHasStarted(true)}
      onEnded={handleEnded}
      className={cn("object-contain", className)}
      aria-label="Homeschool Lighthouse logo animation"
    />
  );
}
