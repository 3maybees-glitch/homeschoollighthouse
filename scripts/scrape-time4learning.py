#!/usr/bin/env python3
"""Scrape Time4Learning products from time4learning.com (Shopify)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
API_BASE = "https://www.time4learning.com/products.json"
SITE_NAME = "Time4Learning"
PER_PAGE = 250

MERCH_PRODUCT_TYPES = {
    "T-Shirt",
    "Mug",
    "Hats",
    "Sweatshirt",
    "Sweatpants",
    "All Over Prints",
    "Home Decor",
    "Accessories",
    "Kids clothes",
}

GRADE_FROM_HANDLE = {
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

LEVEL_TAGS = {
    "beginner": "Grades K-5",
    "intermediate": "Grades 6-8",
    "advanced": "Grades 9-12",
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
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def grades_from_handle(handle: str) -> list[str]:
    labels: list[str] = []
    for key, label in GRADE_FROM_HANDLE.items():
        if key in handle:
            labels.append(label)
            break
    return labels


def extract_ages(title: str, description: str, tags: list[str], handle: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {' '.join(tags)} {handle}"

    for label in grades_from_handle(handle):
        add_label(labels, seen, label)

    for tag in tags:
        level = LEVEL_TAGS.get(tag.lower())
        if level:
            add_label(labels, seen, level)
        if tag.lower() == "elective":
            add_label(labels, seen, "Grades 9-12")

    if "brightspire" in haystack.lower() or "high school elective" in haystack.lower():
        add_label(labels, seen, "Grades 9-12")

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if re.fullmatch(r"\d{1,2}", token):
            add_label(labels, seen, f"Grade {int(token)}")
        else:
            add_label(labels, seen, token.title())

    if "elementary" in handle or "elementary" in haystack.lower():
        add_label(labels, seen, "Grades K-5")
    if "middle-school" in handle or "middle school" in haystack.lower():
        add_label(labels, seen, "Grades 6-8")
    if "high-school" in handle or "high school" in haystack.lower():
        add_label(labels, seen, "Grades 9-12")

    return "; ".join(labels[:8])


def is_educational_product(product: dict) -> bool:
    product_type = product.get("product_type") or ""
    if product_type in MERCH_PRODUCT_TYPES:
        return False

    handle = product.get("handle", "")
    tags = [tag.lower() for tag in normalize_tags(product.get("tags") or [])]
    title = product.get("title", "").lower()

    if "-curriculum" in handle or handle.endswith("-curriculum"):
        return True
    if "elective" in tags:
        return True
    if "book" in tags or "bundle" in handle:
        return True
    if product_type in {"Hardcover", "Mass Market Paperback", "Quality Paper", "Paper products"}:
        return True
    if re.search(r"\bgrade\b", title):
        return True

    fashion_markers = (
        "back to school gear",
        "casual fashion",
        "apparel",
        "clothing",
        "sweatshirt",
        "sweatpants",
        "embroidered hat",
        "ceramic mug",
    )
    if any(marker in " ".join(tags) for marker in fashion_markers):
        return False

    return False


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
        "website_url": f"https://www.time4learning.com/products/{handle}",
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, tags, handle),
        "prices_mentioned": format_prices(product.get("variants") or []),
        "description": description[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    products = fetch_all_products()
    educational = [product for product in products if is_educational_product(product)]
    print(
        f"Found {len(products)} Shopify products ({len(educational)} educational resources)",
        file=sys.stderr,
    )

    rows = [product_to_row(product) for product in educational if product.get("title")]
    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "time4learning-scraped.csv"
    json_path = data_dir / "time4learning-scraped.json"
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
