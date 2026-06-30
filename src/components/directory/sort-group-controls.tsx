"use client";

import { useRouter } from "next/navigation";
import { brand } from "@/lib/brand-vocabulary";
import { groupByOptions, sortOptions } from "@/lib/directory/filter-config";
import { canUseFilter } from "@/lib/directory/premium-gates";
import { filtersToSearchParams } from "@/lib/directory/query-listings";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FilterState, SubscriptionTier } from "@/types/listing";

export function SortGroupControls({
  filters,
  tier,
  total,
}: {
  filters: FilterState;
  tier: SubscriptionTier;
  total: number;
}) {
  const router = useRouter();

  const update = (patch: Partial<FilterState>) => {
    const next = { ...filters, ...patch };
    const params = filtersToSearchParams(next);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
          {total} beacons in view
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{brand.sort.title}</Label>
          <Select value={filters.sort} onValueChange={(value) => update({ sort: value as FilterState["sort"] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={!canUseFilter(tier, "sort", option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{brand.group.title}</Label>
          <Select
            value={filters.groupBy}
            onValueChange={(value) => update({ groupBy: value as FilterState["groupBy"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupByOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={!canUseFilter(tier, "groupBy", option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
