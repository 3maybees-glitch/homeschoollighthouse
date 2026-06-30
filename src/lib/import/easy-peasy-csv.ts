import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange } from "@/lib/import/thsm-csv";

export type EasyPeasyCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function easyPeasyRowToSeedInput(row: EasyPeasyCsvRow) {
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.website_url),
    format: "online" as ListingFormat,
    priceType: "free" as PriceType,
    priceMin: null,
    priceMax: null,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic", "religious"],
    values: ["self_paced", "tech_friendly"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.website_url),
    description: [row.description?.trim(), `Easy Peasy All-in-One resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Free complete homeschool curriculum from Easy Peasy.",
  };
}

function inferListingType(title: string, url: string): ListingType {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("getting ready") || text.includes("preschool")) return "curriculum";
  return "online_course";
}

function inferSubjects(title: string, url: string) {
  const text = `${title} ${url}`.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("math")) subjects.push("math");
  if (text.includes("reading") || text.includes("language")) subjects.push("language_arts");
  if (text.includes("science")) subjects.push("science");
  if (text.includes("history")) subjects.push("history");
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");
  if (text.includes("computer")) subjects.push("electives");
  if (!subjects.length) subjects.push("electives");
  return subjects;
}
