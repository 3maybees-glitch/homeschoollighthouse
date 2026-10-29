/** Public production origin. The apex host redirects here. */
export const CANONICAL_ORIGIN = "https://www.homeschoollighthouse.com";

const APEX_HOST = "homeschoollighthouse.com";
const CANONICAL_HOST = "www.homeschoollighthouse.com";

/**
 * Origin used for sitemap, robots, canonical URLs, and outbound links.
 * The production apex host is always rewritten to www. Local and preview
 * hosts are left alone.
 */
export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return process.env.NODE_ENV === "production" ? CANONICAL_ORIGIN : "http://localhost:3000";
  }

  try {
    const url = new URL(raw);
    if (url.hostname === APEX_HOST || url.hostname === CANONICAL_HOST) {
      return CANONICAL_ORIGIN;
    }
    return url.origin;
  } catch {
    return process.env.NODE_ENV === "production" ? CANONICAL_ORIGIN : "http://localhost:3000";
  }
}

/** Returns the www origin when `hostname` is the bare apex domain. */
export function canonicalOriginForHost(hostname: string) {
  return hostname.toLowerCase() === APEX_HOST ? CANONICAL_ORIGIN : null;
}
