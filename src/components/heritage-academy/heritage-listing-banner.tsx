import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { heritageAcademy } from "@/lib/heritage-academy";
import { Button } from "@/components/ui/button";

export function HeritageListingBanner() {
  return (
    <aside className="rounded-2xl border border-[#b4232c]/25 bg-[#fff7f7] p-5 sm:p-6">
      <p className="text-sm font-semibold text-[#b4232c]">Fall 2026 High School Track</p>
      <p className="mt-2 text-[var(--color-navy-deep)]">
        Applications close {heritageAcademy.deadlineLabel}. The virtual program runs{" "}
        {heritageAcademy.programDatesLabel}.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild className="bg-[#b4232c] text-white hover:bg-[#9d1d25] hover:brightness-100">
          <a href={heritageAcademy.applyUrl} target="_blank" rel="noreferrer">
            Apply now
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/heritage-academy">See the full ad</Link>
        </Button>
      </div>
    </aside>
  );
}
