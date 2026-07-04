import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

export function BookshelfPaywall({ lockedCount }: { lockedCount: number }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
        <BookOpen className="h-6 w-6 text-amber-700" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        {lockedCount} more books on this shelf
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-amber-900">
        {brand.bookshelf.paywallMessage}
      </p>
      <ul className="mx-auto mt-5 max-w-md space-y-2 text-left text-sm text-slate-700">
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          All 250 books across five age and grade levels
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          One-paragraph summaries written for homeschool parents
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          Character traits, difficulty levels, and subjects for every title
        </li>
      </ul>
      <Button asChild className="mt-6">
        <Link href="/pricing">{brand.upgrade.title}</Link>
      </Button>
    </div>
  );
}
