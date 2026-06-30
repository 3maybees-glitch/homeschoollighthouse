#!/usr/bin/env python3
"""Curated HomeschoolReviews.com entry (domain currently redirects to a lander)."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "HomeschoolReviews.com"
BASE_URL = "https://www.homeschoolreviews.com"


def main() -> None:
    rows = [
        {
            "title": "HomeschoolReviews.com",
            "website_url": BASE_URL,
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": "Free",
            "description": (
                "Homeschool curriculum review community. The domain currently redirects to a "
                "placeholder lander page rather than an active review directory."
            ),
        },
        {
            "title": "HomeschoolReviews.com Archive Landing Page",
            "website_url": f"{BASE_URL}/lander",
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": "Free",
            "description": "Current landing page served for homeschoolreviews.com visitors.",
        },
    ]
    write_scrape_output(rows, "homeschool-reviews")


if __name__ == "__main__":
    main()
