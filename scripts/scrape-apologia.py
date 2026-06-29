#!/usr/bin/env python3
"""Scrape Apologia homeschool products from apologia.com (WooCommerce store API)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
API_BASE = "https://www.apologia.com/wp-json/wc/store/products"
PER_PAGE = 100

GRADE_SLUGS = {
    "preschool": "Preschool",
    "kindergarten": "Kindergarten",
    "1st-grade": "1st Grade",
    "2nd-grade": "2nd Grade",
    "3rd-grade": "3rd Grade",
    "4th-grade": "4th Grade",
    "5th-grade": "5th Grade",
    "6th-grade": "6th Grade",
    "7th-grade": "7th Grade",
    "8th-grade": "8th Grade",
    "9th-grade": "9th Grade",
    "10th-grade": "10th Grade",
    "11th-grade": "11th Grade",
    "12th-grade": "12th Grade",
}

LEVEL_SLUGS = {
    "elementary": "Elementary",
    "middle-school": "Middle School",
    "high-school": "High School",
    "preschool": "Preschool",
}


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def strip_html(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def format_price(prices: dict) -> str:
    minor = prices.get("currency_minor_unit", 2)
    divisor = 10**minor

    def to_dollars(raw: str | int | None) -> str | None:
        if raw in (None, ""):
            return None
        value = int(raw) / divisor
        return f"${value:.2f}"

    sale = to_dollars(prices.get("sale_price"))
    regular = to_dollars(prices.get("regular_price"))
    base = to_dollars(prices.get("price"))

    if sale and regular and sale != regular:
        return f"{sale} (was {regular})"
    if base:
        return base
    if regular:
        return regular
    return ""


def extract_ages(categories: list[dict]) -> str:
    labels: list[str] = []
    seen: set[str] = set()

    for category in categories:
        slug = category.get("slug", "")
        name = category.get("name", "")

        if slug in GRADE_SLUGS:
            label = GRADE_SLUGS[slug]
        elif slug in LEVEL_SLUGS:
            label = LEVEL_SLUGS[slug]
        elif re.fullmatch(r"\d{1,2}(st|nd|rd|th)-grade", slug):
            label = name
        elif slug in {"all-science", "science", "math", "course-set", "sets-archives"}:
            continue
        elif name.lower() in {"science", "math", "sale", "new"}:
            continue
        else:
            continue

        if label not in seen:
            seen.add(label)
            labels.append(label)

    return "; ".join(labels)


def fetch_all_products() -> list[dict]:
    page = 1
    products: list[dict] = []

    while True:
        url = f"{API_BASE}?per_page={PER_PAGE}&page={page}"
        payload = json.loads(fetch(url).decode("utf-8"))
        if not payload:
            break
        products.extend(payload)
        if len(payload) < PER_PAGE:
            break
        page += 1

    return products


def product_to_row(product: dict) -> dict:
    prices = product.get("prices") or {}
    categories = product.get("categories") or []

    return {
        "title": strip_html(product.get("name", "")),
        "website_url": product.get("permalink", ""),
        "source": "Apologia",
        "grades_or_ages": extract_ages(categories),
        "prices_mentioned": format_price(prices),
        "description": strip_html(product.get("short_description") or product.get("description") or ""),
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Fetching Apologia products...", file=sys.stderr)
    products = fetch_all_products()
    rows = [product_to_row(product) for product in products]
    rows = [row for row in rows if row["title"] and row["website_url"]]

    csv_path = data_dir / "apologia-scraped.csv"
    json_path = data_dir / "apologia-scraped.json"

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

    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
