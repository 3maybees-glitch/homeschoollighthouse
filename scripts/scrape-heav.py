#!/usr/bin/env python3
"""Scrape HEAV (Home Educators Association of Virginia) store products and resource pages."""

from __future__ import annotations

import json
import re
import ssl
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, wc_product_to_row, write_scrape_output

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
SITE_NAME = "HEAV"
BASE_URL = "https://heav.org"
API_BASE = "https://heav.org/wp-json/wc/store/v1/products"
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

CURATED_PAGES = [
    ("/", "Home Educators Association of Virginia (HEAV)", "Free", "Grades PreK-12"),
    ("/homeschool-support-group/", "HEAV Homeschool Support Groups", "Free", "Grades PreK-12"),
    ("/joinrenew/", "HEAV Membership", "$45-$500", "Grades PreK-12"),
    ("/joinrenew/lifetime-membership/", "HEAV Lifetime Membership", "$500", "Grades PreK-12"),
    ("/homeschool-convention-new/", "HEAV Homeschool Convention", "$69-$129", "Grades PreK-12"),
    ("/convention/", "HEAV Virginia Homeschool Convention", "$69-$129", "Grades PreK-12"),
    ("/events/virginia-homeschool-days/", "HEAV Virginia Homeschool Days", "Contact for pricing", "Grades PreK-12"),
    ("/events/day-at-the-capitol/", "HEAV Day at the Capitol", "Contact for pricing", "Grades PreK-12"),
    ("/events/field-trips/virginia-is-for-field-trips/", "HEAV Virginia Field Trips Guide", "Free", "Grades PreK-12"),
    ("/notice-of-intent/", "Virginia Notice of Intent to Homeschool", "Free", "Grades PreK-12"),
    ("/homeschool-law-compliance/", "Virginia Homeschool Law Compliance", "Free", "Grades PreK-12"),
    ("/virginia-homeschool-laws/testing/", "Virginia Homeschool Testing Requirements", "Free", "Grades PreK-12"),
    ("/resources/counselors-testers-and-tutors/", "HEAV Counselors, Testers, and Tutors Directory", "Free", "Grades PreK-12"),
    ("/resources/online-homeschool-transcript-service/", "HEAV Online Homeschool Transcript Service", "Contact for pricing", "Grades 9-12"),
    ("/high-school-mentor-program/", "HEAV High School Mentor Program", "Contact for pricing", "Grades 9-12"),
    ("/college-scholarships/", "HEAV College Scholarships", "Free", "Grades 9-12"),
    ("/graduation/", "HEAV Homeschool Graduation", "Contact for pricing", "Grades 9-12"),
    ("/homeschool-sports/", "Virginia Homeschool Sports", "Contact for pricing", "Grades 6-18"),
    ("/member-benefits-preview/", "HEAV Member Benefits", "Free", "Grades PreK-12"),
    ("/evaluator-tester-tutor-application/", "HEAV Evaluator and Tutor Listing Application", "$100/year", "Grades PreK-12"),
]

PAGE_INCLUDE = (
    "virginia-homeschool-laws",
    "resources/",
    "events/",
    "convention/",
    "joinrenew",
    "homeschool-support-group",
    "notice-of-intent",
    "graduation",
    "college-scholarships",
    "homeschool-sports",
    "high-school-mentor",
    "member-benefits",
    "evaluator",
    "homeschool-law-compliance",
    "about-heav",
)

PAGE_EXCLUDE = (
    "/form-test",
    "/cart",
    "/checkout",
    "/my-account",
    "/wp-",
    "/preview",
    "/login",
    "/lost-password",
    "/sample-page",
    "/privacy-policy",
    "/terms",
    "/contact",
    "/sitemap",
    "/search",
    "/tag/",
    "/category/",
    "/author/",
    "/feed",
    "/donate/thank",
)


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60, context=SSL_CONTEXT) as response:
        return response.read().decode("utf-8", errors="replace")


def fetch_json(url: str) -> list[dict]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60, context=SSL_CONTEXT) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_wc_products() -> list[dict]:
    page = 1
    products: list[dict] = []
    while page <= 10:
        url = f"{API_BASE}?per_page=100&page={page}"
        print(f"Fetching products page {page}...", file=sys.stderr)
        batch = fetch_json(url)
        if not batch:
            break
        products.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return products


def parse_sitemap_urls() -> list[str]:
    urls: list[str] = []
    for sitemap in ("page-sitemap1.xml", "page-sitemap2.xml"):
        xml = fetch(f"{BASE_URL}/{sitemap}")
        root = ET.fromstring(xml)
        for node in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
            if node.text:
                urls.append(node.text.strip())
    return urls


def should_include_page(url: str) -> bool:
    path = url.replace(BASE_URL, "")
    if any(token in path for token in PAGE_EXCLUDE):
        return False
    return any(token in path for token in PAGE_INCLUDE)


def parse_page(url: str, fallback_title: str, price_hint: str, grades: str) -> dict:
    html = fetch(url)
    title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = strip_html(title_match.group(1)) if title_match else fallback_title
    title = re.sub(r"\s*\|\s*Home Educators Association.*$", "", title, flags=re.I).strip()
    meta = re.search(r'<meta name="description" content="([^"]*)"', html, re.I)
    og = re.search(r'<meta property="og:description" content="([^"]*)"', html, re.I)
    description = strip_html(meta.group(1) if meta else og.group(1) if og else "") or fallback_title
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    if h1:
        heading = strip_html(h1.group(1))
        if heading and len(heading) > 3:
            title = heading
    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades or extract_ages(title, description),
        "prices_mentioned": price_hint,
        "description": description[:320],
    }


def main() -> None:
    rows: list[dict] = []
    seen_urls: set[str] = set()

    def add_row(row: dict) -> None:
        url = row["website_url"].rstrip("/")
        if url in seen_urls:
            return
        seen_urls.add(url)
        rows.append(row)

    for path, title, prices, grades in CURATED_PAGES:
        try:
            add_row(parse_page(f"{BASE_URL}{path}", title, prices, grades))
        except Exception as error:  # noqa: BLE001
            print(f"WARN: curated page failed {path}: {error}", file=sys.stderr)
            add_row(
                {
                    "title": title,
                    "website_url": f"{BASE_URL}{path}",
                    "source": SITE_NAME,
                    "grades_or_ages": grades,
                    "prices_mentioned": prices,
                    "description": title,
                }
            )

    for url in parse_sitemap_urls():
        if not should_include_page(url):
            continue
        if url.rstrip("/") in seen_urls:
            continue
        try:
            add_row(parse_page(url, "HEAV Resource", "Contact for pricing", "Grades PreK-12"))
        except Exception as error:  # noqa: BLE001
            print(f"WARN: sitemap page failed {url}: {error}", file=sys.stderr)

    for product in fetch_wc_products():
        add_row(wc_product_to_row(product, SITE_NAME))

    write_scrape_output(rows, "heav")


if __name__ == "__main__":
    main()
