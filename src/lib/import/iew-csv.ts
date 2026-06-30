import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type IewCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function iewRowToSeedInput(row: IewCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `IEW product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: "hybrid" as ListingFormat,
    priceType: row.prices_mentioned ? priceType : "contact",
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["classical"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Writing and language arts curriculum from Institute for Excellence in Writing.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("writing") || text.includes("essay")) subjects.push("writing");
  if (text.includes("spelling") || text.includes("phonics")) subjects.push("language_arts");
  if (text.includes("grammar")) subjects.push("language_arts");
  if (text.includes("history")) subjects.push("history");
  if (text.includes("literature") || text.includes("poetry")) subjects.push("reading");
  if (text.includes("speaking")) subjects.push("electives");
  if (!subjects.length) subjects.push("writing");
  return [...new Set(subjects)];
}
