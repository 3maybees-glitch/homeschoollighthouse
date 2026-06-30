#!/usr/bin/env python3
"""Scrape Alpha Omega Publications products from aop.com (Shopify)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
API_BASE = "https://aop.com/products.json"
SITE_NAME = "Alpha Omega Publications"
PER_PAGE = 250

GRADE_TAG = re.compile(
    r"^(?:grades?\s*)?"
    r"("
    r"pre\s*k\s*[-–/]?\s*\d+|"
    r"\d+\s*[-–/]\s*\d+|"
    r"\d+(?:st|nd|rd|th)?(?:\s*grade)?|"
    r"pre\s*k|"
    r"k\b"
    r")$",
    re.I,
)
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
    r"\b(elementary school|middle school|high school|upper elementary|lower elementary)\b",
    re.IGNORECASE,
)
COURSE_NUMBER = re.compile(
    r"\b(?:math|science|history|language arts|english|bible|health|geography)\s*(\d{3})\b",
    re.I,
)

COURSE_GRADES = {
    "100": "Grades Pre K-2",
    "200": "Grades 3-5",
    "300": "Grades 3-5",
    "400": "Grades 6-8",
    "500": "Grades 9-10",
    "600": "Grades 11-12",
}


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


def normalize_grade_tag(tag: str) -> str:
    cleaned = re.sub(r"\s+", " ", tag.strip())
    lower = cleaned.lower()
    if lower in {"elementary school", "lower elementary", "upper elementary"}:
        return "Grades K-5"
    if lower == "middle school":
        return "Grades 6-8"
    if lower == "high school":
        return "Grades 9-12"
    if re.fullmatch(r"\d+(?:st|nd|rd|th)\s*grade", lower):
        num = re.search(r"\d+", lower)
        return f"Grade {int(num.group())}" if num else cleaned
    if lower.startswith("grades "):
        return cleaned.replace("Grades Pre K", "Grades Pre-K").replace("Grades pre k", "Grades Pre-K")
    if lower.startswith("grade "):
        return cleaned
    if GRADE_TAG.match(cleaned):
        if re.fullmatch(r"pre\s*k", lower):
            return "Pre-K"
        if lower == "k":
            return "Kindergarten"
        if re.search(r"\d", cleaned):
            return f"Grades {cleaned}" if "-" in cleaned or "–" in cleaned else f"Grade {cleaned}"
    return cleaned


def extract_ages(title: str, description: str, tags: list[str]) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {' '.join(tags)}"

    for tag in tags:
        lower = tag.lower()
        if any(token in lower for token in ("grade", "school", "pre k", "pre-k", "kindergarten")):
            add_label(labels, seen, normalize_grade_tag(tag))

    for match in COURSE_NUMBER.finditer(title):
        course_grade = COURSE_GRADES.get(match.group(1))
        if course_grade:
            add_label(labels, seen, course_grade)

    if re.search(r"\benglish\s+(i{1,3}|iv|v)\b", haystack, re.I):
        roman = re.search(r"\benglish\s+(i{1,3}|iv|v)\b", haystack, re.I).group(1).upper()
        mapping = {"I": "Grade 9", "II": "Grade 10", "III": "Grade 11", "IV": "Grade 12", "V": "Grade 12"}
        add_label(labels, seen, mapping.get(roman, f"English {roman}"))

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if re.fullmatch(r"\d{1,2}", token):
            add_label(labels, seen, f"Grade {int(token)}")
        else:
            add_label(labels, seen, token.title())

    for match in LEVEL_WORD.finditer(haystack):
        add_label(labels, seen, normalize_grade_tag(match.group(1)))

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
        "website_url": f"https://aop.com/products/{handle}",
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

    csv_path = data_dir / "aop-scraped.csv"
    json_path = data_dir / "aop-scraped.json"
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
