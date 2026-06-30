import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type DriveThruHistoryCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function driveThruHistoryRowToSeedInput(row: DriveThruHistoryCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Drive Thru History product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").replace(/®/g, "").trim(),
    listingType: inferListingType(row.title, row.description) as ListingType,
    format: inferFormat(row.title, row.description) as ListingFormat,
    priceType: row.prices_mentioned ? priceType : "contact",
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["classical", "religious"],
    values: ["parent_led", "tech_friendly"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "History and Bible video curriculum from Drive Thru History with Dave Stotts.",
  };
}

function inferListingType(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("adventures") || text.includes("subscription")) return "online_course";
  if (text.includes("t-shirt") || text.includes("map")) return "supplement";
  return "curriculum";
}

function inferFormat(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("adventures") || text.includes("online")) return "online";
  if (text.includes("dvd") || text.includes("special edition")) return "hybrid";
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (
    text.includes("gospel") ||
    text.includes("bible") ||
    text.includes("acts") ||
    text.includes("revelation") ||
    text.includes("christian")
  ) {
    subjects.push("history");
    subjects.push("electives");
  } else if (text.includes("history") || text.includes("america") || text.includes("ancient")) {
    subjects.push("history");
  }
  if (!subjects.length) subjects.push("history");
  return [...new Set(subjects)];
}
