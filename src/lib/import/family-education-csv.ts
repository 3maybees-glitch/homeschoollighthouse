import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type FamilyEducationCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function familyEducationRowToSeedInput(row: FamilyEducationCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "free") as PriceType;

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "support_group" as ListingType,
    format: "online" as ListingFormat,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ['eclectic'],
    religions: ['secular'],
    subjects: ["electives"],
    description: [row.description?.trim(), `FamilyEducation resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription:
      row.description?.slice(0, 120) || "FamilyEducation homeschool resource.",
  };
}
