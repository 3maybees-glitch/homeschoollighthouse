import type { SubscriptionTier } from "@/types/listing";

export interface SessionProfile {
  email?: string;
  tier: SubscriptionTier;
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  // Premium can be toggled during development via env for testing.
  if (process.env.DEV_PREMIUM_TIER === "true") {
    return { email: "dev@homeschoollighthouse.com", tier: "premium" };
  }

  // Supabase session lookup will be wired when env vars are configured.
  return { tier: "free" };
}

export async function getUserTier(): Promise<SubscriptionTier> {
  const profile = await getSessionProfile();
  return profile?.tier ?? "free";
}
