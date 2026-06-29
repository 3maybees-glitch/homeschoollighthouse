import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { AuthNav } from "@/components/auth/auth-nav";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/browse", label: brand.browse.title },
  { href: "/ai", label: brand.ai.title },
  { href: "/pricing", label: brand.pricing.title },
  { href: "/submit", label: brand.submit.title },
  { href: "/account", label: brand.account.title },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Homeschool
            </p>
            <p className="text-lg font-bold text-slate-900">{brand.siteName}</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 hover:text-amber-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <AuthNav />
          <Button asChild size="sm">
            <Link href="/browse">{brand.search.title}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
