import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Compass, MapPin, Search } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = pageMetadata({
  title: "About Homeschool Lighthouse",
  description:
    "Homeschool Lighthouse is a practical directory of trusted curricula, classes, co-ops, and resources for Christian and values-minded families.",
  path: "/about",
  keywords: [
    "about Homeschool Lighthouse",
    "Christian homeschool directory",
    "homeschool resources",
  ],
});

const paths = [
  {
    href: "/browse",
    title: "Search the directory",
    body: `Look through ${brand.stats.listings} curricula, online courses, co-ops, tutors, support groups, field trips, and more.`,
    icon: Search,
    cta: "Start browsing",
  },
  {
    href: "/harbors",
    title: "Find a local harbor",
    body: "Co-ops, support groups, and field trips are easier to spot when you can see what is near home.",
    icon: MapPin,
    cta: "Open Local Harbors",
  },
  {
    href: "/navigator",
    title: "Chart the years ahead",
    body: `${brand.navigator.title} is a separate ${brand.navigator.price} chart for the school years you still have left, through 12th grade.`,
    icon: Compass,
    cta: "See The Navigator",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            About
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            A steady light for homeschool families
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {brand.siteName} is a directory of trusted curricula, classes, co-ops, and practical
            resources for Christian and values-minded families. The hope is simple: help you find a
            path that fits your children, your convictions, and the week you actually live.
          </p>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4 text-base leading-relaxed text-[var(--color-muted-foreground)]">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-navy-deep)]">
              Built for families who care what goes in the school day
            </h2>
            <p>
              Homeschool parents are asked to choose quickly and wisely. A reading program, a
              co-op, a high-school credit, a convention, a tutor — the options are scattered, and
              not all of them share your faith or your standards. This site gathers those choices
              in one place so you can compare them without losing the thread.
            </p>
            <p>
              You can filter by philosophy, values, and faith, including Christian options, along
              with age, format, and subject. Secular resources are here too, clearly labeled, so
              you can decide what belongs in your home. Nothing here assumes one curriculum fits
              every family.
            </p>
            <p>
              Browsing the directory is free. When you want saved searches, the reading list, the
              high-school credit log, or the members&apos; conversation, those tools live on the{" "}
              <Link href="/pricing" className="font-medium text-[var(--color-secondary)] underline">
                pricing page
              </Link>
              . {brand.navigator.title} stays a separate one-time purchase.
            </p>
          </div>
          <Card className="border-[var(--color-border)] bg-white/90">
            <CardHeader>
              <CardTitle className="font-display text-2xl">What stays true here</CardTitle>
              <CardDescription>Practical help, without the hard sell.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              <p>Faith and values are part of the search, not a footnote.</p>
              <p>Listings are resources you can open and judge for yourself.</p>
              <p>
                New submissions are reviewed before they join the directory. If you know a resource
                other families should see,{" "}
                <Link href="/submit" className="font-medium text-[var(--color-secondary)] underline">
                  send it in
                </Link>
                .
              </p>
              <p>
                Encouragement and plain-language guidance also show up in{" "}
                <Link href="/blog" className="font-medium text-[var(--color-secondary)] underline">
                  {brand.blog.title}
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="font-display text-3xl font-semibold text-[var(--color-navy-deep)]">
            Three ways to use the light
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {paths.map((path) => (
              <Card key={path.href} className="border-[var(--color-border)] bg-white/90">
                <CardHeader>
                  <path.icon className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
                  <CardTitle className="font-display text-2xl">{path.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{path.body}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href={path.href}>{path.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-cream)] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Start where you are
              </p>
              <p className="font-display mt-2 text-2xl font-semibold text-[var(--color-navy-deep)]">
                {brand.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                Search the directory, narrow it to what fits your family, and keep the links you
                want to come back to.
              </p>
            </div>
            <Button asChild>
              <Link href="/browse">Browse resources</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
