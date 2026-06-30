#!/usr/bin/env python3
"""Scrape Timberdoodle product pages via sitemap and JSON-LD Product data."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Timberdoodle"
SITEMAP_URL = "https://timberdoodle.com/sitemap.xml"
MAX_WORKERS = 10

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"ages?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?"
    r")\b",
    re.IGNORECASE,
)

SKIP_SLUGS = {
    "homeschool-catalog",
    "gift-card",
    "gift-cards",
}


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8", errors="replace")


def fetch_product_urls() -> list[str]:
    xml_text = fetch(SITEMAP_URL)
    root = ET.fromstring(xml_text)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls: list[str] = []

    for loc in root.findall(".//sm:loc", ns):
        url = (loc.text or "").strip()
        if "/products/" not in url:
            continue
        slug = url.rstrip("/").split("/")[-1].lower()
        if slug in SKIP_SLUGS:
            continue
        urls.append(url.split("?")[0])

    return sorted(set(urls))


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def extract_ages(title: str, description: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description}"

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if re.fullmatch(r"\d{1,2}", token):
            add_label(labels, seen, f"Grade {int(token)}")
        else:
            add_label(labels, seen, token.title())

    age_match = re.search(r"ages?\s*(\d{1,2})\s*[-–/]\s*(\d{1,2})", haystack, re.I)
    if age_match:
        add_label(labels, seen, f"Ages {age_match.group(1)}-{age_match.group(2)}")

    if "curriculum kit" in haystack.lower():
        kit_match = re.search(
            r"(pre-k|kindergarten|\d+(?:st|nd|rd|th)?\s*grade)",
            title,
            re.I,
        )
        if kit_match:
            add_label(labels, seen, kit_match.group(1).title())

    return "; ".join(labels[:8])


def format_offers(offers: list | dict | None) -> str:
    if not offers:
        return ""
    if isinstance(offers, dict):
        offers = [offers]

    prices: list[float] = []
    for offer in offers:
        raw = offer.get("price")
        if raw in (None, ""):
            continue
        try:
            value = float(raw)
            if value >= 0:
                prices.append(value)
        except (TypeError, ValueError):
            continue

    prices = sorted(set(prices))
    if not prices:
        return ""
    if len(prices) == 1:
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def parse_product_page(url: str) -> dict | None:
    html = fetch(url)
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)

    for block in blocks:
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue

        items = data if isinstance(data, list) else [data]
        for item in items:
            if item.get("@type") != "Product":
                continue

            title = (item.get("name") or "").strip()
            if not title:
                continue

            description = unescape(re.sub(r"\s+", " ", item.get("description") or ""))[:320]
            offers = item.get("offers")
            if isinstance(offers, dict):
                offers_list = [offers]
            elif isinstance(offers, list):
                offers_list = offers
            else:
                offers_list = []

            canonical_url = url
            if offers_list and offers_list[0].get("url"):
                canonical_url = offers_list[0]["url"].split("?")[0]

            return {
                "title": title,
                "website_url": canonical_url,
                "source": SITE_NAME,
                "grades_or_ages": extract_ages(title, description),
                "prices_mentioned": format_offers(offers_list),
                "description": description,
            }

    return None


def scrape_url(url: str) -> dict | None:
    try:
        return parse_product_page(url)
    except Exception as exc:
        print(f"WARN: failed {url}: {exc}", file=sys.stderr)
        return None


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    urls = fetch_product_urls()
    print(f"Found {len(urls)} product URLs in sitemap", file=sys.stderr)

    rows: list[dict] = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(scrape_url, url): url for url in urls}
        done = 0
        for future in as_completed(futures):
            done += 1
            if done % 100 == 0:
                print(f"  scraped {done}/{len(urls)}...", file=sys.stderr)
            row = future.result()
            if row:
                rows.append(row)

    rows.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / "timberdoodle-scraped.csv"
    json_path = data_dir / "timberdoodle-scraped.json"

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
