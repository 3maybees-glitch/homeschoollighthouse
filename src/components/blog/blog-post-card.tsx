import Link from "next/link";
import { CalendarDays, Ship } from "lucide-react";
import { formatWeekLabel } from "@/lib/blog/catalog";
import type { BlogPost } from "@/types/blog";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-3xl border bg-white/90 p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-800">
          <Ship className="h-3.5 w-3.5" />
          Fair Winds Weekly
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          Week of {formatWeekLabel(post.weekKey)}
        </span>
      </div>

      {post.coverImageUrl ? (
        <Link href={`/blog/${post.slug}`} className="mt-4 block overflow-hidden rounded-2xl border border-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt ?? post.title}
            className="aspect-[4/3] w-full object-cover object-top"
          />
        </Link>
      ) : null}

      <h2 className="mt-4 font-display text-2xl font-bold text-slate-950">
        <Link href={`/blog/${post.slug}`} className="hover:text-amber-800">
          {post.title}
        </Link>
      </h2>

      <p className="mt-3 text-slate-600">{post.excerpt}</p>

      <div className="mt-5 flex flex-wrap gap-2">
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

      <Link
        href={`/blog/${post.slug}`}
        className="mt-5 inline-flex text-sm font-semibold text-amber-700 hover:text-amber-900"
      >
        Read the dispatch →
      </Link>
    </article>
  );
}
