#!/usr/bin/env python3
"""Scrape Easy Peasy All-in-One Homeschool free course pages."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Easy Peasy All-in-One Homeschool"
BASE_URL = "https://allinonehomeschool.com"

SKIP_PARTS = (
    "/tag/",
    "/category/",
    "/author/",
    "/feed/",
    "/comments/",
    "/wp-",
    "/page/",
    "faq-contact",
    "privacy",
    "disclaimer",
)

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grade[s]?\s*\d{1,2}|"
    r"level \d|first|second|third|fourth|fifth|sixth|seventh|eighth"
    r")\b",
    re.IGNORECASE,
)


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def extract_ages(title: str, url: str) -> str:
    haystack = f"{title} {url}"
    labels: list[str] = []
    seen: set[str] = set()
    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1).title()
        if token.lower() not in seen:
            seen.add(token.lower())
            labels.append(token)
    if "getting-started" in url:
        labels.append("Grades K-12")
    return "; ".join(labels[:6]) or "Grades K-8"


COURSE_HINTS = (
    "math",
    "reading",
    "language",
    "science",
    "history",
    "geography",
    "art",
    "music",
    "bible",
    "computer",
    "getting-ready",
    "individual-courses",
    "programs-of-study",
    "level",
    "grade",
    "kindergarten",
    "preschool",
    "pe-health",
    "thinking",
)


def is_course_url(url: str) -> bool:
    if any(part in url for part in SKIP_PARTS):
        return False
    if re.search(r"/20\d{2}/", url):
        return False
    slug = url.rstrip("/").split("/")[-1]
    haystack = f"{url} {slug.replace('-', ' ')}".lower()
    return any(hint in haystack for hint in COURSE_HINTS)


def slug_to_title(url: str) -> str:
    slug = url.rstrip("/").split("/")[-1]
    if not slug:
        return "Easy Peasy All-in-One Homeschool"
    title = slug.replace("-", " ").strip()
    return title[:1].upper() + title[1:]


def discover_urls() -> list[str]:
    urls: set[str] = set()

    index_xml = fetch(f"{BASE_URL}/sitemap.xml")
    child_maps = re.findall(r"<loc>([^<]+)</loc>", index_xml)
    for map_url in child_maps:
        if "sitemap-" not in map_url or "image" in map_url or "video" in map_url:
            continue
        if "sitemap-index" in map_url:
            nested = fetch(map_url)
            child_maps.extend(re.findall(r"<loc>([^<]+)</loc>", nested))

    for map_url in sorted(set(child_maps)):
        if not re.search(r"sitemap-\d+\.xml", map_url):
            continue
        try:
            xml_text = fetch(map_url)
        except Exception:
            continue
        for url in re.findall(r"<loc>([^<]+)</loc>", xml_text):
            normalized = url.split("#")[0].rstrip("/") + "/"
            if is_course_url(normalized):
                urls.add(normalized)

    hub_html = fetch(f"{BASE_URL}/individual-courses-of-study/")
    for url in re.findall(r'href="(https?://allinonehomeschool\.com/[^"]+)"', hub_html):
        normalized = url.split("#")[0].rstrip("/") + "/"
        if is_course_url(normalized):
            urls.add(normalized)

    return sorted(urls)


def page_to_row(url: str) -> dict:
    title = slug_to_title(url)
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, url),
        "prices_mentioned": "Free",
        "description": f"Free homeschool course from Easy Peasy All-in-One: {title}.",
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    urls = discover_urls()
    print(f"Found {len(urls)} course/page URLs", file=sys.stderr)

    rows = [page_to_row(url) for url in urls]
    rows.append(
        {
            "title": "Easy Peasy All-in-One Homeschool",
            "website_url": BASE_URL + "/",
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": "Free",
            "description": "Free complete Christian homeschool curriculum for all grades.",
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
    csv_path = data_dir / "easy-peasy-scraped.csv"
    json_path = data_dir / "easy-peasy-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
