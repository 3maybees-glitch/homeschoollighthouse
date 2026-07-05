import Link from "next/link";
import { ClipboardList, Lock } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

export function CreditLogbookPaywall() {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
        <ClipboardList className="h-6 w-6 text-amber-700" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">{brand.creditLogbook.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-amber-900">
        {brand.creditLogbook.paywallMessage}
      </p>
      <ul className="mx-auto mt-5 max-w-md space-y-2 text-left text-sm text-slate-700">
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          Four-year high school transcript planner with mix-and-match subjects
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          Automatic credit hours and cumulative GPA as grades change
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          Print-ready layout and CSV export for your records
        </li>
      </ul>
      <Button asChild className="mt-6">
        <Link href="/pricing">{brand.upgrade.title}</Link>
      </Button>
    </div>
  );
}
