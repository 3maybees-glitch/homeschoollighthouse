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
import { BrowsePagination } from "@/components/directory/browse-pagination";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { getUserTier } from "@/lib/auth/session";
import type { ListingType } from "@/types/listing";

const validCategories = new Set(listingTypeOptions.map((option) => option.value));

export async function generateStaticParams() {
  return listingTypeOptions.map((option) => ({ category: option.value }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { category } = await params;
  const option = listingTypeOptions.find((item) => item.value === category);
  if (!option) return {};

  const filters = parseFilterState(await searchParams);
  const query = filters.q?.trim();
  const canonicalParams = filtersToSearchParams({
    ...filters,
    types: undefined,
  });
  if (filters.page && filters.page > 1) canonicalParams.set("page", String(filters.page));
  const canonicalQuery = canonicalParams.toString();

  return pageMetadata({
    title: query
      ? `${option.label} homeschool resources for “${query.slice(0, 40)}”`
      : `${option.label} Homeschool Resources`,
    description: `Browse ${option.label.toLowerCase()} listings in the ${brand.siteName} directory. Filter by philosophy, age, format, and faith-friendly homeschool needs.`,
    path: canonicalQuery ? `/browse/${category}?${canonicalQuery}` : `/browse/${category}`,
    keywords: [
      option.label,
      "homeschool",
      `${option.label.toLowerCase()} homeschool`,
      "Christian homeschool",
    ],
  });
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
  const linkFilters = {
    ...filters,
    types: filters.types?.length === 1 && filters.types[0] === category ? undefined : filters.types,
  };

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
              filters={linkFilters}
              basePath={`/browse/${category}`}
            />
            <ListingGrid listings={result.listings} grouped={result.grouped} />
            <BrowsePagination
              page={result.page}
              pageCount={result.pageCount}
              filters={linkFilters}
              basePath={`/browse/${category}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
