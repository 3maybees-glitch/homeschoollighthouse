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
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">{brand.empty.title}</h3>
        <p className="mt-2 text-slate-600">{brand.empty.subtitle}</p>
      </div>
    );
  }

  if (grouped?.length) {
    return (
      <div className="space-y-10">
        {grouped.map((group) => (
          <section key={group.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{group.label}</h2>
              <span className="text-sm text-slate-500">{group.listings.length} beacons</span>
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
