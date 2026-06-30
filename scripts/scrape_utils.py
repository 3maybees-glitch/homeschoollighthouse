"""Shared helpers for vendor scrape scripts."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"

GRADE_WORD = re.compile(
    r"\b("
    r"pre-k|prek|preschool|pre-kindergarten|kindergarten|\bk\b|"
    r"\d{1,2}(?:st|nd|rd|th)\s*grade|"
    r"grades?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?|"
    r"ages?\s*\d{1,2}(?:\s*[-–/]\s*\d{1,2})?"
    r")\b",
    re.IGNORECASE,
)


def fetch(url: str, timeout: int = 90) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def strip_html(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def extract_ages(title: str, description: str = "", extra: str = "") -> str:
    labels: list[str] = []
    seen: set[str] = set()
    haystack = f"{title} {description} {extra}"

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

    return "; ".join(labels[:8])


def format_shopify_prices(variants: list[dict]) -> str:
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
    low, high = prices[0], prices[-1]
    if low == 0:
        return f"Free-${high:.2f}"
    return f"${low:.2f}-${high:.2f}"


def format_wc_price(prices: dict) -> str:
    minor = prices.get("currency_minor_unit", 2)
    divisor = 10**minor

    def to_dollars(raw: str | int | None) -> str | None:
        if raw in (None, ""):
            return None
        return f"${int(raw) / divisor:.2f}"

    sale = to_dollars(prices.get("sale_price"))
    regular = to_dollars(prices.get("regular_price"))
    base = to_dollars(prices.get("price"))
    if sale and regular and sale != regular:
        return f"{sale} (was {regular})"
    return base or regular or ""


def fetch_shopify_products(base_url: str, per_page: int = 250) -> list[dict]:
    page = 1
    products: list[dict] = []
    while page <= 40:
        url = f"{base_url.rstrip('/')}/products.json?limit={per_page}&page={page}"
        print(f"Fetching {url}...", file=sys.stderr)
        payload = json.loads(fetch(url).decode("utf-8"))
        batch = payload.get("products", [])
        if not batch:
            break
        products.extend(batch)
        if len(batch) < per_page:
            break
        page += 1
    return products


def fetch_wc_products(api_base: str, per_page: int = 100) -> list[dict]:
    page = 1
    products: list[dict] = []
    while page <= 40:
        url = f"{api_base}?per_page={per_page}&page={page}"
        print(f"Fetching page {page}...", file=sys.stderr)
        payload = json.loads(fetch(url).decode("utf-8"))
        if not payload:
            break
        products.extend(payload)
        if len(payload) < per_page:
            break
        page += 1
    return products


def shopify_product_to_row(product: dict, site_name: str, base_url: str) -> dict:
    title = product.get("title", "").strip()
    handle = product.get("handle", "").strip()
    description = strip_html(product.get("body_html", ""))[:320]
    tags = product.get("tags") or []
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
    return {
        "title": title,
        "website_url": f"{base_url.rstrip('/')}/products/{handle}",
        "source": site_name,
        "grades_or_ages": extract_ages(title, description, " ".join(tags)),
        "prices_mentioned": format_shopify_prices(product.get("variants") or []),
        "description": description,
    }


def wc_product_to_row(product: dict, site_name: str) -> dict:
    title = strip_html(product.get("name", ""))
    description = strip_html(product.get("short_description") or product.get("description") or "")[:320]
    categories = product.get("categories") or []
    cat_text = " ".join(category.get("name", "") for category in categories)
    return {
        "title": title,
        "website_url": product.get("permalink", ""),
        "source": site_name,
        "grades_or_ages": extract_ages(title, description, cat_text),
        "prices_mentioned": format_wc_price(product.get("prices") or {}),
        "description": description,
    }


def write_scrape_output(rows: list[dict], stem: str) -> None:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    csv_path = data_dir / f"{stem}-scraped.csv"
    json_path = data_dir / f"{stem}-scraped.json"

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} resources to {json_path}", file=sys.stderr)
