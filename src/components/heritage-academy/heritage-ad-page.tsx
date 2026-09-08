import Link from "next/link";
import { CalendarDays, Clock3, Download, ExternalLink, Mail } from "lucide-react";
import {
  heritageAcademy,
  heritageAcademyFacts,
  heritageAcademyFaqs,
  heritageAcademyIncludes,
  heritageAcademyLectures,
  heritageAcademyTracks,
} from "@/lib/heritage-academy";
import { HeritageFlyerPoster } from "@/components/heritage-academy/heritage-flyer-poster";
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
    sameAs: [heritageAcademy.applyUrl, heritageAcademy.learnMoreUrl],
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
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1fr_22rem] lg:gap-12 xl:grid-cols-[1.15fr_26rem] lg:pb-14 lg:pt-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8ec8e8]">
              {heritageAcademy.eyebrow}
            </p>
            <h1 className="font-display mt-3 max-w-xl text-4xl font-semibold leading-[1.12] text-balance sm:text-5xl">
              {heritageAcademy.headline}
            </h1>
            <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-slate-300">
              {heritageAcademy.subtext}
            </p>
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <a href={heritageAcademy.flyerPdfUrl} download>
                  Official flyer
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Applications close {heritageAcademy.deadlineLabel}. The program is free and virtual.
            </p>
          </div>

          <HeritageFlyerPoster flyer="deadlineBell" href={heritageAcademy.applyUrl} priority />
        </div>
      </section>

      <section className="border-b border-[#d5dde6] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {heritageAcademyFacts.map((fact) => (
            <div key={fact.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1aa3d8]">{fact.label}</p>
              <p className="mt-1 font-display text-lg font-semibold text-[#122033]">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display max-w-2xl text-3xl font-semibold text-[#122033] sm:text-4xl">
          Want to help restore America?
        </h2>
        <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-[#3d5268]">
          Heritage describes the Academy as the next step for a Fellow: knowledge, skills, and a
          network for the battle of ideas. The High School Track is the one they asked us to share.
        </p>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <HeritageFlyerPoster flyer="lectureLaptop" href={heritageAcademy.applyUrl} />
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
          <h2 className="font-display text-3xl font-semibold text-[#122033]">Policy lectures include</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {heritageAcademyLectures.map((topic) => (
              <li key={topic} className="border-b border-[#d5dde6] pb-3 text-[#122033]">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-[#122033]">Who should apply?</h2>
        <p className="mt-3 max-w-[60ch] text-[#3d5268]">
          Heritage is looking for talented conservatives of all ages, with three dedicated discussion
          tracks.
        </p>
        <ol className="mt-8 divide-y divide-[#d5dde6] border-y border-[#d5dde6]">
          {heritageAcademyTracks.map((track) => (
            <li key={track.title} className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:items-baseline">
              <p className="font-semibold text-[#122033]">{track.title}</p>
              <p className="text-sm leading-relaxed text-[#3d5268]">{track.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#d5dde6] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <blockquote className="max-w-3xl">
            <p className="text-sm font-semibold text-[#1aa3d8]">{heritageAcademy.familyNote.label}</p>
            <p className="font-display mt-3 text-2xl font-semibold leading-snug text-[#122033] sm:text-3xl">
              {`"${heritageAcademy.familyNote.quote}"`}
            </p>
            <footer className="mt-4 text-sm text-[#3d5268]">{heritageAcademy.familyNote.attribution}</footer>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-[#122033]">Official Heritage artwork</h2>
        <p className="mt-3 max-w-[60ch] text-[#3d5268]">
          These are Heritage&apos;s 2026 flyers. Click a poster to apply on Heritage.org.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <HeritageFlyerPoster flyer="deadlineBell" href={heritageAcademy.applyUrl} />
          <div className="grid gap-5">
            <HeritageFlyerPoster flyer="deadlineEagle" href={heritageAcademy.applyUrl} />
            <a
              href={heritageAcademy.flyerPdfUrl}
              download
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d5dde6] bg-white px-4 py-4 text-sm font-semibold text-[#122033] transition hover:border-[#1aa3d8]"
            >
              <Download className="h-4 w-4" />
              Download the two-page flyer (PDF)
            </a>
          </div>
        </div>
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
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Apply by September 13</h2>
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
              className="bg-[#1aa3d8] text-[#122033] hover:bg-[#4bb6e0] hover:brightness-100"
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
