import { brand } from "@/lib/brand-vocabulary";
import { filterListings } from "@/lib/directory/query-listings";
import { getFeaturedListings } from "@/lib/listings/catalog";
import type { Listing, ListingType, PriceType } from "@/types/listing";

/** Slim listing shape safe to pass into the client hero demo. */
export type HeroDemoListing = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  listingType: ListingType;
  coverImageUrl?: string | null;
  ratingAvg: number;
  ratingCount: number;
  ageMin: number | null;
  ageMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  priceType: PriceType;
  philosophies: string[];
};

export type HeroStarterQuery = {
  label: string;
  q: string;
};

export const HERO_STARTER_QUERIES: readonly HeroStarterQuery[] = [
  { label: "CLT", q: "CLT" },
  { label: "Saxon Math", q: "Saxon Math" },
  { label: "Scholarships", q: "scholarship" },
  { label: "Charlotte Mason", q: "Charlotte Mason" },
  { label: "Virginia", q: "Virginia" },
] as const;

export type HeroDemoData = {
  starters: readonly HeroStarterQuery[];
  packs: Record<string, HeroDemoListing[]>;
  defaultResults: HeroDemoListing[];
  searchPool: HeroDemoListing[];
  listingsLabel: string;
  listingsCount: string;
};

const DEMO_RESULT_LIMIT = 6;
const SEARCH_POOL_LIMIT = 80;

function toDemoListing(listing: Listing): HeroDemoListing {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    shortDescription: listing.shortDescription,
    listingType: listing.listingType,
    coverImageUrl: listing.coverImageUrl ?? null,
    ratingAvg: listing.ratingAvg,
    ratingCount: listing.ratingCount,
    ageMin: listing.ageMin,
    ageMax: listing.ageMax,
    priceMin: listing.priceMin,
    priceMax: listing.priceMax,
    priceType: listing.priceType,
    philosophies: listing.philosophies.slice(0, 3),
  };
}

function uniqueDemoListings(listings: Listing[], limit: number): HeroDemoListing[] {
  const seen = new Set<string>();
  const results: HeroDemoListing[] = [];

  for (const listing of listings) {
    if (seen.has(listing.slug)) continue;
    seen.add(listing.slug);
    results.push(toDemoListing(listing));
    if (results.length >= limit) break;
  }

  return results;
}

function listingsForQuery(q: string, limit = DEMO_RESULT_LIMIT): Listing[] {
  return filterListings({ q, sort: "relevance", groupBy: "none" }, "free").listings.slice(0, limit);
}

/** Prefetch starter packs + a local search pool for the homepage hero demo. */
export function getHeroDemoData(): HeroDemoData {
  const packs: Record<string, HeroDemoListing[]> = {};

  for (const starter of HERO_STARTER_QUERIES) {
    packs[starter.q] = listingsForQuery(starter.q).map(toDemoListing);
  }

  const defaultResults = getFeaturedListings(DEMO_RESULT_LIMIT).map(toDemoListing);

  const poolSource: Listing[] = [
    ...getFeaturedListings(24),
    ...listingsForQuery("CLT", 10),
    ...listingsForQuery("Saxon Math", 10),
    ...listingsForQuery("scholarship", 10),
    ...listingsForQuery("Charlotte Mason", 10),
    ...listingsForQuery("Virginia", 10),
    ...listingsForQuery("Apologia", 8),
    ...listingsForQuery("Sonlight", 8),
    ...listingsForQuery("co-op", 8),
  ];

  return {
    starters: HERO_STARTER_QUERIES,
    packs,
    defaultResults,
    searchPool: uniqueDemoListings(poolSource, SEARCH_POOL_LIMIT),
    listingsLabel: brand.stats.listingsLabel,
    listingsCount: brand.stats.listings,
  };
}

/** Client-safe filter over the prefetched search pool. */
export function filterHeroDemoPool(pool: HeroDemoListing[], query: string, limit = DEMO_RESULT_LIMIT) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return pool
    .filter((listing) => {
      const haystack = [
        listing.title,
        listing.shortDescription,
        listing.listingType.replace(/_/g, " "),
        ...listing.philosophies,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(needle) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(needle) ? 1 : 0;
      return bTitle - aTitle || b.ratingAvg - a.ratingAvg;
    })
    .slice(0, limit);
}
