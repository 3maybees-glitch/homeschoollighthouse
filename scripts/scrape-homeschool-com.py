#!/usr/bin/env python3
"""Scrape homeschool.com Curriculum Finder directory for resource data."""

from __future__ import annotations

import csv
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path
from urllib.parse import urljoin

import urllib.request

BASE = "https://www.homeschool.com"
DIRECTORY_URL = f"{BASE}/resource-guide/?results=directory&page={{page}}"
USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
MAX_PAGES = 99
DETAIL_WORKERS = 12
REQUEST_DELAY = 0.15


def fetch(url: str, retries: int = 3) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(f"Failed to fetch {url}: {last_err}")


def strip_tags(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", unescape(text)).strip()


def parse_price_from_h3(h3_html: str) -> str:
    text = strip_tags(h3_html)
    text = re.sub(r"^\s*(?:★|\*|fa-star[^\s]*)+\s*", "", text, flags=re.I)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_directory_page(html: str) -> list[dict]:
    listings: list[dict] = []
    blocks = re.split(r'<div class="mb-1">', html)
    for block in blocks[1:]:
        title_match = re.search(
            r'<h2[^>]*>\s*<a\s+href="([^"]+)"[^>]*>\s*([^<]+?)\s*</a>',
            block,
            re.I | re.S,
        )
        if not title_match:
            continue
        url = title_match.group(1).strip()
        if "/resource-guide/" not in url or url.rstrip("/").endswith("resource-guide"):
            continue
        title = strip_tags(title_match.group(2))
        price_match = re.search(r"<h3[^>]*>(.*?)</h3>", block, re.I | re.S)
        price = parse_price_from_h3(price_match.group(1)) if price_match else ""
        desc_match = re.search(
            r'<div>\s*(?!.*<h3)([^<]{20,}?)(?:\.\.\.|…)\s*<a[^>]+>\s*(?:more|\[more\])',
            block,
            re.I | re.S,
        )
        description = strip_tags(desc_match.group(1)) if desc_match else ""
        listings.append(
            {
                "title": title,
                "homeschool_com_url": url,
                "prices_mentioned": price,
                "description": description,
            }
        )
    return listings


def parse_detail_page(html: str) -> dict:
    grades: list[str] = []
    grades_match = re.search(
        r"<h2[^>]*>\s*Grades\s*</h2>\s*<ul[^>]*class=\"main-titles\"[^>]*>(.*?)</ul>",
        html,
        re.I | re.S,
    )
    if grades_match:
        grades = [
            strip_tags(li)
            for li in re.findall(r"<li[^>]*>(.*?)</li>", grades_match.group(1), re.I | re.S)
        ]

    website_url = ""
    visit_match = re.search(
        r'href="(https?://[^"]+)"[^>]*>\s*Visit Site',
        html,
        re.I,
    )
    if visit_match:
        website_url = visit_match.group(1).strip()

    if not website_url:
        discount_match = re.search(
            r'href="(https?://[^"]+)"[^>]*>\s*Get Discount',
            html,
            re.I,
        )
        if discount_match:
            website_url = discount_match.group(1).strip()

    detail_price = ""
    for pattern in [
        r"<h2[^>]*>\s*Price\s*</h2>\s*<[^>]+>([^<]+)",
        r"\$\d[\d,.]*(?:\s*/\s*(?:mo|month|yr|year))?",
    ]:
        m = re.search(pattern, html, re.I)
        if m:
            detail_price = strip_tags(m.group(0) if m.lastindex is None else m.group(1))
            break

    return {
        "grades_or_ages": "; ".join(g for g in grades if g),
        "website_url": website_url,
        "detail_price": detail_price,
    }


def scrape_directory() -> list[dict]:
    all_listings: list[dict] = []
    seen_urls: set[str] = set()

    for page in range(1, MAX_PAGES + 1):
        url = DIRECTORY_URL.format(page=page)
        print(f"Directory page {page}/{MAX_PAGES}...", file=sys.stderr)
        html = fetch(url)
        page_listings = parse_directory_page(html)
        if not page_listings:
            print(f"No listings on page {page}, stopping.", file=sys.stderr)
            break
        for item in page_listings:
            key = item["homeschool_com_url"].rstrip("/").lower()
            if key in seen_urls:
                continue
            seen_urls.add(key)
            all_listings.append(item)
        time.sleep(REQUEST_DELAY)

    return all_listings


def enrich_with_details(listings: list[dict]) -> None:
    def enrich_one(item: dict) -> tuple[str, dict]:
        html = fetch(item["homeschool_com_url"])
        return item["homeschool_com_url"], parse_detail_page(html)

    with ThreadPoolExecutor(max_workers=DETAIL_WORKERS) as pool:
        futures = {pool.submit(enrich_one, item): item for item in listings}
        done = 0
        total = len(listings)
        for future in as_completed(futures):
            item = futures[future]
            done += 1
            if done % 50 == 0 or done == total:
                print(f"Detail pages {done}/{total}...", file=sys.stderr)
            try:
                _, detail = future.result()
            except Exception as exc:  # noqa: BLE001
                print(f"WARN detail {item['homeschool_com_url']}: {exc}", file=sys.stderr)
                continue
            if detail["grades_or_ages"]:
                item["grades_or_ages"] = detail["grades_or_ages"]
            if detail["website_url"]:
                item["website_url"] = detail["website_url"]
            if detail["detail_price"] and not item.get("prices_mentioned"):
                item["prices_mentioned"] = detail["detail_price"]


def scrape_marketplace() -> list[dict]:
    products: list[dict] = []
    for page in range(1, 5):
        url = f"https://marketplace.homeschool.com/shop/page/{page}/" if page > 1 else "https://marketplace.homeschool.com/shop/"
        try:
            html = fetch(url)
        except Exception:
            break
        for m in re.finditer(
            r'\*\*([^*]+)\*\*\s*([^]]*?)\]\((https://marketplace\.homeschool\.com/product/[^)]+)\)',
            html,
        ):
            products.append(
                {
                    "title": m.group(1).strip(),
                    "homeschool_com_url": m.group(3).strip(),
                    "prices_mentioned": strip_tags(m.group(2)).strip(),
                    "grades_or_ages": "",
                    "website_url": m.group(3).strip(),
                    "description": "Homeschool.com Marketplace discount listing",
                    "source": "marketplace",
                }
            )
        # Also parse HTML product cards
        for m in re.finditer(
            r'<a[^>]+href="(https://marketplace\.homeschool\.com/product/[^"]+)"[^>]*>\s*<strong>([^<]+)</strong>',
            html,
            re.I,
        ):
            products.append(
                {
                    "title": strip_tags(m.group(2)),
                    "homeschool_com_url": m.group(1),
                    "prices_mentioned": "",
                    "grades_or_ages": "",
                    "website_url": m.group(1),
                    "description": "Homeschool.com Marketplace discount listing",
                    "source": "marketplace",
                }
            )
    # dedupe
    seen: set[str] = set()
    unique: list[dict] = []
    for p in products:
        key = p["homeschool_com_url"].rstrip("/").lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(p)
    return unique


def write_csv(path: Path, rows: list[dict]) -> None:
    fieldnames = [
        "title",
        "website_url",
        "homeschool_com_url",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def main() -> None:
    out_dir = Path(__file__).resolve().parents[1] / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "homeschool-com-scraped.csv"
    json_path = out_dir / "homeschool-com-scraped.json"

    listings = scrape_directory()
    print(f"Found {len(listings)} directory listings", file=sys.stderr)

    enrich_with_details(listings)

    for item in listings:
        item.setdefault("grades_or_ages", "")
        item.setdefault("website_url", "")
        if not item.get("website_url"):
            item["website_url"] = item["homeschool_com_url"]

    marketplace = scrape_marketplace()
    print(f"Found {len(marketplace)} marketplace products", file=sys.stderr)

    # Merge marketplace items not already in directory by title similarity
    directory_urls = {x["homeschool_com_url"].rstrip("/").lower() for x in listings}
    for mp in marketplace:
        if mp["homeschool_com_url"].rstrip("/").lower() not in directory_urls:
            listings.append(mp)

    write_csv(csv_path, listings)
    json_path.write_text(json.dumps(listings, indent=2), encoding="utf-8")
    print(f"Wrote {len(listings)} rows to {csv_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
