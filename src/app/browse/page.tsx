import { FilterPanel } from "@/components/directory/filter-panel";
import { ListingGrid } from "@/components/directory/listing-grid";
import { SortGroupControls } from "@/components/directory/sort-group-controls";
import { BrowseHero } from "@/components/directory/browse-hero";
import { SaveSearchButton } from "@/components/community/save-search-button";
import { filterListings, filtersToSearchParams, parseFilterState } from "@/lib/directory/query-listings";
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
  const queryString = filtersToSearchParams(filters).toString();

  return (
    <div>
      <BrowseHero
        title="Sweep the horizon across 16,000+ homeschool resources"
        description="Filter by philosophy, age, format, and location. Set your bearing, order your route, and find the beacons your family needs."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside>
            <FilterPanel initialFilters={filters} tier={tier} />
          </aside>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SortGroupControls filters={filters} tier={tier} total={result.total} />
              <SaveSearchButton queryString={queryString} tier={tier} />
            </div>
            <ListingGrid listings={result.listings} grouped={result.grouped} />
          </div>
        </div>
      </div>
    </div>
  );
}
