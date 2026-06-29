import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/user-id";
import { getUserTier } from "@/lib/auth/session";
import { memoryStore } from "@/lib/store/memory-store";

export async function GET() {
  const userId = await getUserId();
  const favorites = memoryStore.listFavorites(userId);
  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  const tier = await getUserTier();
  const userId = await getUserId();
  const body = await request.json();

  if (tier !== "premium") {
    const current = memoryStore.listFavorites(userId);
    if (current.length >= 5) {
      return NextResponse.json(
        { error: "Free accounts can anchor up to 5 resources. Upgrade for unlimited." },
        { status: 403 },
      );
    }
  }

  const favorite = memoryStore.addFavorite(userId, body.listingId, body.listingSlug);
  return NextResponse.json({ favorite }, { status: 201 });
}

export async function DELETE(request: Request) {
  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  const listingSlug = searchParams.get("listingSlug");
  if (!listingSlug) {
    return NextResponse.json({ error: "listingSlug required" }, { status: 400 });
  }

  memoryStore.removeFavorite(userId, listingSlug);
  return NextResponse.json({ ok: true });
}
