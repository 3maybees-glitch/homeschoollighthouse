#!/usr/bin/env python3
"""Scrape Power Homeschool / Acellus courses and program pricing."""

from __future__ import annotations

import csv
import html as html_lib
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Power Homeschool / Acellus"
COURSES_BASE = "https://www.science.edu/acellus/courses/"

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"elementary|middle school|high school|ap "
    r")\b",
    re.IGNORECASE,
)

PROGRAM_ENTRIES = [
    {
        "title": "Power Homeschool Monthly Subscription",
        "website_url": "https://www.powerhomeschool.org/pricing/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$99/mo ($79/mo with scholarship)",
        "description": (
            "Power Homeschool provides parent-led access to Acellus video courses "
            "for homeschool families (not accredited)."
        ),
    },
    {
        "title": "Acellus Academy Basic Plan",
        "website_url": "https://www.acellusacademy.com/tuition/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$79/mo",
        "description": "Accredited online homeschool program from Acellus Academy.",
    },
    {
        "title": "Acellus Academy Enhanced Plan",
        "website_url": "https://www.acellusacademy.com/tuition/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$174/mo",
        "description": "Enhanced accredited plan with additional Acellus Academy support.",
    },
    {
        "title": "Acellus Academy Premium Plan",
        "website_url": "https://www.acellusacademy.com/tuition/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$249/mo",
        "description": "Premium accredited homeschool plan from Acellus Academy.",
    },
    {
        "title": "Acellus Academy Elite Plan",
        "website_url": "https://www.acellusacademy.com/tuition/",
        "grades_or_ages": "Grades K-12",
        "prices_mentioned": "$349/mo",
        "description": "Elite accredited homeschool plan from Acellus Academy.",
    },
    {
        "title": "Acellus Academy High School Diploma Track",
        "website_url": "https://www.acellusacademy.com/tuition/",
        "grades_or_ages": "Grades 9-12",
        "prices_mentioned": "$499/mo",
        "description": "Accredited high school diploma program from Acellus Academy.",
    },
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def extract_ages(title: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = html_lib.unescape(title)

    if haystack.lower().startswith("ap "):
        add_label(labels, seen, "Grades 9-12")
    if "elementary" in haystack.lower():
        add_label(labels, seen, "Grades K-5")
    if "middle school" in haystack.lower() or re.search(r"grade [6-8]\b", haystack, re.I):
        add_label(labels, seen, "Grades 6-8")
    if "high school" in haystack.lower() or re.search(r"grade (9|10|11|12)\b", haystack, re.I):
        add_label(labels, seen, "Grades 9-12")

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if token.lower() in {"elementary"}:
            add_label(labels, seen, "Grades K-5")
        elif token.lower() in {"middle school"}:
            add_label(labels, seen, "Grades 6-8")
        elif token.lower() in {"high school"}:
            add_label(labels, seen, "Grades 9-12")
        elif re.fullmatch(r"\d{1,2}", token):
            grade = int(token)
            if grade <= 5:
                add_label(labels, seen, f"Grade {grade}")
            elif grade <= 8:
                add_label(labels, seen, f"Grade {grade}")
            else:
                add_label(labels, seen, f"Grade {grade}")

    return "; ".join(labels[:6])


def fetch_course_catalog() -> list[dict]:
    seen_slugs: set[str] = set()
    rows: list[dict] = []
    page = 1

    while page <= 20:
        url = f"{COURSES_BASE}?paged={page}"
        print(f"Fetching course archive page {page}...", file=sys.stderr)
        html = fetch(url)
        matches = re.findall(
            r'href="https://www\.science\.edu/acellus/course/([^"]+/)"[^>]*>([^<]+)</a>',
            html,
        )
        if not matches:
            break

        new_on_page = 0
        for slug, raw_title in matches:
            slug_key = slug.rstrip("/").lower()
            if slug_key in seen_slugs:
                continue
            seen_slugs.add(slug_key)
            new_on_page += 1

            title = unescape(re.sub(r"\s+", " ", raw_title)).strip()
            rows.append(
                {
                    "title": title,
                    "website_url": f"https://www.science.edu/acellus/course/{slug}",
                    "source": SITE_NAME,
                    "grades_or_ages": extract_ages(title),
                    "prices_mentioned": "$99/mo (Power Homeschool subscription)",
                    "description": f"Acellus online video course: {title}.",
                }
            )

        if new_on_page == 0:
            break
        page += 1

    return rows


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows = fetch_course_catalog()
    for entry in PROGRAM_ENTRIES:
        rows.append({**entry, "source": SITE_NAME})

    rows.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / "acellus-scraped.csv"
    json_path = data_dir / "acellus-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    print(f"  with prices: {with_prices}, with ages/grades: {with_ages}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
