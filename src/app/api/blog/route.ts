import { NextResponse } from "next/server";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const tag = searchParams.get("tag")?.trim().toLowerCase();

  if (slug) {
    const post = getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }
    return NextResponse.json({ post });
  }

  const posts = getAllBlogPosts().filter((post) => !tag || post.tags.includes(tag));

  return NextResponse.json({
    posts,
    tags: Array.from(new Set(getAllBlogPosts().flatMap((post) => post.tags))).sort(),
  });
}
