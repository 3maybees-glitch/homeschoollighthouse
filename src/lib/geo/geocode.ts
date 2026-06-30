import {
  CITY_COORDINATES,
  STATE_CENTROIDS,
  normalizeCityKey,
} from "@/lib/geo/us-coordinates";

export type GeocodePrecision = "city" | "state" | "nominatim";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  precision: GeocodePrecision;
  city?: string | null;
  state?: string | null;
}

function normalizeState(state?: string | null) {
  if (!state) return null;
  const trimmed = state.trim().toUpperCase();
  return trimmed.length === 2 ? trimmed : null;
}

function lookupCityCoordinates(city?: string | null, state?: string | null) {
  if (!city || !state || city.trim().toLowerCase() === "various") return null;
  return CITY_COORDINATES[normalizeCityKey(city, state)] ?? null;
}

async function geocodeWithNominatim(city: string | null | undefined, state: string) {
  const query = city ? `${city}, ${state}, USA` : `${state}, USA`;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "us");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "HomeschoolLighthouse/1.0 (homeschool directory; contact@homeschoollighthouse.com)",
      Accept: "application/json",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) return null;

  const results = (await response.json()) as Array<{ lat: string; lon: string }>;
  const match = results[0];
  if (!match) return null;

  return {
    latitude: Number(match.lat),
    longitude: Number(match.lon),
    precision: "nominatim" as const,
  };
}

export async function geocodeLocation(input: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
}): Promise<GeocodeResult | null> {
  const state = normalizeState(input.state);
  if (!state || !STATE_CENTROIDS[state]) return null;

  const cityCoords = lookupCityCoordinates(input.city, state);
  if (cityCoords) {
    return {
      latitude: cityCoords.lat,
      longitude: cityCoords.lng,
      precision: "city",
      city: input.city?.trim() ?? null,
      state,
    };
  }

  try {
    const nominatim = await geocodeWithNominatim(input.city, state);
    if (nominatim) {
      return {
        ...nominatim,
        city: input.city?.trim() ?? null,
        state,
      };
    }
  } catch {
    // Fall back to state centroid below.
  }

  const centroid = STATE_CENTROIDS[state];
  return {
    latitude: centroid.lat,
    longitude: centroid.lng,
    precision: "state",
    city: input.city?.trim() ?? null,
    state,
  };
}
