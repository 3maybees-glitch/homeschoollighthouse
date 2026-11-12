import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type GoodandbeautifulCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function goodandbeautifulRowToSeedInput(row: GoodandbeautifulCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "one_time") as PriceType;

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: "hybrid" as ListingFormat,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["charlotte_mason", "religious"],
    religions: ["christian"],
    subjects: ["language_arts"],
    description: [row.description?.trim(), `The Good and the Beautiful resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription:
      row.description?.slice(0, 120) || "Faith-based curriculum from The Good and the Beautiful.",
  };
}
