import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type BridgewayCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function bridgewayRowToSeedInput(row: BridgewayCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Bridgeway Academy resource: ${row.website_url}` : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "online_course" as ListingType,
    format: inferFormat(row.title, row.description),
    priceType: inferPriceType(row.prices_mentioned, priceType),
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic"],
    values: ["parent_led"],
    religions: ["secular", "christian"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "Accredited homeschool programs from Bridgeway Academy.",
  };
}

function inferFormat(title: string, description: string): ListingFormat {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("live online")) return "online";
  return "hybrid";
}

function inferPriceType(pricesMentioned: string, parsed: ReturnType<typeof parsePrices>["priceType"]) {
  const lower = pricesMentioned.toLowerCase();
  if (lower.includes("contact")) return "contact";
  if (lower.includes("/yr") || lower.includes("/year")) return "one_time";
  return parsed;
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("early years") || text.includes("preschool")) {
    subjects.push("reading");
  }
  if (text.includes("dual enrollment")) subjects.push("electives");
  if (!subjects.length) subjects.push("electives");
  return subjects;
}
