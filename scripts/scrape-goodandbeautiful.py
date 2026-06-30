#!/usr/bin/env python3
"""Scrape The Good and the Beautiful products from goodandbeautiful.com (Shopify)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
API_BASE = "https://www.goodandbeautiful.com/products.json"
SITE_NAME = "The Good and the Beautiful"
PER_PAGE = 250

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"ages?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?"
    r")\b",
    re.IGNORECASE,
)
LEVEL_WORD = re.compile(
    r"\b(upper elementary|lower elementary|elementary|middle school|high school)\b",
    re.IGNORECASE,
)
TITLE_MATH = re.compile(r"\bmath\s*(\d{1,2}|k)\b", re.I)
TITLE_LEVEL = re.compile(r"\blevel\s*(\d{1,2}|k)(?:\s*[-/]\s*(\d{1,2}))?\b", re.I)
TAG_LEVEL = re.compile(r"\blevel\s*(\d{1,2}|k)(?:\s*[-/]\s*(\d{1,2}))?\b", re.I)
TAG_MATH = re.compile(r"\bmath\s*(\d{1,2}|k)\b", re.I)


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


def format_prices(variants: list[dict]) -> str:
    prices: list[float] = []
    for variant in variants:
        raw = variant.get("price")
        if raw in (None, ""):
            continue
        value = float(raw)
        if value >= 0:
            prices.append(value)

    prices = sorted(set(prices))
    if not prices:
        return ""
    if len(prices) == 1:
        if prices[0] == 0:
            return "Free"
        return f"${prices[0]:.2f}"
    if prices[0] == 0 and len(prices) == 2:
        return f"${prices[1]:.2f}"
    nonzero = [price for price in prices if price > 0]
    if not nonzero:
        return "Free"
    if len(nonzero) == 1:
        return f"${nonzero[0]:.2f}"
    return f"${nonzero[0]:.2f}-${nonzero[-1]:.2f}"


def grade_label(number: str) -> str:
    token = number.strip().lower()
    if token == "k":
        return "K"
    return f"Grade {int(token)}"


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def labels_from_level_match(match: re.Match[str], labels: list[str], seen: set[str]) -> None:
    first = match.group(1)
    second = match.group(2) if match.lastindex and match.lastindex >= 2 else None
    if second:
        add_label(labels, seen, f"Grades {first.upper() if first.lower() == 'k' else int(first)}-{second}")
        return
    add_label(labels, seen, grade_label(first))


def extract_ages(title: str, description: str, tags: list[str]) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {' '.join(tags)}"

    for tag in tags:
        lower = tag.lower()
        if "preschool" in lower:
            add_label(labels, seen, "Preschool")
        if "kindergarten" in lower or re.search(r"\blevel k\b", lower):
            add_label(labels, seen, "Kindergarten")
        if "high school" in lower:
            add_label(labels, seen, "Grades 9-12")

        match = TAG_LEVEL.search(tag)
        if match:
            labels_from_level_match(match, labels, seen)
            continue

        match = TAG_MATH.search(tag)
        if match:
            add_label(labels, seen, grade_label(match.group(1)))

    for match in TITLE_MATH.finditer(title):
        add_label(labels, seen, grade_label(match.group(1)))
    for match in TITLE_LEVEL.finditer(title):
        labels_from_level_match(match, labels, seen)

    for match in GRADE_WORD.finditer(haystack):
        add_label(labels, seen, match.group(1))
    for match in LEVEL_WORD.finditer(haystack):
        add_label(labels, seen, match.group(1).title())

    if "typing" in title.lower() and not labels:
        add_label(labels, seen, "Grades 3-12")

    return "; ".join(labels[:8])


def fetch_all_products() -> list[dict]:
    page = 1
    products: list[dict] = []

    while True:
        url = f"{API_BASE}?limit={PER_PAGE}&page={page}"
        print(f"Fetching page {page}...", file=sys.stderr)
        payload = json.loads(fetch(url).decode("utf-8"))
        batch = payload.get("products", [])
        if not batch:
            break
        products.extend(batch)
        if len(batch) < PER_PAGE:
            break
        page += 1

    return products


def product_to_row(product: dict) -> dict:
    title = product.get("title", "").strip()
    handle = product.get("handle", "").strip()
    description = strip_html(product.get("body_html", ""))
    tags = product.get("tags") or []
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",") if tag.strip()]

    return {
        "title": title,
        "website_url": f"https://www.goodandbeautiful.com/products/{handle}",
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, tags),
        "prices_mentioned": format_prices(product.get("variants") or []),
        "description": description[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    products = fetch_all_products()
    print(f"Found {len(products)} products", file=sys.stderr)

    rows = [product_to_row(product) for product in products if product.get("title")]
    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "goodandbeautiful-scraped.csv"
    json_path = data_dir / "goodandbeautiful-scraped.json"
    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(f"  with prices: {with_prices}, with ages/grades: {with_ages}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
