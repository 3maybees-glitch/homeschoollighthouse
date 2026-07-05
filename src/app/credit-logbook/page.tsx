import { Anchor, ClipboardList } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { getUserTier } from "@/lib/auth/session";
import { CreditLogbook } from "@/components/tools/credit-logbook";
import { CreditLogbookPaywall } from "@/components/tools/credit-logbook-paywall";

export const metadata = {
  title: brand.creditLogbook.title,
  description: brand.creditLogbook.subtitle,
};

export default async function CreditLogbookPage() {
  const tier = await getUserTier();
  const isPremium = tier === "premium";

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            <Anchor className="h-4 w-4" aria-hidden="true" />
            Premium Transcript Tool
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {brand.creditLogbook.title}
          </h1>
          <p className="mt-2 text-lg font-medium text-[var(--color-beam)]">
            {brand.creditLogbook.tagline}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
            {brand.creditLogbook.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-[var(--color-beam)]" aria-hidden="true" />
              Four years of high school
            </span>
            <span>Mix-and-match subjects and grades</span>
            <span>Print or export to spreadsheet</span>
          </div>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {isPremium ? <CreditLogbook /> : <CreditLogbookPaywall />}
      </div>
    </div>
  );
}
