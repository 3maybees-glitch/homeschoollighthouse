import Link from "next/link";
import { Anchor, Heart, TowerControl } from "lucide-react";
import { getGradeBand, isHighSchoolBand } from "@/lib/navigator/grades";
import { libertyCreditGuidance } from "@/lib/navigator/survey";
import type { NavigatorChart, NavigatorSubjectPlan, NavigatorYearPlan } from "@/types/navigator";

function SubjectTable({
  plan,
  showCollegeCredits,
}: {
  plan: NavigatorSubjectPlan;
  showCollegeCredits: boolean;
}) {
  return (
    <section className="break-inside-avoid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-cream)] px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-seafoam)]">
            Subject channel
          </p>
          <h4 className="font-display text-2xl font-semibold text-[var(--color-navy-deep)]">
            {plan.subjectLabel}
          </h4>
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
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Choice</th>
              <th className="px-4 py-3 font-semibold">Resource</th>
              <th className="px-4 py-3 font-semibold">Company</th>
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
                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{choice.reason}</p>
                </td>
                <td className="px-4 py-4 align-top font-medium text-slate-800">
                  {choice.company || "—"}
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
                  <p className="mt-1 break-all text-[10px] text-slate-400 print:block">{choice.href}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function YearSection({ year }: { year: NavigatorYearPlan }) {
  const band = getGradeBand(year.gradeLevel);
  const showCollegeCredits = isHighSchoolBand(year.gradeLevel) || band === "flexible";

  return (
    <section className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-b from-sky-50/60 to-white p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-seafoam)]">
            Year {year.yearIndex} of the voyage
          </p>
          <h3 className="font-display mt-1 text-3xl font-semibold text-[var(--color-navy-deep)]">
            {year.gradeLabel}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{year.ageHint}</p>
        </div>
        <p className="rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-beam)]">
          {band === "flexible" ? "flexible band" : `${band} band`}
        </p>
      </div>

      <div className="space-y-5">
        {year.subjectPlans.map((plan) => (
          <SubjectTable
            key={`${year.yearIndex}-${plan.subjectKey}`}
            plan={plan}
            showCollegeCredits={showCollegeCredits}
          />
        ))}
      </div>
    </section>
  );
}

export function NavigatorChartSheet({ chart }: { chart: NavigatorChart }) {
  const { answers, encouragement } = chart;
  const name = answers.firstName.trim() || "Student";
  const yearPlans =
    chart.yearPlans?.length > 0
      ? chart.yearPlans
      : ([
          {
            yearIndex: 1,
            gradeLevel: answers.gradeLevel || "ungraded",
            gradeLabel: answers.gradeLevel || "Current year",
            ageHint: answers.age ? `About age ${answers.age}` : "Age flexible",
            subjectPlans: chart.subjectPlans,
          },
        ] as NavigatorYearPlan[]);

  const band = getGradeBand(answers.gradeLevel);
  const showCollegeCredits = isHighSchoolBand(answers.gradeLevel) || band === "flexible";

  return (
    <div className="navigator-print space-y-8">
      <div className="print-only mb-6 hidden border-b border-slate-300 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Homeschool Lighthouse · The Navigator
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold">Multi-Year Academic Course Chart</h1>
        <p className="text-sm text-slate-600">
          {name} · Starting grade {answers.gradeLevel || "—"} · Age {answers.age || "—"} ·{" "}
          {yearPlans.length} year{yearPlans.length === 1 ? "" : "s"} charted · Horizon:{" "}
          {answers.semestersUntilGraduation || "—"}
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
              {name}&apos;s multi-year course recommendations
            </h2>
            <p className="mt-3 max-w-2xl text-slate-200">{encouragement}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur">
            <p>
              <span className="text-slate-300">Starting grade</span>{" "}
              <strong>{answers.gradeLevel || "—"}</strong>
            </p>
            <p className="mt-1">
              <span className="text-slate-300">Years charted</span>{" "}
              <strong>{yearPlans.length}</strong>
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
              Below is a year-by-year chart for every remaining grade you entered — three lights per
              subject each year. Compare, pray, try a sample lesson, and update your profile anytime.
              Fair winds until graduation.
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
                ? "Elementary → graduation voyage bearings"
                : "Bridge years → graduation voyage bearings"}
          </h3>
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          This chart uses your &quot;years / grades remaining&quot; answer to generate every school
          year from the current grade through that horizon (capped at 12th). High school years include
          credit-oriented guidance informed by patterns used by universities that welcome
          homeschoolers — including{" "}
          <a
            href={libertyCreditGuidance.sourceUrl}
            className="font-medium text-[var(--color-seafoam)] underline"
            target="_blank"
            rel="noreferrer"
          >
            Liberty University
          </a>
          .
        </p>
      </section>

      <div className="space-y-8">
        {yearPlans.map((year) => (
          <YearSection key={`year-${year.yearIndex}-${year.gradeLevel}`} year={year} />
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
          Update the remaining-years field anytime and regenerate to rebuild the full multi-year
          chart. Export with Print → Save as PDF for your records or portfolio.
        </p>
      </footer>
    </div>
  );
}
