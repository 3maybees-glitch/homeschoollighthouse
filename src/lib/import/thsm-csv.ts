import type { ListingFormat, ListingType, PriceType } from "@/types/listing";

export type ThsmCsvRow = {
  title: string;
  website_url: string;
  thsm_review_url: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function normalizeHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function parsePrices(prices: string): {
  priceType: PriceType;
  priceMin: number | null;
  priceMax: number | null;
} {
  if (!prices?.trim()) {
    return { priceType: "contact", priceMin: null, priceMax: null };
  }

  const lower = prices.toLowerCase();
  if (lower.includes("/mo") || lower.includes("/month")) {
    const match = prices.match(/\$?([\d,.]+)/);
    return {
      priceType: "subscription",
      priceMin: match ? Number(match[1].replace(/,/g, "")) : null,
      priceMax: null,
    };
  }

  const amounts = [...prices.matchAll(/\$?([\d,.]+)/g)]
    .map((m) => Number(m[1].replace(/,/g, "")))
    .filter((n) => !Number.isNaN(n) && n > 0 && n < 100000);

  if (!amounts.length) {
    return { priceType: "contact", priceMin: null, priceMax: null };
  }

  return {
    priceType: "one_time",
    priceMin: Math.min(...amounts),
    priceMax: amounts.length > 1 ? Math.max(...amounts) : null,
  };
}

function gradeToAge(grade: string): number | null {
  const g = grade.trim().toLowerCase();
  if (g.includes("prek") || g.includes("pre-k") || g.includes("preschool")) return 4;
  if (g === "k" || g.includes("kinder") || g.includes("k5")) return 5;
  const num = g.match(/(\d{1,2})/);
  if (num) {
    const gradeNum = Number(num[1]);
    if (gradeNum >= 1 && gradeNum <= 12) return gradeNum + 5;
    if (gradeNum >= 4 && gradeNum <= 18) return gradeNum;
  }
  if (g.includes("high school")) return 14;
  return null;
}

export function parseAgeRange(grades: string): { ageMin: number | null; ageMax: number | null } {
  if (!grades?.trim()) return { ageMin: null, ageMax: null };

  const text = grades.toLowerCase();
  if (text.includes("k-12") || text.includes("k–12")) return { ageMin: 5, ageMax: 18 };

  const range = text.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})/);
  if (range) {
    const a = gradeToAge(range[1]) ?? Number(range[1]);
    const b = gradeToAge(range[2]) ?? Number(range[2]);
    return { ageMin: Math.min(a, b), ageMax: Math.max(a, b) };
  }

  const parts = grades.split(/[;,]/).map((p) => p.trim()).filter(Boolean);
  const ages = parts.map((p) => gradeToAge(p)).filter((a): a is number => a != null);

  if (!ages.length) return { ageMin: null, ageMax: null };
  return { ageMin: Math.min(...ages), ageMax: Math.max(...ages) };
}

function inferListingType(title: string, url: string): ListingType {
  const haystack = `${title} ${url}`.toLowerCase();
  if (haystack.includes("transcript")) return "supplement";
  if (haystack.includes("co-op") || haystack.includes("coop")) return "coop";
  if (haystack.includes("tutor")) return "tutor";
  if (
    haystack.includes("academy") ||
    haystack.includes("school") ||
    haystack.includes("online academy")
  ) {
    return "online_course";
  }
  return "curriculum";
}

function inferFormat(title: string, listingType: ListingType): ListingFormat {
  if (listingType === "online_course") return "online";
  const haystack = title.toLowerCase();
  if (haystack.includes("online")) return "online";
  return "hybrid";
}

function inferReligions(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("christian") || text.includes("abeka") || text.includes("apologia")) {
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
  if (text.includes("reading") || text.includes("language")) subjects.push("language_arts");
  if (text.includes("science")) subjects.push("science");
  if (text.includes("history")) subjects.push("history");
  return subjects;
}

export function thsmRowToSeedInput(row: ThsmCsvRow) {
  const listingType = inferListingType(row.title, row.website_url);
  const format = inferFormat(row.title, listingType);
  const { priceType, priceMin, priceMax } = parsePrices(row.prices_mentioned);
  const { ageMin, ageMax } = parseAgeRange(row.grades_or_ages);
  const religions = inferReligions(row.title, row.description);
  const subjects = inferSubjects(row.title, row.description);

  const descriptionParts = [
    row.description?.trim(),
    row.thsm_review_url ? `Parent reviews on TheHomeSchoolMom: ${row.thsm_review_url}` : "",
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
    shortDescription: row.description?.slice(0, 120) || `Homeschool resource featured on TheHomeSchoolMom.`,
  };
}
