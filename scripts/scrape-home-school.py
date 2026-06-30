#!/usr/bin/env python3
"""Scrape Homeschool World (home-school.com) catalog, world hub, and section pages."""

from __future__ import annotations

import re
import sys
import urllib.request
from html import unescape
from pathlib import Path
from urllib.parse import urljoin

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Homeschool World"
BASE_URL = "https://www.home-school.com"

SEED_PAGES = [
    "/world",
    "/catalog/",
    "/catalog/pages/homeschooling.php",
    "/catalog/pages/familylife.php",
    "/catalog/pages/gift.php",
    "/catalog/pages/phs.php",
    "/catalog/pages/phs-subscribe.php",
    "/catalog/pages/phs-renewals.php",
    "/2025-i-learn-awards/",
    "/2026-reader-awards/",
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def parse_title(html: str, fallback: str) -> str:
    match = re.search(r"<title>([^<]+)</title>", html, re.I)
    if not match:
        return fallback
    title = strip_html(match.group(1))
    title = re.sub(r"^Home Life Catalog:\s*", "", title, flags=re.I)
    title = re.sub(r'\s*-\s*"The World\'s Most Visited Homeschool Site".*$', "", title, flags=re.I)
    return title.strip() or fallback


def parse_detail(url: str) -> dict:
    html = fetch(url)
    title = parse_title(html, url.rsplit("=", 1)[-1])
    description = ""
    price_match = re.search(r"Price:\s*(\$[\d,.]+)", html, re.I)
    prices = price_match.group(1) if price_match else ""
    if not prices:
        amounts = re.findall(r"\$[\d,.]+", html)
        prices = amounts[0] if amounts else "Contact for pricing"

    body_match = re.search(r"Price:\s*\$[\d,.]+(.*?)(?:<hr|Related|Back to Catalog|$)", html, re.I | re.S)
    if body_match:
        description = strip_html(body_match.group(1))[:320]
    if not description:
        meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
        description = strip_html(meta.group(1)) if meta else ""

    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description) or "Grades K-12",
        "prices_mentioned": prices,
        "description": description or f"Homeschool World catalog item.",
    }


def parse_hub_page(path: str) -> dict:
    url = urljoin(BASE_URL, path)
    html = fetch(url)
    title = parse_title(html, path.strip("/").replace("/", " ").title())
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else strip_html(title)
    amounts = sorted(
        {
            float(value.replace(",", ""))
            for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
            if float(value.replace(",", "")) > 0
        }
    )
    if amounts:
        price_text = f"${amounts[0]:.2f}" if len(amounts) == 1 else f"${amounts[0]:.2f}-${amounts[-1]:.2f}"
    else:
        price_text = "Contact for pricing"
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description, path) or "Grades K-12",
        "prices_mentioned": price_text,
        "description": description[:320],
    }


def discover_detail_urls() -> list[str]:
    seen: set[str] = set()
    for path in SEED_PAGES:
        try:
            html = fetch(urljoin(BASE_URL, path))
        except Exception:
            continue
        for match in re.findall(r'href="(/catalog/detail\.php\?idn=\d+)"', html, re.I):
            seen.add(urljoin(BASE_URL, match))
    return sorted(seen)


def main() -> None:
    rows: list[dict] = []
    seen_urls: set[str] = set()

    for path in SEED_PAGES:
        try:
            row = parse_hub_page(path)
        except Exception as exc:
            print(f"WARN skipping {path}: {exc}", file=sys.stderr)
            continue
        rows.append(row)
        seen_urls.add(row["website_url"])

    for url in discover_detail_urls():
        if url in seen_urls:
            continue
        try:
            rows.append(parse_detail(url))
        except Exception as exc:
            print(f"WARN skipping {url}: {exc}", file=sys.stderr)
        seen_urls.add(url)

    write_scrape_output(rows, "home-school")


if __name__ == "__main__":
    main()
