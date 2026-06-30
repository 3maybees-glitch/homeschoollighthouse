import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type IxlCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function ixlRowToSeedInput(row: IxlCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `IXL resource: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "online_course" as ListingType,
    format: "online" as ListingFormat,
    priceType: inferPriceType(row.prices_mentioned, priceType),
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["secular", "eclectic"],
    values: ["self_paced", "tech_friendly"],
    religions: ["secular"],
    subjects: inferSubjects(row.title, row.description, row.website_url),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) || "Adaptive practice and mastery from IXL Learning.",
  };
}

function inferPriceType(pricesMentioned: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  const lower = pricesMentioned.toLowerCase();
  if (lower.includes("/mo") || lower.includes("/month") || lower.includes("membership")) {
    return "subscription";
  }
  return parsed;
}

function inferSubjects(title: string, description: string, url: string) {
  const text = `${title} ${description} ${url}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math") || url.includes("/math/")) subjects.push("math");
  if (text.includes("science") || url.includes("/science/")) subjects.push("science");
  if (text.includes("social studies") || url.includes("/social-studies/")) {
    subjects.push("history");
  }
  if (
    text.includes("language arts") ||
    text.includes("reading") ||
    text.includes("writing") ||
    text.includes("grammar") ||
    url.includes("/ela/")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("spanish") || url.includes("/spanish/")) subjects.push("foreign_language");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
