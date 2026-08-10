import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import {
  BRIGHT_BEACON_ACTIVE_ROW,
  BRIGHT_BEACON_TOTAL_SPOTS,
} from "@/lib/bright-beacons";
import { getFeaturedListings } from "@/lib/listings/catalog";
import { OpenBeaconSpotCard } from "@/components/home/open-beacon-spot-card";
import { Button } from "@/components/ui/button";

/** Open Bright Beacon advertising inventory — kept below discovery content. */
export function AdvertiseSpotsBand() {
  const activeBeacons = getFeaturedListings(BRIGHT_BEACON_ACTIVE_ROW);
  const openSpotCount = Math.max(0, BRIGHT_BEACON_TOTAL_SPOTS - activeBeacons.length);

  if (openSpotCount <= 0) return null;

  const openSpots = Array.from(
    { length: openSpotCount },
    (_, index) => activeBeacons.length + index + 1,
  );

  return (
    <section
      id="advertise-spots"
      aria-labelledby="advertise-spots-heading"
      className="border-y border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,249,230,0.55),rgba(247,249,252,0.9))]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              For homeschool businesses
            </p>
            <h2
              id="advertise-spots-heading"
              className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl"
            >
              {openSpotCount} Bright Beacon {openSpotCount === 1 ? "spot" : "spots"} open
            </h2>
            <p className="mt-3 text-[var(--color-muted-foreground)]">
              Reach families already exploring our directory. Exclusive homepage placement for{" "}
              {brand.advertise.monthly}.
            </p>
          </div>
          <Button asChild variant="secondary" className="text-white">
            <Link href="/advertise">{brand.advertise.cta}</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {openSpots.map((spotNumber) => (
            <OpenBeaconSpotCard key={spotNumber} spotNumber={spotNumber} />
          ))}
        </div>
      </div>
    </section>
  );
}
