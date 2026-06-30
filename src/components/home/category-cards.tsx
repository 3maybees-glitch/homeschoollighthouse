import Link from "next/link";
import {
  BookOpen,
  Compass,
  GraduationCap,
  HeartHandshake,
  MapPinned,
  MonitorPlay,
  Puzzle,
  ScrollText,
  Trophy,
  Users,
} from "lucide-react";
import { listingTypeOptions } from "@/lib/directory/filter-config";

const categoryIcons: Record<string, typeof BookOpen> = {
  curriculum: BookOpen,
  online_course: MonitorPlay,
  coop: Users,
  tutor: GraduationCap,
  support_group: HeartHandshake,
  field_trip: MapPinned,
  conference: Users,
  scholarship: Trophy,
  standardized_test: ScrollText,
  supplement: Puzzle,
  other: Compass,
};

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Explore by Type
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
          Chart your course through every kind of resource
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {listingTypeOptions.map((option) => {
          const Icon = categoryIcons[option.value] ?? Compass;
          return (
            <Link
              key={option.value}
              href={`/browse/${option.value}`}
              className="group rounded-2xl border border-[var(--color-border)] bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-lg hover:shadow-[rgba(0,31,63,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] transition group-hover:bg-[var(--color-primary)]/15 group-hover:text-[var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-[var(--color-navy-deep)]">{option.label}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Browse trusted {option.label.toLowerCase()} resources
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
