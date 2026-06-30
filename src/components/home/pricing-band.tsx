import Link from "next/link";
import { Anchor, Compass, Sparkles } from "lucide-react";
import { brand, exploreRoutes } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

export function PricingBand() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-navy)] py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_50%,rgba(42,157,143,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
              Near Shore to Open Waters
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
              {brand.pricing.freeTeaser} · {brand.pricing.premiumTeaser}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              Browse for free with essential filters and basic map discovery. Upgrade for advanced
              navigation, saved charted courses, AI pathfinding, and ad-free sailing.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {exploreRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--color-beam)]/30 hover:bg-white/10"
                >
                  <Compass className="h-5 w-5 text-[var(--color-beam)]" />
                  <h3 className="mt-3 font-semibold">{route.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{route.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-beam)] text-[var(--color-navy-deep)]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Full Beam</p>
                <p className="font-display text-2xl font-semibold">{brand.upgrade.title}</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Anchor className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-beam)]" />
                Advanced filters for philosophy, religion, scholarships, and legal resources
              </li>
              <li className="flex items-start gap-2">
                <Anchor className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-beam)]" />
                Unlimited charted courses and anchored favorites
              </li>
              <li className="flex items-start gap-2">
                <Anchor className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-beam)]" />
                AI pathfinder and priority support
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[var(--color-navy-deep)]/50 p-5">
              <p className="text-3xl font-bold text-[var(--color-beam)]">{brand.pricing.yearly}</p>
              <p className="mt-1 text-sm text-slate-400">or {brand.pricing.lifetime}</p>
              <Button asChild className="mt-5 w-full">
                <Link href="/pricing">{brand.upgrade.title}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
