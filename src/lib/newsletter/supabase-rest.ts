function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
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
