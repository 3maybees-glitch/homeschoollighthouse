const TRAILING_BRAND_SUFFIXES = [
  "Memoria Press: Classical Education",
  "Memoria Press",
  "Master Books",
  "Sonlight Curriculum",
  "Sonlight",
  "Veritas Press",
  "Timberdoodle Co.",
  "Timberdoodle",
  "Apologia Educational Ministries",
  "The Good and the Beautiful",
  "My Father's World",
  "Classical Conversations",
  "IEW",
];

/** Strip trailing site branding from vendor-scraped titles before display and slugging. */
export function normalizeListingTitle(title: string): string {
  let cleaned = title.replace(/™/g, "").trim();

  for (const brand of TRAILING_BRAND_SUFFIXES) {
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\s*(?:[-|–—]\\s*|\\|\\s*)${escaped}\\s*$`, "i");
    cleaned = cleaned.replace(pattern, "").trim();
  }

  return cleaned.replace(/\s{2,}/g, " ").trim() || title.trim();
}

export function slugifyListingTitle(title: string): string {
  return normalizeListingTitle(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
