import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type RamseySolutionsCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function ramseySolutionsRowToSeedInput(row: RamseySolutionsCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "one_time") as PriceType;

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: "online" as ListingFormat,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ['religious'],
    religions: ['christian'],
    subjects: ['electives'],
    description: [row.description?.trim(), `Ramsey Solutions resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription:
      row.description?.slice(0, 120) || "Ramsey Solutions homeschool resource.",
  };
}
