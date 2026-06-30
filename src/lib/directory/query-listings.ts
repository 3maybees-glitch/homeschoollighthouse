import {
  groupByOptions,
  listingTypeOptions,
  philosophyOptions,
} from "@/lib/directory/filter-config";
import { sanitizeFiltersForTier } from "@/lib/directory/premium-gates";
import { getAllListings } from "@/lib/listings/catalog";
import type {
  FilterState,
  GroupedListings,
  Listing,
  ListingsResult,
  SubscriptionTier,
} from "@/types/listing";

function matchesQuery(listing: Listing, q?: string) {
  if (!q?.trim()) return true;
  const needle = q.trim().toLowerCase();
  const haystack = [
    listing.title,
    listing.shortDescription,
    listing.description,
    listing.listingType.replace(/_/g, " "),
    listing.city ?? "",
    listing.state ?? "",
    ...listing.philosophies,
    ...listing.values,
    ...listing.religions,
    ...listing.subjects,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function matchesArrayFilter(values: string[], selected?: string[]) {
  if (!selected?.length) return true;
  return selected.some((value) => values.includes(value));
}

function matchesAge(listing: Listing, ageRange?: [number, number]) {
  if (!ageRange) return true;
  const [minAge, maxAge] = ageRange;
  const listingMin = listing.ageMin ?? 0;
  const listingMax = listing.ageMax ?? 99;
  return listingMax >= minAge && listingMin <= maxAge;
}

function matchesPrice(listing: Listing, priceRange?: [number, number]) {
  if (!priceRange) return true;
  const [minPrice, maxPrice] = priceRange;
  if (listing.priceType === "free") return minPrice <= 0;
  const price = listing.priceMin ?? listing.priceMax ?? 0;
  return price >= minPrice && price <= maxPrice;
}

function sortListings(listings: Listing[], sort: FilterState["sort"], q?: string) {
  const items = [...listings];
  switch (sort) {
    case "rating":
      return items.sort((a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount);
    case "newest":
      return items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "alpha":
      return items.sort((a, b) => a.title.localeCompare(b.title));
    case "price_low":
      return items.sort((a, b) => (a.priceMin ?? 9999) - (b.priceMin ?? 9999));
    case "price_high":
      return items.sort((a, b) => (b.priceMin ?? 0) - (a.priceMin ?? 0));
    case "relevance":
    default:
      if (!q?.trim()) return items.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      return items.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
        const bTitle = b.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
        return bTitle - aTitle || b.ratingAvg - a.ratingAvg;
      });
  }
}

function buildFacets(listings: Listing[]) {
  const facets: Record<string, Record<string, number>> = {
    listingType: {},
    format: {},
    philosophy: {},
    values: {},
    religion: {},
    subject: {},
    state: {},
  };

  for (const listing of listings) {
    facets.listingType[listing.listingType] =
      (facets.listingType[listing.listingType] ?? 0) + 1;
    facets.format[listing.format] = (facets.format[listing.format] ?? 0) + 1;
    for (const philosophy of listing.philosophies) {
      facets.philosophy[philosophy] = (facets.philosophy[philosophy] ?? 0) + 1;
    }
    for (const value of listing.values) {
      facets.values[value] = (facets.values[value] ?? 0) + 1;
    }
    for (const religion of listing.religions) {
      facets.religion[religion] = (facets.religion[religion] ?? 0) + 1;
    }
    for (const subject of listing.subjects) {
      facets.subject[subject] = (facets.subject[subject] ?? 0) + 1;
    }
    if (listing.state) {
      facets.state[listing.state] = (facets.state[listing.state] ?? 0) + 1;
    }
  }

  return facets;
}

function groupListings(listings: Listing[], groupBy: FilterState["groupBy"]): GroupedListings[] {
  if (groupBy === "none") return [];

  const groups = new Map<string, Listing[]>();

  for (const listing of listings) {
    let keys: string[] = [];

    switch (groupBy) {
      case "category":
        keys = [listing.listingType];
        break;
      case "philosophy":
        keys = listing.philosophies.length ? listing.philosophies : ["uncategorized"];
        break;
      case "state":
        keys = [listing.state ?? "Virtual / National"];
        break;
      case "format":
        keys = [listing.format];
        break;
      case "price":
        keys = [listing.priceType];
        break;
      default:
        keys = ["all"];
    }

    for (const key of keys) {
      const current = groups.get(key) ?? [];
      current.push(listing);
      groups.set(key, current);
    }
  }

  const labelForKey = (key: string) => {
    if (groupBy === "category") {
      return listingTypeOptions.find((option) => option.value === key)?.label ?? key;
    }
    if (groupBy === "philosophy") {
      return philosophyOptions.find((option) => option.value === key)?.label ?? key;
    }
    if (groupBy === "format") {
      return key.replace("_", " ");
    }
    if (groupBy === "price") {
      return key.replace("_", " ");
    }
    return key;
  };

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, group]) => ({
      key,
      label: labelForKey(key),
      listings: group,
    }));
}

