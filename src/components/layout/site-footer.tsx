import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import { BrandLogoVideo } from "@/components/brand/brand-logo-video";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";

const footerLinks = [
  { href: "/browse", label: brand.nav.chart },
  { href: "/harbors", label: brand.nav.harbors },
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
            <Link href="/" className="inline-flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white/10 p-1">
                <BrandLogoVideo className="h-full w-full" />
              </div>
              <p className="font-display text-2xl font-semibold text-white">{brand.siteName}</p>
            </Link>
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

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <NewsletterSignup />
          <p className="text-xs text-slate-500 lg:text-right">
            © {new Date().getFullYear()} Homeschool Lighthouse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
