import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices, normalizeHost } from "@/lib/import/thsm-csv";

export type HomeschoolComCsvRow = {
  title: string;
  website_url: string;
  homeschool_com_url: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export { normalizeHost };

function inferListingType(title: string, url: string, description: string): ListingType {
  const haystack = `${title} ${url} ${description}`.toLowerCase();
  if (haystack.includes("co-op") || haystack.includes("coop")) return "coop";
  if (haystack.includes("support group")) return "support_group";
  if (haystack.includes("tutor")) return "tutor";
  if (
    haystack.includes("academy") ||
    haystack.includes("online school") ||
    haystack.includes("virtual school")
  ) {
    return "online_course";
  }
  return "curriculum";
}

function inferFormat(title: string, listingType: ListingType, description: string): ListingFormat {
  const haystack = `${title} ${description}`.toLowerCase();
  if (listingType === "online_course") return "online";
  if (haystack.includes("online") || haystack.includes("virtual")) return "online";
  if (haystack.includes("in person") || haystack.includes("co-op")) return "in_person";
  return "hybrid";
}

function inferReligions(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes("christian") ||
    text.includes("biblical") ||
    text.includes("faith-based") ||
    text.includes("apologia")
  ) {
    return ["christian"];
  }
  if (text.includes("catholic")) return ["catholic"];
  if (text.includes("secular")) return ["secular"];
  return ["secular"];
}

function inferSubjects(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];
  if (text.includes("math")) subjects.push("math");
  if (text.includes("reading") || text.includes("language") || text.includes("phonics")) {
    subjects.push("language_arts");
  }
  if (text.includes("science")) subjects.push("science");
  if (text.includes("history") || text.includes("social studies")) subjects.push("history");
  return subjects;
}

function parsePriceType(prices: string): PriceType {
  const lower = prices.toLowerCase();
  if (!prices.trim() || lower.includes("varies") || lower.includes("contact")) return "contact";
  if (lower.includes("free")) return "free";
  const { priceType } = parsePrices(prices);
  return priceType;
}

export function homeschoolComRowToSeedInput(row: HomeschoolComCsvRow) {
  const listingType = inferListingType(row.title, row.website_url, row.description);
  const format = inferFormat(row.title, listingType, row.description);
  const priceType = parsePriceType(row.prices_mentioned);
  const { priceMin, priceMax } =
    priceType === "contact" || priceType === "free"
      ? { priceMin: null, priceMax: null }
      : parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const religions = inferReligions(row.title, row.description);
  const subjects = inferSubjects(row.title, row.description);

  const descriptionParts = [
    row.description?.trim(),
    row.homeschool_com_url
      ? `Featured on Homeschool.com Curriculum Finder: ${row.homeschool_com_url}`
      : "",
  ].filter(Boolean);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType,
    format,
    priceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: religions.includes("christian") ? ["religious", "eclectic"] : ["eclectic"],
    values: format === "online" ? ["self_paced", "tech_friendly"] : [],
    religions,
    subjects,
    description: descriptionParts.join(" "),
    shortDescription:
      row.description?.slice(0, 120) ||
      `Homeschool resource listed on Homeschool.com Curriculum Finder.`,
  };
}
