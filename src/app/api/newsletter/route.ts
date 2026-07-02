import { NextResponse } from "next/server";
import { sendWelcomeNewsletterEmail } from "@/lib/email/welcome-newsletter";
import { addNewsletterSubscriber } from "@/lib/newsletter/subscribers";
import {
  fetchNewsletterSubscriber,
  getNewsletterSupabaseConfig,
} from "@/lib/newsletter/supabase-rest";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const config = getNewsletterSupabaseConfig();
  let connection: { ok: boolean; status?: number; message?: string } = { ok: false };

  if (config.configured) {
    try {
      await fetchNewsletterSubscriber("health-check@example.com");
      connection = { ok: true, status: 200 };
    } catch (error) {
      connection = {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown Supabase error",
      };
    }
  }

  return NextResponse.json({ ...config, connection });
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  let result;
  try {
    result = await addNewsletterSubscriber(email);
  } catch (error) {
    console.error("Failed to save newsletter subscriber:", error);
    return NextResponse.json(
      { error: "Unable to join the crew right now. Please try again." },
      { status: 500 },
    );
  }

  if (result.isNew) {
    const welcome = await sendWelcomeNewsletterEmail(email);
    if (!welcome.sent) {
      console.warn("Newsletter subscriber saved but welcome email was not sent:", welcome.reason);
    }
  }

  const message = result.isNew
    ? "Welcome aboard. Check your inbox for a note from the lighthouse, and watch for your first monthly Beacon Bulletin soon."
    : "You are already on the crew list. Your next Beacon Bulletin is on the way.";

  return NextResponse.json({ message }, { status: result.isNew ? 201 : 200 });
}
