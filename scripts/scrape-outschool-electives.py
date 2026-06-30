#!/usr/bin/env python3
"""Curated Outschool elective category entries for drama, photography, and cooking."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "Outschool"
BASE_URL = "https://outschool.com"

ELECTIVES = [
    ("Outschool Drama and Theater Classes", "/search?q=drama", "Grades K-12", "$5-$50 per class"),
    ("Outschool Photography Classes", "/search?q=photography", "Grades 8-18", "$5-$50 per class"),
    ("Outschool Cooking and Baking Classes", "/search?q=cooking", "Grades K-12", "$5-$50 per class"),
    ("Outschool Creative Writing Classes", "/search?q=creative+writing", "Grades K-12", "$5-$50 per class"),
    ("Outschool Journalism Classes", "/search?q=journalism", "Grades 8-18", "$5-$50 per class"),
]


def main() -> None:
    rows = [
        {
            "title": title,
            "website_url": f"{BASE_URL}{path}",
            "source": SITE_NAME,
            "grades_or_ages": grades,
            "prices_mentioned": price,
            "description": f"Live online homeschool elective classes on Outschool.",
        }
        for title, path, grades, price in ELECTIVES
    ]
    write_scrape_output(rows, "outschool-electives")


if __name__ == "__main__":
    main()
