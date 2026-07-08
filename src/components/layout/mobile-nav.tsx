"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { accountNavItem, freeNavItems, premiumNavItems, type NavItem } from "@/lib/site-nav";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  function renderItem(item: NavItem) {
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeMenu}
        className="rounded-xl px-3 py-2 hover:bg-[var(--color-muted)]/50"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-navy-deep)]">
          {item.label}
          {item.premium ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-beam)]/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-navy-deep)]">
              <Sparkles className="h-2.5 w-2.5" />
              Premium
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-xs text-[var(--color-muted-foreground)]">
          {item.description}
        </span>
      </Link>
    );
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
        <div className="absolute left-0 right-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
              Free for everyone
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              {freeNavItems.map(renderItem)}
            </div>

            <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
              Premium member tools
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              {premiumNavItems.map(renderItem)}
              <Link
                href="/pricing"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-muted)]/50"
              >
                See Premium plans →
              </Link>
            </div>

            <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
              Your account
            </p>
            <div className="mt-1 flex flex-col gap-0.5">{renderItem(accountNavItem)}</div>

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
