#!/usr/bin/env python3
"""Scrape Math-U-See resources from mathusee.com and store.demmelearning.com.

Note: math-u-see.com does not respond reliably; the live site is https://mathusee.com
(Demme Learning). Prices come from the Shopify store API.
"""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0"
STORE_API = "https://store.demmelearning.com/products.json?limit=250"
SITE_BASE = "https://mathusee.com"

LEVEL_GRADES = {
    "primer": "Preschool; Kindergarten; Ages 4-5",
    "alpha": "1st Grade; Ages 6-7",
    "beta": "2nd Grade; Ages 7-8",
    "gamma": "3rd Grade; Ages 8-9",
    "delta": "4th Grade; Ages 9-10",
    "epsilon": "5th Grade; Ages 10-11",
    "zeta": "6th Grade; Ages 11-12",
    "pre-algebra": "7th Grade; 8th Grade; Ages 12-14",
    "algebra-1-psm": "8th Grade; 9th Grade; High School",
    "algebra-1": "8th Grade; 9th Grade; High School",
    "algebra-2-psm": "10th Grade; 11th Grade; High School",
    "algebra-2": "10th Grade; 11th Grade; High School",
    "geometry": "9th Grade; 10th Grade; High School",
    "precalculus": "11th Grade; 12th Grade; High School",
    "calculus": "12th Grade; High School; Ages 16-18",
    "integrated-manipulatives": "All Levels; K-12",
    "accelerated-individualized-mastery-for-addition-and-subtraction": "Ages 8+; Remediation",
    "accelerated-individualized-mastery-for-multiplication": "Ages 8+; Remediation",
    "product-training": "Parents; Educators",
    "integer-block": "All Levels; K-12",
    "aim": "Ages 8+; Remediation",
}

CURRICULUM_LEVELS = [
    ("Primer", "primer"),
    ("Alpha", "alpha"),
    ("Beta", "beta"),
    ("Gamma", "gamma"),
    ("Delta", "delta"),
    ("Epsilon", "epsilon"),
    ("Zeta", "zeta"),
    ("Pre-Algebra", "pre-algebra"),
    ("Algebra 1: Principles of Secondary Mathematics", "algebra-1-psm"),
    ("Algebra 1: Legacy Edition", "algebra-1"),
    ("Geometry", "geometry"),
    ("Algebra 2: Principles of Secondary Mathematics", "algebra-2-psm"),
    ("Algebra 2: Legacy Edition", "algebra-2"),
    ("PreCalculus", "precalculus"),
    ("Calculus", "calculus"),
]

OTHER_PAGES = [
    (
        "Integrated Manipulatives",
        f"{SITE_BASE}/products/integrated-manipulatives/",
        "integrated-manipulatives",
    ),
    (
        "AIM for Addition and Subtraction",
        f"{SITE_BASE}/products/accelerated-individualized-mastery/accelerated-individualized-mastery-for-addition-and-subtraction/",
        "accelerated-individualized-mastery-for-addition-and-subtraction",
    ),
    (
        "AIM for Multiplication",
        f"{SITE_BASE}/products/accelerated-individualized-mastery/accelerated-individualized-mastery-for-multiplication/",
        "accelerated-individualized-mastery-for-multiplication",
    ),
    (
        "Product Training",
        f"{SITE_BASE}/products/product-training/",
        "product-training",
    ),
]

MUS_KEYWORDS = [
    "math-u-see",
    "math u see",
    "integer block",
    "aim ",
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "primer",
    "pre-algebra",
    "algebra",
    "geometry",
    "precalc",
    "calculus",
    "place value whiteboard",
    "mus ",
]

