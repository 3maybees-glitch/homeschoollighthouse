import { NextResponse } from "next/server";
import { getUserTier } from "@/lib/auth/session";
import { memoryStore } from "@/lib/store/memory-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId") ?? undefined;
  const listingSlug = searchParams.get("listingSlug") ?? undefined;
  const reviews = memoryStore.listReviews(listingId, listingSlug);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const tier = await getUserTier();
  if (tier !== "premium") {
    return NextResponse.json(
      { error: "Premium required to post Signals from the Fleet." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const review = memoryStore.addReview({
    listingId: body.listingId,
    listingSlug: body.listingSlug,
    authorName: body.authorName ?? "Lighthouse Parent",
    rating: Number(body.rating),
    title: body.title,
    body: body.body,
  });

  return NextResponse.json({ review }, { status: 201 });
}
