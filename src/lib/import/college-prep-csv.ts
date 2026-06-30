import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type CollegePrepCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

function inferListingType(url: string, title: string, description: string): ListingType {
  const haystack = `${url} ${title} ${description}`.toLowerCase();

  if (
    haystack.includes("convention") ||
    haystack.includes("conference") ||
    haystack.includes("expo") ||
    haystack.includes("practicum")
  ) {
    return "conference";
  }

  if (haystack.includes("scholarship") || haystack.includes("merit")) {
    return "scholarship";
  }

  if (
    haystack.includes("clt") ||
    haystack.includes("classic learning test") ||
    haystack.includes(" sat") ||
    haystack.includes("psat") ||
    haystack.includes(" act") ||
    haystack.includes("standardized") ||
    haystack.includes("testing") ||
    haystack.includes("achievement test") ||
    haystack.includes(" ap exam")
  ) {
    return "standardized_test";
  }

  return "supplement";
}

function inferTestSubjects(title: string, description: string, url: string): string[] {
  const haystack = `${title} ${description} ${url}`.toLowerCase();
  const subjects = new Set<string>(["standardized_testing"]);

  if (haystack.includes("clt") || haystack.includes("classic learning test")) {
    subjects.add("clt");
  }
  if (haystack.includes("sat") && !haystack.includes("consolidat")) {
    subjects.add("sat");
  }
  if (haystack.includes("psat")) {
    subjects.add("psat");
  }
  if (/\bact\b/.test(haystack) || haystack.includes("act.org")) {
    subjects.add("act");
  }
  if (haystack.includes(" ap ") || haystack.includes("advanced placement")) {
    subjects.add("ap_exams");
  }

  return Array.from(subjects);
}

function inferFormat(listingType: ListingType): ListingFormat {
  if (listingType === "conference") return "in_person";
  if (listingType === "scholarship" || listingType === "standardized_test") return "online";
  return "hybrid";
}

export function collegePrepRowToSeedInput(row: CollegePrepCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const listingType = inferListingType(row.website_url, row.title, row.description);
  const format = inferFormat(listingType);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "contact") as PriceType;

  const subjects =
    listingType === "standardized_test"
      ? inferTestSubjects(row.title, row.description, row.website_url)
      : listingType === "scholarship"
        ? ["college_prep"]
        : listingType === "conference"
          ? ["college_prep"]
          : ["electives"];

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType,
    format,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin: ageMin ?? 4,
    ageMax: ageMax ?? 18,
    philosophies: ["eclectic"],
    religions: ["secular"],
    subjects,
    description: [row.description?.trim(), `${row.source} resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || `${row.source} homeschool resource.`,
  };
}
