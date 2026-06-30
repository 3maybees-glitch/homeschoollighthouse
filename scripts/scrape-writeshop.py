#!/usr/bin/env python3
"""Scrape WriteShop products from the Demme Learning Shopify store and overview pages."""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import (
    extract_ages,
    fetch_shopify_products,
    format_shopify_prices,
    shopify_product_to_row,
    strip_html,
    write_scrape_output,
)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "WriteShop"
STORE_URL = "https://store.demmelearning.com"
OVERVIEW_PAGES = [
    ("https://www.writeshop.com/writeshop-primary-overview/", "WriteShop Primary Overview", "Grades K-3"),
    ("https://www.writeshop.com/writeshop-junior-overview/", "WriteShop Junior Overview", "Grades 3-6"),
    ("https://www.writeshop.com/writeshop-i-ii-overview/", "WriteShop I & II Overview", "Grades 6-12"),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def is_writeshop_product(product: dict) -> bool:
    tags = product.get("tags") or []
    if isinstance(tags, str):
        tags = [tags]
    haystack = " ".join(
        [
            product.get("title", ""),
            product.get("handle", ""),
            product.get("body_html", ""),
            " ".join(tags),
        ]
    ).lower()
    return "writeshop" in haystack or product.get("handle", "").startswith("ws-")


def overview_row(url: str, title: str, grades: str) -> dict:
    html = fetch(url)
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades,
        "prices_mentioned": "Contact for pricing",
        "description": description or f"{title} from WriteShop.",
    }


def main() -> None:
    products = [product for product in fetch_shopify_products(STORE_URL) if is_writeshop_product(product)]
    rows = [shopify_product_to_row(product, SITE_NAME, STORE_URL) for product in products]
    rows.extend(overview_row(url, title, grades) for url, title, grades in OVERVIEW_PAGES)
    write_scrape_output(rows, "writeshop")


if __name__ == "__main__":
    main()
