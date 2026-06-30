export type ListingType =
  | "curriculum"
  | "coop"
  | "tutor"
  | "support_group"
  | "online_course"
  | "field_trip"
  | "supplement"
  | "conference"
  | "scholarship"
  | "standardized_test"
  | "other";

export type ListingFormat = "online" | "in_person" | "hybrid";

export type PriceType = "free" | "one_time" | "subscription" | "donation" | "contact";

export type SortOption =
  | "relevance"
  | "rating"
  | "newest"
  | "alpha"
  | "price_low"
  | "price_high"
  | "distance";

export type GroupByOption = "none" | "category" | "philosophy" | "state" | "format" | "price";

export type SubscriptionTier = "free" | "premium";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  listingType: ListingType;
  format: ListingFormat;
  priceType: PriceType;
  priceMin: number | null;
  priceMax: number | null;
  websiteUrl: string;
  coverImageUrl?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  isVirtual: boolean;
  ageMin: number | null;
  ageMax: number | null;
  isFeatured: boolean;
  ratingAvg: number;
  ratingCount: number;
  philosophies: string[];
  values: string[];
  religions: string[];
  subjects: string[];
  createdAt: string;
}

export interface FilterState {
  q?: string;
  types?: ListingType[];
  philosophies?: string[];
  values?: string[];
  religions?: string[];
  subjects?: string[];
  format?: ListingFormat[];
  ageRange?: [number, number];
  priceRange?: [number, number];
  state?: string;
  minRating?: number;
  featuredOnly?: boolean;
  sort: SortOption;
  groupBy: GroupByOption;
}

export interface GroupedListings {
  key: string;
  label: string;
  listings: Listing[];
}

export interface ListingsResult {
  listings: Listing[];
  grouped?: GroupedListings[];
  total: number;
  facets: Record<string, Record<string, number>>;
}
