#!/usr/bin/env python3
"""Scrape Drive Thru History products from drivethruhistory.com (WooCommerce store API)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
API_BASE = "https://drivethruhistory.com/wp-json/wc/store/products"
ADVENTURES_OFFER_URL = "https://www.drivethruadventures.com/offers/wn2di2PC"
PER_PAGE = 100
SITE_NAME = "Drive Thru History"

SKIP_SLUGS = {"woocommerce-automated-testing-product-2"}

TAG_AGES = {
    "american history": "Middle School; High School",
    "ancient history": "Middle School; High School",
    "acts to revelation": "Middle School; High School",
    "the gospels": "All Ages; Middle School through Adult",
    "ends of the earth": "Middle School; High School",
    "subscription": "All Ages; Middle School through High School",
    "drive thru history adventures": "All Ages; Middle School through High School",
}

TITLE_AGES = {
    "holy land": "Middle School; High School",
    "america": "Middle School; High School",
    "ancient": "Middle School; High School",
    "gospels": "All Ages; Middle School through Adult",
    "acts": "Middle School; High School",
    "colonial": "Middle School; High School",
    "t-shirt": "All Ages",
    "map": "Middle School; High School",
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
            return None
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


def fetch_adventures_all_access_price() -> str:
    try:
        html = fetch(ADVENTURES_OFFER_URL).decode("utf-8", errors="replace")
    except Exception as exc:
        print(f"WARN: could not fetch Adventures pricing: {exc}", file=sys.stderr)
        return "See drivethruadventures.com"

    prices = re.findall(r"\$[\d,.]+", html)
    if not prices:
        return "See drivethruadventures.com"
    annual = prices[0].replace(",", "")
    return f"{annual}/year All-Access (drivethruadventures.com); courses $19.90-$89.95"


def extract_ages(product: dict) -> str:
    labels: list[str] = []
    seen: set[str] = set()

    tags = [tag.get("name", "") for tag in product.get("tags") or []]
    haystack = " ".join(
        [
            product.get("name", ""),
            product.get("slug", ""),
            strip_html(product.get("short_description") or product.get("description") or ""),
            " ".join(tags),
        ]
    ).lower()

    for tag in tags:
        key = tag.lower()
        if key in TAG_AGES:
            label = TAG_AGES[key]
            if label.lower() not in seen:
                seen.add(label.lower())
                labels.append(label)

    for needle, label in TITLE_AGES.items():
        if needle in haystack and label.lower() not in seen:
            seen.add(label.lower())
            labels.append(label)

    if not labels:
        labels.append("Middle School; High School; All Ages")

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


def product_to_row(product: dict, adventures_price: str) -> dict:
    prices = product.get("prices") or {}
    title = strip_html(product.get("name", ""))
    description = strip_html(product.get("short_description") or product.get("description") or "")
    slug = product.get("slug", "")

    price_text = format_price(prices)
    if slug == "drive-thru-history-adventures" and not price_text:
        price_text = adventures_price

    return {
        "title": title,
        "website_url": product.get("permalink", ""),
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(product),
        "prices_mentioned": price_text,
        "description": description,
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Fetching Drive Thru History products...", file=sys.stderr)
    adventures_price = fetch_adventures_all_access_price()
    products = fetch_all_products()
    products = [product for product in products if product.get("slug") not in SKIP_SLUGS]
    products = [
        product
        for product in products
        if "automated testing" not in strip_html(product.get("name", "")).lower()
    ]

    rows = [product_to_row(product, adventures_price) for product in products]
    rows = [row for row in rows if row["title"] and row["website_url"]]
    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "drivethruhistory-scraped.csv"
    json_path = data_dir / "drivethruhistory-scraped.json"

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
