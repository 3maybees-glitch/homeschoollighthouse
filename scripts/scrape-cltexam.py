#!/usr/bin/env python3
"""Scrape Classic Learning Test (cltexam.com) pages and exam resources."""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html import unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import extract_ages, strip_html, write_scrape_output

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Classic Learning Test"
BASE_URL = "https://www.cltexam.com"

CURATED_PAGES = [
    ("/", "Classic Learning Test (CLT)", "", "Grades 3-12"),
    ("/homeschool/", "CLT for Homeschool", "", "Grades 3-12"),
    ("/homeschool/state-testing-requirements/", "State Homeschool Testing Requirements", "", "Grades 3-12"),
    ("/register/", "Register for CLT Exams", "", "Grades 3-12"),
    ("/tests/", "CLT Tests Overview", "", "Grades 3-12"),
    ("/testing-accommodations/", "CLT Testing Accommodations", "", "Grades 3-12"),
    (
        "/accommodations-information-for-parents-and-students/",
        "CLT Accommodations for Parents and Students",
        "",
        "Grades 3-12",
    ),
    (
        "/accommodations-information-for-school-administrators/",
        "CLT Accommodations for School Administrators",
        "",
        "Grades 3-12",
    ),
    ("/compare/", "CLT Exam Comparisons", "", "Grades 8-12"),
    ("/compare/clt-vs-sat/", "CLT vs. SAT", "", "Grades 10-12"),
    ("/compare/clt-vs-act/", "CLT vs. ACT", "", "Grades 10-12"),
    ("/compare/clt-10-vs-psat/", "CLT10 vs. PSAT", "", "Grades 9-10"),
    ("/scholarships/", "CLT Scholarships", "", "Grades 9-12"),
    ("/faqs/", "CLT Frequently Asked Questions", "", "Grades 3-12"),
    ("/financial-assistance-request-form/", "CLT Financial Assistance", "", "Grades 3-12"),
    ("/higher-ed/", "CLT for Higher Education", "", "Grades 11-12"),
    ("/colleges/", "Colleges Accepting CLT Scores", "", "Grades 11-12"),
    ("/score-share-rankings/", "CLT College Score Share Rankings", "", "Grades 11-12"),
    ("/student-awards/", "CLT10 Student Awards", "", "Grades 9-10"),
    ("/serviceacademies/", "CLT for U.S. Military Service Academies", "", "Grades 11-12"),
    ("/clt-florida/", "CLT in Florida", "", "Grades 3-12"),
    ("/parental-choice-programs/", "CLT Parental Choice Programs", "", "Grades 3-12"),
]

PAGE_EXCLUDE = (
    "/privacy-policy",
    "/terms-of-use",
    "/signin",
    "/contact",
    "/about/careers",
    "/style-guide",
    "/media",
    "/podcasts",
    "/school-rankings",
    "/2023-school-rankings",
    "/2024-school-rankings",
    "/school-spotlight",
    "/classicalbaccalaureate",
    "/advanced-courses",
    "/classical-teaching-corps",
    "/about/leadership",
    "/journey-through-the-author-bank",
    "/educators/",
)

PRICE_RE = re.compile(r"\$\s*([\d,]+(?:\.\d{2})?)")


def fetch(url: str, timeout: int = 60) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def fetch_json(url: str) -> list[dict] | dict:
    return json.loads(fetch(url).decode("utf-8"))


def clean_title(title: str) -> str:
    cleaned = strip_html(unescape(title))
    cleaned = cleaned.replace("&#038;", "&").replace("®", "").strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned


def extract_description(item: dict) -> str:
    yoast = item.get("yoast_head_json") or {}
    if yoast.get("description"):
        return strip_html(yoast["description"])[:320]

    excerpt = strip_html((item.get("excerpt") or {}).get("rendered", ""))
    if excerpt:
        return excerpt[:320]

    content = strip_html((item.get("content") or {}).get("rendered", ""))
    return content[:320]


def extract_prices(text: str) -> str:
    values: list[float] = []
    for match in PRICE_RE.finditer(text):
        amount = float(match.group(1).replace(",", ""))
        if 0 < amount <= 500:
            values.append(amount)

    values = sorted(set(values))
    if not values:
        return ""
    if len(values) == 1:
        return f"${values[0]:.2f}"
    return f"${values[0]:.2f}-${values[-1]:.2f}"


