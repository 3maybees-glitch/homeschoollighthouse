#!/usr/bin/env python3
"""Scrape FamilyEducation.com homeschool articles and resources."""

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
SITE_NAME = "FamilyEducation"
SITEMAP_URL = "https://www.familyeducation.com/sitemap.xml"


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def discover_homeschool_urls() -> list[str]:
    xml = fetch(SITEMAP_URL)
    urls = re.findall(r"<loc>([^<]+)</loc>", xml)
    return sorted({url for url in urls if "/homeschool" in url.lower()})


def parse_page(url: str) -> dict:
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else url.rstrip("/").split("/")[-1]
    title = re.sub(r"\s*\|\s*FamilyEducation.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else title
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, url) or "Grades K-12",
        "prices_mentioned": "Free",
        "description": description[:320],
    }


def main() -> None:
    urls = discover_homeschool_urls()
    rows = [parse_page(url) for url in urls]
    rows.insert(
        0,
        {
            "title": "FamilyEducation Homeschooling Resources",
            "website_url": "https://www.familyeducation.com/school-learning/homeschooling",
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": "Free",
            "description": "Articles and guides for homeschool families from FamilyEducation.com.",
        },
    )
    write_scrape_output(rows, "family-education")


if __name__ == "__main__":
    main()
