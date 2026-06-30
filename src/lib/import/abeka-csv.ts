import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type AbekaCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function abekaRowToSeedInput(row: AbekaCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Abeka product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "curriculum" as ListingType,
    format: inferFormat(row.title, row.description),
    priceType: row.prices_mentioned.toLowerCase().includes("free") ? "free" : priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["religious", "classical"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Christian homeschool curriculum from Abeka.",
  };
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("video") || text.includes("digital") || text.includes("e-text")) {
    return "online";
  }
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("arithmetic") || text.includes("math") || text.includes("algebra")) {
    subjects.push("math");
  }
  if (text.includes("science") || text.includes("health") || text.includes("biology")) {
    subjects.push("science");
  }
  if (
    text.includes("history") ||
    text.includes("geography") ||
    text.includes("heritage") ||
    text.includes("civics")
  ) {
    subjects.push("history");
  }
  if (text.includes("reading") || text.includes("literature") || text.includes("readers")) {
    subjects.push("reading");
  }
  if (
    text.includes("language") ||
    text.includes("grammar") ||
    text.includes("spelling") ||
    text.includes("writing") ||
    text.includes("penmanship") ||
    text.includes("phonics")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("spanish") || text.includes("french") || text.includes("foreign")) {
    subjects.push("foreign_language");
  }
  if (text.includes("bible")) subjects.push("electives");
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
