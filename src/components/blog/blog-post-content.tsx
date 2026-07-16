import type { BlogPost } from "@/types/blog";
import type { ReactNode } from "react";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

function renderParagraph(text: string): ReactNode[] {
  return text.split(URL_PATTERN).map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      const label = part.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          className="font-semibold text-amber-700 underline-offset-2 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      );
    }
    return <span key={`${part.slice(0, 24)}-${index}`}>{part}</span>;
  });
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <div className="prose prose-slate max-w-none">
      {post.body.map((paragraph) => {
        if (paragraph.startsWith("IMAGE:")) {
          const [, src, alt = ""] = paragraph.split("|");
          return (
            <figure key={src} className="my-8 not-prose">
              <a href="https://homeschoollighthouse.com" target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || post.title}
                  className="w-full rounded-2xl border border-slate-200 shadow-sm"
                />
              </a>
              <figcaption className="mt-3 text-center text-sm text-slate-500">
                Visit{" "}
                <a
                  href="https://homeschoollighthouse.com"
                  className="font-semibold text-amber-700 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  homeschoollighthouse.com
                </a>{" "}
                to find trusted homeschool resources.
              </figcaption>
            </figure>
          );
        }

        return (
          <p
            key={paragraph.slice(0, 48)}
            className="mt-5 text-lg leading-8 text-slate-700 first:mt-0"
          >
            {renderParagraph(paragraph)}
          </p>
        );
      })}
    </div>
  );
}
