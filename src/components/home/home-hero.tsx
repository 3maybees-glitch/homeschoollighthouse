"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Anchor, Compass, MapPin, Radio, ScrollText, Sparkles, Trophy, Users } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { HeroSearch } from "@/components/home/hero-search";
import { BrandLogoVideo } from "@/components/brand/brand-logo-video";

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
    href: "/harbors",
    icon: MapPin,
  },
  {
    label: "Social Harbors",
    href: "/social",
    icon: Radio,
  },
  {
    label: "Conferences",
    href: "/browse/conference",
    icon: Users,
  },
  {
    label: "Scholarships",
    href: "/browse/scholarship",
    icon: Trophy,
  },
  {
    label: "CLT & Tests",
    href: "/browse?q=CLT&types=standardized_test&subjects=clt",
    icon: ScrollText,
  },
];

export function HomeHero() {
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

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-16 sm:px-6 sm:pb-16 lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12 lg:pb-20 lg:pt-20">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)] backdrop-blur sm:px-4 sm:py-1.5 sm:text-xs">
            <Anchor className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="truncate">{brand.ai.title}</span>
          </div>

          <div className="min-w-0 space-y-3 sm:space-y-4">
            <h1 className="font-display max-w-full text-balance text-[1.65rem] font-semibold leading-[1.15] tracking-tight sm:max-w-3xl sm:text-4xl sm:leading-[1.08] lg:text-5xl xl:text-6xl">
              <span className="lg:hidden">{brand.heroTaglineShort}</span>
              <span className="hidden lg:inline">{brand.heroTagline}</span>
            </h1>
            <p className="hidden max-w-xl text-base leading-relaxed text-slate-300 sm:block sm:text-lg">
              {brand.tagline}
            </p>
          </div>

          <HeroSearch />

          <p className="text-xs font-medium text-[var(--color-beam)] sm:text-sm">
            {brand.stats.listings} {brand.stats.listingsLabel} waiting to guide your family
          </p>

          <div className="max-w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max min-w-0 gap-2 pb-1 sm:w-full sm:flex-wrap sm:pb-0">
              {quickChips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:border-[var(--color-beam)]/40 hover:bg-white/15 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <chip.icon className="h-3.5 w-3.5 text-[var(--color-beam)] sm:h-4 sm:w-4" />
                  {chip.label}
                </Link>
              ))}
            </div>
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
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-[var(--color-beam)]/30">
                  <BrandLogoVideo className="h-full w-full scale-[1.12] object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
                    Safe Harbor
                  </p>
                  <p className="font-display text-2xl font-semibold">Your Family&apos;s Guiding Light</p>
                </div>
              </div>

              <div className="grid gap-4">
                <HeroStat label="Curriculum beacons" value={brand.stats.listings} />
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
