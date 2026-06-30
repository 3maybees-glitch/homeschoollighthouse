import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type TeachingTextbooksCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function teachingTextbooksRowToSeedInput(row: TeachingTextbooksCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "online_course" as ListingType,
    format: "online" as ListingFormat,
    priceType: row.prices_mentioned.includes("/year") ? "subscription" : priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic"],
    values: ["self_paced", "tech_friendly"],
    religions: ["secular", "christian"],
    subjects: ["math"],
    description: [row.description?.trim(), `Teaching Textbooks resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Computer-based homeschool math from Teaching Textbooks.",
  };
}
