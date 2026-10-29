import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, isOneTimePlan, resolveNavigatorPriceId, stripePlans, type StripePlan } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

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
  if (!(plan in stripePlans)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const priceId = process.env[stripePlans[plan].envKey];

  if (!priceId) {
    return NextResponse.json(
      { error: `Missing ${stripePlans[plan].envKey} environment variable.` },
      { status: 503 },
    );
  }

  let checkoutPriceId = priceId;
  if (plan === "navigator") {
    try {
      const resolved = await resolveNavigatorPriceId(stripe, priceId);
      if (!resolved) {
        return NextResponse.json(
          {
            error:
              "The Navigator checkout is not using the current $47 price, so no charge was started.",
          },
          { status: 503 },
        );
      }
      checkoutPriceId = resolved;
    } catch (error) {
      console.error("Navigator price lookup failed", error);
      return NextResponse.json(
        {
          error: "The Navigator price could not be confirmed, so no charge was started.",
        },
        { status: 503 },
      );
    }
  }

  const siteUrl = getSiteUrl();
  const mode = isOneTimePlan(plan) ? "payment" : "subscription";
  const successUrl =
    plan === "navigator"
      ? `${siteUrl}/navigator?checkout=success`
      : `${siteUrl}/account?checkout=success`;
  const cancelUrl =
    plan === "navigator"
      ? `${siteUrl}/navigator?checkout=cancelled`
      : `${siteUrl}/pricing?checkout=cancelled`;

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: checkoutPriceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user?.id,
    customer_email: user?.email ?? undefined,
    metadata: {
      plan,
      user_id: user?.id ?? "",
    },
  });

  return NextResponse.json({ url: session.url });
}
