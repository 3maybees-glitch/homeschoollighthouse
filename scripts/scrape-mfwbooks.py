#!/usr/bin/env python3
"""Scrape My Father's World products from mfwbooks.com.

Product URLs are discovered by crawling category pages under /cat/. Item detail
pages expose names, canonical URLs, and prices in server-rendered HTML.
"""

from __future__ import annotations

import csv
import html as html_lib
import json
import re
import sys
import time
import urllib.error
import urllib.request
from collections import deque
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urljoin

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
SITE_NAME = "My Father's World"
BASE_URL = "https://www.mfwbooks.com"
WORKERS = 10
REQUEST_DELAY = 0.06

ITEM_LINK = re.compile(r'href="(/item/(\d+)/[^"#?]*)"')
CATEGORY_LINK = re.compile(r'href="(/cat/\d+[^"#?]*)"')
UM_PRICE = re.compile(r'id="UMprice"[^>]*>([^<]+)')
UM_LIST_PRICE = re.compile(r'id="UMprice2"[^>]*>([^<]+)')
TITLE_H1 = re.compile(r'<h1[^>]*itemprop="name"[^>]*>([^<]+)', re.I)
TITLE_TAG = re.compile(r"<title>([^<]+)</title>", re.I)
CANONICAL = re.compile(r'rel="canonical" href="([^"]+)"', re.I)
META_DESC = re.compile(r'name="description" content="([^"]*)"', re.I)

PACKAGE_GRADES = {
    "all aboard the animal train": "Preschool",
    "voyage of discovery": "Pre-K",
    "god's creation from a to z": "Kindergarten",
    "learning god's story": "Grade 1",
    "adventures in u.s. history": "Grade 2",
    "world changers": "Grade 3",
    "exploring countries and cultures": "Grades 2-8",
    "creation to the greeks": "Grades 4-8",
    "rome to the reformation": "Grades 5-9",
    "exploration to 1850": "Grades 5-9",
    "1850 to modern times": "Grades 6-10",
}


def fetch(url: str, retries: int = 3) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                return response.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code in {429, 500, 502, 503, 504}:
                time.sleep(0.5 * (attempt + 1))
                continue
            raise
        except Exception as exc:
            last_error = exc
            time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(f"Failed to fetch {url}: {last_error}")


def clean_slug(path: str) -> str:
    slug = unquote(path.split("/cat/", 1)[-1].split("/", 1)[-1]).lower()
    slug = slug.replace("rsquo;", "'").replace("&", " ").replace("-", " ")
    return re.sub(r"\s+", " ", slug).strip()


def ordinal_to_grade(token: str) -> str:
    match = re.search(r"(\d+)", token)
    return f"Grade {int(match.group(1))}" if match else token.strip()


def grades_from_category_path(path: str) -> list[str]:
    slug = clean_slug(path)
    labels: list[str] = []

    if "discover" in slug and "preschool" in slug:
        labels.extend(["Preschool", "Grades K-3"])
    if "investigate" in slug and "4th" in slug:
        labels.append("Grades 4-8")
    if "declare" in slug and "9th" in slug:
        labels.append("Grades 9-12")
    if "high school" in slug:
        labels.append("Grades 9-12")
    if "preschool" in slug or "pre k" in slug or "prek" in slug:
        labels.append("Preschool")
    if "kindergarten" in slug:
        labels.append("Kindergarten")

    range_match = re.search(
        r"(\d+(?:st|nd|rd|th)?)\s*(?:to|-)\s*(\d+(?:st|nd|rd|th)?)",
        slug,
    )
    if range_match:
        start = ordinal_to_grade(range_match.group(1))
        end = ordinal_to_grade(range_match.group(2))
        if start.startswith("Grade") and end.startswith("Grade"):
            labels.append(f"Grades {start.split()[1]}-{end.split()[1]}")
        else:
            labels.append(f"{start}-{end}")

    for match in re.finditer(r"(\d+(?:st|nd|rd|th))\s*grade", slug):
        labels.append(ordinal_to_grade(match.group(1)))

    if "2nd 6th grade" in slug or "2nd 6th" in slug:
        labels.append("Grades 2-6")
    if "7th 12th grade" in slug or "7th 12th" in slug:
        labels.append("Grades 7-12")
    if "preschool 1st grade" in slug:
        labels.extend(["Preschool", "Grade 1"])

    deduped: list[str] = []
    seen: set[str] = set()
    for label in labels:
        key = label.lower()
        if key not in seen:
            seen.add(key)
            deduped.append(label)
    return deduped


