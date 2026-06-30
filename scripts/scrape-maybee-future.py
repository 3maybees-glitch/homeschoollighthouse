#!/usr/bin/env python3
"""Scrape Maybee Creations Future realm products from maybeecreations.com/future."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
FUTURE_URL = "https://maybeecreations.com/future"
SITE_NAME = "Maybee Creations"
DEFAULT_AGES = "All Ages; families, students, and creators"
MAP_PRICE = "$4.99"
ADVENTURE_PACK_PRICE = "$9.99"


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def find_bundle_url(html: str) -> str:
    match = re.search(r'<script[^>]+src="(/assets/index-[^"]+\.js)"', html)
    if not match:
        raise RuntimeError("Could not locate Maybee Creations JS bundle URL")
    return f"https://maybeecreations.com{match.group(1)}"


def extract_future_array(bundle: str) -> str:
    start = bundle.find("fn=[")
    if start == -1:
        raise RuntimeError("Future product array (fn) not found in JS bundle")

    chunk = bundle[start:]
    end_match = re.search(r"\],([a-zA-Z_$][a-zA-Z0-9_$]*)=\[", chunk[3:])
    if not end_match:
        raise RuntimeError("Future product array boundary not found in JS bundle")

    end = start + 3 + end_match.start() + 1
    return bundle[start + 3 : end + 1]


def parse_future_products(bundle: str) -> list[dict]:
    array_text = extract_future_array(bundle)
    pattern = re.compile(
        r'\{name:"([^"]+)",brand:"([^"]+)",tagline:"([^"]+)",image:[^,]+,'
        r'mapUrl:"(https://payhip\.com/b/[^"]+)",bundleUrl:"(https://payhip\.com/b/[^"]+)"\}'
    )
    products: list[dict] = []
    for match in pattern.finditer(array_text):
        name, brand, tagline, map_url, bundle_url = match.groups()
        clean_name = unescape(name)
        clean_tagline = unescape(tagline)
        clean_brand = unescape(brand)

        products.append(
            {
                "title": f"Tomorrow Explorer: {clean_name} — World Map ({clean_brand})",
                "website_url": map_url,
                "source": SITE_NAME,
                "grades_or_ages": DEFAULT_AGES,
                "prices_mentioned": MAP_PRICE,
                "description": f"{clean_tagline} Printable fantasy AI world map.",
            }
        )
        products.append(
            {
                "title": f"Tomorrow Explorer: {clean_name} — Adventure Pack ({clean_brand})",
                "website_url": bundle_url,
                "source": SITE_NAME,
                "grades_or_ages": DEFAULT_AGES,
                "prices_mentioned": ADVENTURE_PACK_PRICE,
                "description": (
                    f"{clean_tagline} Includes beginner tutorial PDF, prompts, "
                    "practice missions, and real-life use cases."
                ),
            }
        )
    return products


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print(f"Fetching {FUTURE_URL}...", file=sys.stderr)
    future_html = fetch(FUTURE_URL)
    bundle_url = find_bundle_url(future_html)
    print(f"Fetching bundle {bundle_url}...", file=sys.stderr)
    bundle = fetch(bundle_url)

    rows = parse_future_products(bundle)
    if not rows:
        raise RuntimeError("No future products parsed from Maybee Creations bundle")

    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "maybee-future-scraped.csv"
    json_path = data_dir / "maybee-future-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "title",
                "website_url",
                "source",
                "grades_or_ages",
                "prices_mentioned",
                "description",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(f"  with prices: {with_prices}, with ages/grades: {with_ages}", file=sys.stderr)
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
