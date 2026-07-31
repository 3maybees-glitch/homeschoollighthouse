import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { brandSocial } from "@/lib/brand-social";
import {
  accountNavItem,
  advertiseNavItem,
  freeNavItems,
  premiumNavItems,
} from "@/lib/site-nav";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import { BrandLogoVideo } from "@/components/brand/brand-logo-video";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { PlatformIcon } from "@/components/social/platform-icon";

const freeFooterLinks = [
  ...freeNavItems,
  { href: "/submit", label: brand.submit.title, description: brand.submit.subtitle },
  accountNavItem,
];

const premiumFooterLinks = [
  ...premiumNavItems,
  { href: "/ai", label: brand.ai.title, description: brand.ai.subtitle },
  { href: "/pricing", label: "Pricing & Plans", description: "Compare the free and Premium plans" },
];

const businessFooterLinks = [advertiseNavItem];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; description?: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)]">
        {title}
      </p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              title={link.description}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const { handle, url, label } = brandSocial.x;

  return (
    <footer className="bg-[var(--color-navy-deep)] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_0.7fr]">
          <div className="sm:col-span-2 lg:col-span-1">
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

            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)]">
                Follow along
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                    <PlatformIcon platform="x" className="h-4 w-4" />
                  </span>
                  <span className="pr-1">
                    <span className="block font-medium text-white">@{handle}</span>
                    <span className="block text-xs text-slate-400">on X</span>
                  </span>
                </a>
                <Link
                  href="/social#lighthouse-signals"
                  className="text-sm text-slate-400 underline-offset-4 transition hover:text-white hover:underline"
                >
                  See latest posts
                </Link>
              </div>
            </div>
          </div>

          <FooterColumn title="Free for Everyone" links={freeFooterLinks} />
          <FooterColumn title="Premium Tools" links={premiumFooterLinks} />
          <FooterColumn title="For Businesses" links={businessFooterLinks} />
          <FooterColumn
            title="Browse by Type"
            links={listingTypeOptions.slice(0, 6).map((option) => ({
              href: `/browse/${option.value}`,
              label: option.label,
            }))}
          />
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <NewsletterSignup />
          <div className="flex flex-col gap-2 text-xs text-slate-500 lg:items-end lg:text-right">
            <p>© {new Date().getFullYear()} Homeschool Lighthouse. All rights reserved.</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-slate-300"
            >
              <PlatformIcon platform="x" className="h-3.5 w-3.5 opacity-80" color="currentColor" />
              @{handle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
