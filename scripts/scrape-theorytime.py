#!/usr/bin/env python3
"""Scrape Theory Time products from theorytime.com (WooCommerce store API)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
API_BASE = "https://www.theorytime.com/wp-json/wc/store/products"
PER_PAGE = 100
SITE_NAME = "Theory Time"

GRADE_PATTERN = re.compile(
    r"Grade\s*0?(\d{1,2})|"
    r"Grades?\s*(\d{1,2})\s*[-–/]\s*(\d{1,2})|"
    r"\b(Kindergarten|Middle School|High School|Elementary)\b",
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
    price_range = prices.get("price_range")

    if price_range and price_range.get("min_amount") and price_range.get("max_amount"):
        min_val = int(price_range["min_amount"]) / divisor
        max_val = int(price_range["max_amount"]) / divisor
        if min_val == max_val:
            return f"${min_val:.2f}"
        return f"${min_val:.2f}-${max_val:.2f}"

    def to_dollars(raw: str | int | None) -> str | None:
        if raw in (None, ""):
            return None
        value = int(raw) / divisor
        if value == 0:
            return "Free"
        return f"${value:.2f}"

    sale = to_dollars(prices.get("sale_price"))
    regular = to_dollars(prices.get("regular_price"))
    base = to_dollars(prices.get("price"))

    if sale and regular and sale != regular and sale != "Free":
        return f"{sale} (was {regular})"
    if base:
        return base
    if regular:
        return regular
    return ""


def normalize_grade_label(match: re.Match[str]) -> str:
    if match.group(4):
        return match.group(4).title()
    if match.group(1):
        return f"Grade {int(match.group(1))}"
    if match.group(2) and match.group(3):
        return f"Grades {int(match.group(2))}-{int(match.group(3))}"
    return match.group(0).strip()


def extract_ages(title: str, description: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description}"

    for match in GRADE_PATTERN.finditer(haystack):
        label = normalize_grade_label(match)
        key = label.lower()
        if key not in seen:
            seen.add(key)
            labels.append(label)

    if not labels:
        if "medals" in haystack.lower():
            labels.append("Elementary through High School")
        else:
            labels.append("All Ages; Music Theory")

    return "; ".join(labels)


def fetch_all_products() -> list[dict]:
    page = 1
    products: list[dict] = []

    while True:
        url = f"{API_BASE}?per_page={PER_PAGE}&page={page}"
        print(f"Fetching page {page}...", file=sys.stderr)
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

    print("Fetching Theory Time products...", file=sys.stderr)
    products = fetch_all_products()
    rows = [product_to_row(product) for product in products]
    rows = [row for row in rows if row["title"] and row["website_url"]]
    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "theorytime-scraped.csv"
    json_path = data_dir / "theorytime-scraped.json"

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
