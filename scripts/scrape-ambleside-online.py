#!/usr/bin/env python3
"""Scrape AmblesideOnline free Charlotte Mason curriculum year plans."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "AmblesideOnline"
BASE_URL = "https://www.amblesideonline.org"

YEAR_PAGES = [
    ("ao-y0", "AmblesideOnline Year 0", "Ages 0-5"),
    ("ao-y1-bks", "AmblesideOnline Year 1 Booklist", "Year 1"),
    ("ao-y2-bks", "AmblesideOnline Year 2 Booklist", "Year 2"),
    ("ao-y3-bks", "AmblesideOnline Year 3 Booklist", "Year 3"),
    ("ao-y4-bks", "AmblesideOnline Year 4 Booklist", "Year 4"),
    ("ao-y5-bks", "AmblesideOnline Year 5 Booklist", "Year 5"),
    ("ao-y6-bks", "AmblesideOnline Year 6 Booklist", "Year 6"),
    ("ao-y7", "AmblesideOnline Year 7", "Year 7"),
    ("ao-y7-pre", "AmblesideOnline Year 7 Primer", "Year 7"),
    ("ao-y8", "AmblesideOnline Year 8", "Year 8"),
    ("ao-y9", "AmblesideOnline Year 9", "Year 9"),
    ("ao-y10", "AmblesideOnline Year 10", "Year 10"),
    ("ao-y11", "AmblesideOnline Year 11", "Year 11"),
    ("ao-y12", "AmblesideOnline Year 12", "Year 12"),
    ("ao-y35-bks", "AmblesideOnline Years 3-5 Booklist", "Years 3-5"),
    ("upper5years", "AmblesideOnline Upper Years Overview", "Years 7-12"),
    ("years", "AmblesideOnline Year Plans Overview", "Grades K-12"),
    ("book-helps", "AmblesideOnline Book Helps", "Grades K-12"),
    ("ebooks", "AmblesideOnline Free eBooks", "Grades K-12"),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def page_title(html: str, fallback: str) -> str:
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if match:
        title = unescape(match.group(1))
        title = re.sub(r"\s*\|\s*AmblesideOnline.*$", "", title, flags=re.I).strip()
        if title:
            return title
    return fallback


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows: list[dict] = []
    for slug, fallback_title, ages in YEAR_PAGES:
        url = f"{BASE_URL}/{slug}"
        print(f"Fetching {url}...", file=sys.stderr)
        html = fetch(url)
        rows.append(
            {
                "title": page_title(html, fallback_title),
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": ages,
                "prices_mentioned": "Free",
                "description": strip_html(html)[:320]
                or f"Free Charlotte Mason curriculum resources from {fallback_title}.",
            }
        )

    rows.append(
        {
            "title": "AmblesideOnline Curriculum",
            "website_url": "https://amblesideonline.com/",
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": "Free",
            "description": "Free Charlotte Mason homeschool curriculum schedules, booklists, and resources.",
        }
    )
    rows.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = data_dir / "ambleside-online-scraped.csv"
    json_path = data_dir / "ambleside-online-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
