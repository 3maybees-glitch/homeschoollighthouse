import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type HeavCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

function inferTestSubjects(title: string, description: string, url: string): string[] {
  const haystack = `${title} ${description} ${url}`.toLowerCase();
  const subjects = new Set<string>(["standardized_testing"]);

  if (haystack.includes("clt") || haystack.includes("classic learning test")) {
    subjects.add("clt");
  }
  if (haystack.includes("sat") || haystack.includes("psat")) {
    subjects.add("sat");
  }
  if (haystack.includes("psat")) {
    subjects.add("psat");
  }
  if (/\bact\b/.test(haystack)) {
    subjects.add("act");
  }
  if (haystack.includes(" ap ") || haystack.includes("advanced placement")) {
    subjects.add("ap_exams");
  }

  return Array.from(subjects);
}

function inferListingType(url: string, title: string, description: string): ListingType {
  const haystack = `${url} ${title} ${description}`.toLowerCase();

  if (
    haystack.includes("convention") ||
    haystack.includes("conference") ||
    haystack.includes("leadership-conference") ||
    haystack.includes("special-needs-conference")
  ) {
    return "conference";
  }

  if (haystack.includes("scholarship")) {
    return "scholarship";
  }

  if (
    haystack.includes("testing") ||
    haystack.includes("standardized") ||
    haystack.includes("evaluator") ||
    haystack.includes("tester") ||
    haystack.includes("clt") ||
    haystack.includes(" sat") ||
    haystack.includes("psat") ||
    haystack.includes("interpreting-test") ||
    haystack.includes("test-scores")
  ) {
    return "standardized_test";
  }

  if (
    haystack.includes("field-trip") ||
    haystack.includes("field-trips") ||
    haystack.includes("graduation") ||
    haystack.includes("capitol") ||
    haystack.includes("homeschool-days")
  ) {
    return "field_trip";
  }

  if (
    haystack.includes("support-group") ||
    haystack.includes("membership") ||
    haystack.includes("joinrenew") ||
    haystack.includes("member-benefits") ||
    haystack.includes("mentor-program")
  ) {
    return "support_group";
  }

  if (
    haystack.includes("law") ||
    haystack.includes("notice-of-intent") ||
    haystack.includes("compliance") ||
    haystack.includes("transcript") ||
    haystack.includes("legislative")
  ) {
    return "supplement";
  }

  if (
    haystack.includes("e-book") ||
    haystack.includes("planner") ||
    haystack.includes("bundle") ||
    haystack.includes("curriculum") ||
    haystack.includes("product/")
  ) {
    return "curriculum";
  }

  return "support_group";
}

function inferFormat(url: string, listingType: ListingType): ListingFormat {
  const haystack = url.toLowerCase();
  if (
    listingType === "conference" ||
    listingType === "field_trip" ||
    haystack.includes("convention") ||
    haystack.includes("graduation") ||
    haystack.includes("capitol")
  ) {
    return "in_person";
  }
  if (haystack.includes("online") || haystack.includes("transcript")) {
    return "hybrid";
  }
  if (listingType === "curriculum" && haystack.includes("/product/")) {
    return "online";
  }
  return "hybrid";
}

function inferSubjects(
  listingType: ListingType,
  title: string,
  description: string,
  url: string,
): string[] {
  if (listingType === "standardized_test") {
    return inferTestSubjects(title, description, url);
  }
  if (listingType === "scholarship") {
    return ["college_prep"];
  }
  if (listingType === "conference") {
    return ["college_prep"];
  }
  if (listingType === "supplement") {
    return ["electives"];
  }
  return ["electives"];
}

export function heavRowToSeedInput(row: HeavCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const listingType = inferListingType(row.website_url, row.title, row.description);
  const format = inferFormat(row.website_url, listingType);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "contact") as PriceType;

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType,
    format,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    city: "Richmond",
    state: "VA",
    ageMin: ageMin ?? 4,
    ageMax: ageMax ?? 18,
    philosophies: ["eclectic", "religious"],
    religions: ["christian"],
    subjects: inferSubjects(listingType, row.title, row.description, row.website_url),
    description: [row.description?.trim(), `HEAV resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "HEAV Virginia homeschool resource.",
  };
}
