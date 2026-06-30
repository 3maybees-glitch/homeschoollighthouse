import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type OakMeadowCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function oakMeadowRowToSeedInput(row: OakMeadowCsvRow) {
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
    philosophies: ["waldorf", "eclectic"],
    values: ["parent_led"],
    religions: ["secular"],
    subjects: inferSubjects(row.title),
    description: [row.description?.trim(), `Oak Meadow resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Creative Waldorf-inspired homeschool curriculum from Oak Meadow.",
  };
}

function inferListingType(title: string, url: string): ListingType {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("tutor") || text.includes("support")) return "tutor";
  if (text.includes("evaluation") || text.includes("portfolio")) return "supplement";
  return "curriculum";
}

function inferFormat(url: string): ListingFormat {
  return url.includes("shop.oakmeadow.com") ? "hybrid" : "hybrid";
}

function inferPriceType(prices: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  if (prices.toLowerCase().includes("contact")) return "contact";
  return parsed;
}

function inferSubjects(title: string) {
  const text = title.toLowerCase();
  if (text.includes("math")) return ["math"];
  if (text.includes("language") || text.includes("writing")) return ["language_arts"];
  if (text.includes("science")) return ["science"];
  return ["electives"];
}
