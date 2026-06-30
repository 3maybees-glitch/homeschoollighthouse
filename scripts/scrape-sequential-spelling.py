#!/usr/bin/env python3
"""Scrape Sequential Spelling Online program pages."""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Sequential Spelling"
BASE_URL = "https://www.sequentialspelling.com"

PAGES = [
    ("/v2/", "Sequential Spelling Online", "Grades 2-12"),
    ("/v2/static/method.php", "Sequential Spelling Method", "Grades 2-12"),
    ("/v2/signup.php", "Sequential Spelling Online Subscription", "Grades 2-12"),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def parse_page(path: str, fallback_title: str, grades: str) -> dict:
    url = f"{BASE_URL}{path}"
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else fallback_title
    title = re.sub(r"\s*[—|-]\s*Sequential Spelling\s*$", "", title, flags=re.I).strip() or fallback_title
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    description = strip_html(h1.group(1))[:320] if h1 else "Online sequential spelling program."
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades,
        "prices_mentioned": "Contact for pricing",
        "description": description,
    }


def main() -> None:
    rows = [parse_page(path, title, grades) for path, title, grades in PAGES]
    write_scrape_output(rows, "sequential-spelling")


if __name__ == "__main__":
    main()
