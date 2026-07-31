import type { MetadataRoute } from "next";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import { getAllBlogSlugs } from "@/lib/blog/catalog";
import { getAllListingSlugs } from "@/lib/listings/catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://homeschoollighthouse.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/browse", "/social", "/lighthouse-library", "/credit-logbook", "/navigator", "/navigator/sample", "/harbors", "/harbor-huddle", "/blog", "/pricing", "/advertise", "/submit", "/ai", "/account"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryRoutes = listingTypeOptions.map((option) => ({
    url: `${siteUrl}/browse/${option.value}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const listingRoutes = getAllListingSlugs().map((slug) => ({
    url: `${siteUrl}/listing/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = getAllBlogSlugs().map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...listingRoutes, ...blogRoutes];
}
