"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MapPin } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { usStates } from "@/lib/directory/filter-config";
import type { MapMarker } from "@/lib/geo/listing-coordinates";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LocalHarborsMap = dynamic(
  () => import("@/components/directory/local-harbors-map").then((mod) => mod.LocalHarborsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] w-full items-center justify-center rounded-[1.75rem] border border-[var(--color-border)] bg-white/80 text-sm text-[var(--color-muted-foreground)]">
        Loading harbor chart…
      </div>
    ),
  },
);

export function HarborsMapPanel({
  markers,
  total,
  mapped,
  state,
}: {
  markers: MapMarker[];
  total: number;
  mapped: number;
  state?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {brand.nav.harbors}
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--color-navy-deep)]">
            Navigate local harbors on the map
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            {total} harbors in view · {mapped} pinned on the chart
          </p>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <Label htmlFor="harbor-state">Filter by state</Label>
          <Select
            value={state ?? "all"}
            onValueChange={(value) => {
              startTransition(() => {
                router.push(value === "all" ? "/harbors" : `/harbors?state=${value}`);
              });
            }}
          >
            <SelectTrigger id="harbor-state">
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              {usStates.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <LocalHarborsMap markers={markers} />

      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-muted-foreground)]">
          <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
          Gold pins mark co-ops, support groups, and field trips with location data
        </span>
        {isPending ? (
          <span className="text-sm text-[var(--color-muted-foreground)]">Updating chart…</span>
        ) : null}
      </div>
    </div>
  );
}
