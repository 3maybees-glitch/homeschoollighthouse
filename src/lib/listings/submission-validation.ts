import { geocodeLocation } from "@/lib/geo/geocode";
import {
  isLocalHarborType,
  submissionBenefitsFromState,
  submissionNeedsLocation,
} from "@/lib/directory/local-harbor-types";
import { formatOptions, usStates } from "@/lib/directory/filter-config";
import type { ListingFormat } from "@/types/listing";

function normalizeState(state?: string | null) {
  if (!state) return null;
  const trimmed = state.trim().toUpperCase();
  return usStates.includes(trimmed) ? trimmed : null;
}

function normalizeFormat(format?: string | null): ListingFormat | undefined {
  if (format === "online" || format === "in_person" || format === "hybrid") return format;
  return undefined;
}

export function validateSubmissionInput(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const websiteUrl = typeof body.websiteUrl === "string" ? body.websiteUrl.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const listingType = typeof body.listingType === "string" ? body.listingType : "other";
  const submitterEmail =
    typeof body.submitterEmail === "string" && body.submitterEmail.trim()
      ? body.submitterEmail.trim()
      : undefined;
  const city = typeof body.city === "string" && body.city.trim() ? body.city.trim() : null;
  const state = normalizeState(typeof body.state === "string" ? body.state : null);
  const format = normalizeFormat(typeof body.format === "string" ? body.format : null);

  if (!title || !websiteUrl || !description) {
    return { error: "Missing required fields." as const };
  }

  if (submissionNeedsLocation(listingType, format) && (!city || !state)) {
    return {
      error:
        "Local co-ops, support groups, and field trips need a city and state to appear on the harbor map.",
    };
  }

  if (submissionBenefitsFromState(listingType) && format !== "online" && !state) {
    return { error: "Please select a state so families can find this harbor on the map." as const };
  }

  if (format && !formatOptions.some((option) => option.value === format)) {
    return { error: "Invalid format selected." as const };
  }

  return {
    data: {
      title,
      websiteUrl,
      description,
      listingType,
      submitterEmail,
      format: format ?? (isLocalHarborType(listingType) ? "in_person" : "online"),
      city,
      state,
      country: "US" as const,
    },
  };
}

export async function enrichSubmissionWithGeocode<T extends { city?: string | null; state?: string | null; country?: string | null; listingType: string; format?: ListingFormat }>(
  submission: T,
) {
  if (!submissionBenefitsFromState(submission.listingType) || !submission.state) {
    return submission;
  }

  const geocoded = await geocodeLocation({
    city: submission.city,
    state: submission.state,
    country: submission.country ?? "US",
  });

  if (!geocoded) return submission;

  return {
    ...submission,
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    geocodePrecision: geocoded.precision,
  };
}
