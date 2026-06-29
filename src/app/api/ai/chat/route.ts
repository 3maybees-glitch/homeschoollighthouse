import { NextResponse } from "next/server";
import { generateAiReply } from "@/lib/ai/recommend";
import { getUserTier } from "@/lib/auth/session";

export async function POST(request: Request) {
  const tier = await getUserTier();
  if (tier !== "premium") {
    return NextResponse.json(
      { error: "Follow the Light is a premium feature. Unlock the Full Beam to continue." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const query = body.message?.trim();
  if (!query) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const result = await generateAiReply(query);
  return NextResponse.json(result);
}
