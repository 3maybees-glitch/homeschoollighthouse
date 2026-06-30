#!/usr/bin/env python3
"""Scrape BJU Press products from bjupress.com via Firecrawl.

Cloudflare blocks direct HTTP requests; Firecrawl is used for all fetches.
Products are discovered from category pages listed in the Dynamics 365 sitemap.
"""

from __future__ import annotations

import csv
import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urlparse

SITE_NAME = "BJU Press"
BASE_URL = "https://www.bjupress.com"
SITEMAP_INDEX = f"{BASE_URL}/_msdyn365/sitemap/MA2bXT"
SITEMAP_CATEGORIES = f"{BASE_URL}/_msdyn365/sitemap/MA2bXS"
SITEMAP_PAGE = f"{BASE_URL}/sitemap"
WORKERS = 4
REQUEST_DELAY = 0.15

PRODUCT_BLOCK = re.compile(
    r"\*\*((?:\\.|[^*])+?)\*\*\s*\\+\s*\nSKU\d+\]\((https://www\.bjupress\.com/[^)]+)\)\n(\$[\d,.]+)",
    re.MULTILINE,
)
CATEGORY_URL = re.compile(r"https://www\.bjupress\.com/category/[^\s\"']+?\.c")
GRADE_FROM_PATH = re.compile(
    r"/(?:"
    r"k3|k4|k5|"
    r"(?:(\d{1,2})(?:st|nd|rd|th)?-grade)|"
    r"(?:grade-(\d{1,2}))|"
    r"(math|science|bible|english|reading|spelling|writing|literature|social-studies|heritage-studies|"
    r"algebra|geometry|precalculus|biology|chemistry|physics|latin|spanish|handwriting|vocabulary|"
    r"electives|testing|journeyforth|vacation-stations|supplies|videos|christian-classroom-online"
    r")"
    r")",
    re.I,
)


def fetch_via_firecrawl(url: str, cache_dir: Path) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", urlparse(url).path.lower()).strip("-")[:100]
    cache_file = cache_dir / f"{slug}.json"
    if cache_file.exists() and cache_file.stat().st_size > 200:
        data = json.loads(cache_file.read_text(encoding="utf-8"))
        return data.get("markdown", "") or data.get("html", "") or ""

    cache_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["npx", "firecrawl-cli@latest", "scrape", url, "-o", str(cache_file)],
        check=True,
        capture_output=True,
        text=True,
    )
    data = json.loads(cache_file.read_text(encoding="utf-8"))
    return data.get("markdown", "") or data.get("html", "") or ""


def discover_category_urls(cache_dir: Path) -> list[str]:
    urls: set[str] = set()
    for sitemap_url in (SITEMAP_CATEGORIES, SITEMAP_PAGE):
        try:
            markdown = fetch_via_firecrawl(sitemap_url, cache_dir)
        except subprocess.CalledProcessError as exc:
            print(f"WARN failed sitemap {sitemap_url}: {exc}", file=sys.stderr)
            continue
        urls.update(CATEGORY_URL.findall(markdown))

    return sorted(urls)


def clean_title(title: str) -> str:
    return (
        title.replace("\\[", "[")
        .replace("\\]", "]")
        .replace("\\", "")
        .replace("\xa0", " ")
        .strip()
    )


