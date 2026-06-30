import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type VeritasPressCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function veritasPressRowToSeedInput(row: VeritasPressCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.website_url),
    format: "online" as ListingFormat,
    priceType: inferPriceType(row.prices_mentioned, priceType),
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["classical", "religious"],
    values: ["self_paced", "tech_friendly"],
    religions: ["christian"],
    subjects: inferSubjects(row.title),
    description: [row.description?.trim(), `Veritas Press resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Classical Christian curriculum from Veritas Press.",
  };
}

function inferListingType(title: string, url: string): ListingType {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("live") || text.includes("academy")) return "online_course";
  if (text.includes("self-paced") || text.includes("selfpaced")) return "online_course";
  return "curriculum";
}

function inferPriceType(prices: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  if (prices.toLowerCase().includes("contact")) return "contact";
  if (prices.includes("/course")) return "one_time";
  return parsed;
}

function inferSubjects(title: string) {
  const text = title.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("history") || text.includes("omnibus")) subjects.push("history");
  if (text.includes("bible")) subjects.push("reading");
  if (text.includes("grammar") || text.includes("rhetoric") || text.includes("latin")) {
    subjects.push("language_arts");
  }
  if (text.includes("math")) subjects.push("math");
  if (text.includes("art") || text.includes("draw")) subjects.push("art");
  if (!subjects.length) subjects.push("electives");
  return subjects;
}
