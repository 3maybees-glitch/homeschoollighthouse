# Vendor catalog backlog

Vendors to import (or expand) later as **one PR per vendor**.  
Closed stale stacked scrape PRs in Aug 2026 — do not revive those mega-branches.

## High priority (brand stub only, or thin import)

| Vendor | Site | Notes |
|--------|------|--------|
| Abeka | https://www.abeka.com | Brand stub only today — full product catalog needed |
| BJU Press Homeschool | https://www.bjupresshomeschool.com | Only ~7 spelling items imported; expand to full catalog |
| The Good and the Beautiful | https://www.goodandbeautiful.com | Scrape script exists; wire `*-imported.json` into seed |
| My Father's World | https://www.mfwbooks.com | Scrape script exists; wire import into seed |
| Time4Learning | https://www.time4learning.com | Brand stub only — product/plan catalog needed |
| Memoria Press | https://www.memoriapress.com | Public WooCommerce product API route removed (404); expand/rebuild scraper via product sitemap when ready |

## Medium priority (niche / missing entirely)

| Vendor | Site | Notes |
|--------|------|--------|
| Christian Academy of America (CHAOA) | https://www.chaoa.com | Online academy / program listings |
| Theory Time | https://theorytime.com | ~169 music theory products (old PR estimate) |
| Drive Thru History | https://drivethruhistory.com | Small video curriculum shop |
| Maybee Creations — Faith | https://maybeecreations.com/faith | Soul Explorer Bible maps |
| Maybee Creations — Freedom | https://maybeecreations.com/freedom | Liberty Explorer maps |
| Maybee Creations — Future | https://maybeecreations.com/future | Tomorrow Explorer AI products |

## Already on main (refresh these — don't re-import from old PRs)

Homeschool.com · A2Z · Math-U-See · Sonlight · Master Books · plus the other vendors in `scripts/refresh-imports.sh`.

## How to add a vendor later

1. One focused branch / PR per vendor  
2. Scraper → `data/{vendor}-scraped.json` → `src/data/{vendor}-imported.json`  
3. Wire into `src/data/seed-listings.ts`  
4. Add to `scripts/refresh-imports.sh` (optional if flaky)  
5. Merge, then rely on monthly refresh for new products
