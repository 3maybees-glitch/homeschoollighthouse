#!/usr/bin/env python3
"""Scrape SchoolhouseTeachers.com membership and curriculum box pages."""

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
SITE_NAME = "Schoolhouse Teachers"
BASE_URL = "https://schoolhouseteachers.com"

SEED_PATHS = [
    "/",
    "/join/",
    "/course-info/",
    "/member-resources/all-courses/",
    "/preschool-curriculum-box/",
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
            if float(value.replace(",", "")) >= 99
        }
    )
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def discover_paths() -> list[str]:
    discovered: set[str] = set(SEED_PATHS)
    home = fetch(BASE_URL)
    for match in re.findall(rf'href="({BASE_URL}/[^"#?]+)"', home):
        path = match.replace(BASE_URL, "")
        if "curriculum-box" in path or path in {"/join/", "/course-info/"}:
            discovered.add(path)
    return sorted(discovered)


def parse_page(path: str) -> dict:
    url = f"{BASE_URL}{path}" if path.startswith("/") else path
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path.strip("/")
    title = re.sub(r"\s*-\s*SchoolhouseTeachers\.com.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    if not description:
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
        description = strip_html(h1.group(1))[:320] if h1 else ""
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, path) or "Grades PreK-12",
        "prices_mentioned": format_prices(html),
        "description": description or "Online homeschool courses and electives membership.",
    }


def main() -> None:
    rows = [parse_page(path) for path in discover_paths()]
    write_scrape_output(rows, "schoolhouse-teachers")


if __name__ == "__main__":
    main()
