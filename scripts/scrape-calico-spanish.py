#!/usr/bin/env python3
"""Scrape Calico Spanish products from calicospanish.com (WooCommerce store API)."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import fetch_wc_products, wc_product_to_row, write_scrape_output

SITE_NAME = "Calico Spanish"
API_BASE = "https://calicospanish.com/wp-json/wc/store/v1/products"


def main() -> None:
    products = fetch_wc_products(API_BASE)
    rows = [wc_product_to_row(product, SITE_NAME) for product in products]
    write_scrape_output(rows, "calico-spanish")


if __name__ == "__main__":
    main()
