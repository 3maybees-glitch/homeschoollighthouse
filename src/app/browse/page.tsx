import { FilterPanel } from "@/components/directory/filter-panel";
import { ListingGrid } from "@/components/directory/listing-grid";
import { SortGroupControls } from "@/components/directory/sort-group-controls";
import { filterListings, parseFilterState } from "@/lib/directory/query-listings";
import { getUserTier } from "@/lib/auth/session";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilterState(params);
  const tier = await getUserTier();
  const result = filterListings(filters, tier);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside>
          <FilterPanel initialFilters={filters} tier={tier} />
        </aside>
        <div className="space-y-6">
          <SortGroupControls filters={filters} tier={tier} total={result.total} />
          <ListingGrid listings={result.listings} grouped={result.grouped} />
        </div>
      </div>
    </div>
  );
}
