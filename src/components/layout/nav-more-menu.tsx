"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { secondaryNavItems } from "@/lib/site-nav";

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
          className="z-50 min-w-[11rem] rounded-xl border border-[var(--color-border)] bg-white p-1.5 shadow-lg shadow-[rgba(0,31,63,0.1)]"
        >
          {secondaryNavItems.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-navy-deep)] outline-none hover:bg-[var(--color-muted)]/50 focus:bg-[var(--color-muted)]/50"
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
