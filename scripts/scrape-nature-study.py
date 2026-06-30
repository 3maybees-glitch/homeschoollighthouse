#!/usr/bin/env python3
"""Scrape nature study resources including Handbook of Nature Study and guides."""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Nature Study Resources"

PAGES = [
    (
        "Handbook of Nature Study (Public Domain)",
        "https://www.gutenberg.org/ebooks/78142",
        "Free",
        "Grades K-8",
        "Anna Botsford Comstock's Handbook of Nature Study, available free via Project Gutenberg.",
    ),
    (
        "Handbook of Nature Study Blog",
        "https://www.handbookofnaturestudy.com/",
        "Free",
        "Grades K-8",
        "Outdoor hour challenge and Charlotte Mason nature study ideas from Handbook of Nature Study.",
    ),
    (
        "AmblesideOnline Nature Study Guide",
        "https://www.amblesideonline.org/NatureStudy.shtml",
        "Free",
        "Grades K-8",
        "Charlotte Mason nature study guidance from AmblesideOnline.",
    ),
    (
        "Seasons Afield Nature Study (Beautiful Feet)",
        "https://www.bfbooks.com/products/seasons-afield-nature-study-k-3",
        "Contact for pricing",
        "Grades K-3",
        "Charlotte Mason-inspired nature study curriculum from Beautiful Feet Books.",
    ),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def enrich_row(title: str, url: str, price: str, grades: str, description: str) -> dict:
    try:
        html = fetch(url)
        meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
        if meta and meta.group(1).strip():
            description = strip_html(meta.group(1))[:320]
    except Exception:
        pass
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades,
        "prices_mentioned": price,
        "description": description,
    }


def main() -> None:
    rows = [enrich_row(*entry) for entry in PAGES]
    write_scrape_output(rows, "nature-study")


if __name__ == "__main__":
    main()
