"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HeroDemoData } from "@/lib/home/hero-demo";
import { HeroSearchDemo } from "@/components/home/hero-search-demo";

type HomeHeroProps = {
  demo: HeroDemoData;
};

export function HomeHero({ demo }: HomeHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-x-clip border-b border-white/40 bg-[var(--color-navy)] text-white">
      {/* Harbor glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,217,102,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_12%_18%,rgba(255,217,102,0.18),transparent_58%)]" />

      {/* Sweeping lighthouse fan */}
      <motion.div
        className="pointer-events-none absolute -left-[10%] -top-[20%] h-[140%] w-[90%] opacity-90"
        style={{
          background:
            "conic-gradient(from 210deg at 18% 12%, transparent 0deg, rgba(255,217,102,0.06) 10deg, rgba(255,217,102,0.22) 26deg, rgba(255,217,102,0.08) 42deg, transparent 60deg)",
          transformOrigin: "18% 12%",
        }}
        animate={prefersReducedMotion ? undefined : { rotate: [-10, 14] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Traveling gold beam band */}
      <motion.div
        className="pointer-events-none absolute inset-[-10%] opacity-90"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, transparent 34%, rgba(255,217,102,0.12) 42%, rgba(255,217,102,0.38) 50%, rgba(255,217,102,0.12) 58%, transparent 66%, transparent 100%)",
        }}
        animate={prefersReducedMotion ? undefined : { x: ["-16%", "16%"] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Soft seafoam at the waterline + wave texture */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(42,157,143,0.18),transparent_70%)]" />
      <div className="hero-wave-texture pointer-events-none absolute inset-x-0 bottom-10 h-24 opacity-80" aria-hidden="true" />

      <HeroSearchDemo demo={demo} />

      <div className="wave-divider relative z-10 h-12 w-full" aria-hidden="true" />
    </section>
  );
}
