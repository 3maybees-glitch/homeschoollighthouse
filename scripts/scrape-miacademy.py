#!/usr/bin/env python3
"""Scrape Miacademy homeschool curriculum and pricing pages."""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Miacademy"
BASE_URL = "https://miacademy.co"

PATHS = [
    ("/", "Miacademy Online Curriculum", "Grades K-8"),
    ("/homeschool-curriculum/", "Miacademy Homeschool Curriculum", "Grades K-8"),
    ("/homeschool-curriculum/k8-curriculum/", "Miacademy K-8 Curriculum", "Grades K-8"),
    ("/homeschool-curriculum/financial-options/", "Miacademy Financial Options", "Grades K-8"),
    ("/homeschool-curriculum/how-to-homeschool/", "Miacademy How to Homeschool", "Grades K-8"),
    ("/homeschool-curriculum/state-funding-for-miacademy/", "Miacademy State Funding", "Grades K-8"),
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
            if float(value.replace(",", "")) >= 1
        }
    )
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def parse_page(path: str, fallback_title: str, grades: str) -> dict:
    url = f"{BASE_URL}{path}"
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else fallback_title
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    return {
        "title": title or fallback_title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, path) or grades,
        "prices_mentioned": format_prices(html),
        "description": description or "Engaging online homeschool curriculum with electives.",
    }


def main() -> None:
    rows = [parse_page(path, title, grades) for path, title, grades in PATHS]
    write_scrape_output(rows, "miacademy")


if __name__ == "__main__":
    main()
