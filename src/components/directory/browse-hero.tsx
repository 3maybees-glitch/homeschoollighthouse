import Link from "next/link";
import { MapPin } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

export function BrowseHero({
  eyebrow = brand.browse.title,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
            <Link href="/harbors">
              <MapPin className="h-4 w-4" />
              {brand.nav.harbors}
            </Link>
          </Button>
        </div>
      </div>
      <div className="wave-divider h-10 w-full" aria-hidden="true" />
    </section>
  );
}
