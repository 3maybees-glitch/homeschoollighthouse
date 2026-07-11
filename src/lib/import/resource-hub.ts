import type { ListingType } from "@/types/listing";
import { normalizeHost } from "@/lib/import/thsm-csv";

const RESOURCE_HUB_HOSTS = new Set([
  "thehomeschoolmom.com",
  "homeschool.com",
  "homeschoolreviews.com",
  "freedomhomeschooling.com",
  "homeschooling.gomilpitas.com",
  "a2zhomeschooling.com",
]);

export function isResourceHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = normalizeHost(url);
    const path = parsed.pathname.toLowerCase().replace(/\/$/, "") || "/";

    if (host === "marketplace.homeschool.com") return true;

    if (host === "home-school.com") {
      return path === "/world" || path.endsWith("/world");
    }

    return RESOURCE_HUB_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function inferListingTypeWithHubCheck(
  url: string,
  fallback: ListingType,
): ListingType {
  return isResourceHubUrl(url) ? "resource_hub" : fallback;
}
