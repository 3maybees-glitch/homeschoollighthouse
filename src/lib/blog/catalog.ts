import { formatWeekLabel } from "@/lib/blog/week";
import { seedBlogPosts } from "@/data/seed-blog";
import type { BlogPost } from "@/types/blog";

export function getAllBlogPosts(): BlogPost[] {
  return seedBlogPosts
    .filter((post) => post.isPublished)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return getAllBlogPosts().find((post) => post.slug === slug) ?? null;
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}

export { formatWeekLabel };

