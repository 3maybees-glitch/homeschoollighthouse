#!/usr/bin/env python3
"""Curated Rosetta Stone homeschool language learning plans."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "Rosetta Stone"
BASE_URL = "https://www.rosettastone.com"

PLANS = [
    ("Rosetta Stone Homeschool — 3 Month", "Grades K-12", "$35.97"),
    ("Rosetta Stone Homeschool — 12 Month", "Grades K-12", "$119.88"),
    ("Rosetta Stone Homeschool — Lifetime", "Grades K-12", "$199.00"),
    ("Rosetta Stone Homeschool Edition", "Grades K-12", "$35.97-$199.00"),
]


def main() -> None:
    rows = [
        {
            "title": title,
            "website_url": BASE_URL,
            "source": SITE_NAME,
            "grades_or_ages": grades,
            "prices_mentioned": price,
            "description": "Rosetta Stone language learning for homeschool families.",
        }
        for title, grades, price in PLANS
    ]
    write_scrape_output(rows, "rosetta-stone")


if __name__ == "__main__":
    main()
