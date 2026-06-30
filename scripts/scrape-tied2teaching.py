#!/usr/bin/env python3
"""Scrape Tied 2 Teaching resources from tied2teaching.com (WooCommerce store API)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
API_BASE = "https://tied2teaching.com/wp-json/wc/store/products"
PER_PAGE = 100
SITE_NAME = "Tied 2 Teaching"

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"\d{1,2}(?:st|nd|rd|th)\s*[-–/]\s*\d{1,2}(?:st|nd|rd|th)"
    r")\b",
    re.IGNORECASE,
)

LEVEL_WORD = re.compile(
    r"\b(upper elementary|lower elementary|elementary|middle school|high school)\b",
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


def normalize_grade_token(token: str) -> str:
    cleaned = token.strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.title().replace("Pre-K", "Pre-K").replace("Prek", "Pre-K")


def extract_ages(title: str, description: str, categories: list[dict]) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description}"

    for match in GRADE_WORD.finditer(haystack):
        label = normalize_grade_token(match.group(0))
        key = label.lower()
        if key not in seen:
            seen.add(key)
            labels.append(label)

    for match in LEVEL_WORD.finditer(haystack):
        label = normalize_grade_token(match.group(0))
        key = label.lower()
        if key not in seen:
            seen.add(key)
            labels.append(label)

    if not labels:
        # Site focus: upper elementary teachers and homeschool parents
        subject_cats = [
            c.get("name", "")
            for c in categories
            if not c.get("name", "").lower().startswith("featured")
            and c.get("name", "") not in {"Shop TpT"}
        ]
        if subject_cats:
            labels.append("Upper Elementary (3rd-5th Grade)")

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
    categories = product.get("categories") or []
    title = strip_html(product.get("name", ""))
    description = strip_html(product.get("short_description") or product.get("description") or "")

    return {
        "title": title,
        "website_url": product.get("permalink", ""),
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, categories),
        "prices_mentioned": format_price(prices),
        "description": description,
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Fetching Tied 2 Teaching products...", file=sys.stderr)
    products = fetch_all_products()
    rows = [product_to_row(product) for product in products]
    rows = [row for row in rows if row["title"] and row["website_url"]]

    csv_path = data_dir / "tied2teaching-scraped.csv"
    json_path = data_dir / "tied2teaching-scraped.json"

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
