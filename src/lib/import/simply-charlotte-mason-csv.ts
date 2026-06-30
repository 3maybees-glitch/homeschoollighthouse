import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type SimplyCharlotteMasonCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function simplyCharlotteMasonRowToSeedInput(row: SimplyCharlotteMasonCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Simply Charlotte Mason product: ${row.website_url}` : "",
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
    philosophies: ["charlotte_mason"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Charlotte Mason homeschool curriculum from Simply Charlotte Mason.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("math")) subjects.push("math");
  if (text.includes("science") || text.includes("nature study")) subjects.push("science");
  if (text.includes("history") || text.includes("geography")) subjects.push("history");
  if (text.includes("literature") || text.includes("reading")) subjects.push("reading");
  if (text.includes("writing") || text.includes("language")) subjects.push("language_arts");
  if (text.includes("art") || text.includes("picture study")) subjects.push("art");
  if (text.includes("music") || text.includes("composer")) subjects.push("music");
  if (text.includes("bible")) subjects.push("electives");
  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
