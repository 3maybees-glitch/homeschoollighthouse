#!/usr/bin/env python3
"""Scrape Christian Academy of America resources from chaoa.com.

Combines the WooCommerce store API, program and tuition pages, and the public
Ignitia online course list PDF published on the site.
"""

from __future__ import annotations

import csv
import html as html_lib
import io
import json
import re
import sys
import urllib.error
import urllib.request
from html import unescape
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - optional at runtime
    PdfReader = None

USER_AGENT = "HomeschoolLighthouseBot/1.0 (+https://homeschoollighthouse.com)"
SITE_NAME = "Christian Academy of America"
BASE_URL = "https://www.chaoa.com"
WC_API = f"{BASE_URL}/wp-json/wc/store/v1/products"
COURSE_PDF = f"{BASE_URL}/wp-content/uploads/2025/01/Ignitia-Online-Course-List-2025.pdf"
PER_PAGE = 100

PROGRAM_PAGES = [
    {
        "path": "/online/",
        "title": "Online Homeschooling Program",
        "grades_or_ages": "Grades 3-12",
    },
    {
        "path": "/workbook/",
        "title": "Workbook Homeschool Program",
        "grades_or_ages": "Grades 1-12",
    },
    {
        "path": "/kindergarten/",
        "title": "Kindergarten Program",
        "grades_or_ages": "Kindergarten",
    },
    {
        "path": "/dual-enrollment-2/",
        "title": "Dual Enrollment Program",
        "grades_or_ages": "Grades 9-12",
    },
    {
        "path": "/summer-school-credit-recovery/",
        "title": "Summer School and Credit Recovery",
        "grades_or_ages": "Grades 9-12",
    },
    {
        "path": "/electives/",
        "title": "High School Elective Courses",
        "grades_or_ages": "Grades 9-12",
    },
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


def fetch(url: str, retries: int = 3) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                return response.read()
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code in {429, 500, 502, 503, 504}:
                continue
            raise
        except Exception as exc:
            last_error = exc
    raise RuntimeError(f"Failed to fetch {url}: {last_error}")


def strip_html(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = unescape(cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "item"


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


def add_label(labels: list[str], seen: set[str], label: str) -> None:
    cleaned = re.sub(r"\s+", " ", label.strip())
    if not cleaned:
        return
    key = cleaned.lower()
    if key not in seen:
        seen.add(key)
        labels.append(cleaned)


def infer_grades_from_categories(categories: list[dict]) -> str:
    labels: list[str] = []
    seen: set[str] = set()
    for category in categories:
        name = category.get("name", "")
        slug = category.get("slug", "")
        lower = f"{name} {slug}".lower()
        if "kindergarten" in lower:
            add_label(labels, seen, "Kindergarten")
        if "high school" in lower:
            add_label(labels, seen, "Grades 9-12")
        for match in GRADE_WORD.finditer(name):
            add_label(labels, seen, match.group(1).title())
    return "; ".join(labels)


def fetch_store_products() -> list[dict]:
    page = 1
    products: list[dict] = []
    while True:
        url = f"{WC_API}?per_page={PER_PAGE}&page={page}"
        batch = json.loads(fetch(url).decode("utf-8"))
        if not batch:
            break
        products.extend(batch)
        if len(batch) < PER_PAGE:
            break
        page += 1
    return products


def store_product_to_row(product: dict) -> dict:
    categories = product.get("categories") or []
    return {
        "title": strip_html(product.get("name", "")),
        "website_url": product.get("permalink", ""),
        "source": SITE_NAME,
        "grades_or_ages": infer_grades_from_categories(categories),
        "prices_mentioned": format_wc_price(product.get("prices") or {}),
        "description": strip_html(product.get("short_description") or product.get("description") or "")[:320],
    }


def scrape_program_pages() -> list[dict]:
    rows: list[dict] = []
    for program in PROGRAM_PAGES:
        url = BASE_URL + program["path"]
        html = fetch(url).decode("utf-8", errors="replace")
        meta = re.search(r'name="description" content="([^"]*)"', html, re.I)
        description = html_lib.unescape(meta.group(1)).strip() if meta else program["title"]
        rows.append(
            {
                "title": program["title"],
                "website_url": url,
                "source": SITE_NAME,
                "grades_or_ages": program["grades_or_ages"],
                "prices_mentioned": "",
                "description": description[:320],
            }
        )
    return rows


def parse_tuition_page() -> list[dict]:
    html = fetch(f"{BASE_URL}/tuition-fees/").decode("utf-8", errors="replace")
    plain = strip_html(html)
    rows: list[dict] = []

    section = ""
    plan_type = ""
    for heading in re.findall(r">([^<>]{3,80})<", html):
        text = strip_html(heading)
        if "Tuition Plans" in text:
            section = text
            plan_type = ""
        elif text in {"BASIC", "PREMIUM"}:
            plan_type = text

    patterns = [
        (
            r"1 Installment of \$(\d[\d,]*(?:\.\d{2})?) for the full year",
            "Full Year (1 installment)",
        ),
        (
            r"2 Installments of \$(\d[\d,]*(?:\.\d{2})?) for the full year",
            "Full Year (2 installments)",
        ),
        (
            r"4 Installments of \$(\d[\d,]*(?:\.\d{2})?) for the full year",
            "Full Year (4 installments)",
        ),
        (
            r"8 Installments of \$(\d[\d,]*(?:\.\d{2})?) for the full year",
            "Full Year (8 installments)",
        ),
    ]

    current_section = ""
    current_plan = ""
    for match in re.finditer(
        r"(Kindergarten Tuition Plans|1st-8th Tuition Plans|9th-12th Tuition Plans|"
        r"Combination - Workbook and Online \(3rd-8th Grades\)|"
        r"Combination Workbook And Online \(9th-12th Grade\)|"
        r"BASIC|PREMIUM|Individual Course Tuition Plans|Other Fees)",
        plain,
    ):
        token = match.group(1)
        if "Tuition Plans" in token or token.startswith("Combination"):
            current_section = token
            current_plan = ""
        elif token in {"BASIC", "PREMIUM"}:
            current_plan = token
        elif token == "Individual Course Tuition Plans":
            current_section = token
            current_plan = ""
        elif token == "Other Fees":
            current_section = token
            current_plan = ""

    # Walk plain text sequentially for context + prices
    current_section = ""
    current_plan = ""
    idx = 0
    while idx < len(plain):
        for token in (
            "Kindergarten Tuition Plans",
            "1st-8th Tuition Plans",
            "9th-12th Tuition Plans",
            "Combination - Workbook and Online (3rd-8th Grades)",
            "Combination Workbook And Online (9th-12th Grade)",
            "Individual Course Tuition Plans",
            "Other Fees",
        ):
            if plain.startswith(token, idx):
                current_section = token
                current_plan = ""
                idx += len(token)
                break
        else:
            if plain.startswith("BASIC", idx):
                current_plan = "BASIC"
                idx += 5
                continue
            if plain.startswith("PREMIUM", idx):
                current_plan = "PREMIUM"
                idx += 7
                continue

            matched = False
            for pattern, term in patterns:
                m = re.match(pattern, plain[idx:])
                if m:
                    price = float(m.group(1).replace(",", ""))
                    title_parts = [part for part in (current_section, current_plan, term) if part]
                    title = " - ".join(title_parts)
                    slug = slugify(title)
                    grades = ""
                    lower = title.lower()
                    if "kindergarten" in lower:
                        grades = "Kindergarten"
                    elif "1st-8th" in lower or "3rd-8th" in lower:
                        grades = "Grades 1-8"
                    elif "9th-12th" in lower:
                        grades = "Grades 9-12"
                    rows.append(
                        {
                            "title": title,
                            "website_url": f"{BASE_URL}/tuition-fees/?id={slug}",
                            "source": SITE_NAME,
                            "grades_or_ages": grades,
                            "prices_mentioned": f"${price:.2f}",
                            "description": f"Tuition plan listed on the Christian Academy of America tuition page.",
                        }
                    )
                    idx += m.end()
                    matched = True
                    break
            if matched:
                continue

            fee_match = re.match(
                r"(Reactivation Fee|Transcripts|Switching Curriculum|Kindergarten Diploma Package|"
                r"High School Diploma Package|Rocket Language Access|Admin Fee|Curriculum Replacements|"
                r"High School Reference Books|Film School for Teens|Full Credit Course|Half Credit Course)"
                r"\s*\$(\d+(?:\.\d{2})?(?:-\$\d+(?:\.\d{2})?)?)",
                plain[idx:],
            )
            if fee_match:
                label = fee_match.group(1)
                price_text = fee_match.group(2)
                slug = slugify(label)
                grades = "Grades 9-12" if "High School" in label or "Half Credit" in label or "Full Credit" in label else ""
                rows.append(
                    {
                        "title": label,
                        "website_url": f"{BASE_URL}/tuition-fees/?id={slug}",
                        "source": SITE_NAME,
                        "grades_or_ages": grades,
                        "prices_mentioned": f"${price_text}" if not price_text.startswith("$") else price_text,
                        "description": f"Fee listed on the Christian Academy of America tuition page.",
                    }
                )
                idx += fee_match.end()
                continue

            idx += 1

    # Explicit individual course tuition cards
    for label, price, grades in (
        ("Individual Full Credit Course", 265.0, "Grades 9-12"),
        ("Individual Half Credit Course", 150.0, "Grades 9-12"),
    ):
        slug = slugify(label)
        rows.append(
            {
                "title": label,
                "website_url": f"{BASE_URL}/tuition-fees/?id={slug}",
                "source": SITE_NAME,
                "grades_or_ages": grades,
                "prices_mentioned": f"${price:.2f}",
                "description": "Individual online course tuition listed by Christian Academy of America.",
            }
        )

    return dedupe_rows(rows)


def expand_course_name(name: str, grades: str) -> list[tuple[str, str]]:
    name = name.strip()
    if name == "English I, II, III, and IV":
        return [(f"English {roman}", grades or "Grades 9-12") for roman in ("I", "II", "III", "IV")]
    if name == "Algebra I and II":
        return [("Algebra I", grades), ("Algebra II", grades)]
    if name == "Career Explorations I, II, and III":
        return [(f"Career Explorations {roman}", grades) for roman in ("I", "II", "III")]
    return [(name, grades)]


def parse_course_pdf() -> list[dict]:
    if PdfReader is None:
        print("WARN pypdf not installed; skipping Ignitia course PDF", file=sys.stderr)
        return []

    pdf_bytes = fetch(COURSE_PDF)
    text = "\n".join(
        page.extract_text() or "" for page in PdfReader(io.BytesIO(pdf_bytes)).pages
    )
    text = text.replace("\x96", "-").replace("–", "-")

    rows: list[dict] = []
    section = ""
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("Notes") or line.startswith("*") or line.startswith("Available"):
            continue
        if line.startswith("CAA has") or line.startswith("Online Courses offered"):
            continue
        if line.endswith("Subjects") or line.endswith("Electives") or "Elective Courses" in line:
            section = line
            continue
        if line.startswith("o "):
            line = line[2:].strip()

        grades = ""
        if " - " in line and ("Grade" in line or "Grades" in line):
            name, _, grades = line.partition(" - ")
            for course_name, course_grades in expand_course_name(name.strip(), grades.strip()):
                slug = slugify(course_name)
                rows.append(
                    {
                        "title": course_name,
                        "website_url": f"{BASE_URL}/online/?id={slug}",
                        "source": SITE_NAME,
                        "grades_or_ages": course_grades or infer_section_grades(section),
                        "prices_mentioned": "",
                        "description": f"Ignitia online course offered through Christian Academy of America ({section}).",
                    }
                )
            continue

        if line in {"Math", "Language Arts", "History & Geography", "Science", "Bible"}:
            for course_name, course_grades in expand_course_name(line, infer_section_grades(section)):
                slug = slugify(course_name)
                rows.append(
                    {
                        "title": course_name,
                        "website_url": f"{BASE_URL}/online/?id={slug}",
                        "source": SITE_NAME,
                        "grades_or_ages": course_grades,
                        "prices_mentioned": "",
                        "description": f"Ignitia online course offered through Christian Academy of America ({section}).",
                    }
                )
            continue

        if re.match(r"^[A-Z0-9]", line) and len(line) < 90:
            for course_name, course_grades in expand_course_name(line, infer_section_grades(section)):
                slug = slugify(course_name)
                rows.append(
                    {
                        "title": course_name,
                        "website_url": f"{BASE_URL}/online/?id={slug}",
                        "source": SITE_NAME,
                        "grades_or_ages": course_grades,
                        "prices_mentioned": "",
                        "description": f"Ignitia online course offered through Christian Academy of America ({section}).",
                    }
                )

    return dedupe_rows(rows)


def infer_section_grades(section: str) -> str:
    lower = section.lower()
    if "high school" in lower:
        return "Grades 9-12"
    if "middle school" in lower or "elementary" in lower:
        return "Grades 3-8"
    return ""


def dedupe_rows(rows: list[dict]) -> list[dict]:
    seen: set[str] = set()
    unique: list[dict] = []
    for row in rows:
        key = row["website_url"].lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(row)
    return unique


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    rows: list[dict] = []

    print("Fetching WooCommerce store products...", file=sys.stderr)
    products = fetch_store_products()
    rows.extend(store_product_to_row(product) for product in products if product.get("name"))

    print("Scraping program pages...", file=sys.stderr)
    rows.extend(scrape_program_pages())

    print("Parsing tuition plans...", file=sys.stderr)
    rows.extend(parse_tuition_page())

    print("Parsing Ignitia course list PDF...", file=sys.stderr)
    rows.extend(parse_course_pdf())

    rows = dedupe_rows([row for row in rows if row.get("title") and row.get("website_url")])
    rows.sort(key=lambda row: row["title"].lower())

    csv_path = data_dir / "chaoa-scraped.csv"
    json_path = data_dir / "chaoa-scraped.json"
    fieldnames = [
        "title",
        "website_url",
        "source",
        "grades_or_ages",
        "prices_mentioned",
        "description",
    ]

    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    with_prices = sum(1 for row in rows if row["prices_mentioned"])
    with_ages = sum(1 for row in rows if row["grades_or_ages"])
    print(f"Wrote {len(rows)} resources to {csv_path}", file=sys.stderr)
    print(
        f"  with prices: {with_prices}, with ages/grades: {with_ages}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
