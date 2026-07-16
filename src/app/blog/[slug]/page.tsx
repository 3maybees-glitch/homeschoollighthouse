import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Ship } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { formatWeekLabel, getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog/catalog";
import { BlogPostContent } from "@/components/blog/blog-post-content";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Dispatch not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: post.coverImageUrl
      ? {
          title: post.title,
          description: post.excerpt,
          images: [{ url: post.coverImageUrl, alt: post.coverImageAlt ?? post.title }],
        }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/blog" className="text-sm font-semibold text-amber-700 hover:text-amber-900">
        ← Back to {brand.blog.title}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-800">
          <Ship className="h-3.5 w-3.5" />
          {brand.blog.series}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          Week of {formatWeekLabel(post.weekKey)}
        </span>
        <span>By {post.authorName}</span>
      </div>

      <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
        {post.title}
      </h1>

      <p className="mt-5 text-xl leading-8 text-slate-600">{post.excerpt}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-amber-200 hover:text-amber-800"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {post.coverImageUrl ? (
        <div className="mt-8 space-y-3">
          <a
            href="https://homeschoollighthouse.com"
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt ?? post.title}
              className="h-auto w-full"
            />
          </a>
          <p className="text-center text-sm text-slate-500">
            Visit{" "}
            <a
              href="https://homeschoollighthouse.com"
              className="font-semibold text-amber-700 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              homeschoollighthouse.com
            </a>
            {post.slug === "founding-fathers-who-were-homeschooled" ? (
              <>
                {" · "}
                <Link
                  href="/infographics/founding-fathers-homeschooled"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Download the poster
                </Link>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="mt-10 border-t border-slate-200 pt-10">
        <BlogPostContent post={post} />
      </div>
    </article>
  );
}
