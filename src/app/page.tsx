import Link from "next/link";
import { Compass, Filter, Sparkles, Star } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { getFeaturedListings } from "@/data/seed-listings";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/directory/listing-card";

export default function HomePage() {
  const featured = getFeaturedListings(6);

  return (
    <div>
      <section className="border-b border-white/60 bg-gradient-to-br from-amber-50 via-white to-sky-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Follow the Light
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              The modern homeschool directory built for powerful search, filters, and discovery.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">{brand.tagline}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/browse">{brand.browse.title}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">{brand.pricing.title}</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-amber-100/60">
            <div className="space-y-5">
              <Feature icon={Filter} title={brand.filters.title} text="Filter by philosophy, values, format, age, price, and location." />
              <Feature icon={Compass} title={brand.sort.title} text="Sort and group results the way your family actually thinks." />
              <Feature icon={Sparkles} title={brand.ai.title} text="Premium AI discovery helps you chart a path through the noise." />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              {brand.featured}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Trusted resources families love</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/browse">View all</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Near Shore to Open Waters
              </p>
              <h2 className="mt-2 text-3xl font-bold">Start free. Unlock the full beam when you are ready.</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Browse for free with essential filters. Upgrade for advanced navigation, saved searches,
                and premium discovery tools.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-3xl font-bold text-amber-300">{brand.pricing.yearly}</p>
              <p className="mt-1 text-sm text-slate-300">or {brand.pricing.lifetime}</p>
              <Button asChild className="mt-5">
                <Link href="/pricing">{brand.upgrade.title}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900">Explore by type</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {listingTypeOptions.map((option) => (
            <Link
              key={option.value}
              href={`/browse?types=${option.value}`}
              className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-amber-300 hover:bg-amber-50"
            >
              {option.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Star;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
