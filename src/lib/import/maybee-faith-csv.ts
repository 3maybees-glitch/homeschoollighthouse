import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type MaybeeFaithCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function maybeeFaithRowToSeedInput(row: MaybeeFaithCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Maybee Creations Faith product: ${row.website_url}` : "",
    "Catalog: https://maybeecreations.com/faith",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").replace(/®/g, "").trim(),
    listingType: "supplement" as ListingType,
    format: "online" as ListingFormat,
    priceType: row.prices_mentioned ? priceType : "contact",
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["charlotte_mason", "religious"],
    values: ["parent_led", "tech_friendly"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Printable Bible discovery map and Soul Explorer guide from Maybee Creations.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (
    text.includes("bible") ||
    text.includes("gospel") ||
    text.includes("scripture") ||
    text.includes("testament") ||
    text.includes("prophet") ||
    text.includes("church") ||
    text.includes("revelation")
  ) {
    subjects.push("history");
    subjects.push("electives");
  }
  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
