#!/usr/bin/env python3
"""Scrape The Old Schoolhouse store products from theoldschoolhouse.com (WooCommerce)."""

from __future__ import annotations

import ssl
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import wc_product_to_row, write_scrape_output

SITE_NAME = "The Old Schoolhouse Store"
API_BASE = "https://theoldschoolhouse.com/wp-json/wc/store/v1/products"
STORE_URL = "https://www.theoldschoolhousestore.com"

SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE


def fetch_wc_products_insecure(api_base: str, per_page: int = 100) -> list[dict]:
    import json
    import urllib.request

    page = 1
    products: list[dict] = []
    while page <= 40:
        url = f"{api_base}?per_page={per_page}&page={page}"
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                )
            },
        )
        with urllib.request.urlopen(request, timeout=60, context=SSL_CONTEXT) as response:
            payload = json.loads(response.read().decode("utf-8"))
        if not payload:
            break
        products.extend(payload)
        if len(payload) < per_page:
            break
        page += 1
    return products


def main() -> None:
    products = fetch_wc_products_insecure(API_BASE)
    rows = [wc_product_to_row(product, SITE_NAME) for product in products]
    rows.insert(
        0,
        {
            "title": "The Old Schoolhouse Store",
            "website_url": STORE_URL,
            "source": SITE_NAME,
            "grades_or_ages": "Grades PreK-12",
            "prices_mentioned": "Contact for pricing",
            "description": "Digital and print homeschool curriculum from The Old Schoolhouse.",
        },
    )
    write_scrape_output(rows, "the-old-schoolhouse")


if __name__ == "__main__":
    main()
