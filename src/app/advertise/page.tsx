import Link from "next/link";
import type { Metadata } from "next";
import { Check, Megaphone, Radio, Sparkles, Waves } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import {
  BRIGHT_BEACON_TOTAL_SPOTS,
  brightBeaconBenefits,
  brightBeaconUpsells,
} from "@/lib/bright-beacons";
import { AdvertiseInquiryForm } from "@/components/advertise/advertise-inquiry-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `${brand.advertise.title} | ${brand.siteName}`,
  description: brand.advertise.subtitle,
};

export default function AdvertisePage() {
  return (
    <div>
      <section className="border-b border-white/40 bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            <Megaphone className="h-4 w-4" />
            For homeschool businesses
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {brand.advertise.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {brand.advertise.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-[var(--color-beam)] text-[var(--color-navy-deep)] hover:brightness-105">
              <a href="#claim-spot">Claim a spot</a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <Link href="/#beacons">See open spots on the homepage</Link>
            </Button>
          </div>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Why Bright Beacons
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)]">
            Put your brand where families already chart their course
          </h2>
          <p className="mt-3 text-[var(--color-muted-foreground)]">
            Homeschool Lighthouse is built for discovery — deep filters, Local Harbors, Social
            Harbors, and a growing crew newsletter. A Bright Beacon puts you at the front of that
            voyage.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {brightBeaconBenefits.map((benefit) => (
            <Card key={benefit.title} className="border-[var(--color-border)] bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                  {benefit.title}
                </CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-cream)]/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Pricing
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)]">
              One of {BRIGHT_BEACON_TOTAL_SPOTS} exclusive spots
            </h2>
            <p className="mt-3 max-w-xl text-[var(--color-muted-foreground)]">
              A single Bright Beacon is priced for serious homeschool brands that want steady
              visibility — without buying a loud ad network. Scarcity keeps every spot valuable.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Card className="border-[var(--color-primary)]/35 bg-white shadow-lg shadow-[rgba(0,31,63,0.06)]">
                <CardHeader>
                  <CardTitle>Monthly Beacon</CardTitle>
                  <CardDescription>Flexible month-to-month placement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-bold text-[var(--color-navy-deep)]">
                    {brand.advertise.monthly}
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
                    {[
                      "Homepage Bright Beacon slot",
                      "Bright Beacon badge on your listing",
                      "Mention in monthly Beacon Bulletin rotation",
                      "Cancel anytime before renewal",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-[var(--color-border)] bg-white/90">
                <CardHeader>
                  <CardTitle>Annual Beacon</CardTitle>
                  <CardDescription>{brand.advertise.yearlyNote}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-bold text-[var(--color-navy-deep)]">
                    {brand.advertise.yearly}
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
                    {[
                      "Everything in Monthly",
                      "Priority renewal on your spot",
                      "One complimentary Bulletin Spotlight",
                      "Best value for year-round brands",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card id="claim-spot" className="border-[var(--color-border)] bg-white shadow-xl shadow-[rgba(0,31,63,0.08)]">
            <CardHeader>
              <CardTitle>Request your spot</CardTitle>
              <CardDescription>
                Tell us about your business and preferred plan. We’ll confirm availability and
                next steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvertiseInquiryForm />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Upsell packages
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)]">
              Amplify beyond the homepage
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-muted-foreground)]">
              Layer newsletter depth, Social Harbors reach, and editorial shout-outs when you want
              more than a single beacon.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {brightBeaconUpsells.map((upsell) => (
            <Card key={upsell.title} className="border-[var(--color-border)] bg-white/90">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                  {upsell.title.includes("Bulletin") ? (
                    <Radio className="h-5 w-5" />
                  ) : upsell.title.includes("Harbors") ? (
                    <Waves className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                <CardTitle>{upsell.title}</CardTitle>
                <CardDescription>{upsell.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-[var(--color-navy-deep)]">{upsell.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
