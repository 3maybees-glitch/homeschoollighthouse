import { NextResponse } from "next/server";
import { getStripe, stripePlans, type StripePlan } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY and price IDs to .env.local." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { plan?: StripePlan };
  const plan = body.plan ?? "yearly";
  const priceId = process.env[stripePlans[plan].envKey];

  if (!priceId) {
    return NextResponse.json(
      { error: `Missing ${stripePlans[plan].envKey} environment variable.` },
      { status: 503 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const mode = plan === "lifetime" ? "payment" : "subscription";

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
    metadata: {
      plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
