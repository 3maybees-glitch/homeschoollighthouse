import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { accountNavItem, freeNavItems, premiumNavItems } from "@/lib/site-nav";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import { BrandLogoVideo } from "@/components/brand/brand-logo-video";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";

const freeFooterLinks = [
  ...freeNavItems,
  { href: "/submit", label: brand.submit.title, description: brand.submit.subtitle },
  {
    href: "/advertise",
    label: brand.advertise.title,
    description: brand.advertise.subtitle,
  },
  accountNavItem,
];

const premiumFooterLinks = [
  ...premiumNavItems,
  { href: "/ai", label: brand.ai.title, description: brand.ai.subtitle },
  { href: "/pricing", label: "Pricing & Plans", description: "Compare the free and Premium plans" },
];

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
  return (
    <footer className="bg-[var(--color-navy-deep)] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
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
          </div>

          <FooterColumn title="Free for Everyone" links={freeFooterLinks} />
          <FooterColumn title="Premium Tools" links={premiumFooterLinks} />
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
          <p className="text-xs text-slate-500 lg:text-right">
            © {new Date().getFullYear()} Homeschool Lighthouse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
