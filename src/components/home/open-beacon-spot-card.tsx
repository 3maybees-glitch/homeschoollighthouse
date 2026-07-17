import Link from "next/link";
import { Megaphone, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OpenBeaconSpotCard({ spotNumber }: { spotNumber: number }) {
  return (
    <Link
      href="/advertise"
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      aria-label={`${brand.advertise.openSpotLabel} ${spotNumber}. ${brand.advertise.cta}`}
    >
      <Card className="relative h-full overflow-hidden border-dashed border-[var(--color-primary)]/45 bg-[linear-gradient(160deg,rgba(255,249,230,0.95),rgba(255,255,255,0.92)_45%,rgba(232,246,244,0.9))] transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[rgba(0,31,63,0.08)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(0,31,63,0.08)_1px,transparent_0)] [background-size:18px_18px]"
          aria-hidden="true"
        />
        <CardHeader className="relative">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-navy-deep)] transition group-hover:bg-[var(--color-primary)]/25">
            <Megaphone className="h-6 w-6" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
              Spot available
            </Badge>
            <Badge className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
              {brand.advertise.monthly}
            </Badge>
          </div>
          <CardTitle className="mt-2 font-display text-[var(--color-navy-deep)] transition group-hover:text-[var(--color-secondary)]">
            {brand.advertise.openSpotHeadline}
          </CardTitle>
          <CardDescription>{brand.advertise.openSpotBody}</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-3 text-sm text-[var(--color-muted-foreground)]">
          <p>
            One of {brand.advertise.spotCount} exclusive Bright Beacons · Spot {spotNumber}
          </p>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-secondary)] transition group-hover:text-[var(--color-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            {brand.advertise.cta}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
