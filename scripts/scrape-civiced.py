#!/usr/bin/env python3
"""Scrape Center for Civic Education programs including We the People."""

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
SITE_NAME = "Center for Civic Education"
BASE_URL = "https://www.civiced.org"

SEED_PATHS = [
    "/",
    "/programs/we-the-people-the-citizen-and-the-constitution",
    "/programs/project-citizen",
    "/programs/civitas-international-programs",
    "/programs/60-second-civics",
]

STATIC_PROGRAMS = [
    (
        "We the People: The Citizen and the Constitution",
        f"{BASE_URL}/programs/we-the-people-the-citizen-and-the-constitution",
        "Grades 4-12",
        "Contact for pricing",
        "Center for Civic Education civics curriculum for homeschool and classroom use.",
    ),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def discover_paths() -> list[str]:
    paths = set(SEED_PATHS)
    for seed in SEED_PATHS:
        try:
            html = fetch(f"{BASE_URL}{seed}")
        except Exception:
            continue
        for match in re.findall(rf'href="({BASE_URL}/programs/[^"#?]+)"', html):
            paths.add(match.replace(BASE_URL, ""))
    return sorted(paths)


def parse_page(path: str) -> dict:
    url = f"{BASE_URL}{path}" if path.startswith("/") else path
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path
    title = re.sub(r"\s*-\s*civiced\.org.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else title
    amounts = re.findall(r"\$[\d,.]+", html)
    price_text = amounts[0] if amounts else "Contact for pricing"
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, path) or "Grades 4-12",
        "prices_mentioned": price_text,
        "description": description[:320],
    }


def main() -> None:
    rows: list[dict] = []
    seen: set[str] = set()
    for title, url, grades, price, description in STATIC_PROGRAMS:
        rows.append(
            {
                "title": title,
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": grades,
                "prices_mentioned": price,
                "description": description,
            }
        )
        seen.add(url)
    for path in discover_paths():
        try:
            row = parse_page(path)
        except Exception as exc:
            print(f"WARN skipping {path}: {exc}", file=sys.stderr)
            continue
        if row["website_url"] in seen:
            continue
        rows.append(row)
        seen.add(row["website_url"])
    write_scrape_output(rows, "civiced")


if __name__ == "__main__":
    main()
