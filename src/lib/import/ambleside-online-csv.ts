import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type AmblesideOnlineCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function amblesideOnlineRowToSeedInput(row: AmblesideOnlineCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: "online" as ListingFormat,
    priceType: row.prices_mentioned.toLowerCase().includes("free") ? "free" : priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["charlotte_mason"],
    values: ["parent_led", "screen_free"],
    religions: ["christian"],
    subjects: inferSubjects(row.title),
    description: [row.description?.trim(), `AmblesideOnline resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Free Charlotte Mason curriculum from AmblesideOnline.",
  };
}

function inferSubjects(title: string) {
  const text = title.toLowerCase();
  if (text.includes("book")) return ["reading"];
  if (text.includes("year")) return ["history", "reading"];
  return ["reading"];
}
