import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type CltexamCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

function inferListingType(url: string, title: string, description: string): ListingType {
  const haystack = `${url} ${title} ${description}`.toLowerCase();

  if (haystack.includes("scholarship") || haystack.includes("student award")) {
    return "scholarship";
  }

  if (
    haystack.includes("clt") ||
    haystack.includes("classic learning test") ||
    haystack.includes("practice test") ||
    haystack.includes("test prep") ||
    haystack.includes("register") ||
    haystack.includes("standardized") ||
    haystack.includes("testing") ||
    haystack.includes("accommodation") ||
    haystack.includes("proctor") ||
    haystack.includes("exam")
  ) {
    return "standardized_test";
  }

  if (haystack.includes("college") || haystack.includes("higher ed")) {
    return "supplement";
  }

  return "standardized_test";
}

function inferTestSubjects(title: string, description: string, url: string): string[] {
  const haystack = `${title} ${description} ${url}`.toLowerCase();
  const subjects = new Set<string>(["standardized_testing", "clt"]);

  if (haystack.includes("clt10") || haystack.includes("clt-10") || haystack.includes("clt 10")) {
    subjects.add("clt");
  }
  if (haystack.includes("clt8") || haystack.includes("clt-8") || haystack.includes("clt 8")) {
    subjects.add("clt");
  }
  if (haystack.includes("psat")) {
    subjects.add("psat");
  }
  if (haystack.includes("sat") && !haystack.includes("consolidat")) {
    subjects.add("sat");
  }
  if (/\bact\b/.test(haystack)) {
    subjects.add("act");
  }

  return Array.from(subjects);
}

function inferFormat(listingType: ListingType, url: string): ListingFormat {
  if (listingType === "scholarship") return "online";
  if (url.includes("in-school") || url.includes("serviceacadem")) return "hybrid";
  return "online";
}

export function cltexamRowToSeedInput(row: CltexamCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const listingType = inferListingType(row.website_url, row.title, row.description);
  const format = inferFormat(listingType, row.website_url);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "contact") as PriceType;

  const subjects =
    listingType === "standardized_test"
      ? inferTestSubjects(row.title, row.description, row.website_url)
      : listingType === "scholarship"
        ? ["college_prep", "clt"]
        : ["college_prep", "clt"];

  return {
    title: row.title.replace(/™/g, "").replace(/®/g, "").trim(),
    listingType,
    format,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin: ageMin ?? 8,
    ageMax: ageMax ?? 18,
    philosophies: ["classical", "eclectic"],
    religions: ["christian", "secular"],
    subjects,
    description: [row.description?.trim(), `Classic Learning Test resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "Classic Learning Test homeschool resource.",
  };
}
