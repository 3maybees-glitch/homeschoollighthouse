import Link from "next/link";
import { Check } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const freeFeatures = [
  "Browse the full directory",
  "Sweep the Horizon keyword search",
  "Near Shore filters: type, format, age",
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
  "Follow the Light AI discovery (Phase 2)",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          {brand.pricing.title}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Keep the light burning for your homeschool journey</h1>
        <p className="mt-4 text-lg text-slate-600">
          Start free. Upgrade when you want the full beam — advanced filters, grouping, and navigation
          tools built for serious homeschool research.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Free Pass</CardTitle>
            <CardDescription>Near Shore browsing for every family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-slate-900">$0</p>
            <ul className="space-y-3 text-sm text-slate-600">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/browse" className="inline-block text-sm font-medium text-amber-700 hover:underline">
              Start browsing
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-300 shadow-lg shadow-amber-100">
          <CardHeader>
            <CardTitle>{brand.pricing.yearlyLabel}</CardTitle>
            <CardDescription>Full beam access, renewed yearly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-slate-900">{brand.pricing.yearly}</p>
            <ul className="space-y-3 text-sm text-slate-600">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <CheckoutButton plan="yearly" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{brand.pricing.lifetimeLabel}</CardTitle>
            <CardDescription>One payment. Permanent navigation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-slate-900">{brand.pricing.lifetime}</p>
            <ul className="space-y-3 text-sm text-slate-600">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-amber-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <CheckoutButton plan="lifetime" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
