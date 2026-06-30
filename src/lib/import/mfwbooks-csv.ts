import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type MfwBooksCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function mfwbooksRowToSeedInput(row: MfwBooksCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `My Father's World product: ${row.website_url}` : "",
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
    philosophies: ["charlotte_mason", "classical", "unit_studies", "religious"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Charlotte Mason and classical Christian unit-study curriculum from My Father's World.",
  };
}

function inferListingType(title: string, description: string): ListingType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("coaching") || text.includes("online")) return "online_course";
  return "curriculum";
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("digital") || text.includes("online")) return "online";
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math")) subjects.push("math");
  if (text.includes("science")) subjects.push("science");
  if (text.includes("history") || text.includes("geography") || text.includes("bible")) {
    subjects.push("history");
  }
  if (
    text.includes("reader") ||
    text.includes("literature") ||
    text.includes("read-aloud") ||
    text.includes("book")
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
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
