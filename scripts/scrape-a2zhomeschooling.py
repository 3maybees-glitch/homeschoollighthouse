#!/usr/bin/env python3
"""Scrape A2Z Homeschooling resources from archive and redirect targets.

Note: a2zhomeschooling.com now redirects to homeschool.com/secular-homeschooling/.
Original A2Z directory content is archived at homeschooling.gomilpitas.com.
"""

from __future__ import annotations

import csv
import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urlparse

ARCHIVE_BASE = "https://homeschooling.gomilpitas.com"
REDIRECT_URL = "https://www.homeschool.com/secular-homeschooling/"

DIRECTORY_PAGES = [
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/ann-zeises-archived-homeschool-articles/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/beginning-to-homeschool/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/concerns-about-homeschooling/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/explorations-4-kids-directory/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/field-trips-directory/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/holiday-directory/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/home-school-programs/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/homeschool-laws-legalities-archive/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/homeschool-support-groups/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/homeschooling-jokes-directory/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/homeschooling-teenagers-directory/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/lessons-and-ideas-directory-page/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/methods-styles-of-homeschooling-a2z/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/regional-and-worldwide-homeschooling/",
    f"{ARCHIVE_BASE}/directory-of-archived-posts-2017/thoughts-hard-facts-directory/",
]

CURRICULUM_PAGES = [
    f"{ARCHIVE_BASE}/materials/curriculum_shop/free-homeschooling-curriculum-materials/",
    f"{ARCHIVE_BASE}/materials/curriculum_shop/lesson-plans-for-free/",
    f"{ARCHIVE_BASE}/materials/curriculum_shop/math_shop/",
    f"{ARCHIVE_BASE}/materials/curriculum_shop/language_arts_shop/",
    f"{ARCHIVE_BASE}/explore/math/",
    f"{ARCHIVE_BASE}/explore/language_arts_kids/",
    f"{ARCHIVE_BASE}/explore/science_experiments_kids/",
]

SKIP_URL_PARTS = {
    "gomilpitas.com/opt-out",
    "gomilpitas.com/privacy",
    "gomilpitas.com/wp-admin",
    "gomilpitas.com/author/",
    "gomilpitas.com/tag/",
    "gomilpitas.com/category/",
    "gomilpitas.com/page/",
    "themesdna.com",
    "facebook.com",
    "twitter.com",
    "pinterest.com",
    "instagram.com",
    "youtube.com",
    "cookiedatabase.org",
    "i0.wp.com",
    "web.archive.org/web/*/im_",
    "sharer.php",
    "shareasale",
    "lduhtrp.net",
}

CONTENT_PATH_HINTS = (
    "/materials/",
    "/explore/",
    "/home_school_programs/",
    "/home-school-programs/",
    "/curriculum_shop/",
    "/teens/",
    "/legalities/",
)


