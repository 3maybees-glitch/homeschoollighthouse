"use client";

import { useEffect, useState } from "react";
import { Anchor } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/types/listing";

export function FavoriteButton({
  listingId,
  listingSlug,
  tier,
}: {
  listingId: string;
  listingSlug: string;
  tier: SubscriptionTier;
}) {
  const [anchored, setAnchored] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const exists = data.favorites?.some(
          (favorite: { listingSlug: string }) => favorite.listingSlug === listingSlug,
        );
        setAnchored(Boolean(exists));
      })
      .catch(() => undefined);
  }, [listingSlug]);

  const toggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (anchored) {
        await fetch(`/api/favorites?listingSlug=${listingSlug}`, { method: "DELETE" });
        setAnchored(false);
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, listingSlug }),
        });
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.error ?? "Could not anchor resource.");
          return;
        }
        setAnchored(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={toggle} disabled={loading}>
        <Anchor className="h-4 w-4" />
        {anchored ? "Anchored" : brand.favorites}
        {tier !== "premium" ? " (up to 5)" : ""}
      </Button>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
