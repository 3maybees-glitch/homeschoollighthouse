"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SubscriptionTier } from "@/types/listing";

export function SaveSearchButton({
  queryString,
  tier,
}: {
  queryString: string;
  tier: SubscriptionTier;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  if (tier !== "premium") {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/pricing">
          <Compass className="h-4 w-4" />
          Save {brand.savedSearches} (Premium)
        </Link>
      </Button>
    );
  }

  const save = async () => {
    setMessage("");
    const response = await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || "My charted course", queryString }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Could not save search.");
      return;
    }
    setMessage("Charted course saved to your Captain's Log.");
    setOpen(false);
    setName("");
  };

  return (
    <div className="space-y-2">
      {open ? (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Name this charted course"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-xs"
          />
          <Button size="sm" onClick={save}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Compass className="h-4 w-4" />
          Save {brand.savedSearches}
        </Button>
      )}
      {message ? <p className="text-sm text-amber-800">{message}</p> : null}
    </div>
  );
}
