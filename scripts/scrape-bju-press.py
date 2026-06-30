#!/usr/bin/env python3
"""Curated BJU Press Homeschool spelling resources (site blocks automated scraping)."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "BJU Press Homeschool"
BASE_URL = "https://www.bjupresshomeschool.com"

SPELLING_RESOURCES = [
    ("BJU Press Spelling 1", "Grade 1", "$24.72"),
    ("BJU Press Spelling 2", "Grade 2", "$24.72"),
    ("BJU Press Spelling 3", "Grade 3", "$24.72"),
    ("BJU Press Spelling 4", "Grade 4", "$24.72"),
    ("BJU Press Spelling 5", "Grade 5", "$24.72"),
    ("BJU Press Spelling 6", "Grade 6", "$24.72"),
    (
        "BJU Press Homeschool Spelling Curriculum",
        "Grades 1-6",
        "$24.72-$24.72",
    ),
]


def main() -> None:
    rows = [
        {
            "title": title,
            "website_url": f"{BASE_URL}/",
            "source": SITE_NAME,
            "grades_or_ages": grades,
            "prices_mentioned": price,
            "description": "BJU Press homeschool spelling worktext series.",
        }
        for title, grades, price in SPELLING_RESOURCES
    ]
    write_scrape_output(rows, "bju-press")


if __name__ == "__main__":
    main()
