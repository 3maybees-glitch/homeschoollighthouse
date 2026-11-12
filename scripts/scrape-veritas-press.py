#!/usr/bin/env python3
"""Scrape Veritas Press curriculum programs, self-paced courses, and mini-courses."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.error
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Veritas Press"
BASE_URL = "https://veritaspress.com"

PROGRAM_PAGES = [
    ("/selfpaced", "Veritas Press Self-Paced Courses", "Grades K-12", "From $199/course"),
    ("/selfpaced/history", "Veritas Press Self-Paced History", "Grades 2-12", "From $199/course"),
    ("/selfpaced/bible", "Veritas Press Self-Paced Bible", "Grades 2-12", "From $199/course"),
    ("/selfpaced/omnibus", "Veritas Press Self-Paced Omnibus", "Grades 7-12", "From $199/course"),
    ("/selfpaced/rhetoric", "Veritas Press Self-Paced Rhetoric", "Grades 9-12", "From $199/course"),
    ("/live-online-classes", "Veritas Scholars Academy Live Online Classes", "Grades K-12", "Contact for pricing"),
    ("/online-catalog", "Veritas Press Online Catalog", "Grades K-12", "Contact for pricing"),
    ("/online-private-school-catalog", "Veritas Press Online Private School", "Grades K-12", "Contact for pricing"),
    ("/the-trivium/grammar-stage-grades-k-6", "Veritas Press Grammar Stage (K-6)", "Grades K-6", "Contact for pricing"),
    ("/the-trivium/logic-stage-grades-7-9", "Veritas Press Logic Stage (7-9)", "Grades 7-9", "Contact for pricing"),
    ("/the-trivium/rhetoric-stage-grades-10-12", "Veritas Press Rhetoric Stage (10-12)", "Grades 10-12", "Contact for pricing"),
    ("/omnibus-overview", "Veritas Press Omnibus Overview", "Grades 7-12", "Contact for pricing"),
    ("/journey-through-the-bible", "Veritas Press Journey Through the Bible", "Grades 2-6", "Contact for pricing"),
    ("/vsa-25-26", "Veritas Scholars Academy 2025-26", "Grades K-12", "Contact for pricing"),
]

GRADE_PACKAGES = [
    (f"Grade {grade}", f"{BASE_URL}/online-catalog", f"Grade {grade}")
    for grade in range(1, 13)
]
GRADE_PACKAGES.extend(
    [
        ("Kindergarten Complete Package", f"{BASE_URL}/online-catalog", "Kindergarten"),
        ("Complete Grade Level Package", f"{BASE_URL}/selfpaced", "Grades K-12"),
    ]
)


def fetch(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def safe_fetch(url: str) -> str | None:
    try:
        return fetch(url)
    except urllib.error.HTTPError as exc:
        print(f"WARN: HTTP {exc.code} for {url}", file=sys.stderr)
        return None
    except Exception as exc:
        print(f"WARN: failed {url}: {exc}", file=sys.stderr)
        return None


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def parse_mini_courses(html: str) -> list[dict]:
    headings = re.findall(r"<h[234][^>]*>([^<]{5,120})</h[234]>", html, re.I)
    rows: list[dict] = []
    idx = 0
    while idx < len(headings) - 1:
        title = unescape(headings[idx]).strip()
        subtitle = unescape(headings[idx + 1]).strip()
        if "mini-course" in subtitle.lower() or "mini course" in subtitle.lower():
            rows.append(
                {
                    "title": f"Veritas Press {title}",
                    "website_url": f"{BASE_URL}/mini-course-descriptions",
                    "source": SITE_NAME,
                    "grades_or_ages": "Grades 4-12",
                    "prices_mentioned": "Contact for pricing",
                    "description": f"Veritas Press mini-course: {title}. {subtitle}.",
                }
            )
            idx += 2
        else:
            idx += 1
    return rows


def load_mini_course_fallback(root: Path) -> list[dict]:
    imported = root / "src" / "data" / "veritas-press-imported.json"
    if not imported.is_file():
        return []
    payload = json.loads(imported.read_text(encoding="utf-8"))
    return [
        row
        for row in payload
        if isinstance(row, dict)
        and "mini-course" in (row.get("description") or "").lower()
    ]


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows: list[dict] = []
    for path, title, ages, price in PROGRAM_PAGES:
        url = f"{BASE_URL}{path}"
        html = safe_fetch(url)
        description = strip_html(html)[:320] if html else title
        rows.append(
            {
                "title": title,
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": ages,
                "prices_mentioned": price,
                "description": description or title,
            }
        )

    for title, url, ages in GRADE_PACKAGES:
        rows.append(
            {
                "title": f"Veritas Press {title}",
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": ages,
                "prices_mentioned": "Contact for pricing",
                "description": f"Veritas Press classical homeschool {title.lower()}.",
            }
        )

    mini_html = safe_fetch(f"{BASE_URL}/mini-course-descriptions")
    if mini_html:
        rows.extend(parse_mini_courses(mini_html))
    else:
        fallback = load_mini_course_fallback(root)
        if fallback:
            print(f"Using {len(fallback)} cached mini-course rows from import JSON", file=sys.stderr)
            rows.extend(fallback)
        else:
            print("WARN: no mini-course HTML and no import fallback", file=sys.stderr)

    seen: set[str] = set()
    unique: list[dict] = []
    for row in rows:
        key = f"{row['title']}|{row['website_url']}".lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(row)
    unique.sort(key=lambda row: row["title"].lower())

    if len(unique) < 10:
        print("ERROR: too few Veritas Press rows scraped", file=sys.stderr)
        return 1

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = data_dir / "veritas-press-scraped.csv"
    json_path = data_dir / "veritas-press-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique)
    json_path.write_text(json.dumps(unique, indent=2), encoding="utf-8")
    print(f"Wrote {len(unique)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
