import type { Listing } from "@/types/listing";

const SPECIAL_NEEDS_PATTERN =
  /\b(special[\s-]?needs?|dyslexia|dysgraphia|dyscalculia|autism|autistic|adhd|add\b|asperger|neurodivergent|learning\s+difference|learning\s+disabilit|disabilit(?:y|ies)|\biep\b|504\b|sensory\s+processing|occupational\s+therapy|speech\s+therapy|apraxia|twice[\s-]?exceptional|\b2e\b|simply\s+classical|adaptive\s+learn|developmental\s+delay)\b/i;

const SPECIAL_NEEDS_URL_PATTERN = /special-needs|dyslexia|autism|adhd|neurodivergent|learning-difference|iep/i;

/** Derived match for listings not tagged in `values` but clearly special-needs focused. */
export function listingMatchesSpecialNeeds(listing: Listing): boolean {
  if (listing.values.includes("special_needs") || listing.values.includes("neurodivergent_friendly")) {
    return true;
  }

  const haystack = [
    listing.title,
    listing.shortDescription,
    listing.description,
    listing.websiteUrl,
    listing.slug,
  ]
    .join(" ")
    .toLowerCase();

  if (SPECIAL_NEEDS_URL_PATTERN.test(listing.websiteUrl)) return true;
  return SPECIAL_NEEDS_PATTERN.test(haystack);
}

export function isSpecialNeedsValuesFilter(values?: string[]): boolean {
  if (!values?.length) return false;
  return values.some((value) => value === "special_needs" || value === "neurodivergent_friendly");
}