def fetch_via_firecrawl(url: str, out_path: Path) -> str:
    if out_path.exists() and out_path.stat().st_size > 500:
        data = json.loads(out_path.read_text(encoding="utf-8"))
        return data.get("markdown", "") or data.get("html", "") or ""

    out_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "npx",
            "firecrawl-cli@latest",
            "scrape",
            url,
            "-o",
            str(out_path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    data = json.loads(out_path.read_text(encoding="utf-8"))
    return data.get("markdown", "") or data.get("html", "") or ""


def resolve_wayback(url: str) -> str:
    m = re.match(r"https?://web\.archive\.org/web/\d+/(https?://.+)", url)
    if m:
        return unquote(m.group(1).rstrip("/"))
    return url


def is_skip_url(url: str) -> bool:
    lower = url.lower()
    return any(part in lower for part in SKIP_URL_PARTS)


def is_resource_url(url: str) -> bool:
    if is_skip_url(url):
        return False
    if url.startswith("mailto:") or url.startswith("#"):
        return False
    host = urlparse(url).netloc.lower()
    if not host:
        return False
    if host.endswith("gomilpitas.com"):
        return False
    if host.endswith("homeschool.com") and "secular" not in url:
        return False
    return True


def parse_prices(text: str) -> str:
    if not text:
        return ""
    lower = text.lower()
    if "free" in lower and "$" not in text:
        return "Free"
    amounts = re.findall(
        r"\$\s?[\d,.]+(?:\s*/\s*(?:mo|month|yr|year|student|family))?",
        text,
        re.I,
    )
    ranges = re.findall(r"\$\s?[\d,.]+\s*[-–]\s*\$?\s*[\d,.]+", text)
    parts = ranges or amounts
    if parts:
        return "; ".join(dict.fromkeys(parts[:5]))
    if "varies" in lower or "contact" in lower:
        return "varies"
    if "free" in lower:
        return "Free"
    return ""


def parse_ages(text: str) -> str:
    if not text:
        return ""
    grades = re.findall(
        r"(?:Pre-?K|Preschool|Kindergarten|K-12|K–12|\d{1,2}(?:st|nd|rd|th)?\s*Grade|"
        r"grades?\s*\d{1,2}\s*[-–]\s*\d{1,2}|ages?\s*\d{1,2}\s*[-–]\s*\d{1,2}|high school|elementary|middle school)",
        text,
        re.I,
    )
    if grades:
        return "; ".join(dict.fromkeys(g.strip() for g in grades[:8]))
    return ""


def collect_gomilpitas_content_urls(markdown: str) -> list[str]:
    urls: list[str] = []
    for _title, url in re.findall(r"\[([^\]]+)\]\(([^)]+)\)", markdown):
        clean = url.split('"')[0].strip()
        if "homeschooling.gomilpitas.com" not in clean:
            continue
        if "/directory-of-archived-posts-2017/" in clean:
            continue
        if any(skip in clean for skip in ("opt-out", "privacy", "/author/", "/tag/", "/category/")):
            continue
        if any(hint in clean for hint in CONTENT_PATH_HINTS):
            urls.append(clean.split("#")[0])
    return list(dict.fromkeys(urls))


def extract_links_from_markdown(markdown: str, source_url: str) -> list[dict]:
    resources: list[dict] = []
    seen: set[str] = set()

    for match in re.finditer(r"\[([^\]]+)\]\(([^)]+)\)", markdown):
        title = match.group(1).strip()
        url = match.group(2).strip()

        if title.startswith("!") or len(title) < 2:
            continue
        if title.lower() in {"read more", "read more »", "continue reading", "manage options"}:
            continue

        resolved = resolve_wayback(url)
        if not is_resource_url(resolved):
            continue

        key = (title.lower(), urlparse(resolved).netloc.lower())
        if key in seen:
            continue
        seen.add(key)

        context_start = max(0, match.start() - 200)
        context_end = min(len(markdown), match.end() + 400)
        context = markdown[context_start:context_end]

        resources.append(
            {
                "title": re.sub(r"\s+", " ", title),
                "website_url": resolved,
                "a2z_source_url": source_url,
                "grades_or_ages": parse_ages(context),
                "prices_mentioned": parse_prices(context),
                "description": re.sub(r"\s+", " ", context).strip()[:240],
            }
        )

    return resources


def scrape_page(url: str, cache_dir: Path) -> list[dict]:
    slug = re.sub(r"[^a-z0-9]+", "-", urlparse(url).path.lower()).strip("-")[:80]
    cache_file = cache_dir / f"{slug}.json"
    try:
        markdown = fetch_via_firecrawl(url, cache_file)
    except subprocess.CalledProcessError as exc:
        print(f"WARN failed {url}: {exc}", file=sys.stderr)
        return []
    return extract_links_from_markdown(markdown, url)


def scrape_redirect_page() -> list[dict]:
    cache_dir = Path("/tmp/a2z-scrape-cache")
    return scrape_page(REDIRECT_URL, cache_dir)


def main() -> None:
    out_dir = Path(__file__).resolve().parents[1] / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    cache_dir = Path("/tmp/a2z-scrape-cache")
    cache_dir.mkdir(parents=True, exist_ok=True)

    urls = DIRECTORY_PAGES + CURRICULUM_PAGES
    all_resources: list[dict] = []
    seen_hosts: set[str] = set()
    content_urls: list[str] = []

    print(f"Scraping {len(urls)} A2Z archive pages...", file=sys.stderr)

    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(scrape_page, url, cache_dir): url for url in urls}
        done = 0
        for future in as_completed(futures):
            done += 1
            url = futures[future]
            print(f"  [{done}/{len(urls)}] {url}", file=sys.stderr)
            try:
                rows = future.result()
            except Exception as exc:  # noqa: BLE001
                print(f"  ERROR {url}: {exc}", file=sys.stderr)
                continue

            cache_slug = re.sub(r"[^a-z0-9]+", "-", urlparse(url).path.lower()).strip("-")[:80]
            cache_file = cache_dir / f"{cache_slug}.json"
            if cache_file.exists():
                md = json.loads(cache_file.read_text(encoding="utf-8")).get("markdown", "")
                content_urls.extend(collect_gomilpitas_content_urls(md))

            for row in rows:
                host = urlparse(row["website_url"]).netloc.lower().replace("www.", "")
                if host in seen_hosts:
                    continue
                seen_hosts.add(host)
                all_resources.append(row)
            time.sleep(0.2)

    content_urls = list(dict.fromkeys(content_urls))[:80]
    print(f"Scraping {len(content_urls)} migrated A2Z content pages...", file=sys.stderr)

    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(scrape_page, url, cache_dir): url for url in content_urls}
        done = 0
        for future in as_completed(futures):
            done += 1
            if done % 10 == 0 or done == len(content_urls):
                print(f"  content [{done}/{len(content_urls)}]", file=sys.stderr)
            try:
                rows = future.result()
            except Exception:
                continue
            for row in rows:
                host = urlparse(row["website_url"]).netloc.lower().replace("www.", "")
                if host in seen_hosts:
                    continue
                seen_hosts.add(host)
                all_resources.append(row)
            time.sleep(0.15)

    print("Scraping redirect target (current a2zhomeschooling.com)...", file=sys.stderr)
    for row in scrape_redirect_page():
        host = urlparse(row["website_url"]).netloc.lower().replace("www.", "")
        if host not in seen_hosts:
            seen_hosts.add(host)
            row["a2z_source_url"] = REDIRECT_URL
            all_resources.append(row)

    all_resources.sort(key=lambda r: r["title"].lower())

    csv_path = out_dir / "a2zhomeschooling-scraped.csv"
    json_path = out_dir / "a2zhomeschooling-scraped.json"
    fieldnames = [
        "title",
        "website_url",
        "a2z_source_url",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_resources)

    json_path.write_text(json.dumps(all_resources, indent=2), encoding="utf-8")

    with_prices = sum(1 for r in all_resources if r["prices_mentioned"])
    with_ages = sum(1 for r in all_resources if r["grades_or_ages"])
    print(f"Wrote {len(all_resources)} resources to {csv_path}", file=sys.stderr)
    print(f"  with prices: {with_prices}, with ages: {with_ages}", file=sys.stderr)


if __name__ == "__main__":
    main()
