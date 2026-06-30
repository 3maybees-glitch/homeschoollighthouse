#!/usr/bin/env python3
"""Scrape The Mystery of History products from themysteryofhistory.com (WooCommerce API)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
API_BASE = "https://themysteryofhistory.com/wp-json/wc/store/products"
PER_PAGE = 100
SITE_NAME = "The Mystery of History"

VOLUME_GRADES = {
    "volume i": "Grades 1-5; Volume I (Creation to A.D. 33)",
    "volume ii": "Grades 6-8; Volume II (The Early Church to the Renaissance)",
    "volume iii": "Grades 9-11; Volume III (The Renaissance to the Age of Industry)",
    "volume iv": "Grades 10-12; Volume IV (Wars of Independence to Modern Times)",
}

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"all ages|high school|middle school|upper elementary|elementary"
    r")\b",
    re.IGNORECASE,
)


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
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


def extract_ages(title: str, description: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description}".lower()

    for key, label in VOLUME_GRADES.items():
        if key in haystack and label not in seen:
            seen.add(label)
            labels.append(label)

    for match in GRADE_WORD.finditer(f"{title} {description}"):
        label = match.group(0).strip()
        normalized = label.title().replace("Pre-K", "Pre-K")
        key = normalized.lower()
        if key not in seen:
            seen.add(key)
            labels.append(normalized)

    if not labels:
        labels.append("All Ages; K-12 World History")

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
    title = strip_html(product.get("name", ""))
    description = strip_html(product.get("short_description") or product.get("description") or "")

    return {
        "title": title,
        "website_url": product.get("permalink", ""),
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description),
        "prices_mentioned": format_price(prices),
        "description": description,
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Fetching Mystery of History products...", file=sys.stderr)
    products = fetch_all_products()
    rows = [product_to_row(product) for product in products]
    rows = [row for row in rows if row["title"] and row["website_url"]]
    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "mystery-of-history-scraped.csv"
    json_path = data_dir / "mystery-of-history-scraped.json"

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
