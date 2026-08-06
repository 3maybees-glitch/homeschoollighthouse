import type { ListingFormat, ListingType, PriceType } from "@/types/listing";
import { parseAgeRange, parsePrices } from "@/lib/import/thsm-csv";

export type JourneyHomeschoolAcademyCsvRow = {
  title: string;
  website_url: string;
  source: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function journeyHomeschoolAcademyRowToSeedInput(row: JourneyHomeschoolAcademyCsvRow) {
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const resolvedPriceType = (row.prices_mentioned ? priceType : "one_time") as PriceType;
  const subjects = inferSubjects(row.title, row.description);

  return {
    title: row.title.replace(/™/g, "").trim(),
    listingType: "online_course" as ListingType,
    format: "online" as ListingFormat,
    priceType: resolvedPriceType,
    priceMin,
    priceMax,
    websiteUrl: row.website_url,
    ageMin,
    ageMax,
    philosophies: ["religious", "eclectic"],
    values: ["self_paced", "tech_friendly", "parent_led"],
    religions: ["christian"],
    subjects,
    description: [row.description?.trim(), `Journey Homeschool Academy resource: ${row.website_url}`]
      .filter(Boolean)
      .join(" "),
    shortDescription:
      row.description?.slice(0, 120) || "Journey Homeschool Academy homeschool resource.",
  };
}

function inferSubjects(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const subjects: string[] = [];

  if (text.includes("bible") || text.includes("scripture") || text.includes("theology")) {
    subjects.push("electives");
  }
  if (
    text.includes("science") ||
    text.includes("astronomy") ||
    text.includes("biology") ||
    text.includes("chemistry") ||
    text.includes("physics") ||
    text.includes("anatomy") ||
    text.includes("geology") ||
    text.includes("marine") ||
    text.includes("birds") ||
    text.includes("earth science") ||
    text.includes("physical science")
  ) {
    subjects.push("science");
  }
  if (text.includes("elective") && !subjects.includes("electives")) {
    subjects.push("electives");
  }

  if (!subjects.length) subjects.push("science");
  return subjects;
}
