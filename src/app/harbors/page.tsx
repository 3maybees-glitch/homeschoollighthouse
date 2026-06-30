import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { getLocalHarborMapData, getStateHarborCounts } from "@/lib/directory/local-harbors";
import { HarborsMapPanel } from "@/components/directory/harbors-map-panel";
import { ListingCard } from "@/components/directory/listing-card";
import { Button } from "@/components/ui/button";

export default async function HarborsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const stateParam = params.state;
  const state = Array.isArray(stateParam) ? stateParam[0] : stateParam;
  const mapData = getLocalHarborMapData({ state });
  const stateCounts = getStateHarborCounts().slice(0, 8);

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            {brand.nav.harbors}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Find co-ops, support groups, and field trips near you
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Explore local homeschool harbors across the country. Filter by state, click a pin, and
            chart your family&apos;s next community connection.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/browse?types=support_group,coop">{brand.browse.title}</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
              <Link href="/browse">Browse all resources</Link>
            </Button>
          </div>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <HarborsMapPanel
          markers={mapData.markers}
          total={mapData.total}
          mapped={mapData.mapped}
          state={state}
        />

        {stateCounts.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-navy-deep)]">
              Top states by harbor count
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {stateCounts.map((item) => (
                <Link
                  key={item.state}
                  href={`/harbors?state=${item.state}`}
                  className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-navy-deep)] transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-cream)]"
                >
                  {item.state} · {item.count} beacons
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Nearby listings
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)]">
                Harbors in this view
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mapData.listings.slice(0, 9).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
