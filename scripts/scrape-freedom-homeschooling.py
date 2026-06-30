#!/usr/bin/env python3
"""Scrape Freedom Homeschooling free elective resource links."""

from __future__ import annotations

import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "Freedom Homeschooling"
PAGE_URL = "https://freedomhomeschooling.com/electives/"

SKIP_HOSTS = (
    "facebook.com",
    "pinterest.com",
    "threads.net",
    "x.com",
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "freedomhomeschooling.com",
)


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_html(text: str) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", unescape(cleaned)).strip()


def parse_rows() -> list[dict]:
    html = fetch(PAGE_URL)
    rows: list[dict] = []
    seen: set[str] = set()

    for href, anchor_html in re.findall(r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>', html, re.S | re.I):
        href = unescape(href.split("&amp;")[0])
        if any(host in href for host in SKIP_HOSTS):
            continue
        title = strip_html(anchor_html)
        if len(title) < 3:
            continue
        key = href.lower()
        if key in seen:
            continue
        seen.add(key)
        rows.append(
            {
                "title": title,
                "website_url": href,
                "source": SITE_NAME,
                "grades_or_ages": "Grades K-12",
                "prices_mentioned": "Free",
                "description": f"Free homeschool elective resource listed on Freedom Homeschooling.",
            }
        )

    rows.insert(
        0,
        {
            "title": "Freedom Homeschooling Electives Directory",
            "website_url": PAGE_URL,
            "source": SITE_NAME,
            "grades_or_ages": "Grades K-12",
            "prices_mentioned": "Free",
            "description": "Curated directory of free online elective courses for homeschoolers.",
        },
    )
    return rows


def main() -> None:
    write_scrape_output(parse_rows(), "freedom-homeschooling")


if __name__ == "__main__":
    main()
