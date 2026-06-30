import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type GoodAndBeautifulCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function goodAndBeautifulRowToSeedInput(row: GoodAndBeautifulCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `The Good and the Beautiful product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.description),
    format: inferFormat(row.title, row.description),
    priceType: row.prices_mentioned.toLowerCase().includes("free") ? "free" : priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["charlotte_mason", "religious"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Charlotte Mason-inspired Christian homeschool curriculum from The Good and the Beautiful.",
  };
}

function inferListingType(title: string, description: string): ListingType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("typing") || text.includes("online course") || text.includes("subscription")) {
    return "online_course";
  }
  return "curriculum";
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("pdf") && !text.includes("physical")) return "online";
  if (text.includes("online") || text.includes("typing") || text.includes("subscription")) {
    return "online";
  }
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math") || text.includes("arithmetic") || text.includes("pre-algebra")) {
    subjects.push("math");
  }
  if (text.includes("science") || text.includes("nature") || text.includes("biology")) {
    subjects.push("science");
  }
  if (text.includes("history") || text.includes("geography")) subjects.push("history");
  if (
    text.includes("reading") ||
    text.includes("literature") ||
    text.includes("bookshop") ||
    text.includes("library")
  ) {
    subjects.push("reading");
  }
  if (
    text.includes("language arts") ||
    text.includes("writing") ||
    text.includes("spelling") ||
    text.includes("grammar") ||
    text.includes("handwriting") ||
    text.includes("phonics")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("typing")) subjects.push("language_arts");
  if (text.includes("art") || text.includes("draw")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
