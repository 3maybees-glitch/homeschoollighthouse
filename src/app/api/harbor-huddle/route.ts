import { NextResponse } from "next/server";
import { getSessionProfile, getUserTier } from "@/lib/auth/session";
import { getUserId } from "@/lib/auth/user-id";
import { getMonthKey } from "@/lib/harbor-huddle/month";
import { memoryStore } from "@/lib/store/memory-store";

export async function GET(request: Request) {
  const tier = await getUserTier();
  if (tier !== "premium") {
    return NextResponse.json(
      { error: "Premium required to access the Harbor Huddle." },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const monthKey = searchParams.get("month") ?? getMonthKey();

  const huddle =
    memoryStore.getHuddleByMonthKey(monthKey) ??
    (monthKey === getMonthKey() ? memoryStore.ensureCurrentHuddle() : null);

  if (!huddle) {
    return NextResponse.json({ error: "Harbor Huddle not found for that month." }, { status: 404 });
  }

  const replies = memoryStore.listHuddleReplies(huddle.id);

  return NextResponse.json({
    huddle,
    replies,
    replyCount: replies.length,
    archives: memoryStore.listHuddles().map((item) => ({
      monthKey: item.monthKey,
      title: item.title,
    })),
  });
}

export async function POST(request: Request) {
  const tier = await getUserTier();
  if (tier !== "premium") {
    return NextResponse.json(
      { error: "Premium required to join the Harbor Huddle." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const monthKey = typeof body.monthKey === "string" ? body.monthKey : getMonthKey();
  const replyBody = typeof body.body === "string" ? body.body.trim() : "";
  const authorName =
    typeof body.authorName === "string" && body.authorName.trim()
      ? body.authorName.trim()
      : "Lighthouse Parent";

  if (!replyBody) {
    return NextResponse.json({ error: "Reply cannot be empty." }, { status: 400 });
  }

  if (replyBody.length > 4000) {
    return NextResponse.json({ error: "Reply is too long (max 4,000 characters)." }, { status: 400 });
  }

  const huddle =
    memoryStore.getHuddleByMonthKey(monthKey) ??
    (monthKey === getMonthKey() ? memoryStore.ensureCurrentHuddle() : null);

  if (!huddle) {
    return NextResponse.json({ error: "Harbor Huddle not found for that month." }, { status: 404 });
  }

  const profile = await getSessionProfile();
  const userId = profile?.id ?? (await getUserId());

  const reply = memoryStore.addHuddleReply({
    huddleId: huddle.id,
    authorName,
    userId,
    body: replyBody,
  });

  return NextResponse.json({ reply }, { status: 201 });
}
