import type { FilterState, SubscriptionTier } from "@/types/listing";

const premiumFilterKeys = new Set([
  "philosophies",
  "values",
  "religions",
  "subjects",
  "minRating",
  "state",
  "priceRange",
]);

const premiumSorts = new Set(["price_low", "price_high", "distance"]);
const premiumGroupBy = new Set(["philosophy", "state", "price"]);

export function isPremiumFilterActive(filters: FilterState) {
  if (filters.philosophies?.length) return true;
  if (filters.values?.length) return true;
  if (filters.religions?.length) return true;
  if (filters.subjects?.length) return true;
  if (filters.minRating != null) return true;
  if (filters.state) return true;
  if (filters.priceRange) return true;
  if (premiumSorts.has(filters.sort)) return true;
  if (premiumGroupBy.has(filters.groupBy)) return true;
  return false;
}

export function canUseFilter(
  tier: SubscriptionTier,
  filterKey: keyof FilterState | "sort" | "groupBy",
  value?: unknown,
) {
  if (tier === "premium") return true;
  if (!premiumFilterKeys.has(filterKey) && filterKey !== "sort" && filterKey !== "groupBy") {
    return true;
  }
  if (filterKey === "sort" && typeof value === "string" && premiumSorts.has(value)) {
    return false;
  }
  if (filterKey === "groupBy" && typeof value === "string" && premiumGroupBy.has(value)) {
    return false;
  }
  if (premiumFilterKeys.has(filterKey)) {
    if (Array.isArray(value)) return value.length === 0;
    return value == null || value === "";
  }
  return true;
}

export function sanitizeFiltersForTier(
  filters: FilterState,
  tier: SubscriptionTier,
): FilterState {
  if (tier === "premium") return filters;

  return {
    ...filters,
    philosophies: undefined,
    values: undefined,
    religions: undefined,
    subjects: undefined,
    minRating: undefined,
    state: undefined,
    priceRange: undefined,
    sort: premiumSorts.has(filters.sort) ? "relevance" : filters.sort,
    groupBy: premiumGroupBy.has(filters.groupBy) ? "none" : filters.groupBy,
  };
}
