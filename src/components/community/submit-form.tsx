"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import {
  isLocalHarborType,
  submissionNeedsLocation,
} from "@/lib/directory/local-harbor-types";
import { formatOptions, listingTypeOptions, usStates } from "@/lib/directory/filter-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ListingFormat } from "@/types/listing";

export function SubmitForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [listingType, setListingType] = useState("curriculum");
  const [format, setFormat] = useState<ListingFormat>("online");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showLocationSection = useMemo(() => isLocalHarborType(listingType), [listingType]);
  const locationRequired = useMemo(
    () => submissionNeedsLocation(listingType, format),
    [listingType, format],
  );

  const submit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          websiteUrl,
          listingType,
          format: showLocationSection ? format : "online",
          city: showLocationSection ? city : undefined,
          state: showLocationSection ? state : undefined,
          description,
          submitterEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not send signal.");
        return;
      }
      setSuccess(
        showLocationSection && data.submission?.latitude
          ? "Signal sent! Your harbor location was charted and is waiting for review."
          : "Signal sent! Your submission is in the moderation queue.",
      );
      setTitle("");
      setWebsiteUrl("");
      setDescription("");
      setSubmitterEmail("");
      setCity("");
      setState("");
      setFormat("online");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Resource name</Label>
        <Input
          id="title"
          placeholder="e.g. Lighthouse Learning Co-op"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Your email (optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={submitterEmail}
          onChange={(event) => setSubmitterEmail(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Resource type</Label>
        <select
          id="type"
          className="flex h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
          value={listingType}
          onChange={(event) => {
            const nextType = event.target.value;
            setListingType(nextType);
            if (isLocalHarborType(nextType) && format === "online") {
              setFormat("in_person");
            }
          }}
        >
          {listingTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showLocationSection ? (
        <div className="space-y-4 rounded-[1.75rem] border border-[var(--color-primary)]/25 bg-[var(--color-cream)] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-navy-deep)]">
                {brand.submit.locationTitle}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {brand.submit.locationSubtitle}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">{brand.submit.formatLabel}</Label>
            <select
              id="format"
              className="flex h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
              value={format}
              onChange={(event) => setFormat(event.target.value as ListingFormat)}
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">
                {brand.submit.cityLabel}
                {locationRequired ? " *" : ""}
              </Label>
              <Input
                id="city"
                placeholder={brand.submit.cityPlaceholder}
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">
                {brand.submit.stateLabel}
                {locationRequired || format !== "online" ? " *" : ""}
              </Label>
              <select
                id="state"
                className="flex h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
                value={state}
                onChange={(event) => setState(event.target.value)}
              >
                <option value="">{brand.submit.statePlaceholder}</option>
                {usStates.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-[var(--color-muted-foreground)]">{brand.submit.mapNote}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="min-h-32 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
          placeholder="Tell families why this resource is worth charting."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-[var(--color-accent)]">{success}</p> : null}
      <Button type="button" onClick={submit} disabled={loading}>
        {loading ? "Sending signal…" : brand.submit.title}
      </Button>
    </div>
  );
}
