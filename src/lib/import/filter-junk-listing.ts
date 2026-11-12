import type { PriceType } from "@/types/listing";

type JunkCheckInput = {
  title: string;
  websiteUrl: string;
  priceType?: PriceType;
  priceMin?: number | null;
  priceMax?: number | null;
};

const JUNK_TITLE =
  /\b(gift\s*card|promo\s*gift|e-?gift\s*card|gift\s*certificate)\b|handling\s+fee|shipping\s+(fee|insurance)|\bpostage\b|\bdamaged[-\s]/i;

const CLEARANCE_TITLE = /\[(?:clearance|scratch)\]|scratch\s*&\s*dent|\bclearance\b/i;

export function isJunkImportedListing(input: JunkCheckInput): boolean {
  const title = input.title.trim();
  const url = input.websiteUrl.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (!title || title.length < 2) return true;
  if (JUNK_TITLE.test(lowerTitle)) return true;
  if (url.includes("gift-card") || url.includes("/giftcard") || url.includes("gift_card")) {
    return true;
  }
  if (/\/gift[\s-]?card/i.test(url)) return true;

  if (CLEARANCE_TITLE.test(lowerTitle) || /^damaged-/i.test(slugHint(title))) {
    return true;
  }

  const min = input.priceMin ?? null;
  const max = input.priceMax ?? null;
  const isZeroPricedStoreSku =
    input.priceType === "one_time" &&
    min === 0 &&
    (max === 0 || max === null) &&
    !/\bfree\b/i.test(lowerTitle) &&
    (url.includes("/products/") || url.includes("/product/") || url.includes("/shop/"));

  if (isZeroPricedStoreSku) return true;

  if (/\btest\s+product\b|\bdo not (buy|purchase)\b/i.test(lowerTitle)) return true;

  return false;
}

function slugHint(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
