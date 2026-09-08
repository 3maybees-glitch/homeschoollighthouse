import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, ExternalLink, GraduationCap, Mail, MonitorPlay, Users } from "lucide-react";
import {
  heritageAcademy,
  heritageAcademyFacts,
  heritageAcademyFaqs,
  heritageAcademyIncludes,
} from "@/lib/heritage-academy";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://homeschoollighthouse.com";

export function HeritageAdPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${heritageAcademy.programName} ${heritageAcademy.trackName}`,
    description: heritageAcademy.shortDescription,
    provider: {
      "@type": "Organization",
      name: heritageAcademy.sponsor,
      url: "https://www.heritage.org",
      email: heritageAcademy.contactEmail,
    },
    isAccessibleForFree: true,
    courseMode: "online",
    startDate: heritageAcademy.programStart,
    endDate: heritageAcademy.programEnd,
    url: `${siteUrl}/heritage-academy`,
    sameAs: heritageAcademy.learnMoreUrl,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: heritageAcademy.applyUrl,
      validThrough: `${heritageAcademy.deadlineIso}T23:59:59-04:00`,
    },
  };

  return (
    <div className="heritage-ad bg-[#f3f5f8] text-[#122033]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-white/10 bg-[#122033] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-14 lg:pt-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e3b4b4]">
              {heritageAcademy.eyebrow}
            </p>
            <h1 className="font-display mt-3 max-w-xl text-4xl font-semibold leading-[1.12] text-balance sm:text-5xl">
              {heritageAcademy.headline}
            </h1>
            <p className="mt-4 max-w-[38ch] text-base leading-relaxed text-slate-300">
              {heritageAcademy.subtext}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#b4232c] text-white shadow-md shadow-[rgba(180,35,44,0.28)] hover:bg-[#9d1d25] hover:brightness-100"
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
                <a href={heritageAcademy.faqUrl} target="_blank" rel="noreferrer">
                  Academy FAQ
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Applications close {heritageAcademy.deadlineLabel}. Program is {heritageAcademy.costLabel.toLowerCase()}{" "}
              and virtual.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#1b2d44] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={heritageAcademy.heroImageUrl}
                alt="Two high school students studying founding documents together at a home library table"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
            </div>
            <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 shadow-sm">
              <Image
                src={heritageAcademy.logoUrl}
                alt={`${heritageAcademy.sponsor} logo`}
                width={168}
                height={48}
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d5dde6] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {heritageAcademyFacts.map((fact) => (
            <div key={fact.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b4232c]">{fact.label}</p>
              <p className="mt-1 font-display text-lg font-semibold text-[#122033]">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display max-w-2xl text-3xl font-semibold text-[#122033] sm:text-4xl">
          Built for serious high school students
        </h2>
        <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-[#3d5268]">
          Heritage asked families to share this High School Track with students who would enjoy the work
          and the company. The fellowship is virtual, part-time, and open at no cost.
        </p>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#d5dde6] bg-white shadow-sm">
            <div className="relative aspect-[16/10]">
              <Image
                src={heritageAcademy.studyImageUrl}
                alt="Home desk set for a live Heritage Academy lecture, with notes and a pocket Constitution"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {heritageAcademyIncludes.map((item) => (
              <li key={item.title}>
                <h3 className="font-display text-xl font-semibold text-[#122033]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3d5268]">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-[#d5dde6] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <blockquote className="max-w-3xl">
            <p className="text-sm font-semibold text-[#b4232c]">{heritageAcademy.familyNote.label}</p>
            <p className="font-display mt-3 text-2xl font-semibold leading-snug text-[#122033] sm:text-3xl">
              {`"${heritageAcademy.familyNote.quote}"`}
            </p>
            <footer className="mt-4 text-sm text-[#3d5268]">{heritageAcademy.familyNote.attribution}</footer>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-[#122033]">What a week looks like</h2>
        <ol className="mt-8 divide-y divide-[#d5dde6] border-y border-[#d5dde6]">
          <li className="grid gap-2 py-5 md:grid-cols-[11rem_1fr] md:items-baseline">
            <p className="inline-flex items-center gap-2 font-semibold text-[#122033]">
              <MonitorPlay className="h-4 w-4 text-[#b4232c]" aria-hidden="true" />
              Watch two lectures
            </p>
            <p className="text-sm leading-relaxed text-[#3d5268]">
              On-demand sessions from Heritage scholars, about 30 minutes each, on your family schedule.
            </p>
          </li>
          <li className="grid gap-2 py-5 md:grid-cols-[11rem_1fr] md:items-baseline">
            <p className="inline-flex items-center gap-2 font-semibold text-[#122033]">
              <Users className="h-4 w-4 text-[#b4232c]" aria-hidden="true" />
              Join the live hour
            </p>
            <p className="text-sm leading-relaxed text-[#3d5268]">
              A Q&A or High School Track discussion with students who take the founding seriously.
            </p>
          </li>
          <li className="grid gap-2 py-5 md:grid-cols-[11rem_1fr] md:items-baseline">
            <p className="inline-flex items-center gap-2 font-semibold text-[#122033]">
              <GraduationCap className="h-4 w-4 text-[#b4232c]" aria-hidden="true" />
              Keep going
            </p>
            <p className="text-sm leading-relaxed text-[#3d5268]">
              Completing the Academy is a common path into the{" "}
              <a
                href={heritageAcademy.fellowshipUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#b4232c] underline-offset-4 hover:underline"
              >
                summer High School Fellowship
              </a>{" "}
              in Washington, D.C.
            </p>
          </li>
        </ol>
      </section>

      <section className="border-y border-[#d5dde6] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-[#122033]">Questions families ask</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-2">
            {heritageAcademyFaqs.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-[#122033]">{item.question}</dt>
                <dd className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[#3d5268]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-[#122033] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Apply before September 13</h2>
            <p className="mt-3 max-w-[48ch] text-slate-300">
              Fall 2026 runs {heritageAcademy.programDatesLabel}. Share this with a student, a teacher, a
              church friend, or a homeschool group.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${heritageAcademy.contactEmail}`} className="underline-offset-4 hover:underline">
                {heritageAcademy.contactEmail}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
              <Link href={`/listing/${heritageAcademy.slug}`}>Directory listing</Link>
            </Button>
          </div>
        </div>
      </section>

      <aside className="border-t border-[#d5dde6] bg-[#f3f5f8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#3d5268] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-3xl">{heritageAcademy.disclosure}</p>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#5a6f84]">
            <CalendarDays className="h-3.5 w-3.5" />
            <Clock3 className="h-3.5 w-3.5" />
            Deadline {heritageAcademy.deadlineLabel}
          </p>
        </div>
      </aside>
    </div>
  );
}
