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

function inferListingType(url: string, title: string): ListingType {
  const haystack = `${url} ${title}`.toLowerCase();
  if (
    haystack.includes("field-trip") ||
    haystack.includes("field-trips") ||
    haystack.includes("convention") ||
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
    haystack.includes("mentor-program") ||
    haystack.includes("scholarship")
  ) {
    return "support_group";
  }
  if (
    haystack.includes("law") ||
    haystack.includes("notice-of-intent") ||
    haystack.includes("compliance") ||
    haystack.includes("testing") ||
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

export function heavRowToSeedInput(row: HeavCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const listingType = inferListingType(row.website_url, row.title);
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
    subjects: listingType === "supplement" ? ["electives"] : ["electives"],
    description: [row.description?.trim(), `HEAV resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription: row.description?.slice(0, 120) || "HEAV Virginia homeschool resource.",
  };
}
