import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type SonlightCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function sonlightRowToSeedInput(row: SonlightCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Sonlight product: ${row.website_url}` : "",
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
      "Literature-based Christian homeschool curriculum from Sonlight.",
  };
}

function inferListingType(title: string, description: string): ListingType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("instructor") && text.includes("guide")) return "curriculum";
  if (text.includes("all-subjects package") || text.includes("all subjects package")) {
    return "curriculum";
  }
  if (text.includes("online") || text.includes("video")) return "online_course";
  return "curriculum";
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("digital") || text.includes("video") || text.includes("online")) {
    return "online";
  }
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math")) subjects.push("math");
  if (text.includes("science")) subjects.push("science");
  if (
    text.includes("history") ||
    text.includes("geography") ||
    text.includes("bible") ||
    text.includes("hbl")
  ) {
    subjects.push("history");
  }
  if (
    text.includes("reader") ||
    text.includes("read-aloud") ||
    text.includes("literature") ||
    text.includes("book")
  ) {
    subjects.push("reading");
  }
  if (
    text.includes("language arts") ||
    text.includes("writing") ||
    text.includes("spelling") ||
    text.includes("phonics") ||
    text.includes("handwriting") ||
    text.includes("vocabulary")
  ) {
    subjects.push("language_arts");
  }

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
