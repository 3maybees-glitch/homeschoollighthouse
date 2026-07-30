import Link from "next/link";
import { Anchor, Heart, TowerControl } from "lucide-react";
import { getGradeBand, isHighSchoolBand } from "@/lib/navigator/grades";
import { libertyCreditGuidance } from "@/lib/navigator/survey";
import type { NavigatorChart } from "@/types/navigator";

export function NavigatorChartSheet({ chart }: { chart: NavigatorChart }) {
  const { answers, subjectPlans, encouragement } = chart;
  const name = answers.firstName.trim() || "Student";
  const band = getGradeBand(answers.gradeLevel);
  const showCollegeCredits = isHighSchoolBand(answers.gradeLevel) || band === "flexible";

  return (
    <div className="navigator-print space-y-8">
      <div className="print-only mb-6 hidden border-b border-slate-300 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Homeschool Lighthouse · The Navigator
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold">Academic Course Chart</h1>
        <p className="text-sm text-slate-600">
          {name} · Grade {answers.gradeLevel || "—"} · Age {answers.age || "—"} ·{" "}
          {answers.semestersUntilGraduation || "—"} remaining toward graduation
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Generated {new Date(chart.updatedAt).toLocaleDateString()} · homeschoollighthouse.com/navigator
        </p>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-navy)] via-[#00305f] to-[var(--color-seafoam)] p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
              <TowerControl className="h-4 w-4" aria-hidden="true" />
              The Navigator Chart
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
              {name}&apos;s course recommendations
            </h2>
            <p className="mt-3 max-w-2xl text-slate-200">{encouragement}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur">
            <p>
              <span className="text-slate-300">Grade</span>{" "}
              <strong>{answers.gradeLevel || "—"}</strong>
            </p>
            <p className="mt-1">
              <span className="text-slate-300">Band</span>{" "}
              <strong className="capitalize">
                {band === "flexible" ? "Multi-age / flexible" : band}
              </strong>
            </p>
            <p className="mt-1">
              <span className="text-slate-300">Horizon</span>{" "}
              <strong>{answers.semestersUntilGraduation || "—"}</strong>
            </p>
            <p className="mt-1">
              <span className="text-slate-300">Profile</span>{" "}
              <strong>{chart.completionPercent}% complete</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-100 bg-rose-50/70 px-6 py-5 text-sm text-rose-950">
        <div className="flex gap-3">
          <Heart className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
          <div>
            <p className="font-semibold">Take heart, family</p>
            <p className="mt-1 text-rose-900/80">
              These are three lights per subject — not a single rigid path. Compare, pray, try a
              sample lesson, and update your profile anytime as your sailor grows from elementary
              through Senior year. Fair winds until graduation.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-white/95 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Anchor className="h-5 w-5 text-[var(--color-seafoam)]" aria-hidden="true" />
          <h3 className="font-display text-xl font-semibold text-[var(--color-navy-deep)]">
            {showCollegeCredits
              ? "College-admission credit bearings"
              : band === "elementary"
                ? "Elementary scope & sequence bearings"
                : "Middle-school bridge bearings"}
          </h3>
        </div>
        {showCollegeCredits ? (
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Many universities that welcome homeschoolers — including{" "}
            <a
              href={libertyCreditGuidance.sourceUrl}
              className="font-medium text-[var(--color-seafoam)] underline"
              target="_blank"
              rel="noreferrer"
            >
              Liberty University&apos;s homeschool admission guidance
            </a>{" "}
            — expect a clear transcript with courses, credit units, and GPA. Typical college-bound
            patterns include ~4 English, 3–4 math, 3 lab sciences, 3 social studies/history, and often
            2 units of the same foreign language, plus electives toward graduation.
          </p>
        ) : band === "elementary" ? (
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            For 1st–5th grade, think in full-year subject blocks and joyful mastery — reading fluency,
            number sense, wonder-filled science, and story-rich history — rather than high school
            credits. Steady elementary years make the later transcript voyage much calmer. When you
            reach 9th–12th, The Navigator will shift toward credit-bearing college-admission patterns.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Middle school (6th–8th) bridges elementary foundations into high school readiness. Build
            writing stamina, pre-algebra confidence, lab habits, and language exposure now so 9th–12th
            credit years feel navigable. College-bound transcript patterns (often highlighted by schools
            like{" "}
            <a
              href={libertyCreditGuidance.sourceUrl}
              className="font-medium text-[var(--color-seafoam)] underline"
              target="_blank"
              rel="noreferrer"
            >
              Liberty University
            </a>
            ) typically begin counting in high school.
          </p>
        )}
      </section>

      <div className="space-y-6">
        {subjectPlans.map((plan) => (
          <section
            key={plan.subjectKey}
            className="break-inside-avoid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-cream)] px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-seafoam)]">
                  Subject channel
                </p>
                <h3 className="font-display text-2xl font-semibold text-[var(--color-navy-deep)]">
                  {plan.subjectLabel}
                </h3>
              </div>
              <p className="rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold text-[var(--color-beam)]">
                {plan.recommendedCredits}
              </p>
            </div>

            {plan.libertyNote ? (
              <p className="border-b border-[var(--color-border)] bg-sky-50/80 px-6 py-3 text-sm text-sky-950">
                {plan.libertyNote}
              </p>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Choice</th>
                    <th className="px-4 py-3 font-semibold">Resource</th>
                    <th className="px-4 py-3 font-semibold">Type / format</th>
                    <th className="px-4 py-3 font-semibold">
                      {showCollegeCredits ? "Credit level" : "Year / scope"}
                    </th>
                    <th className="px-4 py-3 font-semibold">Lighthouse link</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.choices.map((choice) => (
                    <tr key={`${plan.subjectKey}-${choice.rank}`} className="border-t border-slate-100">
                      <td className="px-6 py-4 align-top">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-beam)]/30 font-display text-base font-semibold text-[var(--color-navy-deep)]">
                          {choice.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="font-semibold text-[var(--color-navy-deep)]">{choice.title}</p>
                        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                          {choice.reason}
                        </p>
                      </td>
                      <td className="px-4 py-4 align-top capitalize text-slate-600">
                        {choice.listingType.replaceAll("_", " ")}
                        <br />
                        <span className="text-xs">{choice.format.replaceAll("_", " ")}</span>
                      </td>
                      <td className="px-4 py-4 align-top text-slate-700">{choice.creditHint}</td>
                      <td className="px-4 py-4 align-top">
                        <Link
                          href={`/listing/${choice.slug}`}
                          className="font-medium text-[var(--color-seafoam)] underline decoration-[var(--color-seafoam)]/40 underline-offset-2"
                        >
                          View on Homeschool Lighthouse
                        </Link>
                        <p className="mt-1 break-all text-[10px] text-slate-400 print:block">
                          {choice.href}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <footer className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white/80 px-6 py-5 text-sm text-[var(--color-muted-foreground)]">
        <p>
          Profile snapshot: {answers.learningStyles.join(", ") || "learning styles TBD"} ·{" "}
          {answers.deliveryModes.join(", ") || "delivery TBD"} ·{" "}
          {answers.faithPreference || "faith preference TBD"} · writing:{" "}
          {answers.writingLevel || "—"} · grading: {answers.gradingStyle || "—"}
        </p>
        <p className="mt-2">
          Update answers anytime in The Navigator to generate a new set of choices as your learner
          moves from 1st grade through 12th. Export this page with Print → Save as PDF for your
          records or portfolio.
        </p>
      </footer>
    </div>
  );
}
