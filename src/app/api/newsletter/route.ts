import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store/memory-store";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  memoryStore.addNewsletterSubscriber(email);

  return NextResponse.json(
    {
      message: "Welcome aboard. You are on the crew list for weekly beacons and homeschool guidance.",
    },
    { status: 201 },
  );
}
