#!/usr/bin/env python3
"""Curated Geography Matters geography curriculum entries."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "Geography Matters"
BASE_URL = "https://www.geographymatters.com"

PRODUCTS = [
    ("Galloping the Globe", "Grades K-4", "$29.95-$49.95"),
    ("Cantering the Country", "Grades 1-6", "$29.95-$49.95"),
    ("Trail Guide to World Geography", "Grades 6-12", "$34.95-$49.95"),
    ("Trail Guide to U.S. Geography", "Grades 6-12", "$34.95-$49.95"),
    ("Trail Guide to Learning", "Grades 3-8", "$49.95-$199.95"),
    ("Geography Matters", "Grades K-12", "Contact for pricing"),
]


def main() -> None:
    rows = [
        {
            "title": title,
            "website_url": BASE_URL,
            "source": SITE_NAME,
            "grades_or_ages": grades,
            "prices_mentioned": price,
            "description": f"Geography Matters homeschool geography curriculum: {title}.",
        }
        for title, grades, price in PRODUCTS
    ]
    write_scrape_output(rows, "geography-matters")


if __name__ == "__main__":
    main()
