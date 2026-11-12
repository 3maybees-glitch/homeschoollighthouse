#!/usr/bin/env python3
"""Scrape Memoria Press products from Yoast product sitemaps and product pages."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Memoria Press"
SITEMAP_URLS = [
    "https://www.memoriapress.com/product-sitemap.xml",
    "https://www.memoriapress.com/product-sitemap2.xml",
    "https://www.memoriapress.com/product-sitemap3.xml",
    "https://www.memoriapress.com/product-sitemap4.xml",
    "https://www.memoriapress.com/product-sitemap5.xml",
]
MAX_WORKERS = 18

PROGRAM_PAGES = [
    {
        "title": "Memoria Academy Online Courses",
        "website_url": "https://www.memoriapress.com/product-category/online-academy/",
        "grades_or_ages": "Grades 3-12",
        "prices_mentioned": "Contact for pricing",
        "description": "Live and self-paced online classical courses from Memoria Academy.",
    },
    {
        "title": "Memoria Press VideoText Online",
        "website_url": "https://www.memoriapress.com/product-category/videotext-online/",
        "grades_or_ages": "Grades 9-12",
        "prices_mentioned": "Contact for pricing",
        "description": "Online VideoText math courses from Memoria Press.",
    },
]

GRADE_SLUGS = {
    "preschool": "Preschool",
    "kindergarten": "Kindergarten",
    "first-grade": "Grade 1",
    "second-grade": "Grade 2",
    "third-grade": "Grade 3",
    "fourth-grade": "Grade 4",
    "fifth-grade": "Grade 5",
    "sixth-grade": "Grade 6",
    "seventh-grade": "Grade 7",
    "eighth-grade": "Grade 8",
    "ninth-grade": "Grade 9",
    "tenth-grade": "Grade 10",
    "eleventh-grade": "Grade 11",
    "twelfth-grade": "Grade 12",
}


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


def strip_html(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def fetch_product_urls() -> list[str]:
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls: list[str] = []
    seen: set[str] = set()

    for sitemap_url in SITEMAP_URLS:
        try:
            xml_text = fetch(sitemap_url)
        except urllib.error.HTTPError as exc:
            print(f"WARN: sitemap {sitemap_url}: {exc}", file=sys.stderr)
            continue
        root = ET.fromstring(xml_text)
        for loc in root.findall(".//sm:loc", ns):
            url = (loc.text or "").strip()
            if not url or url.rstrip("/").endswith("/shop"):
                continue
            key = url.lower()
            if key in seen:
                continue
            seen.add(key)
            urls.append(url.split("#")[0])

    return sorted(urls)


def parse_meta(html: str, prop: str) -> str:
    pattern = rf'<meta\s+property="{re.escape(prop)}"\s+content="([^"]*)"'
    match = re.search(pattern, html, re.I)
    if match:
        return unescape(match.group(1)).strip()
    pattern = rf'<meta\s+content="([^"]*)"\s+property="{re.escape(prop)}"'
    match = re.search(pattern, html, re.I)
    return unescape(match.group(1)).strip() if match else ""


def parse_prices(html: str) -> str:
    amounts: list[float] = []
    for value in re.findall(
        r'woocommerce-Price-amount amount"><bdi><span[^>]*>[^<]*</span>([\d.,]+)</bdi>',
        html,
    ):
        try:
            num = float(value.replace(",", ""))
        except ValueError:
            continue
        if num >= 0:
            amounts.append(num)
    amounts = sorted(set(amounts))
    if not amounts:
        return ""
    if len(amounts) == 1:
        return "Free" if amounts[0] == 0 else f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def extract_ages(title: str, url: str) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {url}".lower()

    for slug, label in GRADE_SLUGS.items():
        if slug.replace("-", " ") in haystack or slug in haystack:
            if label.lower() not in seen:
                seen.add(label.lower())
                labels.append(label)

    grade_match = re.search(r"(\d{1,2})(?:st|nd|rd|th)?\s*-?\s*grade", haystack)
    if grade_match:
        label = f"Grade {int(grade_match.group(1))}"
        if label.lower() not in seen:
            labels.append(label)

    if "online academy" in haystack or "online-academy" in haystack:
        labels.append("Grades 3-12")

    return "; ".join(labels[:8])


def clean_title(raw: str) -> str:
    title = raw.strip()
    for pattern in (
        r"\s*[-|–—]\s*Memoria Press: Classical Education\s*$",
        r"\s*[-|–—]\s*Memoria Press\s*$",
        r"\s*\|\s*Memoria Press: Classical Education\s*$",
        r"\s*\|\s*Memoria Press.*$",
    ):
        title = re.sub(pattern, "", title, flags=re.I).strip()
    return title.strip()


def product_from_url(url: str) -> dict | None:
    try:
        html = fetch(url)
    except Exception as exc:
        print(f"WARN: failed {url}: {exc}", file=sys.stderr)
        return None

    if "page can't be found" in html.lower() or "error-404" in html.lower():
        return None

    title = clean_title(parse_meta(html, "og:title") or "")
    if not title:
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
        title = strip_html(h1.group(1)) if h1 else ""
    if not title:
        slug = url.rstrip("/").split("/")[-1]
        title = slug.replace("-", " ").title()

    description = parse_meta(html, "og:description") or strip_html(html)[:320]

    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, url),
        "prices_mentioned": parse_prices(html),
        "description": description[:320],
    }


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    urls = fetch_product_urls()
    print(f"Found {len(urls)} product URLs in sitemaps", file=sys.stderr)

    rows: list[dict] = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(product_from_url, url): url for url in urls}
        done = 0
        for future in as_completed(futures):
            done += 1
            if done % 200 == 0:
                print(f"  scraped {done}/{len(urls)}...", file=sys.stderr)
            row = future.result()
            if row:
                rows.append(row)

    for entry in PROGRAM_PAGES:
        rows.append({**entry, "source": SITE_NAME})

    rows.sort(key=lambda row: row["title"].lower())

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = data_dir / "memoria-press-scraped.csv"
    json_path = data_dir / "memoria-press-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
