/**
 * Grant Lighthouse Premium to a user by email.
 *
 * Usage (from repo root, with Supabase credentials in env):
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/grant-premium.mjs your@email.com
 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/grant-premium.mjs <email>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
  process.env.SUPABASE_SECRET_KEY?.trim();

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin
  .from("profiles")
  .update({
    subscription_tier: "premium",
    updated_at: new Date().toISOString(),
  })
  .eq("email", email)
  .select("id, email, subscription_tier");

if (error) {
  console.error("Update failed:", error.message);
  process.exit(1);
}

if (!data?.length) {
  console.error(`No profile found for ${email}. Sign up on the site first, then rerun.`);
  process.exit(1);
}

console.log("Premium granted:", data[0]);
