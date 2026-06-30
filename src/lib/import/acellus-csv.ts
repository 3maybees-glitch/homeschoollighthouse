import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type AcellusCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function acellusRowToSeedInput(row: AcellusCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Power Homeschool / Acellus resource: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.description, row.website_url),
    format: "online" as ListingFormat,
    priceType: inferPriceType(row.prices_mentioned, priceType),
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic"],
    values: ["self_paced", "tech_friendly"],
    religions: ["secular"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Online video courses from Power Homeschool and Acellus Academy.",
  };
}

function inferListingType(title: string, description: string, url: string): ListingType {
  const text = `${title} ${description} ${url}`.toLowerCase();
  if (text.includes("subscription") || text.includes("plan") || text.includes("diploma")) {
    return "online_course";
  }
  return "online_course";
}

function inferPriceType(pricesMentioned: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  const lower = pricesMentioned.toLowerCase();
  if (lower.includes("/mo") || lower.includes("/month")) return "subscription";
  return parsed;
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math")) subjects.push("math");
  if (text.includes("science") || text.includes("biology") || text.includes("chemistry")) {
    subjects.push("science");
  }
  if (text.includes("history") || text.includes("social studies") || text.includes("government")) {
    subjects.push("history");
  }
  if (
    text.includes("reading") ||
    text.includes("language arts") ||
    text.includes("english") ||
    text.includes("writing") ||
    text.includes("spelling")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("spanish") || text.includes("french") || text.includes("sign language")) {
    subjects.push("foreign_language");
  }
  if (text.includes("music")) subjects.push("music");
  if (text.includes("art")) subjects.push("art");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