EXCLUDE_KEYWORDS = ["writeshop", "spelling", "analytical grammar", "clearance", "wild tales", "modern milestones"]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strip_tags(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", unescape(text)).strip()


def page_description(html: str) -> str:
    for pattern in [
        r'<meta name="description" content="([^"]+)"',
        r'property="og:description" content="([^"]+)"',
    ]:
        match = re.search(pattern, html)
        if match and match.group(1).strip():
            return match.group(1).strip()

    match = re.search(r'class="entry-content"[^>]*>(.*?)</div>', html, re.S)
    if match:
        paragraphs = re.findall(r"<p>([^<]{20,})</p>", match.group(1))
        if paragraphs:
            return strip_tags(paragraphs[0])[:240]
    return ""


def infer_grades_from_product(title: str, handle: str, tags: list[str]) -> str:
    haystack = f"{title} {handle} {' '.join(tags)}".lower()
    for key, grades in LEVEL_GRADES.items():
        if key.replace("-", " ") in haystack or key in haystack:
            return grades
    if "integer block" in haystack or "manipulative" in haystack:
        return LEVEL_GRADES["integer-block"]
    if "aim" in haystack:
        return LEVEL_GRADES["aim"]
    if "algebra 1" in haystack and "principles" in haystack:
        return LEVEL_GRADES["algebra-1-psm"]
    if "algebra 1" in haystack:
        return LEVEL_GRADES["algebra-1"]
    if "algebra 2" in haystack and "principles" in haystack:
        return LEVEL_GRADES["algebra-2-psm"]
    if "algebra 2" in haystack:
        return LEVEL_GRADES["algebra-2"]
    return ""


def format_prices(variants: list[dict]) -> str:
    amounts = sorted({float(v["price"]) for v in variants if v.get("price")})
    if not amounts:
        return ""
    if len(amounts) == 1:
        return f"${amounts[0]:.2f}"
    return f"${amounts[0]:.2f}-${amounts[-1]:.2f}"


def is_mus_product(product: dict) -> bool:
    title = product["title"].lower()
    handle = product["handle"].lower()
    tags = " ".join(product.get("tags", [])).lower()
    haystack = f"{title} {handle} {tags}"
    if any(word in haystack for word in EXCLUDE_KEYWORDS):
        return False
    return any(keyword in haystack for keyword in MUS_KEYWORDS)


def fetch_store_products() -> list[dict]:
    products: list[dict] = []
    page = 1
    while page <= 5:
        url = f"{STORE_API}&page={page}" if page > 1 else STORE_API
        batch = json.loads(fetch(url)).get("products", [])
        if not batch:
            break
        products.extend(batch)
        page += 1
    return [p for p in products if is_mus_product(p)]


def store_prices_for_level(slug: str, products: list[dict]) -> str:
    slug_key = slug.replace("-psm", "")
    prices: list[float] = []
    for product in products:
        handle = product["handle"].lower()
        title = product["title"].lower()
        if slug_key not in handle and slug_key not in title:
            continue
        for variant in product.get("variants", []):
            if variant.get("price"):
                prices.append(float(variant["price"]))
    if not prices:
        return "See store"
    prices = sorted(set(prices))
    if len(prices) == 1:
        return f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def scrape_curriculum_pages(store_products: list[dict]) -> list[dict]:
    rows: list[dict] = []

    for title, slug in CURRICULUM_LEVELS:
        url = f"{SITE_BASE}/products/math-u-see-curriculum/{slug}/"
        html = fetch(url)
        rows.append(
            {
                "title": title,
                "website_url": url,
                "source": "mathusee.com curriculum",
                "grades_or_ages": LEVEL_GRADES.get(slug, ""),
                "prices_mentioned": store_prices_for_level(slug, store_products),
                "description": page_description(html),
            }
        )

    for title, url, slug in OTHER_PAGES:
        html = fetch(url)
        rows.append(
            {
                "title": title,
                "website_url": url,
                "source": "mathusee.com product",
                "grades_or_ages": LEVEL_GRADES.get(slug, ""),
                "prices_mentioned": store_prices_for_level(slug, store_products),
                "description": page_description(html),
            }
        )

    return rows


def scrape_store_products(products: list[dict]) -> list[dict]:
    rows: list[dict] = []
    for product in products:
        url = f"https://store.demmelearning.com/products/{product['handle']}"
        body = strip_tags(product.get("body_html") or "")[:240]
        rows.append(
            {
                "title": product["title"],
                "website_url": url,
                "source": "Demme Learning Store",
                "grades_or_ages": infer_grades_from_product(
                    product["title"], product["handle"], product.get("tags", [])
                ),
                "prices_mentioned": format_prices(product.get("variants", [])),
                "description": body,
            }
        )
    return rows


def write_output(rows: list[dict], out_dir: Path) -> None:
    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]
    csv_path = out_dir / "math-u-see-scraped.csv"
    json_path = out_dir / "math-u-see-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} rows to {csv_path}", file=sys.stderr)


def main() -> None:
    out_dir = Path(__file__).resolve().parents[1] / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    store_products = fetch_store_products()
    print(f"Found {len(store_products)} Math-U-See store products", file=sys.stderr)

    curriculum_rows = scrape_curriculum_pages(store_products)
    store_rows = scrape_store_products(store_products)

    seen_urls: set[str] = set()
    merged: list[dict] = []
    for row in curriculum_rows + store_rows:
        key = row["website_url"].rstrip("/").lower()
        if key in seen_urls:
            continue
        seen_urls.add(key)
        merged.append(row)

    merged.sort(key=lambda row: (row["source"], row["title"].lower()))
    write_output(merged, out_dir)

    with_prices = sum(1 for row in merged if row["prices_mentioned"])
    with_ages = sum(1 for row in merged if row["grades_or_ages"])
    print(f"  with prices: {with_prices}, with ages: {with_ages}", file=sys.stderr)


if __name__ == "__main__":
    main()
