"use client";

import { motion } from "motion/react";
import type { HeroDemoData } from "@/lib/home/hero-demo";
import { HeroSearchDemo } from "@/components/home/hero-search-demo";

type HomeHeroProps = {
  demo: HeroDemoData;
};

export function HomeHero({ demo }: HomeHeroProps) {
  return (
    <section className="relative overflow-x-clip border-b border-white/40 bg-[var(--color-navy)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,217,102,0.18),transparent_55%)]" />
      <motion.div
        className="hero-beam pointer-events-none absolute inset-0 opacity-70"
        animate={{ x: ["-8%", "8%"] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(42,157,143,0.15),transparent_70%)]" />

      <HeroSearchDemo demo={demo} />

      <div className="wave-divider h-12 w-full" aria-hidden="true" />
    </section>
  );
}
