import { LOCAL_HARBOR_TYPES } from "@/lib/directory/local-harbor-types";
import { getAllListings } from "@/lib/listings/catalog";
import { buildMapMarkers } from "@/lib/geo/listing-coordinates";
import type { Listing, ListingType } from "@/types/listing";

export { LOCAL_HARBOR_TYPES };

export function isLocalHarborListing(listing: Listing) {
  if (!listing.state) return false;
  if (!LOCAL_HARBOR_TYPES.includes(listing.listingType)) return false;
  if (listing.format === "online" && !listing.city) return false;
  return true;
}

export function getLocalHarborListings(options?: { state?: string; types?: ListingType[] }) {
  const types = options?.types ?? LOCAL_HARBOR_TYPES;

  return getAllListings().filter((listing) => {
    if (!types.includes(listing.listingType)) return false;
    if (!isLocalHarborListing(listing)) return false;
    if (options?.state && listing.state !== options.state) return false;
    return true;
  });
}

export function getLocalHarborMapData(options?: { state?: string; types?: ListingType[] }) {
  const listings = getLocalHarborListings(options);
  const markers = buildMapMarkers(listings);

  return {
    listings,
    markers,
    total: listings.length,
    mapped: markers.length,
  };
}

export function getStateHarborCounts() {
  const counts = new Map<string, number>();

  for (const listing of getLocalHarborListings()) {
    if (!listing.state) continue;
    counts.set(listing.state, (counts.get(listing.state) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((left, right) => right.count - left.count);
}
