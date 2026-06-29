"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listingTypeOptions } from "@/lib/directory/filter-config";

export function SubmitForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [listingType, setListingType] = useState("curriculum");
  const [description, setDescription] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, websiteUrl, listingType, description, submitterEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not send signal.");
        return;
      }
      setSuccess("Signal sent! Your submission is in the moderation queue.");
      setTitle("");
      setWebsiteUrl("");
      setDescription("");
      setSubmitterEmail("");
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
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Your email (optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={submitterEmail}
          onChange={(e) => setSubmitterEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Resource type</Label>
        <select
          id="type"
          className="flex h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm"
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
        >
          {listingTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="min-h-32 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
          placeholder="Tell families why this resource is worth charting."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-amber-800">{success}</p> : null}
      <Button type="button" onClick={submit} disabled={loading}>
        {loading ? "Sending signal…" : brand.submit.title}
      </Button>
    </div>
  );
}
