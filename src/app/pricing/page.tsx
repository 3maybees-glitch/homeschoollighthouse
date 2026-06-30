import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const freeFeatures = [
  "Browse the full directory",
  "Sweep the Horizon keyword search",
  "Near Shore filters: type, format, age",
  "Local Harbors map discovery",
  "View listing details and ratings summary",
];

const premiumFeatures = [
  "Open Waters advanced filters",
  "Philosophy, values, religion, and subject filters",
  "Search These Waters location filtering",
  "Order Your Route advanced sorting",
  "Fleet Formation grouping",
  "Charted Courses saved searches",
  "Anchored Resources favorites",
  "Follow the Light AI discovery",
];

export default function PricingPage() {
  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            {brand.pricing.title}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {brand.pricing.freeTeaser} · {brand.pricing.premiumTeaser}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Start free with essential navigation. Upgrade when you want the full beam: advanced
            filters, grouping, saved routes, and premium discovery tools.
          </p>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-[var(--color-border)] bg-white/90">
            <CardHeader>
              <CardTitle>Free Pass</CardTitle>
              <CardDescription>Near Shore browsing for every family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold text-[var(--color-navy-deep)]">$0</p>
              <ul className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/browse">Start browsing</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-[var(--color-primary)]/40 bg-white shadow-xl shadow-[rgba(0,31,63,0.08)]">
            <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-navy-deep)]">
              <Sparkles className="h-3.5 w-3.5" />
              Most popular
            </div>
            <CardHeader>
              <CardTitle>{brand.pricing.yearlyLabel}</CardTitle>
              <CardDescription>Full beam access, renewed yearly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold text-[var(--color-navy-deep)]">{brand.pricing.yearly}</p>
              <ul className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="yearly" />
            </CardContent>
          </Card>

          <Card className="border-[var(--color-border)] bg-white/90">
            <CardHeader>
              <CardTitle>{brand.pricing.lifetimeLabel}</CardTitle>
              <CardDescription>One payment. Permanent navigation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold text-[var(--color-navy-deep)]">{brand.pricing.lifetime}</p>
              <ul className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="lifetime" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
