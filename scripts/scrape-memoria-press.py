#!/usr/bin/env python3
"""Scrape Memoria Press products and Memoria Academy program pages."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Memoria Press"
API_BASE = "https://www.memoriapress.com/wp-json/wc/store/v1/products"
PER_PAGE = 100

PROGRAM_PAGES = [
    {
        "title": "Memoria Academy Online Courses",
        "website_url": "https://www.memoriapress.com/product-category/online-academy/",
        "grades_or_ages": "Grades 3-12",
        "prices_mentioned": "Contact for pricing",
        "description": "Live and self-paced online classical courses from Memoria Academy.",
    },
    {
        "title": "Memoria Press VideoText Online",
        "website_url": "https://www.memoriapress.com/product-category/videotext-online/",
        "grades_or_ages": "Grades 9-12",
        "prices_mentioned": "Contact for pricing",
        "description": "Online VideoText math courses from Memoria Press.",
    },
]

GRADE_SLUGS = {
    "preschool": "Preschool",
    "kindergarten": "Kindergarten",
    "first-grade": "Grade 1",
    "second-grade": "Grade 2",
    "third-grade": "Grade 3",
    "fourth-grade": "Grade 4",
    "fifth-grade": "Grade 5",
    "sixth-grade": "Grade 6",
    "seventh-grade": "Grade 7",
    "eighth-grade": "Grade 8",
    "ninth-grade": "Grade 9",
    "tenth-grade": "Grade 10",
    "eleventh-grade": "Grade 11",
    "twelfth-grade": "Grade 12",
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


def format_price(prices: dict) -> str:
    minor = prices.get("currency_minor_unit", 2)
    divisor = 10**minor

    def to_dollars(raw: str | int | None) -> str | None:
        if raw in (None, ""):
            return None
        return f"${int(raw) / divisor:.2f}"

    sale = to_dollars(prices.get("sale_price"))
    regular = to_dollars(prices.get("regular_price"))
    base = to_dollars(prices.get("price"))
    if sale and regular and sale != regular:
        return f"{sale} (was {regular})"
    return base or regular or ""


def extract_ages(categories: list[dict], title: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()

    for category in categories:
        slug = category.get("slug", "")
        name = category.get("name", "")
        label = GRADE_SLUGS.get(slug) or (
            name if re.search(r"grade|school|kindergarten|preschool", name, re.I) else ""
        )
        if label and label.lower() not in seen:
            seen.add(label.lower())
            labels.append(label)

    if "online class" in title.lower() or "academy" in title.lower():
        labels.append("Grades 3-12")
    return "; ".join(list(dict.fromkeys(labels))[:8])


def fetch_all_products() -> list[dict]:
    page = 1
    products: list[dict] = []
    while page <= 25:
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
    title = strip_html(product.get("name", ""))
    return {
        "title": title,
        "website_url": product.get("permalink", ""),
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(product.get("categories") or [], title),
        "prices_mentioned": format_price(product.get("prices") or {}),
        "description": strip_html(
            product.get("short_description") or product.get("description") or ""
        )[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows = [product_to_row(product) for product in fetch_all_products()]
    rows = [row for row in rows if row["title"] and row["website_url"]]
    for entry in PROGRAM_PAGES:
        rows.append({**entry, "source": SITE_NAME})
    rows.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = data_dir / "memoria-press-scraped.csv"
    json_path = data_dir / "memoria-press-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
