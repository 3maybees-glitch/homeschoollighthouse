#!/usr/bin/env python3
"""Scrape Uncle Eric / Richard Maybury books from Bluestocking Press."""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Bluestocking Press"
BASE_URL = "https://bluestockingpress.com"

SEED_PATHS = [
    "/uncle-erics-model-of-how-the-world-works/",
    "/uncle-erics-model-deluxe-package/",
    "/uncle-eric-model-htm/",
    "/uncle-eric-study-guides-htm/",
    "/uncle-eric-talks-about-personal-career-and-financial-security/",
    "/whatever-happened-to-penny-candy/",
    "/whatever-happened-to-justice/",
    "/the-money-mystery/",
    "/world-war-i-the-rest-of-the-story-and-how-it-affects-you-today/",
    "/world-war-ii-the-rest-of-the-story-and-how-it-affects-you-today/",
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
            if float(value.replace(",", "")) >= 5
        }
    )
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def parse_page(path: str) -> dict:
    url = urljoin(BASE_URL, path)
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path.strip("/")
    title = re.sub(r"\s*[–|-]\s*Bluestocking Press.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else title
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description) or "Grades 7-12",
        "prices_mentioned": format_prices(html),
        "description": description[:320],
    }


def discover_paths() -> list[str]:
    html = fetch(BASE_URL)
    paths = set(SEED_PATHS)
    for match in re.findall(r'href="(/(?:uncle|whatever|world-war|money)[^"#?]*/)"', html, re.I):
        paths.add(match)
    return sorted(paths)


def main() -> None:
    rows = [parse_page(path) for path in discover_paths()]
    write_scrape_output(rows, "bluestocking-press")


if __name__ == "__main__":
    main()
