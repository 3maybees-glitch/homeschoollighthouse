import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import {
  BRIGHT_BEACON_ACTIVE_ROW,
  BRIGHT_BEACON_TOTAL_SPOTS,
} from "@/lib/bright-beacons";
import { getFeaturedListings } from "@/lib/listings/catalog";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/directory/listing-card";
import { OpenBeaconSpotCard } from "@/components/home/open-beacon-spot-card";

export function BrightBeaconsSection() {
  const activeBeacons = getFeaturedListings(BRIGHT_BEACON_ACTIVE_ROW);
  const openSpotCount = Math.max(0, BRIGHT_BEACON_TOTAL_SPOTS - activeBeacons.length);
  const openSpots = Array.from({ length: openSpotCount }, (_, index) => activeBeacons.length + index + 1);

  return (
    <section id="beacons" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {brand.featured}
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
            {brand.featuredSubtitle}
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--color-muted-foreground)]">
            Trusted resources families love — {BRIGHT_BEACON_TOTAL_SPOTS} exclusive Bright Beacon
            spots hand-picked from our directory of {brand.stats.listings} listings.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/browse?featured=1">View all beacons</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/advertise">{brand.advertise.cta}</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {activeBeacons.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {openSpots.length > 0 ? (
          <div>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Advertising spots open
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Homeschool businesses: claim a Bright Beacon for {brand.advertise.monthly}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {openSpots.map((spotNumber) => (
                <OpenBeaconSpotCard key={spotNumber} spotNumber={spotNumber} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
