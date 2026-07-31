"use client";

import Link from "next/link";
import { Anchor, Compass, Download, Heart, Ship, Sparkles, TowerControl } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sampleReportMeta,
  sampleVoyageSummary,
  sampleYearPlans,
} from "@/lib/navigator/sample-report";
import { brand } from "@/lib/brand-vocabulary";

export function NavigatorSampleReport() {
  const meta = sampleReportMeta;

  return (
    <div className="navigator-print">
      {/* Sales hero — print-hidden CTA band */}
      <section className="no-print border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_85%_15%,rgba(42,157,143,0.28),transparent_55%),radial-gradient(ellipse_50%_50%_at_5%_90%,rgba(230,180,34,0.16),transparent_50%)]" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Sales & marketing sample · The Navigator
            </p>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              {meta.tagline}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{meta.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={meta.ctaHref}>{meta.ctaLabel} · {meta.price}</Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10"
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Print / Save PDF sample
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Standalone product · {meta.priceNote} · Separate from Full Beam membership
            </p>
          </div>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {/* Print header */}
        <div className="print-only mb-4 hidden border-b border-slate-300 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Homeschool Lighthouse · The Navigator · Sample Report
          </p>
          <h1 className="font-display mt-1 text-2xl font-semibold">{meta.tagline}</h1>
          <p className="text-sm text-slate-600">
            Sample student: {meta.studentName} · Starting {meta.startingGrade} · {meta.horizon}
          </p>
        </div>

        {/* Multi-year promise callout */}
        <section className="overflow-hidden rounded-[2rem] border border-[var(--color-seafoam)]/40 bg-gradient-to-br from-teal-50 via-white to-[var(--color-cream)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-beam)]">
              <Ship className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-navy-deep)] sm:text-3xl">
                One purchase. Every year until graduation.
              </h2>
              <p className="mt-2 max-w-3xl text-[var(--color-muted-foreground)]">
                The Navigator is <strong className="text-[var(--color-navy-deep)]">not a one-year planner</strong>.
                Families answer a deep academic interview once, then receive a decorated multi-year chart
                covering <strong className="text-[var(--color-navy-deep)]">all remaining school years</strong>{" "}
                from their current grade through 12th Senior — with three matched curriculum / course /
                product choices per subject for each year, credit or scope guidance, company names, and
                Homeschool Lighthouse weblinks.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-[var(--color-navy)] sm:grid-cols-2">
                <li className="flex gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
                  1st grade through 12th Senior
                </li>
                <li className="flex gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
                  Full remaining-year voyage (not just this semester)
                </li>
                <li className="flex gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
                  3 choices × every subject × every year
                </li>
                <li className="flex gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
                  Update answers anytime → regenerate the whole chart
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sample student card */}
        <section className="rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-navy)] via-[#00305f] to-[var(--color-seafoam)] p-8 text-white shadow-lg">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            <TowerControl className="h-4 w-4" aria-hidden="true" />
            Sample family chart (fictional)
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
            {meta.studentName}&apos;s Navigator voyage
          </h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Starting in <strong className="text-white">{meta.startingGrade} grade</strong> at age{" "}
            {meta.age}, with <strong className="text-white">{meta.horizon}</strong>. This sample
            charts all <strong className="text-white">{meta.yearsCharted} school years</strong> through
            Senior graduation — illustrating what families receive after The Navigator academic
            interview.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Years charted", value: String(meta.yearsCharted) },
              { label: "Through", value: "12th Senior" },
              { label: "Choices / subject", value: String(meta.choicesPerSubject) },
              { label: "Price", value: meta.price },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="font-display mt-1 text-xl font-semibold text-[var(--color-beam)]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Voyage map */}
        <section className="rounded-3xl border border-[var(--color-border)] bg-white/95 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-[var(--color-seafoam)]" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-[var(--color-navy-deep)]">
              Full voyage map — all {meta.yearsCharted} years to graduation
            </h3>
          </div>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Marketing takeaway: families see the whole path at once. Elementary/middle years use
            scope-and-sequence language; high school years shift to credit guidance for college-bound
            transcripts.
          </p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sampleVoyageSummary.map((year, index) => (
              <li
                key={year.grade}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)]/80 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-seafoam)]">
                  Year {index + 1}
                </p>
                <p className="font-display mt-1 text-lg font-semibold text-[var(--color-navy-deep)]">
                  {year.grade}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{year.focus}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-rose-100 bg-rose-50/70 px-6 py-5 text-sm text-rose-950">
          <div className="flex gap-3">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <p className="font-semibold">Encouraging, not rigid</p>
              <p className="mt-1 text-rose-900/80">
                Three lights per subject per year — not a single mandated path. Families compare,
                pray, sample lessons, and regenerate whenever answers change. {meta.privacyNote}
              </p>
            </div>
          </div>
        </section>

        {/* Year-by-year sample excerpts */}
        <div className="space-y-8">
          {sampleYearPlans.map((year) => (
            <section
              key={year.yearIndex}
              className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-b from-sky-50/60 to-white p-5 sm:p-7"
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-seafoam)]">
                    Year {year.yearIndex} of {meta.yearsCharted}
                  </p>
                  <h3 className="font-display mt-1 text-3xl font-semibold text-[var(--color-navy-deep)]">
                    {year.gradeLabel}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{year.ageHint}</p>
                </div>
              </div>

              {year.subjectPlans.map((plan) => (
                <div
                  key={`${year.yearIndex}-${plan.subjectKey}`}
                  className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-cream)] px-5 py-3">
                    <h4 className="font-display text-xl font-semibold text-[var(--color-navy-deep)]">
                      {plan.subjectLabel}
                    </h4>
                    <p className="rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold text-[var(--color-beam)]">
                      {plan.recommendedCredits}
                    </p>
                  </div>
                  {plan.libertyNote ? (
                    <p className="border-b border-[var(--color-border)] bg-sky-50/80 px-5 py-2.5 text-sm text-sky-950">
                      {plan.libertyNote}
                    </p>
                  ) : null}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Choice</th>
                          <th className="px-3 py-3 font-semibold">Resource</th>
                          <th className="px-3 py-3 font-semibold">Company</th>
                          <th className="px-3 py-3 font-semibold">Type</th>
                          <th className="px-3 py-3 font-semibold">Scope / credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.choices.map((c) => (
                          <tr key={`${plan.subjectKey}-${c.rank}`} className="border-t border-slate-100">
                            <td className="px-5 py-3 align-top">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-beam)]/30 font-display font-semibold text-[var(--color-navy-deep)]">
                                {c.rank}
                              </span>
                            </td>
                            <td className="px-3 py-3 align-top">
                              <p className="font-semibold text-[var(--color-navy-deep)]">{c.title}</p>
                              <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                                {c.reason}
                              </p>
                            </td>
                            <td className="px-3 py-3 align-top font-medium text-slate-800">
                              {c.company}
                            </td>
                            <td className="px-3 py-3 align-top capitalize text-slate-600">
                              {c.listingType.replaceAll("_", " ")}
                            </td>
                            <td className="px-3 py-3 align-top text-slate-700">{c.creditHint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* Sales close */}
        <section className="no-print rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-navy)] p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)]">
            Why families buy The Navigator
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">
            Stop re-planning every August. Chart the whole voyage once.
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li>
              · <strong className="text-white">Multi-year value:</strong> recommendations for{" "}
              <em>all</em> remaining years until graduation — not a single-year shopping list.
            </li>
            <li>
              · <strong className="text-white">Deep academic interview:</strong> learning style, faith,
              budget, strengths, grading preference, tech vs paper, and more.
            </li>
            <li>
              · <strong className="text-white">Printable chart:</strong> company names, credit/scope
              levels, and Homeschool Lighthouse weblinks — export as PDF.
            </li>
            <li>
              · <strong className="text-white">{meta.price} one-time:</strong> standalone from{" "}
              {brand.pricing.yearlyLabel} / {brand.pricing.lifetimeLabel}. Update & regenerate anytime.
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={meta.ctaHref}>{meta.ctaLabel}</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </section>

        <p className="text-center text-xs text-[var(--color-muted-foreground)]">
          Sample report for sales & marketing only. Resource names are illustrative. Real Navigator
          charts match against the live Homeschool Lighthouse directory for each family&apos;s answers.
        </p>
      </div>
    </div>
  );
}
