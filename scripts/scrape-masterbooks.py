#!/usr/bin/env python3
"""Scrape Master Books products from masterbooks.com (Magento).

Product URLs are discovered from the public sitemap. Product pages expose
structured data (JSON-LD) with names and prices, plus grade/age hints in
meta tags and titles.
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
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
SITE_NAME = "Master Books"
SITEMAP_URL = "https://www.masterbooks.com/sitemaps/masterbooks/sitemap.xml"
WORKERS = 12
REQUEST_DELAY = 0.06

EXCLUDED_PATH_PREFIXES = (
    "/blog/",
    "/knowledge-base/",
    "/catalogsearch/",
    "/customer/",
    "/checkout/",
    "/sales/",
    "/newsletter/",
    "/contact",
    "/about",
    "/privacy",
    "/terms",
    "/affiliate",
    "/kids/",
    "/curriculum/",
    "/shop/",
    "/specials",
    "/gift-card",
    "/lesson-planner",
    "/homeschool-curriculum",
    "/homeschool",
)

LEVEL_GRADES = {
    "1": "Grade 1",
    "2": "Grade 2",
    "3": "Grade 3",
    "4": "Grade 4",
    "5": "Grade 5",
    "6": "Grade 6",
    "7": "Grade 7",
    "8": "Grade 8",
    "9": "Grade 9",
    "10": "Grade 10",
    "11": "Grade 11",
    "12": "Grade 12",
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


def fetch_product_urls() -> list[str]:
    xml_text = fetch(SITEMAP_URL)
    root = ET.fromstring(xml_text)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls: set[str] = set()

    for node in root.findall("sm:url/sm:loc", namespace):
        if not node.text:
            continue
        url = node.text.strip()
        if "nlpg.com" in url:
            continue
        if not url.startswith("https://www.masterbooks.com/"):
            continue
        path = url.replace("https://www.masterbooks.com", "")
        if not path or path == "/":
            continue
        if any(path.startswith(prefix) for prefix in EXCLUDED_PATH_PREFIXES):
            continue
        urls.add(url.split("#")[0])

    return sorted(urls)


def parse_json_ld_blocks(html: str) -> list[dict]:
    blocks: list[dict] = []
    for match in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            blocks.extend(item for item in data if isinstance(item, dict))
        elif isinstance(data, dict):
            blocks.append(data)
    return blocks


def parse_product(html: str) -> dict | None:
    for block in parse_json_ld_blocks(html):
        if block.get("@type") == "Product":
            return block
    return None


def parse_meta(html: str, name: str) -> str:
    match = re.search(
        rf'<meta (?:name|property)="{re.escape(name)}" content="([^"]*)"',
        html,
        re.I,
    )
    return html_lib.unescape(match.group(1)).strip() if match else ""


def parse_prices(product: dict, html: str) -> str:
    offers = product.get("offers")
    prices: list[float] = []

    if isinstance(offers, list):
        offer_items = offers
    elif isinstance(offers, dict):
        offer_items = [offers]
    else:
        offer_items = []

    for offer in offer_items:
        if not isinstance(offer, dict):
            continue
        offer_type = offer.get("@type", "")
        if offer_type == "AggregateOffer":
            for key in ("lowPrice", "highPrice", "price"):
                raw = offer.get(key)
                if raw not in (None, "", "0", "0.00"):
                    prices.append(float(raw))
            continue
        raw = offer.get("price")
        if raw not in (None, "", "0", "0.00"):
            prices.append(float(raw))

    if not prices:
        meta_price = parse_meta(html, "product:price:amount") or re.search(
            r'<meta itemprop="price" content="([^"]+)"',
            html,
        )
        if meta_price:
            raw = meta_price.group(1) if hasattr(meta_price, "group") else meta_price
            if raw:
                prices.append(float(raw))

    prices = sorted(set(prices))
    if not prices:
        return ""
    if len(prices) == 1:
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key in seen:
        return
    seen.add(key)
    labels.append(cleaned)


def infer_grades(title: str, meta_title: str, keywords: str, description: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {meta_title} {keywords} {description}".lower()

    if re.search(r"\bk-?12\b", haystack):
        add_label(labels, seen, "Grades K-12")
    if re.search(r"\bhigh school\b", haystack):
        add_label(labels, seen, "Grades 9-12")
    if re.search(r"\bmiddle school\b", haystack):
        add_label(labels, seen, "Grades 6-8")
    if re.search(r"\belementary\b", haystack):
        add_label(labels, seen, "Grades K-5")

    for match in re.finditer(
        r"\b(?:pre-?k|prek|preschool|pre-kindergarten|kindergarten|\bk(?:inder)?(?:garten)?\b)\b",
        haystack,
    ):
        token = match.group(0)
        if "pre" in token:
            add_label(labels, seen, "Preschool")
        else:
            add_label(labels, seen, "Kindergarten")

    for match in re.finditer(r"\b(?:grade|grades)\s*(\d{1,2})(?:\s*[-–/]\s*(\d{1,2}))?\b", haystack):
        start = int(match.group(1))
        end = int(match.group(2)) if match.group(2) else start
        if start == end:
            add_label(labels, seen, f"Grade {start}")
        else:
            add_label(labels, seen, f"Grades {start}-{end}")

    for match in re.finditer(r"\b(\d{1,2})(?:st|nd|rd|th)\s+grade\b", haystack):
        add_label(labels, seen, f"Grade {int(match.group(1))}")

    for match in re.finditer(r"\bages?\s*(\d{1,2})(?:\s*[-–/]\s*(\d{1,2}))?\b", haystack):
        start = match.group(1)
        end = match.group(2) or start
        add_label(labels, seen, f"Ages {start}-{end}")

    for match in re.finditer(
        r"\b(?:math|language arts|science|history|writing strands|language lessons|"
        r"basics|basics\s*2\.0|basics\s*for\b.*)\s*level\s*(\d{1,2})\b",
        haystack,
    ):
        level = match.group(1)
        if level in LEVEL_GRADES:
            add_label(labels, seen, LEVEL_GRADES[level])

    for match in re.finditer(r"\blevel\s*(\d{1,2})\b", title.lower()):
        level = match.group(1)
        if level in LEVEL_GRADES:
            add_label(labels, seen, LEVEL_GRADES[level])

    return ", ".join(labels)


def parse_title(product: dict | None, html: str) -> str:
    if product and product.get("name"):
        return str(product["name"]).strip()

    og_title = parse_meta(html, "og:title")
    if og_title:
        if " - " in og_title:
            og_title = og_title.split(" - ", 1)[-1].strip()
        return og_title.replace("Master Books Homeschool Curriculum - ", "").strip()

    meta_title = parse_meta(html, "title")
    if meta_title:
        return meta_title.split(" - ")[0].strip()

    match = re.search(r"<h1[^>]*>([^<]+)</h1>", html, re.I | re.S)
    if match:
        return html_lib.unescape(re.sub(r"\s+", " ", match.group(1))).strip()
    return ""


def scrape_product(url: str) -> dict | None:
    time.sleep(REQUEST_DELAY)
    html = fetch(url)
    product = parse_product(html)
    if not product and 'property="og:type" content="product"' not in html:
        return None

    title = parse_title(product, html)
    if not title:
        return None

    description = ""
    if product and product.get("description"):
        description = re.sub(r"\s+", " ", str(product["description"])).strip()
    if not description:
        description = parse_meta(html, "description")

    meta_title = parse_meta(html, "title")
    keywords = parse_meta(html, "keywords")

    return {
        "title": title,
        "website_url": url.split("#")[0],
        "source": SITE_NAME,
        "grades_or_ages": infer_grades(title, meta_title, keywords, description),
        "prices_mentioned": parse_prices(product or {}, html),
        "description": description[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    print("Loading Master Books sitemap...", file=sys.stderr)
    urls = fetch_product_urls()
    print(f"Found {len(urls)} candidate URLs", file=sys.stderr)

    rows: list[dict] = []
    errors = 0
    skipped = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(scrape_product, url): url for url in urls}
        for index, future in enumerate(as_completed(futures), start=1):
            url = futures[future]
            try:
                row = future.result()
                if row:
                    rows.append(row)
                else:
                    skipped += 1
            except Exception as exc:
                errors += 1
                print(f"WARN failed {url}: {exc}", file=sys.stderr)
            if index % 100 == 0 or index == len(urls):
                print(f"  processed {index}/{len(urls)}...", file=sys.stderr)

    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "masterbooks-scraped.csv"
    json_path = data_dir / "masterbooks-scraped.json"
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
        f"  with prices: {with_prices}, with ages/grades: {with_ages}, "
        f"skipped: {skipped}, errors: {errors}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
