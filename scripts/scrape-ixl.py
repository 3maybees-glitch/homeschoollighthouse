#!/usr/bin/env python3
"""Scrape IXL practice areas (grade and course pages) with family membership pricing."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "IXL"
BASE_URL = "https://www.ixl.com"

SUBJECTS = {
    "math": "Math",
    "ela": "Language Arts",
    "science": "Science",
    "social-studies": "Social Studies",
    "spanish": "Spanish",
}

GRADES = [
    "pre-k",
    "kindergarten",
    *[f"grade-{n}" for n in range(1, 13)],
]

HIGH_SCHOOL_COURSES = {
    "math": [
        "algebra-1",
        "algebra-2",
        "geometry",
        "precalculus",
        "calculus",
        "integrated-math-1",
        "integrated-math-2",
        "integrated-math-3",
        "statistics-and-probability",
    ],
    "ela": [
        "literary-analysis",
        "writing-strategies",
        "vocabulary",
        "grammar-and-mechanics",
    ],
    "science": [
        "biology",
        "chemistry",
        "physics",
        "earth-science",
        "physical-science",
    ],
    "social-studies": [
        "civics",
        "economics",
        "world-history",
        "us-history",
        "geography",
    ],
}

GRADE_LABELS = {
    "pre-k": "Pre-K",
    "kindergarten": "Kindergarten",
    **{f"grade-{n}": f"Grade {n}" for n in range(1, 13)},
}


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def page_title(html: str, fallback: str) -> str:
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if match:
        title = unescape(match.group(1))
        title = re.sub(r"\s*\|\s*IXL.*$", "", title, flags=re.I).strip()
        if title:
            return title
    h1 = re.search(r"<h1[^>]*>([^<]+)</h1>", html, re.I)
    if h1:
        return unescape(h1.group(1)).strip()
    return fallback


def grade_to_ages(slug: str) -> str:
    if slug == "pre-k":
        return "Ages 4-5"
    if slug == "kindergarten":
        return "Kindergarten"
    if slug.startswith("grade-"):
        num = int(slug.split("-")[1])
        return f"Grade {num}"
    return ""


def build_grade_rows() -> list[dict]:
    rows: list[dict] = []
    pricing = "$9.95-$19.95/mo (IXL family membership)"

    for subject_slug, subject_name in SUBJECTS.items():
        for grade_slug in GRADES:
            path = f"/{subject_slug}/{grade_slug}"
            url = f"{BASE_URL}{path}"
            label = GRADE_LABELS.get(grade_slug, grade_slug)
            fallback = f"IXL {subject_name} — {label}"

            try:
                html = fetch(url)
                title = page_title(html, fallback)
            except Exception as exc:
                print(f"WARN: failed {url}: {exc}", file=sys.stderr)
                title = fallback

            rows.append(
                {
                    "title": title,
                    "website_url": url,
                    "source": SITE_NAME,
                    "grades_or_ages": grade_to_ages(grade_slug),
                    "prices_mentioned": pricing,
                    "description": (
                        f"IXL {subject_name} practice and mastery skills for {label}. "
                        "Requires IXL family membership."
                    ),
                }
            )

    return rows


def build_course_rows() -> list[dict]:
    rows: list[dict] = []
    pricing = "$9.95-$19.95/mo (IXL family membership)"

    for subject_slug, courses in HIGH_SCHOOL_COURSES.items():
        subject_name = SUBJECTS.get(subject_slug, subject_slug)
        for course_slug in courses:
            path = f"/{subject_slug}/{course_slug}"
            url = f"{BASE_URL}{path}"
            fallback = f"IXL {subject_name} — {course_slug.replace('-', ' ').title()}"

            try:
                html = fetch(url)
                title = page_title(html, fallback)
            except Exception as exc:
                print(f"WARN: failed {url}: {exc}", file=sys.stderr)
                title = fallback

            rows.append(
                {
                    "title": title,
                    "website_url": url,
                    "source": SITE_NAME,
                    "grades_or_ages": "Grades 9-12",
                    "prices_mentioned": pricing,
                    "description": (
                        f"IXL {subject_name} high school course: "
                        f"{course_slug.replace('-', ' ').title()}."
                    ),
                }
            )

    return rows


def membership_row() -> dict:
    return {
        "title": "IXL Family Membership",
        "website_url": f"{BASE_URL}/membership/family/pricing",
        "source": SITE_NAME,
        "grades_or_ages": "Grades Pre-K-12",
        "prices_mentioned": "$9.95-$19.95/mo",
        "description": "IXL family membership for unlimited practice across subjects and grade levels.",
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Fetching IXL grade-level practice pages...", file=sys.stderr)
    rows = build_grade_rows()
    print("Fetching IXL high school course pages...", file=sys.stderr)
    rows.extend(build_course_rows())
    rows.append(membership_row())

    # Deduplicate by URL
    by_url: dict[str, dict] = {}
    for row in rows:
        by_url[row["website_url"]] = row
    rows = sorted(by_url.values(), key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / "ixl-scraped.csv"
    json_path = data_dir / "ixl-scraped.json"

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
