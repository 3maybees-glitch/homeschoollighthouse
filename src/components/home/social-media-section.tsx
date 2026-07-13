"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Share2 } from "lucide-react";
import {
  getChannelsByPlatform,
  socialPlatformOptions,
} from "@/data/homeschool-social-media";
import type { SocialPlatform } from "@/types/social-media";
import { Button } from "@/components/ui/button";

const platformColors: Record<SocialPlatform, string> = {
  youtube: "bg-red-50 text-red-700 border-red-200",
  facebook: "bg-blue-50 text-blue-700 border-blue-200",
  instagram: "bg-pink-50 text-pink-700 border-pink-200",
  tiktok: "bg-slate-900 text-white border-slate-700",
  pinterest: "bg-red-50 text-red-800 border-red-300",
  x: "bg-slate-100 text-slate-900 border-slate-300",
};

export function SocialMediaSection() {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>("youtube");
  const channels = getChannelsByPlatform(activePlatform);
  const activeOption = socialPlatformOptions.find((p) => p.value === activePlatform)!;

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-cream)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Community Signals
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
              Top homeschool voices on social media
            </h2>
            <p className="mt-3 text-[var(--color-muted-foreground)]">
              Curated channels, groups, and accounts families trust for curriculum tips, encouragement,
              and real homeschool community — ten standouts on each platform.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/browse/social_media" className="inline-flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Browse all social media
            </Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {socialPlatformOptions.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => setActivePlatform(platform.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activePlatform === platform.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                  : "border-[var(--color-border)] bg-white/80 text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-navy-deep)]"
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">{activeOption.description}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {channels.map((channel, index) => (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-lg hover:shadow-[rgba(0,31,63,0.08)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${platformColors[channel.platform]}`}
                >
                  #{index + 1}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition group-hover:text-[var(--color-primary)]" />
              </div>
              <h3 className="mt-3 font-semibold text-[var(--color-navy-deep)] group-hover:text-[var(--color-secondary)]">
                {channel.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-[var(--color-accent)]">{channel.handle}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {channel.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
