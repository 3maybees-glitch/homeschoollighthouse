import type { SubscriptionTier } from "@/types/listing";
import { createClient } from "@/lib/supabase/server";

export interface SessionProfile {
  id?: string;
  email?: string;
  tier: SubscriptionTier;
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  if (process.env.DEV_PREMIUM_TIER === "true") {
    return { email: "dev@homeschoollighthouse.com", tier: "premium" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { tier: "free" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { tier: "free" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, email")
    .eq("id", user.id)
    .maybeSingle();

  const tier = (profile?.subscription_tier as SubscriptionTier | undefined) ?? "free";

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? undefined,
    tier,
  };
}

export async function getUserTier(): Promise<SubscriptionTier> {
  const profile = await getSessionProfile();
  return profile?.tier ?? "free";
}
