import { NextResponse } from "next/server";
import {
  sendAdvertiseInquiryEmail,
  type AdvertiseInquiry,
} from "@/lib/email/advertise-inquiry";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const allowedPlans = new Set(["monthly", "yearly", "upsell"]);

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AdvertiseInquiry>;

  const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
  const contactName = typeof body.contactName === "string" ? body.contactName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const plan = body.plan;

  if (!businessName || !contactName) {
    return NextResponse.json(
      { error: "Please share your business and contact name." },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!plan || !allowedPlans.has(plan)) {
    return NextResponse.json({ error: "Please choose a plan interest." }, { status: 400 });
  }

  const inquiry: AdvertiseInquiry = {
    businessName,
    contactName,
    email,
    website: website || undefined,
    plan,
    message: message || undefined,
  };

  try {
    const result = await sendAdvertiseInquiryEmail(inquiry);
    if (!result.sent) {
      console.warn("Bright Beacon inquiry received but email was not sent:", result.reason);
      console.info("Bright Beacon inquiry:", inquiry);
    }
  } catch (error) {
    console.error("Failed to process Bright Beacon inquiry:", error);
    return NextResponse.json(
      { error: "Unable to send your inquiry right now. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Thanks — your Bright Beacon inquiry is on its way to the lighthouse crew. We’ll follow up shortly.",
    },
    { status: 201 },
  );
}
