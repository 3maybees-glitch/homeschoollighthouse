import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type TimberdoodleCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function timberdoodleRowToSeedInput(row: TimberdoodleCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Timberdoodle product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.description),
    format: "hybrid" as ListingFormat,
    priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic"],
    values: ["gifted", "parent_led"],
    religions: inferReligions(row.title, row.description),
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Hands-on homeschool curriculum kits and resources from Timberdoodle.",
  };
}

function inferListingType(title: string, description: string): ListingType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("kit") || text.includes("curriculum")) return "curriculum";
  return "supplement";
}

function inferReligions(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("nonreligious") || text.includes("non-religious")) {
    return ["secular"];
  }
  return ["secular", "christian"];
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math")) subjects.push("math");
  if (text.includes("science")) subjects.push("science");
  if (text.includes("history")) subjects.push("history");
  if (
    text.includes("reading") ||
    text.includes("language") ||
    text.includes("spelling") ||
    text.includes("writing")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
