#!/usr/bin/env bash
# Refresh all vendor scrapes and sync JSON into src/data for seed-listings.ts.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PYTHON="${PYTHON:-python3}"

run_scraper() {
  local script="$1"
  local label="$2"
  echo ""
  echo "==> Scraping ${label}..."
  "$PYTHON" "$script"
}

copy_import() {
  local source="$1"
  local dest="$2"
  if [[ ! -f "$source" ]]; then
    echo "Missing scrape output: $source" >&2
    return 1
  fi
  cp "$source" "$dest"
  echo "Synced $(basename "$dest")"
}

scrape_and_sync() {
  local script="$1"
  local label="$2"
  local source="$3"
  local dest="$4"
  local required="${5:-true}"

  if run_scraper "$script" "$label"; then
    copy_import "$source" "$dest"
    return 0
  fi

  if [[ "$required" == "true" ]]; then
    echo "ERROR: required scrape failed for ${label}" >&2
    exit 1
  fi

  echo "WARN: ${label} scrape failed; keeping existing $(basename "$dest")" >&2
}

mkdir -p data src/data

# Fast WooCommerce / Shopify API scrapers (required)
scrape_and_sync scripts/scrape-apologia.py "Apologia" \
  data/apologia-scraped.json src/data/apologia-imported.json true
scrape_and_sync scripts/scrape-tied2teaching.py "Tied 2 Teaching" \
  data/tied2teaching-scraped.json src/data/tied2teaching-imported.json true
scrape_and_sync scripts/scrape-math-u-see.py "Math-U-See" \
  data/math-u-see-scraped.json src/data/math-u-see-imported.json true
scrape_and_sync scripts/scrape-mystery-of-history.py "The Mystery of History" \
  data/mystery-of-history-scraped.json src/data/mystery-of-history-imported.json true

# Slower HTML scrapers (optional — keep prior import JSON on failure)
scrape_and_sync scripts/scrape-homeschool-com.py "Homeschool.com" \
  data/homeschool-com-scraped.json src/data/homeschool-com-imported.json false
scrape_and_sync scripts/scrape-a2zhomeschooling.py "A2Z Homeschooling" \
  data/a2zhomeschooling-scraped.json src/data/a2z-imported.json false

echo ""
echo "Refresh complete. Run 'npm run refresh-imports:verify' to rebuild and check listing counts."
