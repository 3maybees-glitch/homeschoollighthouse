#!/usr/bin/env python3
"""Scrape Secular Homeschool resources (redirects to Homeschool.com secular hub)."""

from __future__ import annotations

import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Secular Homeschool"
PAGES = [
    ("https://secularhomeschool.com/", "Secular Homeschooling Resources"),
    ("https://www.homeschool.com/secular-homeschooling/", "Secular Homeschooling Resources | Homeschool.com"),
    ("https://www.homeschool.com/how-to-start-homeschooling/", "How to Start Homeschooling"),
    ("https://marketplace.homeschool.com/", "Homeschool.com Marketplace"),
]


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        final_url = response.geturl()
        html = response.read().decode("utf-8", errors="replace")
    return html, final_url


def parse_page(url: str, fallback_title: str) -> dict:
    html, final_url = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else fallback_title
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1)) if meta else fallback_title

    resource_links: list[str] = []
    for match in re.finditer(r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>', html, re.S | re.I):
        href = match.group(1)
        anchor = strip_html(match.group(2))
        if len(anchor) < 4:
            continue
        if any(host in href for host in ("facebook.com", "twitter.com", "fonts.googleapis.com")):
            continue
        if "homeschool.com" in href or "secular" in anchor.lower():
            resource_links.append(anchor)

    if resource_links:
        description = f"{description} Featured links: {', '.join(resource_links[:6])}."

    return {
        "title": title,
        "website_url": final_url,
        "source": SITE_NAME,
        "grades_or_ages": extract_ages(title, description) or "Grades K-12",
        "prices_mentioned": "Free",
        "description": description[:320],
    }


def main() -> None:
    rows: list[dict] = []
    seen: set[str] = set()
    for url, title in PAGES:
        row = parse_page(url, title)
        key = row["website_url"].lower()
        if key in seen:
            continue
        rows.append(row)
        seen.add(key)
    write_scrape_output(rows, "secular-homeschool")


if __name__ == "__main__":
    main()
