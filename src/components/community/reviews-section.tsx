"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Review } from "@/types/community";
import type { SubscriptionTier } from "@/types/listing";

export function ReviewsSection({
  listingId,
  listingSlug,
  tier,
  initialReviews,
}: {
  listingId: string;
  listingSlug: string;
  tier: SubscriptionTier;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState("");

  const isPremium = tier === "premium";

  const submitReview = async () => {
    setError("");
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, listingSlug, title, body, rating, authorName }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not submit review.");
      return;
    }
    setReviews((current) => [data.review, ...current]);
    setShowForm(false);
    setTitle("");
    setBody("");
  };

  return (
    <section className="rounded-3xl border bg-white/90 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{brand.reviews}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {isPremium
              ? "Read and share parent feedback from the fleet."
              : "Upgrade to read full reviews and share your own signal."}
          </p>
        </div>
        {isPremium ? (
          <Button variant="outline" onClick={() => setShowForm((value) => !value)}>
            Share a Signal
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/pricing">{brand.upgrade.title}</Link>
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="mt-6 space-y-4 rounded-2xl bg-amber-50 p-4">
          <div className="space-y-2">
            <Label htmlFor="author">Your name</Label>
            <Input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-title">Review title</Label>
            <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <select
              id="rating"
              className="h-11 w-full rounded-full border px-4 text-sm"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-body">Your experience</Label>
            <textarea
              id="review-body"
              className="min-h-28 w-full rounded-2xl border px-4 py-3 text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={submitReview}>Post Review</Button>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No signals yet. Be the first to share your experience.</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{review.title}</h3>
                <span className="inline-flex items-center gap-1 text-sm text-amber-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {review.rating}
                </span>
              </div>
              {isPremium ? (
                <>
                  <p className="mt-2 text-sm text-slate-700">{review.body}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    {review.authorName} · {new Date(review.createdAt).toLocaleDateString()} ·{" "}
                    {review.helpfulCount} found helpful
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500 italic">
                  Full review hidden on free pass.{" "}
                  <Link href="/pricing" className="font-medium text-amber-700 hover:underline">
                    Unlock the Full Beam
                  </Link>{" "}
                  to read parent feedback.
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
