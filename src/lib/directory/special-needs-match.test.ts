import assert from "node:assert/strict";
import test from "node:test";
import type { Listing } from "@/types/listing";
import { listingMatchesSpecialNeeds } from "./special-needs-match";

function stubListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "1",
    slug: "test",
    title: "Generic Math Curriculum",
    shortDescription: "A standard program.",
    description: "Grade-level workbook series.",
    type: "curriculum",
    formats: ["online"],
    philosophies: [],
    values: [],
    religions: [],
    subjects: [],
    ageRange: [5, 18],
    price: 100,
    priceTier: "mid",
    rating: 4.5,
    reviewCount: 10,
    featured: false,
    state: "",
    city: "",
    websiteUrl: "https://example.com/math",
    createdAt: "2020-01-01",
    ...overrides,
  };
}

test("matches explicit special_needs value tag", () => {
  assert.equal(listingMatchesSpecialNeeds(stubListing({ values: ["special_needs"] })), true);
});

test("matches dyslexia in title", () => {
  assert.equal(
    listingMatchesSpecialNeeds(stubListing({ title: "Dyslexia Reading Program" })),
    true,
  );
});

test("matches special-needs URL segment", () => {
  assert.equal(
    listingMatchesSpecialNeeds(
      stubListing({ websiteUrl: "https://memoriapress.com/shop/special-needs/simply-classical" }),
    ),
    true,
  );
});

test("does not match unrelated moral-values copy", () => {
  assert.equal(
    listingMatchesSpecialNeeds(
      stubListing({ description: "Teaches strong moral values and family virtues." }),
    ),
    false,
  );
});