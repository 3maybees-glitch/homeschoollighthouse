#!/usr/bin/env python3
"""Scrape Abeka products from abeka.com.

Product URLs are discovered from the public Google sitemap. Product pages expose
structured data (JSON-LD) with names, descriptions, and prices, plus grade labels
in the product details panel.
"""

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
SITE_NAME = "Abeka"
SITEMAP_URL = "https://www.abeka.com/abekaonline/googlesitemap.aspx"
WORKERS = 12
REQUEST_DELAY = 0.08


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
    urls = [
        node.text.strip()
        for node in root.findall("sm:url/sm:loc", namespace)
        if node.text and "bookdescription.aspx?sbn=" in node.text.lower()
    ]
    return sorted(set(urls))


def parse_json_ld(html: str) -> dict | None:
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    if not match:
        return None
    try:
        data = json.loads(match.group(1))
    except json.JSONDecodeError:
        return None
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and item.get("@type") == "Product":
                return item
        return None
    if isinstance(data, dict) and data.get("@type") == "Product":
        return data
    return None


def parse_grade(html: str) -> str:
    match = re.search(r'id="div-grade"[\s\S]*?<span>([^<]+)</span>', html, re.I)
    return match.group(1).strip() if match else ""


def parse_prices(product: dict) -> str:
    offers = product.get("offers")
    if not offers:
        return ""

    if isinstance(offers, list):
        offers = offers[0] if offers else {}

    offer_type = offers.get("@type", "")
    if offer_type == "AggregateOffer":
        low = offers.get("lowPrice")
        high = offers.get("highPrice")
        if low and high and low != high:
            return f"${float(low):.2f}-${float(high):.2f}"
        if low:
            return f"${float(low):.2f}"
        return ""

    price = offers.get("price")
    if price in (None, "", "0", "0.00"):
        return ""
    return f"${float(price):.2f}"


def parse_title(html: str, product: dict | None) -> str:
    if product and product.get("name"):
        return str(product["name"]).strip()
    match = re.search(r"<h1[^>]*>([^<]+)</h1>", html, re.I | re.S)
    if match:
        return unescape(re.sub(r"\s+", " ", match.group(1))).strip()
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if match:
        title = match.group(1).strip()
        if " | " in title:
            title = title.rsplit(" | ", 1)[0].strip()
            if title.startswith("Abeka | Product Information | "):
                title = title.replace("Abeka | Product Information | ", "", 1)
        return title
    return ""


def scrape_product(url: str) -> dict | None:
    time.sleep(REQUEST_DELAY)
    html = fetch(url)
    product = parse_json_ld(html)
    title = parse_title(html, product)
    if not title or title.lower() == "product information":
        return None

    description = ""
    if product and product.get("description"):
        description = re.sub(r"\s+", " ", str(product["description"])).strip()

    return {
        "title": title,
        "website_url": url.split("#")[0],
        "source": SITE_NAME,
        "grades_or_ages": parse_grade(html),
        "prices_mentioned": parse_prices(product or {}),
        "description": description[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Loading Abeka product sitemap...", file=sys.stderr)
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
            if index % 100 == 0 or index == len(urls):
                print(f"  processed {index}/{len(urls)}...", file=sys.stderr)

    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "abeka-scraped.csv"
    json_path = data_dir / "abeka-scraped.json"
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
