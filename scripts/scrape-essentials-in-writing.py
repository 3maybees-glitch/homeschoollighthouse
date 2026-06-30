#!/usr/bin/env python3
"""Scrape Essentials in Writing level and program pages."""

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
SITE_NAME = "Essentials in Writing"
BASE_URL = "https://essentialsinwriting.com"

PROGRAM_PATHS = [
    "/course-catalog/",
    "/essentials-in-writing/",
    "/essentials-in-literature/",
    "/essentials-bundle/",
    "/college-app-essay-guide/",
]

LEVEL_PATTERN = re.compile(r'href="(https://essentialsinwriting\.com/level-\d+(?:-[a-z0-9-]+)?/)"', re.I)


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def format_prices(html: str) -> str:
    amounts = sorted(
        {
            float(value.replace(",", ""))
            for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
            if float(value.replace(",", "")) >= 15
        }
    )
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def parse_page(url: str) -> dict:
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else url.rstrip("/").split("/")[-1]
    title = re.sub(r"\s*-\s*Essentials in Writing.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    if not description:
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
        description = strip_html(h1.group(1))[:320] if h1 else ""
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, url) or "Grades 1-12",
        "prices_mentioned": format_prices(html),
        "description": description,
    }


def discover_level_urls() -> list[str]:
    catalog_html = fetch(f"{BASE_URL}/course-catalog/")
    urls = sorted(set(LEVEL_PATTERN.findall(catalog_html)))
    return urls


def main() -> None:
    rows: list[dict] = []
    seen: set[str] = set()

    for path in PROGRAM_PATHS:
        url = f"{BASE_URL}{path}"
        row = parse_page(url)
        rows.append(row)
        seen.add(url)

    for url in discover_level_urls():
        if url in seen:
            continue
        rows.append(parse_page(url))
        seen.add(url)

    write_scrape_output(rows, "essentials-in-writing")


if __name__ == "__main__":
    main()
