import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { heritageAcademy } from "@/lib/heritage-academy";
import { HeritageFlyerPoster } from "@/components/heritage-academy/heritage-flyer-poster";
import { Button } from "@/components/ui/button";

export function HeritageAcademyPromo() {
  return (
    <section
      id="heritage-academy"
      aria-labelledby="heritage-academy-promo-heading"
      className="border-y border-[var(--color-border)] bg-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_22rem] xl:grid-cols-[1.1fr_26rem]">
        <div>
          <h2
            id="heritage-academy-promo-heading"
            className="font-display text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl"
          >
            The Heritage Academy High School Track
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
            {heritageAcademy.subtext} A Lighthouse family praises the Heritage Academy as
            &ldquo;highly recommended and very influential in their future career direction.&rdquo;
          </p>

          <dl className="mt-6 grid max-w-lg grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Dates</dt>
              <dd className="mt-0.5 font-medium text-[var(--color-navy-deep)]">
                {heritageAcademy.programDatesLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Apply by</dt>
              <dd className="mt-0.5 font-medium text-[var(--color-navy-deep)]">
                {heritageAcademy.deadlineLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#1aa3d8] text-[#122033] hover:bg-[#4bb6e0] hover:brightness-100"
            >
              <a href={heritageAcademy.applyUrl} target="_blank" rel="noreferrer">
                Apply now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/heritage-academy">See the full ad</Link>
            </Button>
          </div>
        </div>

        <HeritageFlyerPoster
          flyer="deadlineBell"
          href="/heritage-academy"
          label="Open the Heritage Academy advertisement"
        />
      </div>
    </section>
  );
}
