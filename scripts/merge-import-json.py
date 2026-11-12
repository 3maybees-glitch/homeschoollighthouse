#!/usr/bin/env python3
"""Merge scraped vendor JSON into an existing import file by website_url."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def row_count(rows: list) -> int:
    return len(rows)


def load_rows(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return [r for r in data if isinstance(r, dict)]
    return []


def merge_rows(existing: list[dict], scraped: list[dict]) -> list[dict]:
    merged: dict[str, dict] = {}
    for row in existing:
        url = (row.get("website_url") or row.get("url") or "").strip().lower()
        if url:
            merged[url] = row
    for row in scraped:
        url = (row.get("website_url") or row.get("url") or "").strip().lower()
        if url:
            merged[url] = row
    return sorted(merged.values(), key=lambda r: (r.get("title") or "").lower())


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: merge-import-json.py <scraped.json> <imported.json>", file=sys.stderr)
        return 2

    scraped_path = Path(sys.argv[1])
    import_path = Path(sys.argv[2])
    if not scraped_path.is_file():
        print(f"Missing scrape: {scraped_path}", file=sys.stderr)
        return 1

    scraped = load_rows(scraped_path)
    existing = load_rows(import_path) if import_path.is_file() else []
    old_count = row_count(existing)

    merged = merge_rows(existing, scraped)
    new_count = row_count(merged)

    if old_count > 0 and new_count * 10 < old_count * 9:
        print(
            f"REFUSE merge {import_path.name}: merged {new_count} rows vs existing {old_count} (>10% drop)",
            file=sys.stderr,
        )
        return 1

    import_path.parent.mkdir(parents=True, exist_ok=True)
    import_path.write_text(json.dumps(merged, indent=2), encoding="utf-8")
    added = max(0, new_count - old_count)
    updated = min(old_count, len(scraped))
    print(
        f"Merged {import_path.name}: {old_count} -> {new_count} (+{added} net; {len(scraped)} scraped rows)",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
