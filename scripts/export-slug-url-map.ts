#!/usr/bin/env npx tsx
/** Print JSON map of normalized listing URL -> slug for current seed-listings build. */

import { writeFileSync } from "node:fs";
import { seedListings } from "../src/data/seed-listings";
import { normalizeListingUrl } from "../src/lib/import/thsm-csv";

const byUrl: Record<string, string> = {};
const bySlug: Record<string, { websiteUrl: string; title: string }> = {};

for (const listing of seedListings) {
  const key = normalizeListingUrl(listing.websiteUrl);
  byUrl[key] = listing.slug;
  bySlug[listing.slug] = { websiteUrl: listing.websiteUrl, title: listing.title };
}

const outPath = process.argv[2];
const payload = { byUrl, bySlug, generatedAt: new Date().toISOString(), count: seedListings.length };

if (outPath) {
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.error(`Wrote ${seedListings.length} listings to ${outPath}`);
} else {
  process.stdout.write(JSON.stringify(payload));
}
