import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { listingTypeOptions } from "@/lib/directory/filter-config";

const footerLinks = [
  { href: "/browse", label: brand.nav.chart },
  { href: "/browse?featured=1", label: brand.featured },
  { href: "/ai", label: brand.ai.title },
  { href: "/pricing", label: brand.nav.premium },
  { href: "/submit", label: brand.submit.title },
  { href: "/account", label: brand.account.title },
];

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-navy-deep)] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-white">{brand.siteName}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">{brand.tagline}</p>
            <p className="mt-4 text-sm text-slate-500">
              Guiding families through trusted homeschool waters with {brand.stats.listings}{" "}
              resources.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)]">
              Navigation
            </p>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)]">
              Explore
            </p>
            <ul className="mt-4 space-y-2">
              {listingTypeOptions.slice(0, 6).map((option) => (
                <li key={option.value}>
                  <Link
                    href={`/browse/${option.value}`}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{brand.newsletter.title}</p>
            <p className="mt-1 text-sm text-slate-500">{brand.newsletter.subtitle}</p>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Homeschool Lighthouse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
