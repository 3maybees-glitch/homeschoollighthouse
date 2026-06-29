"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Anchor, Compass } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { seedListings } from "@/data/seed-listings";
import { Button } from "@/components/ui/button";
import type { Favorite, SavedSearch } from "@/types/community";
import type { SubscriptionTier } from "@/types/listing";

export function CaptainLogPanels({ tier }: { tier: SubscriptionTier }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data.favorites ?? []))
      .catch(() => undefined);

    fetch("/api/saved-searches")
      .then((res) => res.json())
      .then((data) => setSavedSearches(data.savedSearches ?? []))
      .catch(() => undefined);
  }, []);

  const removeFavorite = async (listingSlug: string) => {
    await fetch(`/api/favorites?listingSlug=${listingSlug}`, { method: "DELETE" });
    setFavorites((current) => current.filter((favorite) => favorite.listingSlug !== listingSlug));
  };

  const removeSavedSearch = async (id: string) => {
    await fetch(`/api/saved-searches?id=${id}`, { method: "DELETE" });
    setSavedSearches((current) => current.filter((search) => search.id !== id));
  };

  return (
    <>
      <section className="rounded-3xl border bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Anchor className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">{brand.favorites}</h2>
        </div>
        <div className="mt-4 space-y-3">
          {favorites.length === 0 ? (
            <p className="text-sm text-slate-500">No anchored resources yet.</p>
          ) : (
            favorites.map((favorite) => {
              const listing = seedListings.find((item) => item.slug === favorite.listingSlug);
              return (
                <div
                  key={favorite.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <Link href={`/listing/${favorite.listingSlug}`} className="font-medium text-slate-900 hover:text-amber-700">
                    {listing?.title ?? favorite.listingSlug}
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => removeFavorite(favorite.listingSlug)}>
                    Remove
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-3xl border bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">{brand.savedSearches}</h2>
        </div>
        {tier !== "premium" ? (
          <p className="mt-4 text-sm text-slate-500">
            Upgrade to save charted courses from the browse page.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {savedSearches.length === 0 ? (
              <p className="text-sm text-slate-500">No charted courses saved yet.</p>
            ) : (
              savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <Link
                      href={`/browse?${search.queryString}`}
                      className="font-medium text-slate-900 hover:text-amber-700"
                    >
                      {search.name}
                    </Link>
                    <p className="text-xs text-slate-500">{search.queryString}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeSavedSearch(search.id)}>
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
}
