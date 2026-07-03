"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { primaryNavItems, secondaryNavItems } from "@/lib/site-nav";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
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
          <nav className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex flex-col gap-0.5">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-navy-deep)] hover:bg-[var(--color-muted)]/50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
              More
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/50 hover:text-[var(--color-navy-deep)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-[var(--color-border)] pt-3">
              <Link
                href="/browse"
                onClick={closeMenu}
                className="flex w-full items-center justify-center rounded-xl bg-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                {brand.search.title}
              </Link>
              <div className="mt-2 flex items-center justify-center gap-4">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="text-sm font-medium text-[var(--color-navy-deep)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="text-sm font-medium text-[var(--color-secondary)]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
