import type { ListingFormat, ListingType } from "@/types/listing";

export const LOCAL_HARBOR_TYPES: ListingType[] = ["support_group", "coop", "field_trip"];

export function isLocalHarborType(listingType: string) {
  return LOCAL_HARBOR_TYPES.includes(listingType as ListingType);
}

export function submissionNeedsLocation(listingType: string, format?: ListingFormat | null) {
  if (!isLocalHarborType(listingType)) return false;
  if (!format || format === "online") return false;
  return true;
}

export function submissionBenefitsFromState(listingType: string) {
  return isLocalHarborType(listingType);
}
