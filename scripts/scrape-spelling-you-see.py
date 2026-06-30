#!/usr/bin/env python3
"""Scrape Spelling You See level pages from spellingyousee.com."""

from __future__ import annotations

import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Spelling You See"
BASE_URL = "https://spellingyousee.com"

LEVEL_PATHS = [
    "/levels/listen-and-write/",
    "/levels/jack-and-jill/",
    "/levels/wild-tales/",
    "/levels/americana/",
    "/levels/american-spirit/",
    "/levels/ancient-achievements/",
    "/levels/modern-milestones/",
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def parse_page(url: str) -> dict:
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else ""
    title = re.sub(r"\s*-\s*Spelling You See\s*$", "", title, flags=re.I).strip()

    h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    heading = strip_html(h1_match.group(1)) if h1_match else title

    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    if not description:
        paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", html, re.S | re.I)
        for paragraph in paragraphs:
            text = strip_html(paragraph)
            if len(text) > 40:
                description = text[:320]
                break

    prices = sorted(
        {
            float(value.replace(",", ""))
            for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
            if float(value.replace(",", "")) > 0
        }
    )
    if prices:
        price_text = f"${prices[0]:.2f}" if len(prices) == 1 else f"${prices[0]:.2f}-${prices[-1]:.2f}"
    else:
        price_text = "Contact for pricing"

    return {
        "title": f"Spelling You See: {heading or title}",
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(heading or title, description, url),
        "prices_mentioned": price_text,
        "description": description or f"Spelling You See level from Demme Learning.",
    }


def main() -> None:
    rows = [parse_page(f"{BASE_URL}{path}") for path in LEVEL_PATHS]
    overview = {
        "title": "Spelling You See",
        "website_url": f"{BASE_URL}/levels/",
        "source": SITE_NAME,
        "grades_or_ages": "Grades K-8",
        "prices_mentioned": "Contact for pricing",
        "description": "Research-based spelling curriculum using copywork, reading, and dictation.",
    }
    rows.insert(0, overview)
    write_scrape_output(rows, "spelling-you-see")


if __name__ == "__main__":
    main()
