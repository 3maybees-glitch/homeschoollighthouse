#!/usr/bin/env node
/**
 * Verify every /listing slug in the production sitemap exists in the current build
 * or has a 308 redirect entry.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCTION_SITEMAP = "https://www.homeschoollighthouse.com/sitemap.xml";

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

function loadCurrentSlugMap() {
  const tmp = path.join(ROOT, "data/.continuity-tmp/check-current-slug-map.json");
  mkdirSync(path.dirname(tmp), { recursive: true });
  execFileSync("npx", ["tsx", "scripts/export-slug-url-map.ts", tmp], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "inherit"],
  });
  return JSON.parse(readFileSync(tmp, "utf8"));
}

function main() {
  const redirects = JSON.parse(
    readFileSync(path.join(ROOT, "src/data/listing-redirects.json"), "utf8"),
  );

  return fetchProductionListingSlugs().then((productionSlugs) => {
    const currentMap = loadCurrentSlugMap();
    const currentSlugs = new Set(Object.keys(currentMap.bySlug));

    const unresolved = [];
    for (const slug of productionSlugs) {
      if (currentSlugs.has(slug)) continue;
      if (redirects[slug]) continue;
      unresolved.push(slug);
    }

    const report = {
      productionListingSlugs: productionSlugs.length,
      currentListingSlugs: currentSlugs.size,
      redirects: Object.keys(redirects).length,
      unresolved: unresolved.length,
      sampleUnresolved: unresolved.slice(0, 25),
    };

    const artifactPath = "/opt/cursor/artifacts/slug-continuity-check.json";
    try {
      writeFileSync(artifactPath, JSON.stringify(report, null, 2));
    } catch {
      writeFileSync(path.join(ROOT, "data/slug-continuity-check.json"), JSON.stringify(report, null, 2));
    }

    console.log(JSON.stringify(report, null, 2));

    if (unresolved.length > 0) {
      process.exit(1);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
