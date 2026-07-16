import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { FoundingFathersInfographic } from "@/components/infographics/founding-fathers-infographic";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand-vocabulary";

export const metadata: Metadata = {
  title: "Founding Fathers Who Were Homeschooled | Infographic",
  description:
    "An Homeschool Lighthouse infographic on Founding Fathers educated at home — Washington, Jefferson, Madison, Patrick Henry, John Quincy Adams, and Franklin.",
  openGraph: {
    title: "Founding Fathers Who Were Homeschooled",
    description: "Home education helped shape a nation. Explore the story at Homeschool Lighthouse.",
    images: [
      {
        url: "/infographics/founding-fathers-homeschooled.png",
        width: 1024,
        height: 1536,
        alt: "Founding Fathers Who Were Homeschooled infographic from Homeschool Lighthouse",
      },
    ],
  },
};

export default function FoundingFathersInfographicPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        Shareable Infographic
      </p>
      <h1 className="font-display mt-3 text-4xl font-bold text-[var(--color-navy-deep)] sm:text-5xl">
        Founding Fathers Who Were Homeschooled
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-muted-foreground)]">
        Long before modern classrooms, several of America&apos;s founders learned at
        home with parents and tutors. Share this {brand.siteName} graphic — and
        visit{" "}
        <Link
          href="https://homeschoollighthouse.com"
          className="font-semibold text-[var(--color-secondary)] underline-offset-2 hover:underline"
        >
          homeschoollighthouse.com
        </Link>{" "}
        to chart your own family&apos;s course.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <a href="/infographics/founding-fathers-homeschooled.png" download>
            <Download className="h-4 w-4" />
            Download PNG
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blog/founding-fathers-who-were-homeschooled">Read the dispatch</Link>
        </Button>
      </div>

      <div className="mt-10">
        <FoundingFathersInfographic />
      </div>

      <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white p-3 shadow-sm sm:p-4">
        <p className="mb-3 px-1 text-sm font-medium text-[var(--color-muted-foreground)]">
          Shareable poster version
        </p>
        <a
          href="https://homeschoollighthouse.com"
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-2xl"
        >
          <Image
            src="/infographics/founding-fathers-homeschooled.png"
            alt="Founding Fathers Who Were Homeschooled infographic linking to Homeschool Lighthouse"
            width={1024}
            height={1536}
            className="h-auto w-full"
            priority
          />
        </a>
      </div>
    </div>
  );
}
