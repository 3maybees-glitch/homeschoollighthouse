import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type Tied2TeachingCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function tied2TeachingRowToSeedInput(row: Tied2TeachingCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Tied 2 Teaching resource: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "supplement" as ListingType,
    format: "online" as ListingFormat,
    priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic", "secular"],
    values: ["parent_led", "tech_friendly"],
    religions: ["secular"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Upper elementary homeschool resource from Tied 2 Teaching.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("math")) subjects.push("math");
  if (text.includes("science") || text.includes("stem")) subjects.push("science");
  if (text.includes("reading") || text.includes("ela") || text.includes("language")) {
    subjects.push("reading");
    subjects.push("language_arts");
  }
  if (text.includes("writing")) subjects.push("writing");
  if (text.includes("social studies") || text.includes("history")) subjects.push("history");
  if (text.includes("art")) subjects.push("art");
  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
