"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Anchor, Compass, MapPin, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { HeroSearch } from "@/components/home/hero-search";

const quickChips = [
  {
    label: brand.filters.title,
    href: "/browse",
    icon: Compass,
  },
  {
    label: brand.featured,
    href: "/browse?featured=1",
    icon: Sparkles,
  },
  {
    label: brand.nav.harbors,
    href: "/browse?types=support_group,coop",
    icon: MapPin,
  },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/40 bg-[var(--color-navy)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,217,102,0.18),transparent_55%)]" />
      <motion.div
        className="hero-beam pointer-events-none absolute inset-0 opacity-70"
        animate={{ x: ["-8%", "8%"] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(42,157,143,0.15),transparent_70%)]" />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-28 lg:pt-32">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-beam)] backdrop-blur">
            <Anchor className="h-3.5 w-3.5" />
            {brand.ai.title}
          </div>

          <div className="space-y-5">
            <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {brand.heroTagline}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-300">{brand.tagline}</p>
            <p className="text-sm font-medium text-[var(--color-beam)]">
              {brand.stats.listings} {brand.stats.listingsLabel} waiting to guide your family
            </p>
          </div>

          <HeroSearch />

          <div className="flex flex-wrap gap-3">
            {quickChips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:border-[var(--color-beam)]/40 hover:bg-white/15"
              >
                <chip.icon className="h-4 w-4 text-[var(--color-beam)]" />
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative hidden lg:block"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-beam)]/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--color-seafoam)]/20 blur-3xl" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-beam)] text-[var(--color-navy-deep)] shadow-lg shadow-[var(--color-beam)]/30">
                  <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M32 8c-2 0-4 2-4 4v8l-8 4v4l12-2 12 2v-4l-8-4v-8c0-2-2-4-4-4zm-14 22 6 28h16l6-28H18zm8 8h12l-2 10H28l-2-10z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
                    Safe Harbor
                  </p>
                  <p className="font-display text-2xl font-semibold">Your family&apos;s compass</p>
                </div>
              </div>

              <div className="grid gap-4">
                <HeroStat label="Curriculum beacons" value="13,000+" />
                <HeroStat label="Support groups & co-ops" value="170+" />
                <HeroStat label="Philosophies charted" value="10+" />
              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                Every page feels like a supportive harbor: hopeful, wise, and built for real families
                navigating real homeschool waters.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="wave-divider h-12 w-full" aria-hidden="true" />
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-2xl font-bold text-[var(--color-beam)]">{value}</p>
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}
