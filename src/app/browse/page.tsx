import type { Metadata } from "next";
import { FilterPanel } from "@/components/directory/filter-panel";
import { ListingGrid } from "@/components/directory/listing-grid";
import { SortGroupControls } from "@/components/directory/sort-group-controls";
import { BrowseHero } from "@/components/directory/browse-hero";
import { BrowsePagination } from "@/components/directory/browse-pagination";
import { SaveSearchButton } from "@/components/community/save-search-button";
import { getBrowseHeading } from "@/lib/directory/browse-heading";
import { isSpecialNeedsValuesFilter } from "@/lib/directory/special-needs-match";
import { filterListings, filtersToSearchParams, parseFilterState } from "@/lib/directory/query-listings";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { getUserTier } from "@/lib/auth/session";

function browsePath(filters: ReturnType<typeof parseFilterState>) {
  const params = filtersToSearchParams(filters);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const filters = parseFilterState(params);
  const query = filters.q?.trim();

  const specialNeeds = isSpecialNeedsValuesFilter(filters.values);
  const title = query
    ? `Homeschool resources for “${query.slice(0, 60)}”`
    : specialNeeds
      ? "Special Needs & Neurodivergent-Friendly Homeschool Resources"
      : filters.featuredOnly
        ? "Featured Homeschool Resources"
        : "Browse Homeschool Curriculum and Resources";

  const description = query
    ? `Search results for ${query} in the Homeschool Lighthouse directory of curricula, classes, co-ops, and trusted resources.`
    : specialNeeds
      ? "Browse homeschool curricula, supports, and adaptive tools for dyslexia, autism, ADHD, learning differences, and related needs."
      : filters.featuredOnly
        ? "Bright Beacons: hand-picked homeschool curricula, classes, and resources for Christian and values-minded families."
        : "Filter 17,800+ homeschool curricula, online classes, co-ops, and trusted resources by philosophy, age, format, and location.";

  return pageMetadata({
    title,
    description,
    path: browsePath(filters),
    keywords: [
      "homeschool curriculum",
      "homeschool directory",
      "Christian homeschool resources",
      "homeschool co-op",
      query ?? "browse homeschool resources",
    ],
  });
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilterState(params);
  const tier = await getUserTier();
  const result = filterListings(filters, tier);
  const hero = getBrowseHeading(filters, result.total);
  const queryString = filtersToSearchParams(filters).toString();

  return (
    <div>
      <BrowseHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside>
            <FilterPanel initialFilters={filters} tier={tier} />
          </aside>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SortGroupControls
                filters={filters}
                tier={tier}
                total={result.total}
                rangeStart={result.rangeStart}
                rangeEnd={result.rangeEnd}
              />
              <SaveSearchButton queryString={queryString} tier={tier} />
            </div>
            <BrowsePagination
              page={result.page}
              pageCount={result.pageCount}
              filters={filters}
              basePath="/browse"
            />
            <ListingGrid listings={result.listings} grouped={result.grouped} />
            <BrowsePagination
              page={result.page}
              pageCount={result.pageCount}
              filters={filters}
              basePath="/browse"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
