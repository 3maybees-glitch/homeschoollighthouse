import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getServiceRoleKey() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
    process.env.SUPABASE_SECRET_KEY?.trim();
  return key || undefined;
}

function isJwtApiKey(apiKey: string) {
  return apiKey.startsWith("eyJ");
}

function createSupabaseFetch(apiKey: string): typeof fetch {
  return async (input, init = {}) => {
    const headers = new Headers(init.headers);
    headers.set("apikey", apiKey);

    if (isJwtApiKey(apiKey)) {
      headers.set("Authorization", `Bearer ${apiKey}`);
    } else {
      headers.delete("Authorization");
    }

    return fetch(input, { ...init, headers });
  };
}

export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = getServiceRoleKey();
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: createSupabaseFetch(serviceRoleKey),
    },
  });
}
