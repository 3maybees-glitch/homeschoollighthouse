import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { primaryNavItems } from "@/lib/site-nav";
import { AuthNav } from "@/components/auth/auth-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavMoreMenu } from "@/components/layout/nav-more-menu";
import { BrandLogoVideo } from "@/components/brand/brand-logo-video";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[var(--color-cream)] shadow-md shadow-[rgba(0,31,63,0.1)] sm:h-10 sm:w-10 sm:rounded-2xl">
            <BrandLogoVideo className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)] sm:block">
              Homeschool
            </p>
            <p className="truncate font-display text-base font-semibold text-[var(--color-navy-deep)] sm:text-lg">
              {brand.siteName}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-muted-foreground)] transition hover:text-[var(--color-secondary)]"
            >
              {item.label}
            </Link>
          ))}
          <NavMoreMenu />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <AuthNav />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
