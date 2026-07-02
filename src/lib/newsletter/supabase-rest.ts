function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return undefined;
  return url.replace(/\/+$/, "");
}

function getServiceRoleKey() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
    process.env.SUPABASE_SECRET_KEY?.trim();
  return key || undefined;
}

function isJwtApiKey(apiKey: string) {
  return apiKey.startsWith("eyJ");
}

function getAdminHeaders(apiKey: string, extra: Record<string, string> = {}) {
  const headers: Record<string, string> = {
    apikey: apiKey,
    ...extra,
  };

  if (isJwtApiKey(apiKey)) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function getKeyFormat(apiKey?: string) {
  if (!apiKey) return "missing";
  if (apiKey.startsWith("eyJ")) return "legacy-jwt";
  if (apiKey.startsWith("sb_secret_")) return "secret";
  if (apiKey.startsWith("sb_publishable_")) return "publishable-in-service-slot";
  return "unknown";
}

export function getNewsletterSupabaseConfig() {
  const url = getSupabaseUrl();
  const apiKey = getServiceRoleKey();

  let urlHost: string | null = null;
  if (url) {
    try {
      urlHost = new URL(url).host;
    } catch {
      urlHost = "invalid-url";
    }
  }

  return {
    configured: Boolean(url && apiKey),
    urlPresent: Boolean(url),
    keyPresent: Boolean(apiKey),
    urlHost,
    keyFormat: getKeyFormat(apiKey),
  };
}

type NewsletterRow = {
  id: string;
  email: string;
  created_at: string;
};

export async function fetchNewsletterSubscriber(email: string) {
  const url = getSupabaseUrl();
  const apiKey = getServiceRoleKey();
  if (!url || !apiKey) return { row: null as NewsletterRow | null, configured: false };

  const endpoint = new URL(`${url}/rest/v1/newsletter_subscribers`);
  endpoint.searchParams.set("select", "id,email,created_at");
  endpoint.searchParams.set("email", `eq.${email}`);

  const response = await fetch(endpoint, {
    headers: getAdminHeaders(apiKey, {
      Accept: "application/json",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Supabase read failed with status ${response.status}`);
  }

  const rows = (await response.json()) as NewsletterRow[];
  return { row: rows[0] ?? null, configured: true };
}

export async function insertNewsletterSubscriber(email: string) {
  const url = getSupabaseUrl();
  const apiKey = getServiceRoleKey();
  if (!url || !apiKey) return { row: null as NewsletterRow | null, configured: false };

  const response = await fetch(`${url}/rest/v1/newsletter_subscribers`, {
    method: "POST",
    headers: getAdminHeaders(apiKey, {
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Supabase insert failed with status ${response.status}`);
  }

  const rows = (await response.json()) as NewsletterRow[];
  return { row: rows[0] ?? null, configured: true };
}
