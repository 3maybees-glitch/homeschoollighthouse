import { ListingCard } from "@/components/directory/listing-card";
import { brand } from "@/lib/brand-vocabulary";
import type { GroupedListings, Listing } from "@/types/listing";

export function ListingGrid({
  listings,
  grouped,
}: {
  listings: Listing[];
  grouped?: GroupedListings[];
}) {
  if (!listings.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-[var(--color-border)] bg-white/80 p-12 text-center">
        <h3 className="font-display text-xl font-semibold text-[var(--color-navy-deep)]">
          {brand.empty.title}
        </h3>
        <p className="mt-2 text-[var(--color-muted-foreground)]">{brand.empty.subtitle}</p>
      </div>
    );
  }

  if (grouped?.length) {
    return (
      <div className="space-y-10">
        {grouped.map((group) => (
          <section key={group.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[var(--color-navy-deep)]">
                {group.label}
              </h2>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {group.listings.length} beacons
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
