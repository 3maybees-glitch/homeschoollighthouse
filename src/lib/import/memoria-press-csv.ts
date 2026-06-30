import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type MemoriaPressCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function memoriaPressRowToSeedInput(row: MemoriaPressCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.website_url),
    format: inferFormat(row.title, row.website_url),
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
    description: [row.description?.trim(), `Memoria Press product: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Classical Christian curriculum from Memoria Press.",
  };
}

function inferListingType(title: string, url: string): ListingType {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("online academy") || text.includes("memoria academy")) return "online_course";
  return "curriculum";
}

function inferFormat(title: string, url: string): ListingFormat {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("online") || text.includes("academy")) return "online";
  return "hybrid";
}

function inferPriceType(prices: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  if (prices.toLowerCase().includes("contact")) return "contact";
  return parsed;
}

function inferSubjects(title: string) {
  const text = title.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("latin") || text.includes("greek")) subjects.push("foreign_language");
  if (text.includes("math") || text.includes("algebra")) subjects.push("math");
  if (text.includes("history")) subjects.push("history");
  if (text.includes("literature") || text.includes("grammar") || text.includes("writing")) {
    subjects.push("language_arts");
  }
  if (!subjects.length) subjects.push("electives");
  return subjects;
}
