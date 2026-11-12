#!/usr/bin/env python3
"""Snapshot and compare vendor import JSON row counts."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def row_count(path: Path) -> int:
    if not path.is_file():
        return 0
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return len(data)
    return len(data.get("listings") or data.get("products") or [])


def scan_imports(directory: Path) -> dict[str, int]:
    counts: dict[str, int] = {}
    for path in sorted(directory.glob("*-imported.json")):
        vendor = path.name.replace("-imported.json", "")
        counts[vendor] = row_count(path)
    return counts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--snapshot", metavar="FILE")
    parser.add_argument("import_dir", nargs="?", default="src/data", type=Path)
    parser.add_argument("--compare", metavar="FILE")
    parser.add_argument("--write", metavar="OUT")
    args = parser.parse_args()

    if args.snapshot:
        counts = scan_imports(args.import_dir)
        args.snapshot = Path(args.snapshot)
        args.snapshot.parent.mkdir(parents=True, exist_ok=True)
        args.snapshot.write_text(json.dumps(counts, indent=2), encoding="utf-8")
        print(f"Snapshot {len(counts)} vendors -> {args.snapshot}", file=sys.stderr)
        return 0

    if not args.compare:
        parser.error("provide --snapshot or --compare")

    before = json.loads(Path(args.compare).read_text(encoding="utf-8"))
    after = scan_imports(args.import_dir)

    rows = []
    total_added = 0
    total_removed = 0
    for vendor in sorted(set(before) | set(after)):
        b = int(before.get(vendor, 0))
        a = int(after.get(vendor, 0))
        delta = a - b
        if delta > 0:
            total_added += delta
        elif delta < 0:
            total_removed += -delta
        if b != a:
            rows.append(
                {
                    "vendor": vendor,
                    "before": b,
                    "after": a,
                    "delta": delta,
                }
            )

    report = {
        "vendors_compared": len(set(before) | set(after)),
        "vendors_changed": len(rows),
        "total_row_delta_positive": total_added,
        "total_row_delta_negative": total_removed,
        "net_rows": sum(after.values()) - sum(before.values()),
        "changes": rows,
        "after_total_rows": sum(after.values()),
    }

    if args.write:
        out = Path(args.write)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
