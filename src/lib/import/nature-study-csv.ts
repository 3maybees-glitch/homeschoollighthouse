import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type NatureStudyCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function natureStudyRowToSeedInput(row: NatureStudyCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "free") as PriceType;

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "supplement" as ListingType,
    format: "online" as ListingFormat,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ['charlotte_mason'],
    religions: ['secular'],
    subjects: ['science'],
    description: [row.description?.trim(), `Nature Study Resources resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription:
      row.description?.slice(0, 120) || "Nature Study Resources homeschool resource.",
  };
}
