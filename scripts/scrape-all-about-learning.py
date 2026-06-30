#!/usr/bin/env python3
"""Scrape All About Learning Press product pages (Reading, Spelling, Math)."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "All About Learning Press"
PROGRAMS_URL = "https://www.allaboutlearningpress.com/programs/"
MAX_WORKERS = 8

GRADE_WORD = re.compile(
    r"\b("
    r"pre-reading|pre-reading|preschool|kindergarten|\bk\b|level \d|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?"
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


def extract_ages(title: str, description: str) -> str:
    haystack = f"{title} {description}"
    labels: list[str] = []
    seen: set[str] = set()
    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1).title()
        if token.lower() not in seen:
            seen.add(token.lower())
            labels.append(token)
    if "pre-reading" in haystack.lower():
        labels.insert(0, "Pre-Reading")
    level = re.search(r"level\s*(\d)", haystack, re.I)
    if level:
        labels.insert(0, f"Level {level.group(1)}")
    return "; ".join(labels[:6])


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
            prices.append(float(raw))
        except (TypeError, ValueError):
            continue
    prices = sorted(set(prices))
    if not prices:
        return ""
    if len(prices) == 1:
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def discover_product_urls() -> list[str]:
    html = fetch(PROGRAMS_URL)
    urls = re.findall(
        r'href="(https://www\.allaboutlearningpress\.com/all-about-[^"]+)"',
        html,
    )
    shop_html = fetch("https://www.allaboutlearningpress.com/shop-all-products/")
    urls.extend(
        re.findall(
            r'href="(https://www\.allaboutlearningpress\.com/all-about-[^"]+)"',
            shop_html,
        )
    )
    return sorted(set(url for url in urls if "/programs/" not in url and "/shop/" not in url))


def parse_product(url: str) -> dict | None:
    html = fetch(url)
    title = None
    description = ""
    price = ""

    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        items = data if isinstance(data, list) else [data]
        for item in items:
            if item.get("@type") != "Product":
                continue
            title = (item.get("name") or "").strip()
            description = strip_html(item.get("description") or "")[:320]
            price = format_offers(item.get("offers"))
            break
        if title:
            break

    if not title:
        match = re.search(r"<title>([^<]+)</title>", html, re.I)
        title = unescape(match.group(1)).split("|")[0].strip() if match else None
    if not title:
        return None

    if not price:
        values: list[float] = []
        for raw in re.findall(r"\$([\d,.]+)", html):
            cleaned = raw.replace(",", "")
            if not cleaned or cleaned == ".":
                continue
            try:
                amount = float(cleaned)
            except ValueError:
                continue
            if amount >= 5:
                values.append(amount)
        values = sorted(set(values))
        if values:
            price = f"${values[0]:.2f}" if len(values) == 1 else f"${values[0]:.2f}-${values[-1]:.2f}"

    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description),
        "prices_mentioned": price,
        "description": description or strip_html(html)[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    urls = discover_product_urls()
    print(f"Found {len(urls)} product URLs", file=sys.stderr)

    rows: list[dict] = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(parse_product, url): url for url in urls}
        for future in as_completed(futures):
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
    csv_path = data_dir / "all-about-learning-scraped.csv"
    json_path = data_dir / "all-about-learning-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
