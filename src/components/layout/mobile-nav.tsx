"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/browse", label: brand.nav.chart },
  { href: "/browse?featured=1", label: brand.nav.beacons },
  { href: "/harbors", label: brand.nav.harbors },
  { href: "/account", label: brand.nav.captainsLog },
  { href: "/pricing", label: brand.nav.premium },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="px-2"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open ? (
        <div className="absolute left-0 right-0 top-full border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-navy-deep)] hover:bg-[var(--color-muted)]/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
