import { CITY_COORDINATES, STATE_CENTROIDS, normalizeCityKey } from "@/lib/geo/us-coordinates";
import type { Listing } from "@/types/listing";

export interface MapMarker {
  listing: Listing;
  lat: number;
  lng: number;
  precision: "city" | "state";
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

function jitterCoordinates(lat: number, lng: number, seed: string) {
  const hash = hashString(seed);
  const latOffset = ((hash % 1000) - 500) / 25000;
  const lngOffset = (((hash / 1000) % 1000) - 500) / 25000;
  return { lat: lat + latOffset, lng: lng + lngOffset };
}

export function resolveListingCoordinates(listing: Listing): MapMarker | null {
  if (!listing.state) return null;

  const stateKey = listing.state.toUpperCase();
  const stateCentroid = STATE_CENTROIDS[stateKey];
  if (!stateCentroid) return null;

  if (listing.city && listing.city.toLowerCase() !== "various") {
    const cityKey = normalizeCityKey(listing.city, listing.state);
    const cityCoords = CITY_COORDINATES[cityKey];
    if (cityCoords) {
      const jittered = jitterCoordinates(cityCoords.lat, cityCoords.lng, listing.slug);
      return { listing, lat: jittered.lat, lng: jittered.lng, precision: "city" };
    }
  }

  const jittered = jitterCoordinates(stateCentroid.lat, stateCentroid.lng, listing.slug);
  return { listing, lat: jittered.lat, lng: jittered.lng, precision: "state" };
}

export function buildMapMarkers(listings: Listing[]) {
  return listings
    .map((listing) => resolveListingCoordinates(listing))
    .filter((marker): marker is MapMarker => marker !== null);
}
