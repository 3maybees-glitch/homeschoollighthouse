import Image from "next/image";
import Link from "next/link";
import { Compass, FileText, Ship } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Compass,
    label: "Deep academic interview",
    detail: "Style, faith, budget, strengths & years to graduation",
  },
  {
    icon: Ship,
    label: "Every year until Senior",
    detail: "1st through 12th — the full remaining voyage on one chart",
  },
  {
    icon: FileText,
    label: "3 choices per subject",
    detail: "Matched curricula with company names, weblinks & PDF save",
  },
] as const;

export function NavigatorPromo() {
  return (
    <section
      id="the-navigator"
      aria-labelledby="navigator-promo-heading"
      className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-navy)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_90%_10%,rgba(230,180,34,0.22),transparent_55%),radial-gradient(ellipse_50%_60%_at_0%_100%,rgba(42,157,143,0.2),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Prefer a guided plan?
            </p>
            <h2
              id="navigator-promo-heading"
              className="font-display mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]"
            >
              Meet {brand.navigator.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Not ready to browse {brand.stats.listings} listings on your own? Answer one deep
              academic interview and receive a multi-year Personalized Curriculum Chart: three
              matched choices per subject, for every remaining year through 12th Senior.
            </p>

            <ul className="mt-7 space-y-3">
              {highlights.map(({ icon: Icon, label, detail }) => (
                <li key={label} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[var(--color-beam)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{label}</span>
                    <span className="mt-0.5 block text-sm text-slate-400">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-slate-400">
              <span className="font-semibold text-[var(--color-beam)]">
                {brand.navigator.price} one-time
              </span>
              {" · "}
              Standalone — not a subscription · Separate from Full Beam · Private
              to your account
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/navigator">Start your chart</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/navigator/sample">See a sample chart</Link>
              </Button>
            </div>
          </div>

          <Link
            href="/navigator"
            className="group relative mx-auto block w-full max-w-lg justify-self-center lg:max-w-none lg:justify-self-end"
            aria-label={`${brand.navigator.title} — open the Personalized Curriculum Planner`}
          >
            <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition duration-500 group-hover:-translate-y-1 group-hover:border-[var(--color-beam)]/40 group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-[var(--color-cream)]">
                <Image
                  src="/social/navigator-personalized-curriculum-x-infographic.png"
                  alt="The Navigator Personalized Curriculum Planner infographic — deep interview, multi-year voyage, three choices per subject, print and save, $47 one-time"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  priority={false}
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Featured · Shareable voyage chart overview
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