def infer_grades(category_url: str, product_title: str) -> str:
    labels: list[str] = []
    path = unquote(urlparse(category_url).path).lower()
    title = product_title.lower()

    if re.search(r"\bk3\b", path) or "k3" in title:
        labels.append("K3")
    if re.search(r"\bk4\b", path) or "k4" in title:
        labels.append("K4")
    if re.search(r"\bk5\b", path) or re.search(r"\bk5\b", title):
        labels.append("K5")

    for match in re.finditer(r"(\d{1,2})(?:st|nd|rd|th)?[- ]grade", path):
        labels.append(f"Grade {int(match.group(1))}")
    for match in re.finditer(r"grade[- ](\d{1,2})", path):
        labels.append(f"Grade {int(match.group(1))}")

    for match in re.finditer(
        r"\b(?:math|science|reading|english|writing|bible|spelling|literature|heritage studies|"
        r"algebra|geometry|precalculus|biology|chemistry|physics|latin|spanish)\s*(\d{1,2})\b",
        title,
    ):
        labels.append(f"Grade {int(match.group(1))}")

    if re.search(r"\b(?:algebra 1|geometry|algebra 2|precalculus|consumer math)\b", title, re.I):
        labels.append("Grades 9-12")
    if re.search(r"\b(?:biology|chemistry|physics|american literature|british literature)\b", title, re.I):
        labels.append("Grades 9-12")
    if re.search(r"\b(?:iowa|stanford|cogat|standardized test)\b", f"{path} {title}", re.I):
        labels.append("Grades K-12")

    if not labels:
        if any(token in path for token in ("early-childhood", "k3", "k4", "k5")):
            labels.append("Ages 3-6")
        elif "high-school" in path or "electives" in path:
            labels.append("Grades 9-12")
        elif "middle" in path or "6th-grade" in path:
            labels.append("Grades 6-8")

    deduped = list(dict.fromkeys(labels))
    return "; ".join(deduped[:6])


def parse_category_products(markdown: str, category_url: str) -> list[dict]:
    products: list[dict] = []
    for match in PRODUCT_BLOCK.finditer(markdown):
        title = clean_title(match.group(1))
        url = match.group(2).split("#")[0]
        price = match.group(3).strip()

        desc_start = match.end()
        desc_end = markdown.find("\n\n", desc_start)
        description = markdown[desc_start : desc_end if desc_end != -1 else desc_start + 400].strip()
        if description.lower().startswith("quick view"):
            description = ""

        products.append(
            {
                "title": title,
                "website_url": url,
                "source": SITE_NAME,
                "category_url": category_url,
                "grades_or_ages": infer_grades(category_url, title),
                "prices_mentioned": price,
                "description": re.sub(r"\s+", " ", description)[:320],
            }
        )
    return products


def scrape_category(category_url: str, cache_dir: Path) -> list[dict]:
    time.sleep(REQUEST_DELAY)
    try:
        markdown = fetch_via_firecrawl(category_url, cache_dir)
    except subprocess.CalledProcessError as exc:
        print(f"WARN failed category {category_url}: {exc}", file=sys.stderr)
        return []
    return parse_category_products(markdown, category_url)


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    cache_dir = Path("/tmp/bjupress-scrape-cache")
    data_dir.mkdir(parents=True, exist_ok=True)
    cache_dir.mkdir(parents=True, exist_ok=True)

    print("Discovering BJU Press category URLs...", file=sys.stderr)
    categories = discover_category_urls(cache_dir)
    print(f"Found {len(categories)} categories", file=sys.stderr)

    all_products: dict[str, dict] = {}
    errors = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(scrape_category, url, cache_dir): url for url in categories}
        for index, future in enumerate(as_completed(futures), start=1):
            category_url = futures[future]
            try:
                rows = future.result()
            except Exception as exc:  # noqa: BLE001
                errors += 1
                print(f"ERROR {category_url}: {exc}", file=sys.stderr)
                continue

            for row in rows:
                key = row["website_url"].lower().rstrip("/")
                existing = all_products.get(key)
                if existing is None:
                    all_products[key] = row
                    continue
                if not existing["grades_or_ages"] and row["grades_or_ages"]:
                    existing["grades_or_ages"] = row["grades_or_ages"]
                if not existing["description"] and row["description"]:
                    existing["description"] = row["description"]
                if existing["prices_mentioned"] in ("", "$0.00") and row["prices_mentioned"] not in (
                    "",
                    "$0.00",
                ):
                    existing["prices_mentioned"] = row["prices_mentioned"]

            if index % 20 == 0 or index == len(categories):
                print(f"  categories [{index}/{len(categories)}]", file=sys.stderr)

    rows = sorted(all_products.values(), key=lambda item: item["title"].lower())

    csv_path = data_dir / "bjupress-scraped.csv"
    json_path = data_dir / "bjupress-scraped.json"
    fieldnames = [
        "title",
        "website_url",
        "source",
        "category_url",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"] and row["prices_mentioned"] != "$0.00")
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(
        f"  with prices: {with_prices}, with ages/grades: {with_ages}, category errors: {errors}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
