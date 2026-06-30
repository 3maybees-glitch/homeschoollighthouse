import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type AllAboutLearningCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function allAboutLearningRowToSeedInput(row: AllAboutLearningCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: "hybrid" as ListingFormat,
    priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic"],
    values: ["parent_led", "neurodivergent_friendly"],
    religions: ["secular"],
    subjects: inferSubjects(row.title),
    description: [row.description?.trim(), `All About Learning Press product: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Orton-Gillingham reading and spelling from All About Learning Press.",
  };
}

function inferSubjects(title: string) {
  const text = title.toLowerCase();
  if (text.includes("spelling")) return ["language_arts"];
  if (text.includes("reading")) return ["reading"];
  if (text.includes("math")) return ["math"];
  if (text.includes("homophone")) return ["language_arts"];
  return ["language_arts"];
}
