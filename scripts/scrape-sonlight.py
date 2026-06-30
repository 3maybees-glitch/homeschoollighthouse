#!/usr/bin/env python3
"""Scrape Sonlight products from sonlight.com (Shopify)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
API_BASE = "https://www.sonlight.com/products.json"
SITE_NAME = "Sonlight"
PER_PAGE = 250

SONLIGHT_LEVEL_GRADES = {
    "a": "Kindergarten",
    "b": "Grade 1",
    "c": "Grade 2",
    "d": "Grade 3",
    "e": "Grade 4",
    "f": "Grade 5",
    "g": "Grade 6",
    "h": "Grade 7",
    "i": "Grade 8",
    "j": "Grade 9",
    "k": "Grade 10",
    "l": "Grade 11",
    "w": "Grade 12",
}

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|pre-kindergarten|kindergarten|\bk\b|"
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
TITLE_GRADE = re.compile(r"\b(\d{1,2})(?:st|nd|rd|th)\s*grade\b", re.I)
FOR_GRADE = re.compile(r"\bfor\s+grade\s*(\d{1,2})\b", re.I)
GRADE_READERS = re.compile(r"\bgrade\s*(\d{1,2})\s*readers?\b", re.I)
SONLIGHT_LEVEL = re.compile(
    r"\b(?:sonlight\s+)?(?:science|history/bible/literature|history|core|level|package)\s*([a-w])\b",
    re.I,
)
LEVEL_ONLY = re.compile(r"\blevel\s*([a-w])\b", re.I)
HISTORY_LEVEL = re.compile(r"\bhistory\s*([a-w])\b", re.I)
PACKAGE_LEVEL = re.compile(r"\bpackage\s*([a-w])\b", re.I)


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
    nonzero = [price for price in prices if price > 0]
    if not nonzero:
        return "Free"
    if len(nonzero) == 1:
        return f"${nonzero[0]:.2f}"
    return f"${nonzero[0]:.2f}-${nonzero[-1]:.2f}"


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def grade_from_level_letter(letter: str) -> str:
    return SONLIGHT_LEVEL_GRADES.get(letter.lower(), f"Level {letter.upper()}")


def extract_ages(title: str, description: str, tags: list[str], product_type: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {' '.join(tags)} {product_type}"

    if re.search(r"\bpre-kindergarten\b|\bpre-k\b|\bpreschool\b", haystack, re.I):
        add_label(labels, seen, "Pre-K")
    if re.search(r"\bkindergarten\b", haystack, re.I):
        add_label(labels, seen, "Kindergarten")

    for match in TITLE_GRADE.finditer(title):
        add_label(labels, seen, f"Grade {int(match.group(1))}")
    for match in FOR_GRADE.finditer(haystack):
        add_label(labels, seen, f"Grade {int(match.group(1))}")
    for match in GRADE_READERS.finditer(haystack):
        add_label(labels, seen, f"Grade {int(match.group(1))}")

    for pattern in (SONLIGHT_LEVEL, LEVEL_ONLY, HISTORY_LEVEL, PACKAGE_LEVEL):
        for match in pattern.finditer(haystack):
            add_label(labels, seen, grade_from_level_letter(match.group(1)))

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if re.fullmatch(r"\d{1,2}", token):
            add_label(labels, seen, f"Grade {int(token)}")
        else:
            add_label(labels, seen, token.title())

    for match in LEVEL_WORD.finditer(haystack):
        add_label(labels, seen, match.group(1).title())

    if product_type == "ALLSUBJECT" and not labels:
        add_label(labels, seen, "Grades K-12")

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
        "website_url": f"https://www.sonlight.com/products/{handle}",
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, tags, product.get("product_type", "")),
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

    csv_path = data_dir / "sonlight-scraped.csv"
    json_path = data_dir / "sonlight-scraped.json"
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
