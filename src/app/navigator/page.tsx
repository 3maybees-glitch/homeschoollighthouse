import { Compass, Ship, Waves } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { getSessionProfile } from "@/lib/auth/session";
import { getNavigatorEntitlement } from "@/lib/navigator/access";
import { memoryStore } from "@/lib/store/memory-store";
import { createClient } from "@/lib/supabase/server";
import { NavigatorApp } from "@/components/navigator/navigator-app";
import { NAVIGATOR_PRICE_LABEL } from "@/lib/navigator/survey";
import type { NavigatorChart, NavigatorProfileAnswers, NavigatorSubjectPlan } from "@/types/navigator";

export const metadata = {
  title: brand.navigator.title,
  description: brand.navigator.subtitle,
};

async function loadInitialChart(userId?: string): Promise<NavigatorChart | null> {
  if (!userId) return null;

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("navigator_charts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      return {
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        answers: data.answers as NavigatorProfileAnswers,
        completionPercent: data.completion_percent,
        subjectPlans: data.subject_plans as NavigatorSubjectPlan[],
        encouragement: data.encouragement ?? "",
      };
    }
  }

  return memoryStore.getNavigatorChart(userId);
}

export default async function NavigatorPage() {
  const profile = await getSessionProfile();
  const entitlement = await getNavigatorEntitlement(profile?.id);
  const initialChart = entitlement.hasAccess ? await loadInitialChart(profile?.id) : null;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_80%_20%,rgba(42,157,143,0.28),transparent_55%),radial-gradient(ellipse_50%_60%_at_10%_90%,rgba(230,180,34,0.18),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            <Compass className="h-4 w-4" aria-hidden="true" />
            Featured product · Standalone purchase
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {brand.navigator.title}
          </h1>
          <p className="mt-2 text-lg font-medium text-[var(--color-beam)]">
            {brand.navigator.tagline}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
            {brand.navigator.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <Ship className="h-4 w-4 text-[var(--color-beam)]" aria-hidden="true" />
              1st grade through 12th Senior
            </span>
            <span>3 matched choices per subject</span>
            <span>Printable academic chart</span>
            <span>{NAVIGATOR_PRICE_LABEL} one-time · not a subscription</span>
          </div>
          <p className="mt-5 max-w-2xl text-sm text-slate-400">
            <Waves className="mr-2 inline h-4 w-4 text-[var(--color-seafoam)]" aria-hidden="true" />
            {brand.navigator.privacy}
          </p>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <NavigatorApp
          hasAccess={entitlement.hasAccess}
          isSignedIn={Boolean(profile?.id || profile?.email)}
          initialChart={initialChart}
        />
      </div>
    </div>
  );
}
