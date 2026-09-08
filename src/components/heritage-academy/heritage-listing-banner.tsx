import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { heritageAcademy } from "@/lib/heritage-academy";
import { Button } from "@/components/ui/button";

export function HeritageListingBanner() {
  return (
    <aside className="overflow-hidden rounded-2xl border border-[#1a2b44]/15 bg-[#122033] text-white">
      <div className="grid gap-0 sm:grid-cols-[8.5rem_1fr]">
        <div className="relative hidden aspect-[4/5] sm:block">
          <Image
            src={heritageAcademy.flyers.deadlineBell.src}
            alt=""
            fill
            className="object-cover object-top"
            sizes="140px"
          />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-[#8ec8e8]">Fall 2026 High School Track</p>
          <p className="mt-2 text-white">
            Applications close {heritageAcademy.deadlineLabel}. The virtual program runs{" "}
            {heritageAcademy.programDatesLabel}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild className="bg-[#1aa3d8] text-[#122033] hover:bg-[#4bb6e0] hover:brightness-100">
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
