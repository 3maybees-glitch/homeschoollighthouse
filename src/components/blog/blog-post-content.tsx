import type { BlogPost } from "@/types/blog";

export function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <div className="prose prose-slate max-w-none">
      {post.body.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-5 text-lg leading-8 text-slate-700 first:mt-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
