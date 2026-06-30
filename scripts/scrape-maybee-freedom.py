#!/usr/bin/env python3
"""Scrape Maybee Creations Freedom realm products from maybeecreations.com/freedom."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
FREEDOM_URL = "https://maybeecreations.com/freedom"
SITE_NAME = "Maybee Creations"
DEFAULT_AGES = "All Ages; families and students"

CATEGORY_AGES = {
    "Founding Era": "Middle School; High School",
    "American History": "Middle School; High School",
    "World History": "Middle School; High School",
}


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def find_bundle_url(html: str) -> str:
    match = re.search(r'<script[^>]+src="(/assets/index-[^"]+\.js)"', html)
    if not match:
        raise RuntimeError("Could not locate Maybee Creations JS bundle URL")
    return f"https://maybeecreations.com{match.group(1)}"


def extract_freedom_array(bundle: str) -> str:
    start = bundle.find("Wa=[")
    if start == -1:
        raise RuntimeError("Freedom product array (Wa) not found in JS bundle")

    chunk = bundle[start:]
    end_match = re.search(r"\],([a-zA-Z_$][a-zA-Z0-9_$]*)=\[", chunk[3:])
    if not end_match:
        raise RuntimeError("Freedom product array boundary not found in JS bundle")

    end = start + 3 + end_match.start() + 1
    return bundle[start + 3 : end + 1]


def parse_freedom_products(bundle: str) -> list[dict]:
    array_text = extract_freedom_array(bundle)
    pattern = re.compile(
        r'\{name:"([^"]+)",category:"([^"]+)",subtitle:"([^"]+)",tagline:"([^"]+)",'
        r'image:[^,]+,url:"(https://payhip\.com/b/[^"]+)",price:"([^"]+)"\}'
    )
    products: list[dict] = []
    for match in pattern.finditer(array_text):
        name, category, subtitle, tagline, url, price = match.groups()
        title = f"Liberty Explorer: {unescape(name)} ({category})"
        description = f"{unescape(tagline)} {unescape(subtitle)}."
        products.append(
            {
                "title": title,
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": CATEGORY_AGES.get(category, DEFAULT_AGES),
                "prices_mentioned": price,
                "description": description,
            }
        )
    return products


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print(f"Fetching {FREEDOM_URL}...", file=sys.stderr)
    freedom_html = fetch(FREEDOM_URL)
    bundle_url = find_bundle_url(freedom_html)
    print(f"Fetching bundle {bundle_url}...", file=sys.stderr)
    bundle = fetch(bundle_url)

    rows = parse_freedom_products(bundle)
    if not rows:
        raise RuntimeError("No freedom products parsed from Maybee Creations bundle")

    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "maybee-freedom-scraped.csv"
    json_path = data_dir / "maybee-freedom-scraped.json"

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
