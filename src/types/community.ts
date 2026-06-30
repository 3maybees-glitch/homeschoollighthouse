export interface Review {
  id: string;
  listingId: string;
  listingSlug: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  helpfulCount: number;
}

import type { GeocodePrecision, ListingFormat } from "@/types/listing";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  title: string;
  websiteUrl: string;
  listingType: string;
  description: string;
  submitterEmail?: string;
  format?: ListingFormat;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geocodePrecision?: GeocodePrecision | null;
  status: SubmissionStatus;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  queryString: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  listingSlug: string;
  createdAt: string;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiRecommendation {
  slug: string;
  title: string;
  reason: string;
}
