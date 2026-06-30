import type { ListingFormat, ListingType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type MaybeeFutureCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function maybeeFutureRowToSeedInput(row: MaybeeFutureCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);

  const descriptionParts = [
    row.description?.trim(),
    row.website_url ? `Maybee Creations Future product: ${row.website_url}` : "",
    "Catalog: https://maybeecreations.com/future",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").replace(/®/g, "").trim(),
    listingType: "supplement" as ListingType,
    format: "online" as ListingFormat,
    priceType: row.prices_mentioned ? priceType : "contact",
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["eclectic", "secular"],
    values: ["parent_led", "tech_friendly", "self_paced"],
    religions: ["secular"],
    subjects: inferSubjects(row.title, row.description),
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      "AI literacy discovery map or Adventure Pack from Maybee Creations Tomorrow Explorer.",
  };
}

function inferSubjects(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (
    text.includes("ai") ||
    text.includes("chatgpt") ||
    text.includes("claude") ||
    text.includes("gemini") ||
    text.includes("coding") ||
    text.includes("llm")
  ) {
    subjects.push("electives");
  }
  if (!subjects.length) subjects.push("electives");
  return [...new Set(subjects)];
}
