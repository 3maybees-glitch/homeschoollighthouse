import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type AopCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function aopRowToSeedInput(row: AopCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Alpha Omega Publications product: ${row.website_url}` : "",
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
    philosophies: ["religious"],
    values: ["parent_led"],
    religions: ["christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Christian homeschool curriculum from Alpha Omega Publications (LIFEPAC, Monarch, Horizons).",
  };
}

function inferListingType(title: string, description: string): ListingType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("monarch") || text.includes("online") || text.includes("subscription")) {
    return "online_course";
  }
  if (text.includes("ignite christian academy") || text.includes("academy")) {
    return "online_course";
  }
  return "curriculum";
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("monarch") || text.includes("online") || text.includes("digital")) {
    return "online";
  }
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math")) subjects.push("math");
  if (text.includes("science")) subjects.push("science");
  if (
    text.includes("history") ||
    text.includes("geography") ||
    text.includes("bible") ||
    text.includes("theology") ||
    text.includes("old testament") ||
    text.includes("new testament")
  ) {
    subjects.push("history");
  }
  if (
    text.includes("reader") ||
    text.includes("literature") ||
    text.includes("read-aloud") ||
    text.includes("english")
  ) {
    subjects.push("reading");
  }
  if (
    text.includes("language arts") ||
    text.includes("writing") ||
    text.includes("spelling") ||
    text.includes("grammar") ||
    text.includes("handwriting") ||
    text.includes("phonics")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("art")) subjects.push("art");
  if (text.includes("music")) subjects.push("music");

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