def discover_items() -> tuple[dict[str, set[str]], dict[str, str]]:
    seen_categories: set[str] = set()
    item_categories: dict[str, set[str]] = {}
    queue: deque[str] = deque([f"{BASE_URL}/products"])

    while queue:
        page_url = queue.popleft()
        try:
            html = fetch(page_url)
        except Exception as exc:
            print(f"WARN failed category crawl {page_url}: {exc}", file=sys.stderr)
            continue

        for match in CATEGORY_LINK.finditer(html):
            path = match.group(1)
            if path in seen_categories:
                continue
            seen_categories.add(path)
            queue.append(urljoin(BASE_URL, path))

        for match in ITEM_LINK.finditer(html):
            item_id = match.group(2)
            item_categories.setdefault(item_id, set()).add(page_url)

        time.sleep(0.04)

    canonical_urls: dict[str, str] = {}
    for item_id in item_categories:
        canonical_urls[item_id] = f"{BASE_URL}/item/{item_id}/"

    print(
        f"Discovered {len(item_categories)} items across {len(seen_categories)} categories",
        file=sys.stderr,
    )
    return item_categories, canonical_urls


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key in seen:
        return
    seen.add(key)
    labels.append(cleaned)


def infer_grades(title: str, description: str, category_labels: set[str]) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description}".lower()

    for label in sorted(category_labels):
        add_label(labels, seen, label)

    for key, label in PACKAGE_GRADES.items():
        if key in haystack:
            add_label(labels, seen, label)

    for match in re.finditer(r"\b(?:grade|grades)\s*(\d{1,2})(?:\s*[-–/]\s*(\d{1,2}))?\b", haystack):
        start = int(match.group(1))
        end = int(match.group(2)) if match.group(2) else start
        if start == end:
            add_label(labels, seen, f"Grade {start}")
        else:
            add_label(labels, seen, f"Grades {start}-{end}")

    for match in re.finditer(r"\b(\d{1,2})(?:st|nd|rd|th)\s+grade\b", haystack):
        add_label(labels, seen, f"Grade {int(match.group(1))}")

    if re.search(r"\b(?:pre-?k|prek|preschool)\b", haystack):
        add_label(labels, seen, "Preschool")
    if re.search(r"\bkindergarten\b", haystack):
        add_label(labels, seen, "Kindergarten")
    if re.search(r"\bhigh school\b", haystack):
        add_label(labels, seen, "Grades 9-12")

    return ", ".join(labels)


def parse_title(html: str) -> str:
    match = TITLE_H1.search(html) or TITLE_TAG.search(html)
    if not match:
        return ""
    title = html_lib.unescape(re.sub(r"\s+", " ", match.group(1))).strip()
    suffix = title.rsplit(" - ", 1)
    if len(suffix) == 2 and suffix[1].strip().isdigit():
        title = suffix[0].strip()
    return title


def parse_prices(html: str) -> str:
    prices: list[float] = []
    for pattern in (UM_PRICE, UM_LIST_PRICE):
        match = pattern.search(html)
        if not match:
            continue
        raw = match.group(1).strip().replace(",", "")
        if raw:
            prices.append(float(raw))

    prices = sorted(set(prices))
    if not prices:
        return ""
    if len(prices) == 1:
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def scrape_item(item_id: str, category_paths: set[str]) -> dict | None:
    time.sleep(REQUEST_DELAY)
    url = f"{BASE_URL}/item/{item_id}/"
    html = fetch(url)
    title = parse_title(html)
    if not title:
        return None

    canonical = CANONICAL.search(html)
    website_url = canonical.group(1) if canonical else url
    description_match = META_DESC.search(html)
    description = (
        html_lib.unescape(description_match.group(1)).strip() if description_match else title
    )

    category_labels: set[str] = set()
    for path in category_paths:
        for label in grades_from_category_path(path):
            category_labels.add(label)

    return {
        "title": title,
        "website_url": website_url.split("#")[0],
        "source": SITE_NAME,
        "grades_or_ages": infer_grades(title, description, category_labels),
        "prices_mentioned": parse_prices(html),
        "description": description[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    item_categories, _ = discover_items()
    item_ids = sorted(item_categories.keys())

    rows: list[dict] = []
    errors = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {
            executor.submit(scrape_item, item_id, item_categories[item_id]): item_id
            for item_id in item_ids
        }
        for index, future in enumerate(as_completed(futures), start=1):
            item_id = futures[future]
            try:
                row = future.result()
                if row:
                    rows.append(row)
            except Exception as exc:
                errors += 1
                print(f"WARN failed item/{item_id}: {exc}", file=sys.stderr)
            if index % 50 == 0 or index == len(item_ids):
                print(f"  processed {index}/{len(item_ids)}...", file=sys.stderr)

    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "mfwbooks-scraped.csv"
    json_path = data_dir / "mfwbooks-scraped.json"
    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(
        f"  with prices: {with_prices}, with ages/grades: {with_ages}, errors: {errors}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
