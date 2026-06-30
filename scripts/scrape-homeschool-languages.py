#!/usr/bin/env python3
"""Scrape Homeschool Languages products from homeschoollanguages.com (Shopify)."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import fetch_shopify_products, shopify_product_to_row, write_scrape_output

SITE_NAME = "Homeschool Languages"
BASE_URL = "https://homeschoollanguages.com"


def main() -> None:
    products = fetch_shopify_products(BASE_URL)
    rows = [shopify_product_to_row(product, SITE_NAME, BASE_URL) for product in products]
    write_scrape_output(rows, "homeschool-languages")


if __name__ == "__main__":
    main()
