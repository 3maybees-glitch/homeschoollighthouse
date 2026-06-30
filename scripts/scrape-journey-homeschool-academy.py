#!/usr/bin/env python3
"""Curated Journey Homeschool Academy Experience Astronomy entries."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "Journey Homeschool Academy"
BASE_URL = "https://journeyhomeschoolacademy.com"

PRODUCTS = [
    ("Experience Astronomy", "Grades 6-12", "$199-$249"),
    ("Experience Astronomy Plus", "Grades 6-12", "$249-$299"),
    ("Experience Biology", "Grades 9-12", "$199-$249"),
    ("Experience Chemistry", "Grades 9-12", "$199-$249"),
    ("Journey Homeschool Academy", "Grades 6-12", "Contact for pricing"),
]


def main() -> None:
    rows = [
        {
            "title": title,
            "website_url": f"{BASE_URL}/experience-astronomy/" if "Astronomy" in title else BASE_URL,
            "source": SITE_NAME,
            "grades_or_ages": grades,
            "prices_mentioned": price,
            "description": f"Online science elective from Journey Homeschool Academy: {title}.",
        }
        for title, grades, price in PRODUCTS
    ]
    write_scrape_output(rows, "journey-homeschool-academy")


if __name__ == "__main__":
    main()
