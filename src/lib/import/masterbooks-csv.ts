import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type MasterBooksCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function masterbooksRowToSeedInput(row: MasterBooksCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Master Books product: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.description),
    format: inferFormat(row.title, row.description),
    priceType: row.prices_mentioned.toLowerCase().includes("free") ? "free" : priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["charlotte_mason", "religious"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Charlotte Mason-inspired Christian homeschool curriculum from Master Books.",
  };
}

function inferListingType(title: string, description: string): ListingType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("dvd") || text.includes("video") || text.includes("online course")) {
    return "online_course";
  }
  return "curriculum";
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("ebook") || text.includes("digital") || text.includes("pdf")) {
    return "online";
  }
  if (text.includes("dvd") || text.includes("video")) return "online";
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math") || text.includes("arithmetic") || text.includes("algebra")) {
    subjects.push("math");
  }
  if (
    text.includes("science") ||
    text.includes("biology") ||
    text.includes("chemistry") ||
    text.includes("physics") ||
    text.includes("creation")
  ) {
    subjects.push("science");
  }
  if (text.includes("history") || text.includes("geography") || text.includes("timeline")) {
    subjects.push("history");
  }
  if (
    text.includes("reading") ||
    text.includes("literature") ||
    text.includes("book") ||
    text.includes("reader")
  ) {
    subjects.push("reading");
  }
  if (
    text.includes("language arts") ||
    text.includes("writing") ||
    text.includes("spelling") ||
    text.includes("grammar") ||
    text.includes("handwriting") ||
    text.includes("language lessons") ||
    text.includes("writing strands")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
