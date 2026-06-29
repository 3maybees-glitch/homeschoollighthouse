"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import {
  formatOptions,
  listingTypeOptions,
  philosophyOptions,
  religionOptions,
  subjectOptions,
  usStates,
  valuesOptions,
} from "@/lib/directory/filter-config";
import { canUseFilter } from "@/lib/directory/premium-gates";
import { filtersToSearchParams } from "@/lib/directory/query-listings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FilterState, SubscriptionTier } from "@/types/listing";

function CheckboxGroup({
  title,
  options,
  selected,
  locked,
  onToggle,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  locked?: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>{title}</Label>
        {locked ? <Lock className="h-3.5 w-3.5 text-amber-600" /> : null}
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm text-slate-700">
            <Checkbox
              checked={selected.includes(option.value)}
              disabled={locked}
              onCheckedChange={() => onToggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterPanel({
  initialFilters,
  tier,
}: {
  initialFilters: FilterState;
  tier: SubscriptionTier;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isPremium = tier === "premium";

  const updateFilters = (next: FilterState) => {
    setFilters(next);
    startTransition(() => {
      const params = filtersToSearchParams(next);
      router.push(`/browse?${params.toString()}`);
    });
  };

  const toggleValue = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[] | undefined) ?? [];
    const nextValues = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateFilters({ ...filters, [key]: nextValues });
  };

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (filters.q) chips.push(`Search: ${filters.q}`);
    filters.types?.forEach((value) => chips.push(value));
    filters.format?.forEach((value) => chips.push(value));
    filters.philosophies?.forEach((value) => chips.push(value));
    if (filters.state) chips.push(filters.state);
    return chips;
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          {brand.filters.title}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{brand.browse.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{brand.browse.subtitle}</p>
      </div>

      <div className="rounded-3xl border bg-white/90 p-5 shadow-sm">
        <Label htmlFor="search">{brand.search.title}</Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="search"
            defaultValue={filters.q ?? ""}
            placeholder={brand.search.placeholder}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateFilters({ ...filters, q: event.currentTarget.value });
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.getElementById("search") as HTMLInputElement | null;
              updateFilters({ ...filters, q: input?.value ?? "" });
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {activeChips.length ? (
        <div className="rounded-3xl border bg-amber-50/80 p-4">
          <p className="text-sm font-medium text-amber-900">{brand.filters.chips}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border bg-white/90 p-5 shadow-sm">
        <p className="font-semibold text-slate-900">{brand.filters.basic}</p>
        <div className="mt-4 space-y-6">
          <CheckboxGroup
            title="Resource Type"
            options={listingTypeOptions}
            selected={filters.types ?? []}
            onToggle={(value) => toggleValue("types", value)}
          />
          <CheckboxGroup
            title="Format"
            options={formatOptions}
            selected={filters.format ?? []}
            onToggle={(value) => toggleValue("format", value)}
          />
          <div className="space-y-2">
            <Label htmlFor="age-range">Age Range</Label>
            <Input
              id="age-range"
              placeholder="e.g. 6-12"
              defaultValue={filters.ageRange ? filters.ageRange.join("-") : ""}
              onBlur={(event) => {
                const [min, max] = event.target.value.split("-").map(Number);
                if (!Number.isNaN(min) && !Number.isNaN(max)) {
                  updateFilters({ ...filters, ageRange: [min, max] });
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white/90 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-900">{brand.filters.advanced}</p>
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced((value) => !value)}>
            {showAdvanced ? "Hide" : brand.filters.more}
          </Button>
        </div>
        {showAdvanced ? (
          <div className="mt-4 space-y-6">
            <CheckboxGroup
              title="Philosophy"
              options={philosophyOptions}
              selected={filters.philosophies ?? []}
              locked={!canUseFilter(tier, "philosophies", filters.philosophies)}
              onToggle={(value) => toggleValue("philosophies", value)}
            />
            <CheckboxGroup
              title="Values"
              options={valuesOptions}
              selected={filters.values ?? []}
              locked={!canUseFilter(tier, "values", filters.values)}
              onToggle={(value) => toggleValue("values", value)}
            />
            <CheckboxGroup
              title="Religious Affiliation"
              options={religionOptions}
              selected={filters.religions ?? []}
              locked={!canUseFilter(tier, "religions", filters.religions)}
              onToggle={(value) => toggleValue("religions", value)}
            />
            <CheckboxGroup
              title="Subjects"
              options={subjectOptions}
              selected={filters.subjects ?? []}
              locked={!canUseFilter(tier, "subjects", filters.subjects)}
              onToggle={(value) => toggleValue("subjects", value)}
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>{brand.filters.location}</Label>
                {!canUseFilter(tier, "state", filters.state) ? (
                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                ) : null}
              </div>
              <Select
                value={filters.state ?? "all"}
                onValueChange={(value) =>
                  updateFilters({ ...filters, state: value === "all" ? undefined : value })
                }
                disabled={!canUseFilter(tier, "state", filters.state)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {usStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
      </div>

      {!isPremium ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-950">{brand.upgrade.title}</p>
          <p className="mt-2 text-sm text-amber-900">{brand.upgrade.subtitle}</p>
          <Button asChild className="mt-4">
            <Link href="/pricing">{brand.pricing.title}</Link>
          </Button>
        </div>
      ) : null}

      {isPending ? <p className="text-sm text-slate-500">Updating your bearing…</p> : null}
    </div>
  );
}
