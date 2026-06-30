import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type BjupressCsvRow = {
  title: string;
  website_url: string;
  source: string;
  category_url: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function bjupressRowToSeedInput(row: BjupressCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `BJU Press product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: "hybrid" as ListingFormat,
    priceType: row.prices_mentioned.toLowerCase().includes("free") ? "free" : priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["religious"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description, row.category_url),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Christian homeschool curriculum from BJU Press.",
  };
}

function inferSubjects(title: string, description: string, categoryUrl: string) {
  const text = `${title} ${description} ${categoryUrl}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math") || text.includes("algebra") || text.includes("geometry")) {
    subjects.push("math");
  }
  if (text.includes("science") || text.includes("biology") || text.includes("chemistry")) {
    subjects.push("science");
  }
  if (
    text.includes("heritage") ||
    text.includes("social-studies") ||
    text.includes("history") ||
    text.includes("geography") ||
    text.includes("government") ||
    text.includes("economics")
  ) {
    subjects.push("history");
  }
  if (text.includes("reading") || text.includes("literature")) subjects.push("reading");
  if (
    text.includes("writing") ||
    text.includes("grammar") ||
    text.includes("english") ||
    text.includes("spelling") ||
    text.includes("handwriting") ||
    text.includes("vocabulary")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("spanish") || text.includes("latin") || text.includes("foreign-language")) {
    subjects.push("foreign_language");
  }
  if (text.includes("bible") || text.includes("biblical")) subjects.push("electives");
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");
  if (text.includes("test") || text.includes("iowa") || text.includes("stanford")) {
    subjects.push("electives");
  }

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
