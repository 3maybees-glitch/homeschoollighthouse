"use client";

import type { HeroDemoData } from "@/lib/home/hero-demo";
import { HeroSearchDemo } from "@/components/home/hero-search-demo";

type HomeHeroProps = {
  demo: HeroDemoData;
};

export function HomeHero({ demo }: HomeHeroProps) {
  return (
    <section className="relative overflow-x-clip border-b border-white/40 bg-[var(--color-navy)] text-white">
      {/* Harbor glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,217,102,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_12%_18%,rgba(255,217,102,0.16),transparent_58%)]" />

      {/* Sweeping lighthouse fan + traveling gold beam */}
      <div
        className="hero-beam-fan pointer-events-none absolute -left-[10%] -top-[20%] h-[140%] w-[85%] opacity-80"
        aria-hidden="true"
      />
      <div className="hero-beam pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />

      {/* Soft seafoam at the waterline + wave texture */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(42,157,143,0.18),transparent_70%)]" />
      <div className="hero-wave-texture pointer-events-none absolute inset-x-0 bottom-10 h-24 opacity-80" aria-hidden="true" />

      <HeroSearchDemo demo={demo} />

      <div className="wave-divider relative z-10 h-12 w-full" aria-hidden="true" />
    </section>
  );
}
