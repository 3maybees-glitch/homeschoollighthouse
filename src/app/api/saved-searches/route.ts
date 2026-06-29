import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/user-id";
import { getUserTier } from "@/lib/auth/session";
import { memoryStore } from "@/lib/store/memory-store";

export async function GET() {
  const userId = await getUserId();
  const savedSearches = memoryStore.listSavedSearches(userId);
  return NextResponse.json({ savedSearches });
}

export async function POST(request: Request) {
  const tier = await getUserTier();
  if (tier !== "premium") {
    return NextResponse.json(
      { error: "Premium required to save Charted Courses." },
      { status: 403 },
    );
  }

  const userId = await getUserId();
  const body = await request.json();
  if (!body.name || !body.queryString) {
    return NextResponse.json({ error: "name and queryString required" }, { status: 400 });
  }

  const saved = memoryStore.addSavedSearch(userId, body.name, body.queryString);
  return NextResponse.json({ saved }, { status: 201 });
}

export async function DELETE(request: Request) {
  const tier = await getUserTier();
  if (tier !== "premium") {
    return NextResponse.json({ error: "Premium required." }, { status: 403 });
  }

  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  memoryStore.removeSavedSearch(userId, id);
  return NextResponse.json({ ok: true });
}
