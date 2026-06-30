#!/usr/bin/env python3
"""Scrape Torchlight Curriculum level pages."""

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
SITE_NAME = "Torchlight Curriculum"
BASE_URL = "https://torchlightcurriculum.com"

LEVEL_PATHS = [
    "/torchlight/torchlight-level-pre-k/",
    "/torchlight/level-k/",
    "/torchlight/torchlight-level-1/",
    "/torchlight/torchlight-level-2/",
    "/torchlight/torchlight-level-3/",
    "/torchlight/torchlight-level-4/",
    "/torchlight/torchlight-level-5/",
    "/torchlight/levelplacement/",
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


def parse_page(path: str) -> dict:
    url = f"{BASE_URL}{path}"
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path
    title = re.sub(r"\s*\|\s*Torchlight Curriculum.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else title
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, path) or "Grades PreK-5",
        "prices_mentioned": format_prices(html),
        "description": description[:320],
    }


def main() -> None:
    rows = [parse_page(path) for path in LEVEL_PATHS]
    rows.insert(
        0,
        {
            "title": "Torchlight Curriculum",
            "website_url": BASE_URL,
            "source": SITE_NAME,
            "grades_or_ages": "Grades PreK-5",
            "prices_mentioned": "Contact for pricing",
            "description": "Literature-rich secular homeschool curriculum with multi-subject integration.",
        },
    )
    write_scrape_output(rows, "torchlight")


if __name__ == "__main__":
    main()
