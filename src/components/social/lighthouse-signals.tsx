import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { brandSocial } from "@/lib/brand-social";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/social/platform-icon";
import { XTimelineEmbed } from "@/components/social/x-timeline-embed";

export function LighthouseSignals() {
  const { handle, url } = brandSocial.x;

  return (
    <section
      id="lighthouse-signals"
      aria-labelledby="lighthouse-signals-heading"
      className="mb-12 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(165deg,rgba(0,31,63,0.97),rgba(0,20,40,0.98)_55%,rgba(0,31,63,0.94))] text-white shadow-[0_24px_60px_-36px_rgba(0,20,40,0.65)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="relative flex flex-col justify-between gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:pr-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 0% 0%, rgba(230,180,34,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(42,157,143,0.16), transparent 50%)",
            }}
          />

          <div className="relative">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
              <Radio className="h-4 w-4" aria-hidden="true" />
              Lighthouse Signals
            </p>
            <h2
              id="lighthouse-signals-heading"
              className="font-display mt-3 max-w-md text-3xl font-semibold leading-tight sm:text-4xl"
            >
              Live posts from our X deck
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
              Fresh beacons, resource finds, and fair-winds notes from{" "}
              <span className="font-medium text-white">@{handle}</span> — the Homeschool
              Lighthouse account on X.
            </p>
          </div>

          <div className="relative flex flex-wrap items-center gap-3">
            <Button asChild variant="default">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <PlatformIcon platform="x" className="h-4 w-4" />
                Follow @{handle}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
            >
              <Link href="/social#x">Browse curated X harbors</Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[var(--color-cream)] px-4 py-5 text-[var(--color-navy-deep)] sm:px-6 sm:py-6 lg:border-l lg:border-t-0">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            <XTimelineEmbed height={520} className="min-h-[320px]" />
          </div>
          <p className="mt-3 text-center text-xs text-[var(--color-muted-foreground)]">
            Timeline powered by X ·{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-navy)] underline-offset-2 hover:underline"
            >
              Open full profile
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
