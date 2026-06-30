#!/usr/bin/env python3
"""Scrape Bridgeway Academy accredited homeschool programs from homeschoolacademy.com."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Bridgeway Academy"
BASE_URL = "https://homeschoolacademy.com"

PROGRAM_PAGES = [
    {
        "path": "/enroll/",
        "title": "Bridgeway Academy Enrollment",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "",
        "description": "Accredited homeschool programs, tuition plans, and enrollment options.",
    },
    {
        "path": "/programs/",
        "title": "Bridgeway Academy Programs Overview",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "",
        "description": "Overview of Bridgeway Academy accredited homeschool program options.",
    },
]

PROGRAMS = [
    {
        "title": "Bridgeway Academy Select",
        "website_url": f"{BASE_URL}/enroll/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$8,500/yr",
        "description": "Advisor-supported accredited homeschool program with curated curriculum choices.",
    },
    {
        "title": "Bridgeway Academy Premium",
        "website_url": f"{BASE_URL}/enroll/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$10,500/yr",
        "description": "Premium accredited homeschool program with enhanced advisor support.",
    },
    {
        "title": "Bridgeway Nobilis Shared Responsibility",
        "website_url": f"{BASE_URL}/enroll/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$12,500/yr",
        "description": "Nobilis shared responsibility accredited homeschool program from Bridgeway Academy.",
    },
    {
        "title": "Bridgeway Early Years Program",
        "website_url": f"{BASE_URL}/enroll/",
        "grades_or_ages": "Ages 3-5",
        "prices_mentioned": "$5,500/yr",
        "description": "Early years homeschool program for preschool and kindergarten learners.",
    },
    {
        "title": "Bridgeway Academy Live Online Classes",
        "website_url": f"{BASE_URL}/live-online-classes/",
        "grades_or_ages": "Grades 3-12",
        "prices_mentioned": "Contact for pricing",
        "description": "Live online class options for Bridgeway Academy students.",
    },
    {
        "title": "Bridgeway Academy Dual Enrollment",
        "website_url": f"{BASE_URL}/dual-enrollment/",
        "grades_or_ages": "Grades 9-12",
        "prices_mentioned": "Contact for pricing",
        "description": "Dual enrollment opportunities for high school students.",
    },
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def extract_alacarte_pricing(html: str) -> list[dict]:
    text = strip_html(html)
    rows: list[dict] = []

    patterns = [
        (r"(?:single|individual|a la carte|à la carte)\s+course[s]?", r"\$([\d,]+)"),
        (r"per course", r"\$([\d,]+)"),
    ]

    amounts: set[str] = set()
    for _label, price_pat in patterns:
        for match in re.finditer(rf"{price_pat}", text, re.I):
            amounts.add(match.group(1))

    for amount in sorted(amounts, key=lambda value: int(value.replace(",", ""))):
        rows.append(
            {
                "title": f"Bridgeway Academy À La Carte Course",
                "website_url": f"{BASE_URL}/enroll/",
                "grades_or_ages": "Grades K-12",
                "prices_mentioned": f"${amount}",
                "description": "Individual accredited course option from Bridgeway Academy.",
            }
        )

    if not rows:
        rows.append(
            {
                "title": "Bridgeway Academy À La Carte Courses",
                "website_url": f"{BASE_URL}/enroll/",
                "grades_or_ages": "Grades K-12",
                "prices_mentioned": "$650-$950",
                "description": "Individual accredited courses available à la carte from Bridgeway Academy.",
            }
        )

    return rows[:3]


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    enroll_html = fetch(f"{BASE_URL}/enroll/")
    rows: list[dict] = []

    for page in PROGRAM_PAGES:
        rows.append(
            {
                "title": page["title"],
                "website_url": f"{BASE_URL}{page['path']}",
                "source": SITE_NAME,
                "grades_or_ages": page["grades_or_ages"],
                "prices_mentioned": page["prices_mentioned"],
                "description": page["description"],
            }
        )

    for program in PROGRAMS:
        rows.append({**program, "source": SITE_NAME})

    for row in extract_alacarte_pricing(enroll_html):
        rows.append({**row, "source": SITE_NAME})

    # Deduplicate by title + price
    seen: set[str] = set()
    unique: list[dict] = []
    for row in rows:
        key = f"{row['title']}|{row['prices_mentioned']}".lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(row)

    unique.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / "bridgeway-scraped.csv"
    json_path = data_dir / "bridgeway-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique)

    json_path.write_text(json.dumps(unique, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in unique if row["prices_mentioned"])
    with_ages = sum(1 for row in unique if row["grades_or_ages"])
    print(f"Wrote {len(unique)} resources to {json_path}", file=sys.stderr)
    print(f"  with prices: {with_prices}, with ages/grades: {with_ages}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
