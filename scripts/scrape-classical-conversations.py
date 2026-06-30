#!/usr/bin/env python3
"""Scrape Classical Conversations programs and bookstore products."""

from __future__ import annotations

import csv
import json
import re
import ssl
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Classical Conversations"
SHOPIFY_BASE = "https://classicalconversationsbooks.com"
PER_PAGE = 250

PROGRAM_PAGES = [
    ("foundations", "Foundations", "Ages 4+; Grades K-6"),
    ("essentials", "Essentials", "Ages 9-12"),
    ("scribblers", "Scribblers", "Ages 4-8"),
    ("challenge-a", "Challenge A", "Ages 12+"),
    ("challenge-b", "Challenge B", "Ages 13+"),
    ("challenge-i", "Challenge I", "Ages 14+"),
    ("challenge-ii", "Challenge II", "Ages 15+"),
    ("challenge-iii", "Challenge III", "Ages 16+"),
    ("challenge-iv", "Challenge IV", "Ages 17+"),
]

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"ages?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?"
    r")\b",
    re.IGNORECASE,
)

SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90, context=SSL_CONTEXT) as response:
        return response.read()


def strip_html(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def format_prices(variants: list[dict]) -> str:
    prices: list[float] = []
    for variant in variants:
        raw = variant.get("price")
        if raw in (None, ""):
            continue
        value = float(raw)
        if value >= 0:
            prices.append(value)
    prices = sorted(set(prices))
    if not prices:
        return ""
    if len(prices) == 1:
        return "Free" if prices[0] == 0 else f"${prices[0]:.2f}"
    return f"${prices[0]:.2f}-${prices[-1]:.2f}"


def extract_ages(title: str, description: str, tags: list[str]) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {' '.join(tags)}"

    for match in GRADE_WORD.finditer(haystack):
        token = match.group(1)
        if re.fullmatch(r"\d{1,2}", token):
            label = f"Grade {int(token)}"
        else:
            label = token.title()
        key = label.lower()
        if key not in seen:
            seen.add(key)
            labels.append(label)

    if "foundations" in haystack.lower():
        labels.insert(0, "Ages 4+; Grades K-6") if "Ages 4+; Grades K-6" not in labels else None
    if "essentials" in haystack.lower():
        labels.insert(0, "Ages 9-12") if "Ages 9-12" not in labels else None
    if "challenge" in haystack.lower():
        labels.insert(0, "Grades 7-12") if "Grades 7-12" not in labels else None

    return "; ".join(labels[:8])


def fetch_shopify_products() -> list[dict]:
    page = 1
    products: list[dict] = []
    while True:
        url = f"{SHOPIFY_BASE}/products.json?limit={PER_PAGE}&page={page}"
        print(f"Fetching Shopify page {page}...", file=sys.stderr)
        payload = json.loads(fetch(url).decode("utf-8"))
        batch = payload.get("products", [])
        if not batch:
            break
        products.extend(batch)
        if len(batch) < PER_PAGE:
            break
        page += 1
    return products


def program_rows() -> list[dict]:
    rows: list[dict] = []
    for slug, title, ages in PROGRAM_PAGES:
        rows.append(
            {
                "title": f"Classical Conversations {title}",
                "website_url": f"https://classicalconversations.com/{slug}/",
                "source": SITE_NAME,
                "grades_or_ages": ages,
                "prices_mentioned": "Contact community director for tuition",
                "description": f"Classical Conversations {title} homeschool community program.",
            }
        )
    rows.append(
        {
            "title": "Classical Conversations Community Program",
            "website_url": "https://classicalconversations.com/",
            "source": SITE_NAME,
            "grades_or_ages": "Ages 4+; Grades K-12",
            "prices_mentioned": "Contact community director for tuition",
            "description": "Classical Christian homeschool community programs from Classical Conversations.",
        }
    )
    return rows


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows = program_rows()
    products = fetch_shopify_products()
    print(f"Found {len(products)} bookstore products", file=sys.stderr)

    for product in products:
        title = product.get("title", "").strip()
        handle = product.get("handle", "").strip()
        if not title:
            continue
        tags = product.get("tags") or []
        if isinstance(tags, str):
            tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
        description = strip_html(product.get("body_html", ""))[:320]
        rows.append(
            {
                "title": title,
                "website_url": f"{SHOPIFY_BASE}/products/{handle}",
                "source": SITE_NAME,
                "grades_or_ages": extract_ages(title, description, tags),
                "prices_mentioned": format_prices(product.get("variants") or []),
                "description": description,
            }
        )

    rows.sort(key=lambda row: row["title"].lower())
    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / "classical-conversations-scraped.csv"
    json_path = data_dir / "classical-conversations-scraped.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
