import type { Listing } from "@/types/listing";
import { listingTypeOptions } from "@/lib/directory/filter-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://homeschoollighthouse.com";

export function buildListingJsonLd(listing: Listing) {
  const typeLabel =
    listingTypeOptions.find((option) => option.value === listing.listingType)?.label ??
    listing.listingType;

  return {
    "@context": "https://schema.org",
    "@type": listing.format === "in_person" ? "LocalBusiness" : "Course",
    name: listing.title,
    description: listing.shortDescription,
    url: `${siteUrl}/listing/${listing.slug}`,
    sameAs: listing.websiteUrl,
    aggregateRating:
      listing.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: listing.ratingAvg,
            reviewCount: listing.ratingCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      price: listing.priceMin ?? 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: typeLabel,
    },
    areaServed: listing.state ?? "United States",
  };
}
