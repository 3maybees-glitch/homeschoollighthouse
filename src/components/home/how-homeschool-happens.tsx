import Image from "next/image";
import Link from "next/link";
import { Compass, Users } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

const ways = [
  { name: "Parent instructor", detail: "You hold the helm at the table." },
  { name: "Online", detail: "Live or self-paced, kitchen as campus." },
  { name: "Hybrid", detail: "Home days plus campus or screen days." },
  { name: "Co-op", detail: "Families share teaching and friendship." },
  { name: "Tutor-supported", detail: "Keep the cores; hire help where it counts." },
  { name: "Cottage / microschool", detail: "A small paid classroom, still homeschool." },
] as const;

export function HowHomeschoolHappens() {
  return (
    <section
      id="how-homeschool-happens"
      aria-labelledby="how-homeschool-happens-heading"
      className="border-y border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(250,248,243,0.95),rgba(255,255,255,0.92))]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <Link
            href="/navigator"
            className="group relative mx-auto block w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-start"
            aria-label="How homeschool happens infographic — open The Navigator"
          >
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--color-navy)]/10 bg-white p-2 shadow-[0_18px_50px_rgba(0,20,40,0.1)] transition duration-500 group-hover:-translate-y-1 group-hover:border-[var(--color-primary)]/40">
              <div className="relative aspect-[2/3] overflow-hidden rounded-[1.35rem] bg-[var(--color-cream)]">
                <Image
                  src="/social/how-homeschool-happens-x-infographic.png"
                  alt="How Homeschool Happens infographic — parent instructor, online, hybrid, co-op, tutor-supported, and cottage school, with The Navigator as a quiet next step"
                  fill
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
              New · Shareable X graphic
            </p>
          </Link>

          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              <Users className="h-4 w-4" aria-hidden="true" />
              Many ways home
            </p>
            <h2
              id="how-homeschool-happens-heading"
              className="font-display mt-3 text-3xl font-semibold leading-tight text-[var(--color-navy-deep)] sm:text-4xl lg:text-[2.6rem]"
            >
              Homeschool isn&apos;t one course. It&apos;s a whole harbor.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
              Parent at the helm, a remote teacher, a weekly co-op, a hybrid campus day —
              most families mix two or three. The right curriculum depends on how you
              actually teach, not on a single labeled lane.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {ways.map((way) => (
                <li
                  key={way.name}
                  className="rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                >
                  <span className="block text-sm font-semibold text-[var(--color-navy-deep)]">
                    {way.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-[var(--color-muted-foreground)]">
                    {way.detail}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              Dual enrollment, umbrella schools, and unschooling belong here too. When you
              want a chart that respects the mix, {brand.navigator.title} matches three
              choices per subject for every remaining year through Senior —{" "}
              <span className="font-semibold text-[var(--color-navy-deep)]">
                {brand.navigator.price} one-time
              </span>
              , not a subscription.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/navigator">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  Meet {brand.navigator.title}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/browse?types=coop,online_course,tutor">Browse these waters</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
