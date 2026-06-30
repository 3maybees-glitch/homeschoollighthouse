#!/usr/bin/env python3
"""Scrape Breaking the Barrier language products from tobreak.com (Shopify)."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import fetch_shopify_products, shopify_product_to_row, write_scrape_output

SITE_NAME = "Breaking the Barrier"
BASE_URL = "https://tobreak.com"


def main() -> None:
    products = fetch_shopify_products(BASE_URL)
    rows = [shopify_product_to_row(product, SITE_NAME, BASE_URL) for product in products]
    write_scrape_output(rows, "breaking-the-barrier")


if __name__ == "__main__":
    main()
