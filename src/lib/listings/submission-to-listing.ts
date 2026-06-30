import type { Submission } from "@/types/community";
import type { Listing, ListingFormat, ListingType, PriceType } from "@/types/listing";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function asListingType(value: string): ListingType {
  const allowed: ListingType[] = [
    "curriculum",
    "coop",
    "tutor",
    "support_group",
    "online_course",
    "field_trip",
    "supplement",
    "other",
  ];
  return allowed.includes(value as ListingType) ? (value as ListingType) : "other";
}

function asListingFormat(value?: string | null): ListingFormat {
  if (value === "in_person" || value === "hybrid" || value === "online") return value;
  return "online";
}

export function submissionToListing(submission: Submission): Listing {
  const listingType = asListingType(submission.listingType);
  const format = asListingFormat(submission.format);
  const slug = `${slugify(submission.title)}-${submission.id.slice(0, 8)}`;

  return {
    id: submission.id,
    slug,
    title: submission.title,
    description: submission.description,
    shortDescription: submission.description.slice(0, 120),
    listingType,
    format,
    priceType: "contact" as PriceType,
    priceMin: null,
    priceMax: null,
    websiteUrl: submission.websiteUrl,
    city: submission.city ?? null,
    state: submission.state ?? null,
    country: submission.country ?? "US",
    latitude: submission.latitude ?? null,
    longitude: submission.longitude ?? null,
    geocodePrecision: submission.geocodePrecision ?? null,
    isVirtual: format !== "in_person",
    ageMin: null,
    ageMax: null,
    isFeatured: false,
    ratingAvg: 0,
    ratingCount: 0,
    philosophies: ["eclectic"],
    values: [],
    religions: ["secular"],
    subjects: [],
    createdAt: submission.createdAt,
  };
}
