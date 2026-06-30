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
scrape_and_sync scripts/scrape-simply-charlotte-mason.py "Simply Charlotte Mason" \
  data/simply-charlotte-mason-scraped.json src/data/simply-charlotte-mason-imported.json true
scrape_and_sync scripts/scrape-iew.py "IEW" \
  data/iew-scraped.json src/data/iew-imported.json true
scrape_and_sync scripts/scrape-k12.py "K12 (Stride)" \
  data/k12-scraped.json src/data/k12-imported.json true
scrape_and_sync scripts/scrape-acellus.py "Power Homeschool / Acellus" \
  data/acellus-scraped.json src/data/acellus-imported.json true
scrape_and_sync scripts/scrape-ixl.py "IXL" \
  data/ixl-scraped.json src/data/ixl-imported.json true
scrape_and_sync scripts/scrape-timberdoodle.py "Timberdoodle" \
  data/timberdoodle-scraped.json src/data/timberdoodle-imported.json false
scrape_and_sync scripts/scrape-bridgeway.py "Bridgeway Academy" \
  data/bridgeway-scraped.json src/data/bridgeway-imported.json true
scrape_and_sync scripts/scrape-classical-conversations.py "Classical Conversations" \
  data/classical-conversations-scraped.json src/data/classical-conversations-imported.json true
scrape_and_sync scripts/scrape-memoria-press.py "Memoria Press" \
  data/memoria-press-scraped.json src/data/memoria-press-imported.json true
scrape_and_sync scripts/scrape-veritas-press.py "Veritas Press" \
  data/veritas-press-scraped.json src/data/veritas-press-imported.json true
scrape_and_sync scripts/scrape-oak-meadow.py "Oak Meadow" \
  data/oak-meadow-scraped.json src/data/oak-meadow-imported.json false
scrape_and_sync scripts/scrape-ambleside-online.py "AmblesideOnline" \
  data/ambleside-online-scraped.json src/data/ambleside-online-imported.json true
scrape_and_sync scripts/scrape-all-about-learning.py "All About Learning Press" \
  data/all-about-learning-scraped.json src/data/all-about-learning-imported.json true
scrape_and_sync scripts/scrape-teaching-textbooks.py "Teaching Textbooks" \
  data/teaching-textbooks-scraped.json src/data/teaching-textbooks-imported.json true
scrape_and_sync scripts/scrape-easy-peasy.py "Easy Peasy All-in-One Homeschool" \
  data/easy-peasy-scraped.json src/data/easy-peasy-imported.json true
scrape_and_sync scripts/scrape-homeschool-languages.py "Homeschool Languages" \
  data/homeschool-languages-scraped.json src/data/homeschool-languages-imported.json true
scrape_and_sync scripts/scrape-breaking-the-barrier.py "Breaking the Barrier" \
  data/breaking-the-barrier-scraped.json src/data/breaking-the-barrier-imported.json true
scrape_and_sync scripts/scrape-brave-writer.py "Brave Writer" \
  data/brave-writer-scraped.json src/data/brave-writer-imported.json true
scrape_and_sync scripts/scrape-calico-spanish.py "Calico Spanish" \
  data/calico-spanish-scraped.json src/data/calico-spanish-imported.json true
scrape_and_sync scripts/scrape-spelling-you-see.py "Spelling You See" \
  data/spelling-you-see-scraped.json src/data/spelling-you-see-imported.json true
scrape_and_sync scripts/scrape-spelling-power.py "Spelling Power" \
  data/spelling-power-scraped.json src/data/spelling-power-imported.json true
scrape_and_sync scripts/scrape-sequential-spelling.py "Sequential Spelling" \
  data/sequential-spelling-scraped.json src/data/sequential-spelling-imported.json true
scrape_and_sync scripts/scrape-essentials-in-writing.py "Essentials in Writing" \
  data/essentials-in-writing-scraped.json src/data/essentials-in-writing-imported.json true
scrape_and_sync scripts/scrape-writeshop.py "WriteShop" \
  data/writeshop-scraped.json src/data/writeshop-imported.json true
scrape_and_sync scripts/scrape-writeathome.py "WriteAtHome" \
  data/writeathome-scraped.json src/data/writeathome-imported.json true
scrape_and_sync scripts/scrape-artistic-pursuits.py "ARTistic Pursuits" \
  data/artistic-pursuits-scraped.json src/data/artistic-pursuits-imported.json true
scrape_and_sync scripts/scrape-schoolhouse-teachers.py "Schoolhouse Teachers" \
  data/schoolhouse-teachers-scraped.json src/data/schoolhouse-teachers-imported.json true
