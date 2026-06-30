#!/usr/bin/env python3
"""Scrape K12 (Stride) Learning Store products from learningstore.k12.com (Shopify)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
API_BASE = "https://learningstore.k12.com/products.json"
SITE_NAME = "K12 (Stride)"
PER_PAGE = 250

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|pre-kindergarten|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"ages?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?"
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


def normalize_tags(tags: list[str] | str) -> list[str]:
    if isinstance(tags, str):
        return [tag.strip() for tag in tags.split(",") if tag.strip()]
    return [tag.strip() for tag in tags if tag.strip()]


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
    low, high = prices[0], prices[-1]
    if low == 0:
        return f"Free-${high:.2f}"
    return f"${low:.2f}-${high:.2f}"


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def extract_ages(title: str, description: str, tags: list[str], handle: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {' '.join(tags)} {handle}"

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if re.fullmatch(r"\d{1,2}", token):
            add_label(labels, seen, f"Grade {int(token)}")
        else:
            add_label(labels, seen, token.title())

    if "elementary" in haystack.lower():
        add_label(labels, seen, "Grades K-5")
    if "middle" in haystack.lower():
        add_label(labels, seen, "Grades 6-8")
    if "high school" in haystack.lower() or "high-school" in handle:
        add_label(labels, seen, "Grades 9-12")
    if "k-12" in haystack.lower() or "k12" in haystack.lower():
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
    tags = normalize_tags(product.get("tags") or [])

    return {
        "title": title,
        "website_url": f"https://learningstore.k12.com/products/{handle}",
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, tags, handle),
        "prices_mentioned": format_prices(product.get("variants") or []),
        "description": description[:320],
    }


def learning_hub_row() -> dict:
    return {
        "title": "K12 Learning Hub Supplements",
        "website_url": "https://www.k12.com/",
        "source": SITE_NAME,
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "Free (with account)",
        "description": (
            "Stride K12 Learning Hub offers thousands of supplemental lessons and resources "
            "for homeschool families using K12 online programs."
        ),
    }


def write_rows(rows: list[dict], stem: str) -> None:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / f"{stem}-scraped.csv"
    json_path = data_dir / f"{stem}-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)


def main() -> int:
    products = fetch_all_products()
    print(f"Found {len(products)} Shopify products", file=sys.stderr)

    rows = [product_to_row(product) for product in products if product.get("title")]
    rows.append(learning_hub_row())
    rows.sort(key=lambda row: row["title"].lower())

    write_rows(rows, "k12")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"  with prices: {with_prices}, with ages/grades: {with_ages}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
