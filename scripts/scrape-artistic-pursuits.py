#!/usr/bin/env python3
"""Scrape ARTistic Pursuits homeschool art program pages."""

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
SITE_NAME = "ARTistic Pursuits"
BASE_URL = "https://artisticpursuits.com"


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def format_prices(html: str) -> str:
    amounts = sorted(
        {
            float(value.replace(",", ""))
            for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
            if float(value.replace(",", "")) >= 10
        }
    )
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def discover_paths() -> list[str]:
    html = fetch(f"{BASE_URL}/the-program")
    paths: set[str] = {"/the-program"}
    for match in re.findall(r'href="(/[^"#?]+)"', html):
        slug = match.strip("/")
        if not slug or slug.startswith("assets"):
            continue
        if any(
            token in slug
            for token in (
                "classic",
                "preschool",
                "elementary",
                "middle",
                "high",
                "sculpture",
                "art-supplies",
                "4-6th",
                "7-8th",
                "9-12th",
            )
        ):
            paths.add(match if match.endswith("/") else f"{match}/")
    return sorted(paths)


def parse_page(path: str) -> dict:
    url = urljoin(BASE_URL, path)
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path.strip("/")
    title = re.sub(r"\s*\|\s*ARTistic Pursuits.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, path) or "Grades K-12",
        "prices_mentioned": format_prices(html),
        "description": description or "Homeschool art curriculum from ARTistic Pursuits.",
    }


def main() -> None:
    rows = [parse_page(path) for path in discover_paths()]
    write_scrape_output(rows, "artistic-pursuits")


if __name__ == "__main__":
    main()
