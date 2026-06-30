#!/usr/bin/env python3
"""Scrape Ramsey Solutions homeschool finance and economics curriculum."""

from __future__ import annotations

import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Ramsey Solutions"
BASE_URL = "https://store.ramseysolutions.com"

CATEGORY_PAGES = [
    "/personal-finance-homeschool/",
    "/economics-homeschool/",
    "/entrepreneurship-homeschool/",
    "/career-discovery-homeschool/",
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def discover_product_urls() -> list[str]:
    seen: set[str] = set()
    for path in CATEGORY_PAGES:
        html = fetch(f"{BASE_URL}{path}")
        for match in re.findall(r'href="(https://store\.ramseysolutions\.com/[^"#?]+)"', html):
            slug = match.rstrip("/").split("/")[-1]
            if slug in {"bundles", "cart.php"}:
                continue
            if any(token in match for token in ("foundations", "homeschool", "economics", "finance", "bundle")):
                seen.add(match.split("#")[0].rstrip("/") + "/")
    return sorted(seen)


def parse_product(url: str) -> dict:
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else url
    title = re.sub(r"\s*\|\s*Ramsey Solutions.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else title
    amounts = sorted(
        {
            float(value.replace(",", ""))
            for value in re.findall(r"\$([\d,]+(?:\.\d{2})?)", html)
            if float(value.replace(",", "")) >= 20
        }
    )
    if amounts:
        price_text = f"${amounts[0]:.2f}" if len(amounts) == 1 else f"${amounts[0]:.2f}-${amounts[-1]:.2f}"
    else:
        price_text = "Contact for pricing"
    grades = "Grades 9-12" if "high" in f"{title} {description}".lower() else "Grades 6-12"
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades,
        "prices_mentioned": price_text,
        "description": description[:320],
    }


def parse_category(path: str) -> dict:
    url = f"{BASE_URL}{path}"
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else path
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": "Grades 6-12",
        "prices_mentioned": "Contact for pricing",
        "description": f"Ramsey Solutions homeschool {path.strip('/').replace('-', ' ')} resources.",
    }


def main() -> None:
    rows = [parse_category(path) for path in CATEGORY_PAGES]
    seen = {row["website_url"] for row in rows}
    for url in discover_product_urls():
        if url in seen:
            continue
        try:
            rows.append(parse_product(url))
        except Exception as exc:
            print(f"WARN skipping {url}: {exc}", file=sys.stderr)
        seen.add(url)
    write_scrape_output(rows, "ramsey-solutions")


if __name__ == "__main__":
    main()
