import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type MaybeeFreedomCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function maybeeFreedomRowToSeedInput(row: MaybeeFreedomCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Maybee Creations Freedom product: ${row.website_url}` : "",
    "Catalog: https://maybeecreations.com/freedom",
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
    philosophies: ["classical", "eclectic"],
    values: ["parent_led", "tech_friendly"],
    religions: ["secular", "christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Printable civics and history discovery map from Maybee Creations Liberty Explorer.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (
    text.includes("constitution") ||
    text.includes("founding") ||
    text.includes("president") ||
    text.includes("republic") ||
    text.includes("liberty") ||
    text.includes("war") ||
    text.includes("history") ||
    text.includes("america")
  ) {
    subjects.push("history");
  }
  if (text.includes("civic") || text.includes("government") || text.includes("constitution")) {
    subjects.push("electives");
  }
  if (!subjects.length) subjects.push("history");
  return [...new Set(subjects)];
}
