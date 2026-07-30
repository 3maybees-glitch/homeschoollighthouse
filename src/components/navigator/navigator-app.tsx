"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Compass,
  Download,
  Lock,
  RefreshCw,
  Save,
  Shield,
  Ship,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { NavigatorSurvey } from "@/components/navigator/navigator-survey";
import { NavigatorChartSheet } from "@/components/navigator/navigator-chart-sheet";
import {
  computeCompletionPercent,
  emptyNavigatorAnswers,
  NAVIGATOR_PRICE_LABEL,
} from "@/lib/navigator/survey";
import type { NavigatorChart, NavigatorProfileAnswers } from "@/types/navigator";

type View = "welcome" | "survey" | "chart";

async function requestRecommendations(answers: NavigatorProfileAnswers) {
  const response = await fetch("/api/navigator/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Could not generate recommendations.");
  }
  return data as Pick<NavigatorChart, "subjectPlans" | "encouragement" | "completionPercent">;
}

export function NavigatorApp({
  hasAccess,
  isSignedIn,
  initialChart,
}: {
  hasAccess: boolean;
  isSignedIn: boolean;
  initialChart: NavigatorChart | null;
}) {
  const [view, setView] = useState<View>(
    initialChart ? "chart" : hasAccess ? "survey" : "welcome",
  );
  const [answers, setAnswers] = useState<NavigatorProfileAnswers>(
    initialChart?.answers ?? emptyNavigatorAnswers(),
  );
  const [chart, setChart] = useState<NavigatorChart | null>(initialChart);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const completion = useMemo(() => computeCompletionPercent(answers), [answers]);

  const generateChart = async (nextAnswers: NavigatorProfileAnswers) => {
    const result = await requestRecommendations(nextAnswers);
    const now = new Date().toISOString();
    const next: NavigatorChart = {
      id: chart?.id ?? crypto.randomUUID(),
      userId: chart?.userId ?? "local",
      createdAt: chart?.createdAt ?? now,
      updatedAt: now,
      answers: nextAnswers,
      completionPercent: result.completionPercent,
      subjectPlans: result.subjectPlans,
      encouragement: result.encouragement,
    };
    setChart(next);
    setView("chart");
    return next;
  };

  const handleSurveyComplete = (nextAnswers: NavigatorProfileAnswers) => {
    setAnswers(nextAnswers);
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const next = await generateChart(nextAnswers);
        if (hasAccess && isSignedIn) {
          await persistChart(next);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Generation failed.");
      }
    });
  };

  const persistChart = async (next: NavigatorChart) => {
    setSaveMessage(null);
    try {
      const response = await fetch("/api/navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: next.id,
          answers: next.answers,
          subjectPlans: next.subjectPlans,
          completionPercent: next.completionPercent,
          encouragement: next.encouragement,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSaveMessage(data.error ?? "Could not save to your Captain's Log yet.");
        return;
      }
      if (data.chart) setChart(data.chart);
      setSaveMessage("Saved to your password-protected Captain's Log.");
    } catch {
      setSaveMessage("Could not save right now. You can still print your chart.");
    }
  };

  if (!hasAccess) {
    return <NavigatorPaywall isSignedIn={isSignedIn} />;
  }

  return (
    <div className="space-y-8">
      <div className="no-print rounded-3xl border border-[var(--color-border)] bg-white/90 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-seafoam)]">
              Academic interview profile
            </p>
            <h2 className="font-display mt-1 text-2xl font-semibold text-[var(--color-navy-deep)]">
              Chart progress
            </h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--color-muted-foreground)]">
              Your answers stay password-protected in your account. Homeschool Lighthouse does not
              read them for marketing, and we do not sell them to companies.
            </p>
          </div>
          <div className="min-w-[180px]">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-[var(--color-navy)]">
              <span>{completion}% complete</span>
              <Ship className="h-4 w-4 text-[var(--color-seafoam)]" aria-hidden="true" />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-seafoam)] to-[var(--color-beam)] transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant={view === "survey" ? "default" : "outline"}
            onClick={() => setView("survey")}
          >
            {chart ? "Update answers" : "Begin profile"}
          </Button>
          {chart ? (
            <Button variant={view === "chart" ? "default" : "outline"} onClick={() => setView("chart")}>
              View chart
            </Button>
          ) : null}
          {chart ? (
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => {
                setErrorMessage(null);
                startTransition(async () => {
                  try {
                    const next = await generateChart(answers);
                    if (isSignedIn) await persistChart(next);
                  } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : "Generation failed.");
                  }
                });
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Regenerate choices
            </Button>
          ) : null}
          {chart && isSignedIn ? (
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await persistChart(chart);
                });
              }}
            >
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              Save to account
            </Button>
          ) : null}
          {chart ? (
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export / Print PDF
            </Button>
          ) : null}
        </div>

        {!isSignedIn ? (
          <p className="mt-4 text-sm text-amber-800">
            <Link href="/signup?next=/navigator" className="font-semibold underline">
              Create a free account
            </Link>{" "}
            (or{" "}
            <Link href="/login?next=/navigator" className="font-semibold underline">
              sign in
            </Link>
            ) so your Navigator chart stays saved under your password-protected profile. You can run
            the interview multiple times; each update regenerates fresh choices.
          </p>
        ) : null}
        {saveMessage ? (
          <p className="mt-3 text-sm text-[var(--color-seafoam)]">{saveMessage}</p>
        ) : null}
        {errorMessage ? <p className="mt-3 text-sm text-red-700">{errorMessage}</p> : null}
        {isPending ? (
          <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
            Charting your course…
          </p>
        ) : null}
      </div>

      <div className="no-print flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm text-teal-950">
        <Shield className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <strong>Privacy beacon:</strong> Personal academic-profile answers are encrypted behind
          your account password, not reviewed by our crew for marketing, and never sold or rented to
          companies.
        </p>
      </div>

      {view === "survey" ? (
        <NavigatorSurvey
          answers={answers}
          onChange={setAnswers}
          onComplete={handleSurveyComplete}
          completion={completion}
        />
      ) : null}

      {view === "chart" && chart ? <NavigatorChartSheet chart={chart} /> : null}

      {view === "welcome" && hasAccess ? (
        <div className="rounded-3xl border border-[var(--color-border)] bg-white/95 p-8 text-center">
          <Compass className="mx-auto h-10 w-10 text-[var(--color-seafoam)]" />
          <h3 className="font-display mt-4 text-2xl font-semibold">Your Navigator is unlocked</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--color-muted-foreground)]">
            Fill out the academic interview profile to receive three curriculum, course, or product
            recommendations per subject — with credit levels and Homeschool Lighthouse weblinks.
          </p>
          <Button className="mt-6" onClick={() => setView("survey")}>
            Start academic profile
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function NavigatorPaywall({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-xl shadow-[rgba(0,31,63,0.08)]">
      <div className="bg-[var(--color-navy)] px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
          Standalone featured product
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
          Unlock The Navigator
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          A one-time charting fee — separate from Annual Pass or Lifetime Lantern. Purchase once,
          create your password-protected profile, and regenerate recommendations whenever answers
          change — from 1st grade all the way through Senior year.
        </p>
        <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-beam)]">
          {NAVIGATOR_PRICE_LABEL}
          <span className="ml-2 text-base font-sans font-normal text-slate-300">one-time</span>
        </p>
      </div>
      <div className="space-y-6 px-6 py-8 sm:px-10">
        <ul className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
          <li className="flex gap-2">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
            Long-form academic interview profile (dating-profile depth for curriculum matching)
          </li>
          <li className="flex gap-2">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
            Three choices per subject with year/credit guidance & homeschoollighthouse.com weblinks
          </li>
          <li className="flex gap-2">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
            Printable / PDF academic chart for elementary through high school
          </li>
          <li className="flex gap-2">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-seafoam)]" />
            Saved under your account — personal answers not marketed to companies
          </li>
        </ul>

        {!isSignedIn ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Please{" "}
            <Link href="/signup?next=/navigator" className="font-semibold underline">
              create an account
            </Link>{" "}
            or{" "}
            <Link href="/login?next=/navigator" className="font-semibold underline">
              sign in
            </Link>{" "}
            before checkout so The Navigator unlocks on your Captain&apos;s Log.
          </p>
        ) : null}

        <CheckoutButton plan="navigator" />
        <p className="text-center text-xs text-[var(--color-muted-foreground)]">
          Not included with monthly/yearly Full Beam membership — this is its own lighthouse product.
        </p>
      </div>
    </div>
  );
}
