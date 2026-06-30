#!/usr/bin/env python3
"""Scrape Spelling Power product pages from spellingpower.com."""

from __future__ import annotations

import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Spelling Power"
BASE_URL = "https://www.spellingpower.com"

PRODUCT_PATHS = [
    "/products/SpellingPower.htm",
    "/products/BasicPack.htm",
    "/products/DeluxePack.htm",
    "/products/ActivityTaskCards.htm",
    "/products/MagneticAlphabetTiles.htm",
    "/products/RecordBooks.htm",
    "/products/WordBankBox.htm",
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def format_prices(html: str) -> str:
    amounts = sorted(
        {
            float(value.replace(",", ""))
            for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
            if float(value.replace(",", "")) >= 5
        }
    )
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def parse_page(path: str) -> dict:
    url = f"{BASE_URL}{path}"
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path.split("/")[-1]
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    if not description:
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
        description = strip_html(h1.group(1))[:320] if h1 else ""
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description) or "Grades 3-12",
        "prices_mentioned": format_prices(html),
        "description": description,
    }


def main() -> None:
    rows = [parse_page(path) for path in PRODUCT_PATHS]
    write_scrape_output(rows, "spelling-power")


if __name__ == "__main__":
    main()
