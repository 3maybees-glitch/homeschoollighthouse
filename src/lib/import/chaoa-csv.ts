import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type ChaoaCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function chaoaRowToSeedInput(row: ChaoaCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Christian Academy of America resource: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: inferListingType(row.title, row.description, row.website_url),
    format: inferFormat(row.title, row.description, row.website_url),
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
      "Accredited Christian homeschool program from Christian Academy of America.",
  };
}

function inferListingType(title: string, description: string, url: string): ListingType {
  const text = `${title} ${description} ${url}`.toLowerCase();
  if (text.includes("dual enrollment") || text.includes("online program") || text.includes("/online/")) {
    return "online_course";
  }
  if (text.includes("tuition") || text.includes("program") || text.includes("course")) {
    return "online_course";
  }
  if (text.includes("t-shirt") || text.includes("mug") || text.includes("diploma package")) {
    return "supplement";
  }
  return "curriculum";
}

function inferFormat(title: string, description: string, url: string): ListingFormat {
  const text = `${title} ${description} ${url}`.toLowerCase();
  if (text.includes("workbook")) return "hybrid";
  if (text.includes("online") || text.includes("ignitia") || text.includes("monarch")) {
    return "online";
  }
  return "hybrid";
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("math") || text.includes("algebra") || text.includes("geometry")) {
    subjects.push("math");
  }
  if (text.includes("science") || text.includes("biology") || text.includes("chemistry")) {
    subjects.push("science");
  }
  if (
    text.includes("history") ||
    text.includes("geography") ||
    text.includes("government") ||
    text.includes("economics")
  ) {
    subjects.push("history");
  }
  if (text.includes("english") || text.includes("literature") || text.includes("reading")) {
    subjects.push("reading");
  }
  if (
    text.includes("language arts") ||
    text.includes("writing") ||
    text.includes("grammar") ||
    text.includes("speech")
  ) {
    subjects.push("language_arts");
  }
  if (text.includes("bible") || text.includes("theology") || text.includes("testament")) {
    subjects.push("history");
  }
  if (text.includes("art") || text.includes("music") || text.includes("film")) {
    subjects.push("art");
  }

  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
