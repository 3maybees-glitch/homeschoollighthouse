import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { memoryStore } from "@/lib/store/memory-store";
import type { NavigatorEntitlement } from "@/types/navigator";

export async function getNavigatorEntitlement(userId?: string | null): Promise<NavigatorEntitlement> {
  if (process.env.DEV_NAVIGATOR_ACCESS === "true" || process.env.DEV_PREMIUM_TIER === "true") {
    return { hasAccess: true, purchasedAt: new Date().toISOString() };
  }

  const profile = await getSessionProfile();
  const email = profile?.email?.toLowerCase();
  const ownerEmails = (process.env.OWNER_PREMIUM_EMAILS ?? "3maybees@gmail.com")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (email && ownerEmails.includes(email)) {
    return { hasAccess: true, purchasedAt: new Date().toISOString() };
  }

  const id = userId ?? profile?.id;
  if (!id) {
    return { hasAccess: false };
  }

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("profiles")
      .select("navigator_purchased_at, navigator_stripe_payment_id")
      .eq("id", id)
      .maybeSingle();

    if (data?.navigator_purchased_at) {
      return {
        hasAccess: true,
        purchasedAt: data.navigator_purchased_at,
        stripePaymentId: data.navigator_stripe_payment_id,
      };
    }
  }

  const memory = memoryStore.getNavigatorEntitlement(id);
  if (memory?.hasAccess) return memory;

  return { hasAccess: false };
}

export async function grantNavigatorAccess(input: {
  userId?: string | null;
  email?: string | null;
  paymentId?: string | null;
}) {
  const purchasedAt = new Date().toISOString();

  if (input.userId) {
    memoryStore.grantNavigatorEntitlement(input.userId, {
      hasAccess: true,
      purchasedAt,
      stripePaymentId: input.paymentId,
    });
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  if (!admin) return;

  const payload = {
    navigator_purchased_at: purchasedAt,
    navigator_stripe_payment_id: input.paymentId ?? null,
    updated_at: purchasedAt,
  };

  if (input.userId) {
    await admin.from("profiles").update(payload).eq("id", input.userId);
    return;
  }

  if (input.email) {
    await admin.from("profiles").update(payload).eq("email", input.email);
  }
}
