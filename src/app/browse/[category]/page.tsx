import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterPanel } from "@/components/directory/filter-panel";
import { ListingGrid } from "@/components/directory/listing-grid";
import { SortGroupControls } from "@/components/directory/sort-group-controls";
import { BrowseHero } from "@/components/directory/browse-hero";
import { SaveSearchButton } from "@/components/community/save-search-button";
import { brand } from "@/lib/brand-vocabulary";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import {
  filterListings,
  filtersToSearchParams,
  parseFilterState,
} from "@/lib/directory/query-listings";
import { getUserTier } from "@/lib/auth/session";
import type { ListingType } from "@/types/listing";

const validCategories = new Set(listingTypeOptions.map((option) => option.value));

export async function generateStaticParams() {
  return listingTypeOptions.map((option) => ({ category: option.value }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const option = listingTypeOptions.find((item) => item.value === category);
  if (!option) return {};

  return {
    title: `${option.label} Homeschool Resources`,
    description: `Browse ${option.label.toLowerCase()} listings in the ${brand.siteName} directory with filters, sorting, and curated homeschool resources.`,
  };
}

export default async function CategoryBrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  if (!validCategories.has(category as ListingType)) notFound();

  const option = listingTypeOptions.find((item) => item.value === category)!;
  const rawParams = await searchParams;
  const filters = parseFilterState(rawParams);
  filters.types = [category as ListingType];

  const tier = await getUserTier();
  const result = filterListings(filters, tier);
  const queryString = filtersToSearchParams(filters).toString();

  return (
    <div>
      <BrowseHero
        title={option.label}
        description={`Explore trusted ${option.label.toLowerCase()} resources for homeschool families. Use filters to narrow by philosophy, age, format, and more.`}
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
