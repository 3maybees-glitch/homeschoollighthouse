"use client";

import type { HeroDemoData } from "@/lib/home/hero-demo";
import { HeroSearchDemo } from "@/components/home/hero-search-demo";

type HomeHeroProps = {
  demo: HeroDemoData;
};

export function HomeHero({ demo }: HomeHeroProps) {
  return (
    <section className="relative overflow-x-clip border-b border-white/40 bg-[var(--color-navy)] text-white">
      {/* Harbor glow + static lighthouse ray so the gold light reads even if motion is reduced */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_72%_18%,rgba(255,217,102,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_10%_14%,rgba(255,217,102,0.28),transparent_60%)]" />
      <div
        className="pointer-events-none absolute left-[-8%] top-[-12%] h-[85%] w-[70%] opacity-70"
        style={{
          background:
            "conic-gradient(from 205deg at 22% 18%, transparent 0deg, rgba(255,217,102,0.08) 8deg, rgba(255,217,102,0.26) 22deg, rgba(255,217,102,0.1) 36deg, transparent 52deg)",
        }}
        aria-hidden="true"
      />

      {/* Animated sweeping fan + traveling beam (CSS; disabled only under prefers-reduced-motion) */}
      <div
        className="hero-beam-fan pointer-events-none absolute -left-[10%] -top-[20%] h-[140%] w-[90%] opacity-90"
        aria-hidden="true"
      />
      <div className="hero-beam pointer-events-none absolute inset-[-8%] opacity-95" aria-hidden="true" />

      {/* Soft seafoam at the waterline + wave texture */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(42,157,143,0.2),transparent_70%)]" />
      <div className="hero-wave-texture pointer-events-none absolute inset-x-0 bottom-10 h-24 opacity-90" aria-hidden="true" />

      <HeroSearchDemo demo={demo} />

      <div className="wave-divider relative z-10 h-12 w-full" aria-hidden="true" />
    </section>
  );
}