export function filterListings(
  filters: FilterState,
  tier: SubscriptionTier = "free",
): ListingsResult {
  const activeFilters = sanitizeFiltersForTier(filters, tier);

  const allListings = getAllListings();
  const filtered = allListings.filter((listing) => {
    if (!matchesQuery(listing, activeFilters.q)) return false;
    if (activeFilters.types?.length && !activeFilters.types.includes(listing.listingType)) {
      return false;
    }
    if (activeFilters.format?.length && !activeFilters.format.includes(listing.format)) {
      return false;
    }
    if (!matchesArrayFilter(listing.philosophies, activeFilters.philosophies)) return false;
    if (!matchesArrayFilter(listing.values, activeFilters.values)) return false;
    if (!matchesArrayFilter(listing.religions, activeFilters.religions)) return false;
    if (!matchesArrayFilter(listing.subjects, activeFilters.subjects)) return false;
    if (activeFilters.state && listing.state !== activeFilters.state) return false;
    if (activeFilters.minRating != null && listing.ratingAvg < activeFilters.minRating) {
      return false;
    }
    if (activeFilters.featuredOnly && !listing.isFeatured) return false;
    if (!matchesAge(listing, activeFilters.ageRange)) return false;
    if (!matchesPrice(listing, activeFilters.priceRange)) return false;
    return true;
  });

  const sorted = sortListings(filtered, activeFilters.sort, activeFilters.q);
  const grouped =
    activeFilters.groupBy === "none" ? undefined : groupListings(sorted, activeFilters.groupBy);

  return {
    listings: sorted,
    grouped,
    total: sorted.length,
    facets: buildFacets(allListings),
  };
}

export function parseFilterState(searchParams: Record<string, string | string[] | undefined>) {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const parseList = (key: string) => {
    const value = get(key);
    return value ? value.split(",").filter(Boolean) : undefined;
  };

  const age = get("age");
  const price = get("price");

  const filters: FilterState = {
    q: get("q") ?? undefined,
    types: parseList("types") as FilterState["types"],
    philosophies: parseList("philosophies"),
    values: parseList("values"),
    religions: parseList("religions"),
    subjects: parseList("subjects"),
    format: parseList("format") as FilterState["format"],
    state: get("state") ?? undefined,
    minRating: get("minRating") ? Number(get("minRating")) : undefined,
    featuredOnly: get("featured") === "1",
    sort: (get("sort") as FilterState["sort"]) ?? "relevance",
    groupBy: (get("groupBy") as FilterState["groupBy"]) ?? "none",
  };

  if (age?.includes("-")) {
    const [min, max] = age.split("-").map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) filters.ageRange = [min, max];
  }

  if (price?.includes("-")) {
    const [min, max] = price.split("-").map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) filters.priceRange = [min, max];
  }

  return filters;
}

export function filtersToSearchParams(filters: FilterState) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.types?.length) params.set("types", filters.types.join(","));
  if (filters.philosophies?.length) params.set("philosophies", filters.philosophies.join(","));
  if (filters.values?.length) params.set("values", filters.values.join(","));
  if (filters.religions?.length) params.set("religions", filters.religions.join(","));
  if (filters.subjects?.length) params.set("subjects", filters.subjects.join(","));
  if (filters.format?.length) params.set("format", filters.format.join(","));
  if (filters.state) params.set("state", filters.state);
  if (filters.minRating != null) params.set("minRating", String(filters.minRating));
  if (filters.featuredOnly) params.set("featured", "1");
  if (filters.ageRange) params.set("age", filters.ageRange.join("-"));
  if (filters.priceRange) params.set("price", filters.priceRange.join("-"));
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (filters.groupBy !== "none") params.set("groupBy", filters.groupBy);
  return params;
}

export { groupByOptions };
