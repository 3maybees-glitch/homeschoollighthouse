#!/usr/bin/env python3
"""Scrape IEW (Institute for Excellence in Writing) products from iew.com."""

from __future__ import annotations

import csv
import json
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITEMAP_URL = "https://iew.com/sitemap-products.xml"
SITE_NAME = "IEW"
WORKERS = 10
REQUEST_DELAY = 0.12
SKIP_GRADE_LABELS = {"LD", "ELL", "Tchr"}


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


def fetch_product_urls() -> list[str]:
    xml_text = fetch(SITEMAP_URL)
    root = ET.fromstring(xml_text)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text.strip() for node in root.findall("sm:url/sm:loc", namespace) if node.text]
    return sorted(set(urls))


def strip_html(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def parse_title(html: str) -> str:
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if not match:
        return ""
    title = strip_html(match.group(1))
    if " | " in title:
        title = title.rsplit(" | ", 1)[0].strip()
    return title


def parse_description(html: str) -> str:
    match = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    if match and match.group(1).strip():
        return strip_html(match.group(1))
    match = re.search(r"<h1[^>]*>([^<]+)</h1>", html, re.I)
    return strip_html(match.group(1)) if match else ""


def parse_grades(html: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    for _code, label in re.findall(r'<li data-grade="([^"]+)">([^<]+)</li>', html):
        cleaned = label.strip()
        if cleaned in SKIP_GRADE_LABELS:
            continue
        if cleaned not in seen:
            seen.add(cleaned)
            labels.append(cleaned)
    return "; ".join(labels)


def parse_prices(html: str) -> str:
    match = re.search(r'"formats"\s*:\s*(\[.*?\])\s*,\s*"cart"', html, re.S)
    if not match:
        match = re.search(r'"formats"\s*:\s*(\[.*?\])', html, re.S)
    if not match:
        return ""

    try:
        formats = json.loads(match.group(1))
    except json.JSONDecodeError:
        return ""

    prices = sorted({float(item.get("price", 0)) for item in formats if item.get("price") is not None})
    prices = [price for price in prices if price > 0]
    if not prices:
        return ""
    if len(prices) == 1:
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def scrape_product(url: str) -> dict | None:
    time.sleep(REQUEST_DELAY)
    html = fetch(url)
    title = parse_title(html)
    if not title:
        return None

    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": parse_grades(html) or "Grades K-12",
        "prices_mentioned": parse_prices(html),
        "description": parse_description(html),
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Loading IEW product sitemap...", file=sys.stderr)
    urls = fetch_product_urls()
    print(f"Found {len(urls)} product URLs", file=sys.stderr)

    rows: list[dict] = []
    errors = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(scrape_product, url): url for url in urls}
        for index, future in enumerate(as_completed(futures), start=1):
            url = futures[future]
            try:
                row = future.result()
                if row:
                    rows.append(row)
            except Exception as exc:
                errors += 1
                print(f"WARN failed {url}: {exc}", file=sys.stderr)
            if index % 50 == 0:
                print(f"  processed {index}/{len(urls)}...", file=sys.stderr)

    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "iew-scraped.csv"
    json_path = data_dir / "iew-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "title",
                "website_url",
                "source",
                "grades_or_ages",
                "prices_mentioned",
                "description",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(f"  with prices: {with_prices}, with ages/grades: {with_ages}, errors: {errors}", file=sys.stderr)
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
