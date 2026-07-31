"use client";

import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { accountNavItem, advertiseNavItem, moreFreeNavItems, premiumNavItems, type NavItem } from "@/lib/site-nav";

function MenuLink({ item }: { item: NavItem }) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        href={item.href}
        className="block rounded-lg px-3 py-2 outline-none hover:bg-[var(--color-muted)]/50 focus:bg-[var(--color-muted)]/50"
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
    </DropdownMenu.Item>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu.Label className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
      {children}
    </DropdownMenu.Label>
  );
}

export function NavMoreMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-muted-foreground)] transition hover:text-[var(--color-secondary)] data-[state=open]:text-[var(--color-secondary)]">
        More
        <ChevronDown className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[18rem] rounded-xl border border-[var(--color-border)] bg-white p-1.5 shadow-lg shadow-[rgba(0,31,63,0.1)]"
        >
          <SectionLabel>Free for everyone</SectionLabel>
          {moreFreeNavItems.map((item) => (
            <MenuLink key={item.href} item={item} />
          ))}

          <DropdownMenu.Separator className="mx-2 my-1.5 h-px bg-[var(--color-border)]" />

          <SectionLabel>Premium tools</SectionLabel>
          {premiumNavItems.map((item) => (
            <MenuLink key={item.href} item={item} />
          ))}

          <DropdownMenu.Separator className="mx-2 my-1.5 h-px bg-[var(--color-border)]" />

          <SectionLabel>For businesses</SectionLabel>
          <MenuLink item={advertiseNavItem} />

          <DropdownMenu.Separator className="mx-2 my-1.5 h-px bg-[var(--color-border)]" />

          <SectionLabel>Your account</SectionLabel>
          <MenuLink item={accountNavItem} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
