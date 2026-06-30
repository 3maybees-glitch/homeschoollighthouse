#!/usr/bin/env python3
"""Scrape Oak Meadow homeschool programs and curriculum packages."""

from __future__ import annotations

import csv
import json
import re
import sys
import time
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
SITE_NAME = "Oak Meadow"
BASE_URL = "https://www.oakmeadow.com"
SHOP_URL = "https://shop.oakmeadow.com"

PROGRAM_PATHS = [
    ("/", "Oak Meadow Homeschool Curriculum", "Grades K-12"),
    ("/elementary-k-4/", "Oak Meadow Elementary (K-4)", "Grades K-4"),
    ("/middle-school-5-8/", "Oak Meadow Middle School (5-8)", "Grades 5-8"),
    ("/high-school/", "Oak Meadow High School", "Grades 9-12"),
    ("/about-us/our-complete-curriculum/", "Oak Meadow Complete Curriculum", "Grades K-12"),
    ("/enroll/", "Oak Meadow Enrollment", "Grades K-12"),
    ("/portfolio-evaluation-program/", "Oak Meadow Portfolio Evaluation", "Grades K-12"),
    ("/support-and-tutoring/", "Oak Meadow Support and Tutoring", "Grades K-12"),
]


def fetch(url: str) -> str:
    time.sleep(0.8)
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml",
        "Referer": "https://www.google.com/",
    }
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def page_title(html: str, fallback: str) -> str:
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if match:
        title = unescape(match.group(1))
        title = re.sub(r"\s*\|\s*Oak Meadow.*$", "", title, flags=re.I).strip()
        if title:
            return title
    return fallback


def page_prices(html: str) -> str:
    amounts = [
        float(value.replace(",", ""))
        for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
        if float(value.replace(",", "")) >= 10
    ]
    amounts = sorted(set(amounts))
    if not amounts:
        return "Contact for pricing"
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def shop_packages() -> list[dict]:
    html = fetch(SHOP_URL)
    names = re.findall(r'"name"\s*:\s*"([^"]{5,120})"', html)
    rows: list[dict] = []
    seen: set[str] = set()

    for raw_name in names:
        name = unescape(raw_name).strip()
        if any(skip in name.lower() for skip in [".jpg", ".png", "yahoo", "gmail"]):
            continue
        if not any(
            keyword in name.lower()
            for keyword in ["package", "grade", "preschool", "kindergarten", "course", "curriculum"]
        ):
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        grades = "Grades K-12"
        grade_match = re.search(r"(\d{1,2})(?:st|nd|rd|th)?\s*grade", name, re.I)
        if grade_match:
            grades = f"Grade {grade_match.group(1)}"
        elif "preschool" in name.lower():
            grades = "Preschool"
        elif "kindergarten" in name.lower():
            grades = "Kindergarten"

        rows.append(
            {
                "title": name if name.startswith("Oak Meadow") else f"Oak Meadow {name}",
                "website_url": SHOP_URL,
                "source": SITE_NAME,
                "grades_or_ages": grades,
                "prices_mentioned": page_prices(html),
                "description": f"Oak Meadow curriculum package: {name}.",
            }
        )
    return rows


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows: list[dict] = []
    for path, fallback_title, ages in PROGRAM_PATHS:
        url = f"{BASE_URL}{path}"
        print(f"Fetching {url}...", file=sys.stderr)
        html = fetch(url)
        rows.append(
            {
                "title": page_title(html, fallback_title),
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": ages,
                "prices_mentioned": page_prices(html),
                "description": strip_html(html)[:320] or fallback_title,
            }
        )

    rows.extend(shop_packages())
    rows.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = data_dir / "oak-meadow-scraped.csv"
    json_path = data_dir / "oak-meadow-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
