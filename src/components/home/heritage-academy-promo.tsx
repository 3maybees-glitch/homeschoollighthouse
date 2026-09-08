import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { heritageAcademy } from "@/lib/heritage-academy";
import { Button } from "@/components/ui/button";

export function HeritageAcademyPromo() {
  return (
    <section
      id="heritage-academy"
      aria-labelledby="heritage-academy-promo-heading"
      className="border-y border-[var(--color-border)] bg-[linear-gradient(120deg,#122033_0%,#1b2d44_55%,#24364d_100%)] text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h2
            id="heritage-academy-promo-heading"
            className="font-display text-3xl font-semibold sm:text-4xl"
          >
            The Heritage Academy High School Track
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            {heritageAcademy.subtext} A Lighthouse family already sent a son through it.
          </p>

          <dl className="mt-6 grid max-w-lg grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-400">Dates</dt>
              <dd className="mt-0.5 font-medium">{heritageAcademy.programDatesLabel}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Cost</dt>
              <dd className="mt-0.5 font-medium">Free · virtual · 2 to 3 hours a week</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#b4232c] text-white hover:bg-[#9d1d25] hover:brightness-100"
            >
              <a href={heritageAcademy.applyUrl} target="_blank" rel="noreferrer">
                Apply now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/heritage-academy">See the full ad</Link>
            </Button>
          </div>
        </div>

        <Link
          href="/heritage-academy"
          className="group relative block overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-1"
          aria-label="Open the Heritage Academy advertisement"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={heritageAcademy.studyImageUrl}
              alt="A homeschool desk ready for a Heritage Academy lecture"
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Image
              src={heritageAcademy.logoUrl}
              alt={`${heritageAcademy.sponsor} logo`}
              width={150}
              height={42}
              className="h-8 w-auto rounded-md bg-white px-2 py-1"
            />
            <p className="text-sm font-medium text-slate-200">Fall 2026 applications are open</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
