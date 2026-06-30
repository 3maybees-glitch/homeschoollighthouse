#!/usr/bin/env python3
"""Scrape Teaching Textbooks math courses and family plan pricing."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Teaching Textbooks"
BASE_URL = "https://www.teachingtextbooks.com"

COURSE_SLUGS = {
    "math3-version4.html": ("Teaching Textbooks Math 3", "Grade 3"),
    "math4-version4.html": ("Teaching Textbooks Math 4", "Grade 4"),
    "math5-version4.html": ("Teaching Textbooks Math 5", "Grade 5"),
    "math6-version4.html": ("Teaching Textbooks Math 6", "Grade 6"),
    "math7-version4.html": ("Teaching Textbooks Math 7", "Grade 7"),
    "pre-algebra-version4.html": ("Teaching Textbooks Pre-Algebra", "Grade 8"),
    "algebra1-version4.html": ("Teaching Textbooks Algebra 1", "Grade 9"),
    "geometry-version4.html": ("Teaching Textbooks Geometry", "Grade 10"),
    "algebra2-version4.html": ("Teaching Textbooks Algebra 2", "Grade 11"),
    "pre-calculus-version4.html": ("Teaching Textbooks Pre-Calculus", "Grade 12"),
}

EXTRA_PAGES = [
    ("familyplan.html", "Teaching Textbooks Large Family Discount Plan", "Grades 3-12"),
    ("free-trial/", "Teaching Textbooks Free Trial", "Grades 3-12"),
    ("printed-textbooks/", "Teaching Textbooks Printed Textbooks", "Grades 3-12"),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def extract_price(html: str) -> str:
    amount = re.search(r'data-price-amount="([\d.]+)"', html)
    if amount:
        return f"${float(amount.group(1)):.2f}/year"
    final = re.search(r'"finalPrice"\s*:\s*\{[^}]*"amount"\s*:\s*([\d.]+)', html)
    if final and float(final.group(1)) > 0:
        return f"${float(final.group(1)):.2f}/year"
    amounts: list[float] = []
    for value in re.findall(r"\$([\d,.]+)", html):
        cleaned = value.replace(",", "")
        if not cleaned or cleaned == ".":
            continue
        try:
            amount = float(cleaned)
        except ValueError:
            continue
        if amount >= 20:
            amounts.append(amount)
    if amounts:
        low, high = min(amounts), max(amounts)
        return f"${low:.2f}/year" if low == high else f"${low:.2f}-${high:.2f}/year"
    return ""


def parse_course(slug: str, fallback_title: str, ages: str) -> dict:
    url = f"{BASE_URL}/{slug.rstrip('/')}/"
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = unescape(title_match.group(1)).split("|")[0].strip() if title_match else fallback_title
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": ages,
        "prices_mentioned": extract_price(html),
        "description": strip_html(html)[:320] or fallback_title,
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows = [parse_course(slug, title, ages) for slug, (title, ages) in COURSE_SLUGS.items()]
    for slug, title, ages in EXTRA_PAGES:
        rows.append(parse_course(slug, title, ages))

    rows.sort(key=lambda row: row["title"].lower())
    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = data_dir / "teaching-textbooks-scraped.csv"
    json_path = data_dir / "teaching-textbooks-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
