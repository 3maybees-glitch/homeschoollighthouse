import Link from "next/link";
import { Quote } from "lucide-react";
import { brand, homeTestimonials } from "@/lib/brand-vocabulary";

export function TestimonialsSection() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-cream)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Signals from the Fleet
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
            Families who found their bearing
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {homeTestimonials.map((item) => (
            <article
              key={item.author}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
            >
              <Quote className="h-8 w-8 text-[var(--color-primary)]/70" />
              <blockquote className="mt-4 text-base leading-relaxed text-[var(--color-muted-foreground)]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-[var(--color-border)] pt-4">
                <p className="font-semibold text-[var(--color-navy-deep)]">{item.author}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{item.detail}</p>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/browse"
            className="text-sm font-semibold text-[var(--color-secondary)] underline-offset-4 hover:underline"
          >
            Explore {brand.stats.listings} resources families trust
          </Link>
        </div>
      </div>
    </section>
  );
}