scrape_and_sync scripts/scrape-freedom-homeschooling.py "Freedom Homeschooling" \
  data/freedom-homeschooling-scraped.json src/data/freedom-homeschooling-imported.json true
scrape_and_sync scripts/scrape-miacademy.py "Miacademy" \
  data/miacademy-scraped.json src/data/miacademy-imported.json true
scrape_and_sync scripts/scrape-bju-press.py "BJU Press Homeschool" \
  data/bju-press-scraped.json src/data/bju-press-imported.json true
scrape_and_sync scripts/scrape-rosetta-stone.py "Rosetta Stone" \
  data/rosetta-stone-scraped.json src/data/rosetta-stone-imported.json true
scrape_and_sync scripts/scrape-masterbooks.py "Master Books" \
  data/masterbooks-scraped.json src/data/masterbooks-imported.json false
scrape_and_sync scripts/scrape-sonlight.py "Sonlight" \
  data/sonlight-scraped.json src/data/sonlight-imported.json false
scrape_and_sync scripts/scrape-home-school.py "Homeschool World" \
  data/home-school-scraped.json src/data/home-school-imported.json true
scrape_and_sync scripts/scrape-hslda.py "HSLDA" \
  data/hslda-scraped.json src/data/hslda-imported.json true
scrape_and_sync scripts/scrape-well-trained-mind.py "Well-Trained Mind" \
  data/well-trained-mind-scraped.json src/data/well-trained-mind-imported.json false
scrape_and_sync scripts/scrape-homeschool-reviews.py "HomeschoolReviews.com" \
  data/homeschool-reviews-scraped.json src/data/homeschool-reviews-imported.json true
scrape_and_sync scripts/scrape-secular-homeschool.py "Secular Homeschool" \
  data/secular-homeschool-scraped.json src/data/secular-homeschool-imported.json true
scrape_and_sync scripts/scrape-the-old-schoolhouse.py "The Old Schoolhouse Store" \
  data/the-old-schoolhouse-scraped.json src/data/the-old-schoolhouse-imported.json true
scrape_and_sync scripts/scrape-family-education.py "FamilyEducation" \
  data/family-education-scraped.json src/data/family-education-imported.json false
scrape_and_sync scripts/scrape-beautiful-feet.py "Beautiful Feet Books" \
  data/beautiful-feet-scraped.json src/data/beautiful-feet-imported.json true
scrape_and_sync scripts/scrape-canon-press.py "Canon Press" \
  data/canon-press-scraped.json src/data/canon-press-imported.json true
scrape_and_sync scripts/scrape-bluestocking-press.py "Bluestocking Press" \
  data/bluestocking-press-scraped.json src/data/bluestocking-press-imported.json true
scrape_and_sync scripts/scrape-torchlight.py "Torchlight Curriculum" \
  data/torchlight-scraped.json src/data/torchlight-imported.json true
scrape_and_sync scripts/scrape-civiced.py "Center for Civic Education" \
  data/civiced-scraped.json src/data/civiced-imported.json true
scrape_and_sync scripts/scrape-ramsey-solutions.py "Ramsey Solutions" \
  data/ramsey-solutions-scraped.json src/data/ramsey-solutions-imported.json true
scrape_and_sync scripts/scrape-geography-matters.py "Geography Matters" \
  data/geography-matters-scraped.json src/data/geography-matters-imported.json true
scrape_and_sync scripts/scrape-nature-study.py "Nature Study Resources" \
  data/nature-study-scraped.json src/data/nature-study-imported.json true
scrape_and_sync scripts/scrape-journey-homeschool-academy.py "Journey Homeschool Academy" \
  data/journey-homeschool-academy-scraped.json src/data/journey-homeschool-academy-imported.json true
scrape_and_sync scripts/scrape-outschool-electives.py "Outschool Electives" \
  data/outschool-electives-scraped.json src/data/outschool-electives-imported.json true

# Slower HTML scrapers (optional — keep prior import JSON on failure)
scrape_and_sync scripts/scrape-homeschool-com.py "Homeschool.com" \
  data/homeschool-com-scraped.json src/data/homeschool-com-imported.json false
scrape_and_sync scripts/scrape-a2zhomeschooling.py "A2Z Homeschooling" \
  data/a2zhomeschooling-scraped.json src/data/a2z-imported.json false

echo ""
echo "Refresh complete. Run 'npm run refresh-imports:verify' to rebuild and check listing counts."
