import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { AuthNav } from "@/components/auth/auth-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LighthouseIcon } from "@/components/icons/lighthouse-icon";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/browse", label: brand.nav.chart },
  { href: "/browse?featured=1", label: brand.nav.beacons },
  { href: "/harbors", label: brand.nav.harbors },
  { href: "/account", label: brand.nav.captainsLog },
  { href: "/pricing", label: brand.nav.premium },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-secondary)] text-[var(--color-beam)] shadow-lg shadow-[rgba(0,31,63,0.18)]">
            <LighthouseIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Homeschool
            </p>
            <p className="font-display text-lg font-semibold text-[var(--color-navy-deep)]">
              {brand.siteName}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-muted-foreground)] transition hover:text-[var(--color-secondary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <AuthNav />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/browse">{brand.search.title}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
