#!/usr/bin/env node
/**
 * Build listing-slug-by-url.json (preserve production slugs by product URL)
 * and listing-redirects.json (308 targets for retired production slugs).
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAIN_WORKTREE = process.env.MAIN_WORKTREE || "/tmp/hsl-main";
const PRODUCTION_SITEMAP = "https://www.homeschoollighthouse.com/sitemap.xml";

function normalizeListingUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const pathname = parsed.pathname.replace(/\/$/, "") || "/";
    return `${parsed.protocol}//${host}${pathname}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function vendorFallbackPath() {
  return "/browse/curriculum";
}

function runExport(cwd, outFile) {
  execFileSync("npx", ["tsx", "scripts/export-slug-url-map.ts", outFile], {
    cwd,
    stdio: ["ignore", "pipe", "inherit"],
    env: { ...process.env, FORCE_COLOR: "0" },
  });
}

async function fetchProductionListingSlugs() {
  const response = await fetch(PRODUCTION_SITEMAP);
  if (!response.ok) throw new Error(`Sitemap fetch failed: ${response.status}`);
  const xml = await response.text();
  const slugs = [];
  for (const match of xml.matchAll(/<loc>https?:\/\/[^<]+\/listing\/([^<]+)<\/loc>/gi)) {
    slugs.push(match[1].trim());
  }
  return [...new Set(slugs)];
}

function loadExport(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

async function main() {
  const tmpDir = path.join(ROOT, "data", ".continuity-tmp");
  mkdirSync(tmpDir, { recursive: true });
  const mainOut = path.join(tmpDir, "main-slug-map.json");
  const currentOut = path.join(tmpDir, "current-slug-map.json");

  console.log("Exporting slug maps from main worktree...");
  runExport(MAIN_WORKTREE, mainOut);

  console.log("Exporting slug maps from current branch...");
  runExport(ROOT, currentOut);

  const mainMap = loadExport(mainOut);
  const currentMap = loadExport(currentOut);

  const currentUrls = new Set(Object.keys(currentMap.byUrl));
  const preserveByUrl = {};
  let preservedCount = 0;

  for (const [url, slug] of Object.entries(mainMap.byUrl)) {
    if (currentUrls.has(url)) {
      preserveByUrl[url] = slug;
      preservedCount += 1;
    }
  }

  const productionSlugs = await fetchProductionListingSlugs();
  const currentSlugs = new Set(Object.keys(currentMap.bySlug));
  const redirects = {};
  let redirectCount = 0;

  for (const oldSlug of productionSlugs) {
    if (currentSlugs.has(oldSlug)) continue;

    const mainEntry = mainMap.bySlug[oldSlug];
    if (mainEntry) {
      const urlKey = normalizeListingUrl(mainEntry.websiteUrl);
      const targetSlug = preserveByUrl[urlKey] || currentMap.byUrl[urlKey];
      if (targetSlug && currentSlugs.has(targetSlug)) {
        redirects[oldSlug] = `/listing/${targetSlug}`;
        redirectCount += 1;
        continue;
      }
      redirects[oldSlug] = vendorFallbackPath();
      redirectCount += 1;
      continue;
    }

    redirects[oldSlug] = "/browse/curriculum";
    redirectCount += 1;
  }

  const slugRegistryPath = path.join(ROOT, "src/data/listing-slug-by-url.json");
  const redirectsPath = path.join(ROOT, "src/data/listing-redirects.json");
  const statsPath = path.join(ROOT, "data/listing-continuity-stats.json");

  writeFileSync(
    slugRegistryPath,
    JSON.stringify(
      {
        byUrl: preserveByUrl,
        preservedSlugs: preservedCount,
        generatedAt: new Date().toISOString(),
        source: "production-main-by-product-url",
      },
      null,
      2,
    ),
  );

  writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));

  const stats = {
    preservedUrlSlugPairs: preservedCount,
    redirectsAdded: redirectCount,
    productionListingSlugs: productionSlugs.length,
    currentListingSlugs: currentSlugs.size,
    unresolvedAfterRedirects: productionSlugs.filter(
      (slug) => !currentSlugs.has(slug) && !redirects[slug],
    ).length,
  };
  writeFileSync(statsPath, JSON.stringify(stats, null, 2));

  console.log(JSON.stringify(stats, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
