import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { getAllBlogPosts } from "@/lib/blog/catalog";
import { BlogPostCard } from "@/components/blog/blog-post-card";

export const metadata = {
  title: brand.blog.title,
  description: brand.blog.subtitle,
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const activeTag = params.tag?.trim().toLowerCase();
  const allPosts = getAllBlogPosts();
  const posts = activeTag
    ? allPosts.filter((post) => post.tags.includes(activeTag))
    : allPosts;

  const allTags = Array.from(new Set(allPosts.flatMap((post) => post.tags))).sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        {brand.blog.series}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-slate-950">{brand.blog.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{brand.blog.subtitle}</p>

      {allTags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              !activeTag
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:text-amber-800"
            }`}
          >
            All dispatches
          </Link>
          {allTags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:text-amber-800"
                }`}
              >
                #{tag}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="mt-10 space-y-6">
        {posts.length === 0 ? (
          <div className="rounded-3xl border bg-white/90 p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-900">No dispatches found for that tag.</p>
            <p className="mt-2 text-slate-600">Try another tag or browse all weekly posts.</p>
            <Link href="/blog" className="mt-4 inline-flex text-sm font-semibold text-amber-700 hover:text-amber-900">
              View all dispatches →
            </Link>
          </div>
        ) : (
          posts.map((post) => <BlogPostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
