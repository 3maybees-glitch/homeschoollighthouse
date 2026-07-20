#!/usr/bin/env python3
"""Render PWA icons from public/icons/lighthouse-icon.svg."""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SVG = ROOT / "public/icons/lighthouse-icon.svg"
OUT = ROOT / "public/icons"
FAVICON = ROOT / "public/favicon.png"
NAVY = (0, 20, 40, 255)


def render_png(size: int) -> Image.Image:
    png_bytes = cairosvg.svg2png(url=str(SVG), output_width=size, output_height=size)
    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for size, name in ((512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png")):
        img = render_png(size)
        img.save(OUT / name, optimize=True)
        print(f"wrote {name} ({size}x{size})")

    inner = render_png(410)
    maskable = Image.new("RGBA", (512, 512), NAVY)
    offset = (512 - 410) // 2
    maskable.paste(inner, (offset, offset), inner)
    maskable.save(OUT / "icon-512-maskable.png", optimize=True)
    print("wrote icon-512-maskable.png (512x512)")

    render_png(192).save(FAVICON, optimize=True)
    print("wrote favicon.png (192x192)")


if __name__ == "__main__":
    main()
