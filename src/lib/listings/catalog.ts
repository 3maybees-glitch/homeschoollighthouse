import { seedListings, getFeaturedListings as getSeedFeatured } from "@/data/seed-listings";
import { memoryStore } from "@/lib/store/memory-store";
import type { Listing } from "@/types/listing";

export function getAllListings(): Listing[] {
  const published = memoryStore.getPublishedListings();
  const bySlug = new Map<string, Listing>();

  for (const listing of seedListings) {
    bySlug.set(listing.slug, listing);
  }

  for (const listing of published) {
    bySlug.set(listing.slug, listing);
  }

  return Array.from(bySlug.values());
}

export function getListingBySlug(slug: string): Listing | null {
  const published = memoryStore.getPublishedListings().find((listing) => listing.slug === slug);
  if (published) return published;
  return seedListings.find((listing) => listing.slug === slug) ?? null;
}

const PINNED_FEATURED_SLUGS = ["tied-2-teaching"];

function pinFeaturedOrder(listings: Listing[]) {
  const pinned = PINNED_FEATURED_SLUGS.flatMap((slug) =>
    listings.filter((listing) => listing.slug === slug),
  );
  const pinnedSlugs = new Set(pinned.map((listing) => listing.slug));
  const rest = listings.filter((listing) => !pinnedSlugs.has(listing.slug));
  return [...pinned, ...rest];
}

export function getFeaturedListings(limit = 6) {
  const featured = pinFeaturedOrder(getAllListings().filter((listing) => listing.isFeatured));
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }
  return pinFeaturedOrder(getSeedFeatured(limit));
}

export function getAllListingSlugs(): string[] {
  return getAllListings().map((listing) => listing.slug);
}
