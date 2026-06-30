import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type ClassicalConversationsCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function classicalConversationsRowToSeedInput(row: ClassicalConversationsCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.website_url),
    format: inferFormat(row.website_url),
    priceType: inferPriceType(row.prices_mentioned, priceType),
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["classical", "religious"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title),
    description: [row.description?.trim(), `Classical Conversations resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Classical Christian homeschool community programs.",
  };
}

function inferListingType(title: string, url: string): ListingType {
  if (url.includes("classicalconversationsbooks.com")) return "curriculum";
  if (title.toLowerCase().includes("challenge") || title.toLowerCase().includes("foundations")) {
    return "coop";
  }
  return "coop";
}

function inferFormat(url: string): ListingFormat {
  return url.includes("classicalconversationsbooks.com") ? "hybrid" : "in_person";
}

function inferPriceType(prices: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  if (prices.toLowerCase().includes("contact")) return "contact";
  return parsed;
}

function inferSubjects(title: string) {
  const text = title.toLowerCase();
  if (text.includes("latin")) return ["foreign_language"];
  if (text.includes("math")) return ["math"];
  return ["electives"];
}
