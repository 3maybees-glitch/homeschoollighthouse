import type { FilterState, SubscriptionTier } from "@/types/listing";

export const FREE_SUBJECT_TAGS = new Set([
  "college_prep",
  "standardized_testing",
  "clt",
  "sat",
  "act",
  "psat",
  "ap_exams",
]);

/** Values filters allowed on the free tier (homepage discovery links). */
export const FREE_TIER_VALUE_FILTERS = new Set(["special_needs", "neurodivergent_friendly"]);

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

function splitSubjects(subjects?: string[]) {
  const freeSubjects = subjects?.filter((subject) => FREE_SUBJECT_TAGS.has(subject)) ?? [];
  const premiumSubjects = subjects?.filter((subject) => !FREE_SUBJECT_TAGS.has(subject)) ?? [];
  return { freeSubjects, premiumSubjects };
}

export function isPremiumFilterActive(filters: FilterState) {
  const { premiumSubjects } = splitSubjects(filters.subjects);
  if (filters.philosophies?.length) return true;
  if (filters.values?.some((value) => !FREE_TIER_VALUE_FILTERS.has(value))) return true;
  if (filters.religions?.length) return true;
  if (premiumSubjects.length) return true;
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
  if (filterKey === "subjects" && Array.isArray(value)) {
    const { premiumSubjects } = splitSubjects(value);
    return premiumSubjects.length === 0;
  }
  if (filterKey === "values" && Array.isArray(value)) {
    return value.every((entry) => FREE_TIER_VALUE_FILTERS.has(entry));
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

  const { freeSubjects } = splitSubjects(filters.subjects);
  const freeValues = filters.values?.filter((value) => FREE_TIER_VALUE_FILTERS.has(value));

  return {
    ...filters,
    philosophies: undefined,
    values: freeValues?.length ? freeValues : undefined,
    religions: undefined,
    subjects: freeSubjects.length ? freeSubjects : undefined,
    minRating: undefined,
    state: undefined,
    priceRange: undefined,
    sort: premiumSorts.has(filters.sort) ? "relevance" : filters.sort,
    groupBy: premiumGroupBy.has(filters.groupBy) ? "none" : filters.groupBy,
  };
}