def infer_grades(url: str, title: str, description: str) -> str:
    path = url.lower()
    title_l = title.lower()

    if "clt3-6" in path or "clt3-6" in title_l:
        return "Grades 3-6"
    if "clt3-8" in path or "clt3-8" in title_l:
        return "Grades 3-8"
    if "clt-8" in path or "clt8" in title_l:
        return "Grade 8"
    if "clt-10" in path or "clt10" in title_l:
        return "Grades 9-10"
    if re.search(r"/tests/clt/?$", path) or title_l.strip() in {"clt", "clt exam"}:
        return "Grades 11-12"
    if "serviceacadem" in path or "higher-ed" in path or "colleges" in path:
        return "Grades 11-12"
    if "clt-10-vs-psat" in path or "student-awards" in path:
        return "Grades 9-10"
    if "compare" in path:
        return "Grades 8-12"
    if "scholarship" in path:
        return "Grades 9-12"

    inferred = extract_ages(title, description)
    return inferred or "Grades 3-12"


def wp_item_to_row(item: dict) -> dict:
    title = clean_title((item.get("title") or {}).get("rendered", ""))
    url = item.get("link", "").strip()
    content_html = (item.get("content") or {}).get("rendered", "")
    description = extract_description(item)
    prices = extract_prices(f"{content_html} {description}")
    grades = infer_grades(url, title, description)

    return {
        "title": title,
        "website_url": url,
        "source": SITE_NAME,
        "grades_or_ages": grades,
        "prices_mentioned": prices,
        "description": description,
    }


def fetch_paginated(endpoint: str) -> list[dict]:
    page = 1
    items: list[dict] = []
    while page <= 20:
        url = f"{BASE_URL}/wp-json/wp/v2/{endpoint}?per_page=100&page={page}"
        print(f"Fetching {url}...", file=sys.stderr)
        try:
            batch = fetch_json(url)
        except urllib.error.HTTPError as error:
            if error.code == 400:
                break
            raise
        if not isinstance(batch, list) or not batch:
            break
        items.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return items


def fetch_page_by_path(path: str) -> dict | None:
    slug = path.strip("/").split("/")[-1]
    if not slug:
        slug = "home"
    try:
        batch = fetch_json(f"{BASE_URL}/wp-json/wp/v2/pages?slug={slug}")
    except urllib.error.HTTPError:
        return None
    if not batch:
        return None
    for item in batch:
        if item.get("link", "").rstrip("/") == f"{BASE_URL}{path}".rstrip("/"):
            return item
    return batch[0]


def parse_sitemap_urls() -> list[str]:
    xml = fetch(f"{BASE_URL}/page-sitemap.xml").decode("utf-8", errors="replace")
    root = ET.fromstring(xml)
    urls: list[str] = []
    for node in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        if node.text:
            urls.append(node.text.strip())
    return urls


def should_include_page(url: str) -> bool:
    path = url.replace(BASE_URL, "")
    if any(token in path for token in PAGE_EXCLUDE):
        return False
    return any(
        token in path
        for token in (
            "/homeschool",
            "/register",
            "/tests",
            "/testing",
            "/accommodations",
            "/compare",
            "/scholarship",
            "/faq",
            "/financial-assistance",
            "/higher-ed",
            "/colleges",
            "/score-share",
            "/student-award",
            "/serviceacadem",
            "/clt-florida",
            "/parental-choice",
        )
    )


def main() -> None:
    rows: list[dict] = []
    seen_urls: set[str] = set()

    def add_row(row: dict) -> None:
        url = row["website_url"].rstrip("/")
        if not url or url in seen_urls:
            return
        seen_urls.add(url)
        rows.append(row)

    for test_item in fetch_paginated("cpt_tests"):
        add_row(wp_item_to_row(test_item))

    for path, title, prices, grades in CURATED_PAGES:
        url = f"{BASE_URL}{path}".rstrip("/") + ("/" if path != "/" else "/")
        if url.rstrip("/") in seen_urls:
            continue
        try:
            if path == "/":
                item = fetch_json(f"{BASE_URL}/wp-json/wp/v2/pages?slug=home")[0]
            else:
                item = fetch_page_by_path(path)
            if item:
                row = wp_item_to_row(item)
                if not row["prices_mentioned"] and prices:
                    row["prices_mentioned"] = prices
                if grades and row["grades_or_ages"] == "Grades 3-12":
                    row["grades_or_ages"] = grades
                add_row(row)
                continue
        except Exception as error:  # noqa: BLE001
            print(f"WARN: curated page failed {path}: {error}", file=sys.stderr)

        add_row(
            {
                "title": title,
                "website_url": url,
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
        path = url.replace(BASE_URL, "")
        try:
            item = fetch_page_by_path(path)
            if item:
                add_row(wp_item_to_row(item))
        except Exception as error:  # noqa: BLE001
            print(f"WARN: sitemap page failed {url}: {error}", file=sys.stderr)

    write_scrape_output(rows, "cltexam")


if __name__ == "__main__":
    main()
