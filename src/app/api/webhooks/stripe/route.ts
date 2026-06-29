import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

async function grantPremiumAccess(input: {
  userId?: string | null;
  customerId?: string | null;
  customerEmail?: string | null;
  subscriptionId?: string | null;
  expiresAt?: string | null;
}) {
  const admin = createAdminClient();
  if (!admin) {
    console.log("Supabase admin not configured; skipping profile update.");
    return;
  }

  const payload = {
    subscription_tier: "premium",
    stripe_customer_id: input.customerId ?? undefined,
    stripe_subscription_id: input.subscriptionId ?? undefined,
    subscription_expires_at: input.expiresAt ?? null,
    updated_at: new Date().toISOString(),
  };

  if (input.userId) {
    await admin.from("profiles").update(payload).eq("id", input.userId);
    return;
  }

  if (input.customerEmail) {
    await admin.from("profiles").update(payload).eq("email", input.customerEmail);
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await grantPremiumAccess({
        userId: session.client_reference_id,
        customerId: typeof session.customer === "string" ? session.customer : null,
        customerEmail: session.customer_details?.email ?? session.customer_email,
        subscriptionId:
          typeof session.subscription === "string" ? session.subscription : null,
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      await grantPremiumAccess({
        customerId: typeof invoice.customer === "string" ? invoice.customer : null,
        customerEmail: invoice.customer_email,
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const admin = createAdminClient();
      if (admin && typeof subscription.customer === "string") {
        await admin
          .from("profiles")
          .update({
            subscription_tier: "free",
            stripe_subscription_id: null,
            subscription_expires_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", subscription.customer);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
