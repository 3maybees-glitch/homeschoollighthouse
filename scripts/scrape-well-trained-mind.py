#!/usr/bin/env python3
"""Scrape Well-Trained Mind store products from product sitemaps."""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, write_scrape_output

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Well-Trained Mind"
SITEMAPS = [
    "https://welltrainedmind.com/product-sitemap1.xml",
    "https://welltrainedmind.com/product-sitemap2.xml",
]
WORKERS = 10
REQUEST_DELAY = 0.12


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def fetch_product_urls() -> list[str]:
    urls: list[str] = []
    for sitemap in SITEMAPS:
        root = ET.fromstring(fetch(sitemap))
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        for node in root.findall("sm:url/sm:loc", namespace):
            if node.text:
                url = node.text.strip()
                if "/p/" in url:
                    urls.append(url)
    return sorted(set(urls))


def parse_prices(html: str) -> str:
    for match in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get("@type") in {"Product", "Book"}:
            offers = data.get("offers")
            if isinstance(offers, dict):
                price = offers.get("price") or offers.get("lowPrice")
                if price:
                    return f"${float(price):.2f}"
            if isinstance(offers, list):
                prices = sorted(
                    {
                        float(item.get("price"))
                        for item in offers
                        if item.get("price") not in (None, "")
                    }
                )
                if prices:
                    if len(prices) == 1:
                        return f"${prices[0]:.2f}"
                    return f"${prices[0]:.2f}-${prices[-1]:.2f}"

    amounts = sorted(
        {
            float(value.replace(",", "").rstrip("."))
            for value in re.findall(r'woocommerce-Price-amount[^>]*>\s*\$([\d,.]+)', html)
            if value.replace(",", "").rstrip(".")
        }
    )
    if not amounts:
        amounts = sorted(
            {
                float(value.replace(",", "").rstrip("."))
                for value in re.findall(r"\$([\d,.]+)", html)
                if value.replace(",", "").rstrip(".") and float(value.replace(",", "").rstrip(".")) >= 5
            }
        )
    if not amounts:
        return ""
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def scrape_product(url: str) -> dict | None:
    time.sleep(REQUEST_DELAY)
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if not title_match:
        return None
    title = strip_html(title_match.group(1))
    title = re.sub(r"\s*-\s*Well-Trained Mind.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else ""
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, url) or "Grades K-12",
        "prices_mentioned": parse_prices(html) or "Contact for pricing",
        "description": description[:320],
    }


def main() -> None:
    urls = fetch_product_urls()
    rows: list[dict] = []
    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(scrape_product, url): url for url in urls}
        for future in as_completed(futures):
            try:
                row = future.result()
                if row:
                    rows.append(row)
            except Exception as exc:
                print(f"WARN failed {futures[future]}: {exc}", file=sys.stderr)
    rows.sort(key=lambda row: row["title"].lower())
    write_scrape_output(rows, "well-trained-mind")


if __name__ == "__main__":
    main()
