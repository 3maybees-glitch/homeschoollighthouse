"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { motion } from "motion/react";
import { ArrowRight, Compass, Search } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import {
  filterHeroDemoPool,
  type HeroDemoData,
  type HeroDemoListing,
} from "@/lib/home/hero-demo";
import { HeroDemoCard } from "@/components/home/hero-demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOBILE_PLACEHOLDER = "Try CLT, Saxon Math, scholarships…";
const DESKTOP_PLACEHOLDER = brand.search.placeholder;

type HeroSearchDemoProps = {
  demo: HeroDemoData;
};

export function HeroSearchDemo({ demo }: HeroSearchDemoProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeStarter, setActiveStarter] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState(MOBILE_PLACEHOLDER);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const syncPlaceholder = () => {
      setPlaceholder(media.matches ? DESKTOP_PLACEHOLDER : MOBILE_PLACEHOLDER);
    };
    syncPlaceholder();
    media.addEventListener("change", syncPlaceholder);
    return () => media.removeEventListener("change", syncPlaceholder);
  }, []);

  const results = useMemo(() => resolveHeroResults(demo, query, activeStarter), [
    activeStarter,
    demo,
    query,
  ]);

  const resultCountLabel = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length >= 2 || activeStarter) {
      return `${results.length} sample match${results.length === 1 ? "" : "es"}`;
    }
    return "Featured beacons to start";
  }, [activeStarter, query, results.length]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    startTransition(() => {
      if (!trimmed) {
        router.push("/browse");
        return;
      }
      router.push(`/browse?q=${encodeURIComponent(trimmed)}`);
    });
  }

  function activateStarter(starterQuery: string) {
    setActiveStarter(starterQuery);
    setQuery(starterQuery);
  }

  const browseHref = query.trim()
    ? `/browse?q=${encodeURIComponent(query.trim())}`
    : "/browse";

  return (
    <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-14 sm:px-6 sm:pb-16 lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10 lg:pb-20 lg:pt-16">
      <div className="min-w-0 space-y-5 sm:space-y-6">
        <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)] backdrop-blur sm:px-4 sm:py-1.5 sm:text-xs">
          {demo.listingsCount} {demo.listingsLabel}
        </p>

        <div className="min-w-0 space-y-3 sm:space-y-4">
          <h1 className="font-display max-w-full text-balance text-[1.7rem] font-semibold leading-[1.12] tracking-tight sm:max-w-3xl sm:text-4xl sm:leading-[1.08] lg:text-5xl xl:text-[3.35rem]">
            <span className="block text-[var(--color-beam)]">{brand.siteName}</span>
            <span className="mt-2 block lg:hidden">{brand.heroTaglineShort}</span>
            <span className="mt-2 hidden lg:block">{brand.heroTagline}</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-lg">
            Search trusted curricula, tests, scholarships, and local harbors — see real matches
            before you leave the homepage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full min-w-0 max-w-2xl">
          <div className="flex w-full min-w-0 flex-col gap-2 sm:block">
            <div className="relative w-full min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[var(--color-muted-foreground)] sm:left-5" />
              <Input
                value={query}
                onChange={(event) => {
                  setActiveStarter(null);
                  setQuery(event.target.value);
                }}
                placeholder={placeholder}
                className="box-border h-12 w-full min-w-0 max-w-full rounded-2xl border-[var(--color-border)] bg-white/95 pl-10 pr-3 text-base text-black shadow-lg shadow-[rgba(0,31,63,0.08)] backdrop-blur focus-visible:ring-[var(--color-ring)] sm:h-14 sm:pl-14 sm:pr-36"
                aria-label="Search homeschool resources"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="hidden rounded-xl px-5 sm:absolute sm:right-2 sm:top-1/2 sm:inline-flex sm:-translate-y-1/2"
              >
                {brand.search.title}
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full max-w-full shrink rounded-xl sm:hidden"
            >
              {brand.search.title}
            </Button>
          </div>
        </form>

        <div className="max-w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-0 gap-2 pb-1 sm:w-full sm:flex-wrap sm:pb-0" role="group" aria-label="Try a sample search">
            {demo.starters.map((starter) => {
              const selected =
                activeStarter === starter.q ||
                query.trim().toLowerCase() === starter.q.toLowerCase();
              return (
                <button
                  key={starter.q}
                  type="button"
                  onClick={() => activateStarter(starter.q)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition sm:px-4 sm:py-2 sm:text-sm ${
                    selected
                      ? "border-[var(--color-beam)]/60 bg-[var(--color-beam)]/20 text-[var(--color-beam)]"
                      : "border-white/15 bg-white/10 text-white hover:border-[var(--color-beam)]/40 hover:bg-white/15"
                  }`}
                  aria-pressed={selected}
                >
                  <Compass className="h-3.5 w-3.5 text-[var(--color-beam)] sm:h-4 sm:w-4" />
                  {starter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile / tablet results under the search */}
        <div className="lg:hidden">
          <ResultsHeader
            resultCountLabel={resultCountLabel}
            browseHref={browseHref}
            listingsCount={demo.listingsCount}
            listingsLabel={demo.listingsLabel}
          />
          <div className="mt-3 flex gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {results.slice(0, 4).map((listing) => (
              <HeroDemoCard key={listing.id} listing={listing} compact />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/navigator">Not sure yet? Try {brand.navigator.title}</Link>
            </Button>
            <Link
              href="/navigator/sample"
              className="text-sm font-medium text-slate-300 underline-offset-4 transition hover:text-[var(--color-beam)] hover:underline"
            >
              See a sample chart
            </Link>
          </div>

          <ProductVisualStrip />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12 }}
        className="relative hidden min-w-0 lg:block"
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/25 backdrop-blur sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--color-beam)]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[var(--color-seafoam)]/20 blur-3xl" />

          <div className="relative">
            <ResultsHeader
              resultCountLabel={resultCountLabel}
              browseHref={browseHref}
              listingsCount={demo.listingsCount}
              listingsLabel={demo.listingsLabel}
            />
            <div className="mt-4 space-y-2.5">
              {results.slice(0, 5).map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * index }}
                >
                  <HeroDemoCard listing={listing} />
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              Tap a card for details, or open the full directory to refine with filters.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResultsHeader({
  resultCountLabel,
  browseHref,
  listingsCount,
  listingsLabel,
}: {
  resultCountLabel: string;
  browseHref: string;
  listingsCount: string;
  listingsLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)] sm:text-xs">
          Live directory preview
        </p>
        <p className="mt-1 text-sm text-slate-300">{resultCountLabel}</p>
      </div>
      <Link
        href={browseHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-beam)] transition hover:text-white"
      >
        Browse {listingsCount} {listingsLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

function ProductVisualStrip() {
  return (
    <div className="flex items-center gap-2" aria-label="Product previews">
      <VisualThumb
        src="/social/navigator-personalized-curriculum-x-infographic.png"
        alt="The Navigator curriculum chart preview"
        href="/navigator"
      />
      <VisualThumb
        src="/logos/maybee-madison-map.jpg"
        alt="Faith and Freedom map preview"
        href="/#faith-freedom-maps"
      />
      <VisualThumb
        src="/social/linked-resources-count-x-infographic.png"
        alt="Directory scale preview"
        href="/browse"
      />
    </div>
  );
}

function VisualThumb({
  src,
  alt,
  href,
}: {
  src: string;
  alt: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/20 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:border-[var(--color-beam)]/50 sm:h-14 sm:w-14"
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="56px" />
    </Link>
  );
}

function resolveHeroResults(
  demo: HeroDemoData,
  query: string,
  activeStarter: string | null,
): HeroDemoListing[] {
  const trimmed = query.trim();

  if (activeStarter && demo.packs[activeStarter]?.length) {
    if (!trimmed || trimmed.toLowerCase() === activeStarter.toLowerCase()) {
      return demo.packs[activeStarter];
    }
  }

  if (trimmed.length >= 2) {
    const exactPack = demo.starters.find(
      (starter) => starter.q.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exactPack && demo.packs[exactPack.q]?.length) {
      return demo.packs[exactPack.q];
    }

    const fromPool = filterHeroDemoPool(demo.searchPool, trimmed, 6);
    if (fromPool.length) return fromPool;
  }

  return demo.defaultResults;
}
