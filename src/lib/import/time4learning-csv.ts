import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type Time4LearningCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function time4learningRowToSeedInput(row: Time4LearningCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Time4Learning product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.description, row.website_url),
    format: inferFormat(row.title, row.description),
    priceType: inferPriceType(row.title, row.description, row.prices_mentioned, priceType),
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["secular"],
    values: ["self_paced", "tech_friendly"],
    religions: ["secular"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Online homeschool curriculum and courses from Time4Learning.",
  };
}

function inferListingType(title: string, description: string, url: string): ListingType {
  const text = `${title} ${description} ${url}`.toLowerCase();
  if (text.includes("curriculum") || text.includes("elective") || text.includes("brightspire")) {
    return "online_course";
  }
  if (text.includes("book bundle") || text.includes("paperback") || text.includes("hardcover")) {
    return "supplement";
  }
  return "curriculum";
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("book") || text.includes("paperback") || text.includes("hardcover")) {
    return "hybrid";
  }
  return "online";
}

function inferPriceType(
  title: string,
  description: string,
  pricesMentioned: string,
  parsed: ReturnType<typeof parsePrices>["priceType"],
) {
  const text = `${title} ${description} ${pricesMentioned}`.toLowerCase();
  if (text.includes("free")) return "free";
  if (text.includes("curriculum") && pricesMentioned.includes("$39.95")) {
    return "subscription";
  }
  return parsed;
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math")) subjects.push("math");
  if (text.includes("science") || text.includes("biology") || text.includes("chemistry")) {
    subjects.push("science");
  }
  if (text.includes("history") || text.includes("geography") || text.includes("social studies")) {
    subjects.push("history");
  }
  if (
    text.includes("reading") ||
    text.includes("literature") ||
    text.includes("language arts") ||
    text.includes("english")
  ) {
    subjects.push("reading");
  }
  if (text.includes("writing") || text.includes("grammar") || text.includes("spelling")) {
    subjects.push("language_arts");
  }
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");
  if (text.includes("language") || text.includes("spanish") || text.includes("french")) {
    subjects.push("language_arts");
  }

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
