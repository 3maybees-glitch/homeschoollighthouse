import type { Metadata } from "next";

const DEFAULT_OG_IMAGE = "/brand/homeschool-lighthouse-logo-poster.png";

export function clipMetaDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const cut = sliced.replace(/\s+\S*$/, "").trim();
  return `${cut || sliced.trim()}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  /** Path beginning with `/`, optionally including a query string. */
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: { url: string; alt: string };
  type?: "website" | "article";
  /** Root `app/page.tsx` does not receive the layout title template. */
  absoluteTitle?: boolean;
}): Metadata {
  const summary = clipMetaDescription(description);
  const imageUrl = image?.url ?? DEFAULT_OG_IMAGE;
  const imageAlt = image?.alt ?? "Homeschool Lighthouse";

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: summary,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: summary,
      url: path,
      siteName: "Homeschool Lighthouse",
      type,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [imageUrl],
    },
  };
}
