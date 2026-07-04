import { BookOpen, CalendarDays, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { difficultyLabels, difficultyStyles } from "@/lib/bookshelf/catalog";
import type { BookshelfBook } from "@/types/bookshelf";

export function BookCard({ book, index }: { book: BookshelfBook; index: number }) {
  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:border-[var(--color-primary)]/30 hover:shadow-md sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            Book {index}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-[var(--color-navy-deep)]">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {book.author} ·{" "}
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {book.year}
            </span>
          </p>
        </div>
        <Badge className={difficultyStyles[book.difficulty]}>
          {difficultyLabels[book.difficulty]}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">{book.summary}</p>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-navy-deep)]">
            <Heart className="h-4 w-4 text-rose-500" aria-hidden="true" />
            Character
          </span>
          {book.characterTraits.map((trait) => (
            <Badge key={trait} className="bg-rose-50 text-rose-900">
              {trait}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-navy-deep)]">
            <BookOpen className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
            Subjects
          </span>
          {book.subjects.map((subject) => (
            <Badge key={subject} className="bg-[var(--color-muted)]/60 text-[var(--color-muted-foreground)]">
              {subject}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
