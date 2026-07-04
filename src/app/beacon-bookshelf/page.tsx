import Link from "next/link";
import { Anchor, BookOpen } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { getUserTier } from "@/lib/auth/session";
import {
  bookshelfStages,
  difficultyLabels,
  FREE_PREVIEW_COUNT,
  getStageById,
  getTotalBookCount,
} from "@/lib/bookshelf/catalog";
import { BookCard } from "@/components/bookshelf/book-card";
import { BookshelfPaywall } from "@/components/bookshelf/bookshelf-paywall";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: brand.bookshelf.title,
  description: brand.bookshelf.subtitle,
};

export default async function BeaconBookshelfPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const params = await searchParams;
  const tier = await getUserTier();
  const isPremium = tier === "premium";

  const activeStage = getStageById(params.stage ?? "") ?? bookshelfStages[0];
  const visibleBooks = isPremium
    ? activeStage.books
    : activeStage.books.slice(0, FREE_PREVIEW_COUNT);
  const lockedCount = activeStage.books.length - visibleBooks.length;

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            <Anchor className="h-4 w-4" aria-hidden="true" />
            Premium Master Reading List
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {brand.bookshelf.title}
          </h1>
          <p className="mt-2 text-lg font-medium text-[var(--color-beam)]">
            {brand.bookshelf.tagline}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
            {brand.bookshelf.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--color-beam)]" aria-hidden="true" />
              {getTotalBookCount()} living books
            </span>
            <span>{bookshelfStages.length} age &amp; grade shelves</span>
            <span>50 books per shelf</span>
          </div>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <nav aria-label="Age and grade shelves" className="flex flex-wrap gap-2">
          {bookshelfStages.map((stage) => {
            const isActive = stage.id === activeStage.id;
            return (
              <Link
                key={stage.id}
                href={`/beacon-bookshelf?stage=${stage.id}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:text-amber-800"
                }`}
              >
                {stage.name}
                <span className="ml-1.5 text-xs opacity-70">{stage.gradeLabel}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-bold text-slate-950">{activeStage.name}</h2>
            <Badge className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
              {activeStage.gradeLabel}
            </Badge>
            <Badge className="bg-[var(--color-muted)]/60 text-[var(--color-muted-foreground)]">
              {activeStage.ageLabel}
            </Badge>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">{activeStage.description}</p>
          <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
            Difficulty key: {Object.values(difficultyLabels).join(" → ")}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {visibleBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i + 1} />
          ))}
        </div>

        {!isPremium ? (
          <div className="mt-8">
            <BookshelfPaywall lockedCount={lockedCount} />
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-[var(--color-border)] bg-white/90 p-6 text-center text-sm text-slate-600">
            You&apos;ve reached the end of the {activeStage.name} shelf — {activeStage.books.length}{" "}
            books charted. Choose another shelf above to keep sailing.
          </div>
        )}
      </div>
    </div>
  );
}
