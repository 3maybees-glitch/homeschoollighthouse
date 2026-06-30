import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type TheoryTimeCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function theoryTimeRowToSeedInput(row: TheoryTimeCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Theory Time product: ${row.website_url}` : "",
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
    philosophies: ["classical", "eclectic"],
    values: ["parent_led"],
    religions: ["secular"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Music theory curriculum and resources from Theory Time.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (
    text.includes("music") ||
    text.includes("theory") ||
    text.includes("piano") ||
    text.includes("clef") ||
    text.includes("rhythm") ||
    text.includes("composer")
  ) {
    subjects.push("music");
  }
  if (text.includes("history") || text.includes("egypt") || text.includes("civilization")) {
    subjects.push("history");
  }
  if (!subjects.length) subjects.push("music");
  return [...new Set(subjects)];
}
