import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { heritageAcademy } from "@/lib/heritage-academy";
import { Button } from "@/components/ui/button";

export function HeritageInlineAd({
  placement,
}: {
  placement: "credit-logbook" | "online-course";
}) {
  const intro =
    placement === "credit-logbook"
      ? "Charting high school credits? A free eight-week policy fellowship may belong on the same voyage."
      : "Families browsing live and online courses: Heritage is taking applications for a free virtual High School Track.";

  return (
    <aside
      className="overflow-hidden rounded-2xl border border-[#1a2b44]/15 bg-[#122033] text-white"
      aria-label="Heritage Academy advertisement"
    >
      <div className="grid items-center gap-0 md:grid-cols-[9.5rem_1fr]">
        <div className="relative hidden aspect-[4/5] md:block">
          <Image
            src={heritageAcademy.flyers.deadlineBell.src}
            alt=""
            fill
            className="object-cover object-top"
            sizes="160px"
          />
        </div>
        <div className="px-5 py-5 sm:px-6">
          <p className="font-display text-xl font-semibold">{heritageAcademy.programName}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#8ec8e8]">
            {heritageAcademy.tagline}
          </p>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-slate-300">{intro}</p>
          <p className="mt-2 text-sm font-medium text-white">Apply by {heritageAcademy.deadlineShort}.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[#1aa3d8] text-[#122033] hover:bg-[#4bb6e0] hover:brightness-100"
            >
              <a href={heritageAcademy.applyUrl} target="_blank" rel="noreferrer">
                Apply now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/heritage-academy">See the full ad</Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
