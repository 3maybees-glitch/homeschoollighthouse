#!/usr/bin/env python3
"""Scrape HSLDA membership, legal, and homeschool support pages."""

from __future__ import annotations

import re
import ssl
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "HSLDA"
BASE_URL = "https://hslda.org"
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

PAGES = [
    ("/membership", "HSLDA Membership", "$15-$1500", "Grades K-12"),
    ("/jointoday", "Join HSLDA Today", "$15-$1500", "Grades K-12"),
    ("/laws", "Homeschool Laws By State", "Free", "Grades K-12"),
    ("/legal", "HSLDA Legal Services", "Contact for pricing", "Grades K-12"),
    ("/teaching-my-kids/special-needs", "HSLDA Special Needs Support", "Contact for pricing", "Grades K-12"),
]

MEMBERSHIP_PLANS = [
    ("HSLDA Lifetime Membership", "$1500.00"),
    ("HSLDA Pay Yearly Membership", "$150.00"),
    ("HSLDA Pay Monthly Membership", "$15.00/month"),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60, context=SSL_CONTEXT) as response:
        return response.read().decode("utf-8", errors="replace")


def parse_page(path: str, fallback_title: str, price_hint: str, grades: str) -> dict:
    url = f"{BASE_URL}{path}"
    html = fetch(url)
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(match.group(1)) if match else fallback_title
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else fallback_title
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades,
        "prices_mentioned": price_hint,
        "description": description[:320],
    }


def main() -> None:
    rows = [parse_page(path, title, prices, grades) for path, title, prices, grades in PAGES]
    rows.extend(
        {
            "title": title,
            "website_url": f"{BASE_URL}/membership",
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": price,
            "description": "Homeschool Legal Defense Association membership plan.",
        }
        for title, price in MEMBERSHIP_PLANS
    )
    write_scrape_output(rows, "hslda")


if __name__ == "__main__":
    main()
