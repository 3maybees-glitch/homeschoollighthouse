import Link from "next/link";
import { ArrowRight, ArrowUpRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandSocial } from "@/lib/brand-social";
import {
  getSocialPlatformGroups,
  getTotalSocialChannelCount,
} from "@/data/homeschool-social-media";
import { PlatformIcon } from "@/components/social/platform-icon";
import { XTimelineEmbed } from "@/components/social/x-timeline-embed";
import type { SocialPlatformGroup } from "@/types/social-media";

const PREVIEW_COUNT = 3;

function PlatformPreviewCard({ group }: { group: SocialPlatformGroup }) {
  return (
    <div
      id={`social-${group.platform}`}
      className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10">
            <PlatformIcon platform={group.platform} className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-navy-deep)]">{group.label}</h3>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Top {group.channels.length} homeschool picks
            </p>
          </div>
        </div>
        <Link
          href={`/social#${group.platform}`}
          className="text-sm font-medium text-[var(--color-primary)] transition hover:text-[var(--color-secondary)]"
        >
          See all
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {group.channels.slice(0, PREVIEW_COUNT).map((channel) => (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-transparent px-3 py-2 transition hover:border-[var(--color-border)] hover:bg-[var(--color-cream)]/60"
          >
            <p className="font-medium text-[var(--color-navy-deep)]">{channel.name}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
              {channel.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export function SocialHarborsPreview() {
  const groups = getSocialPlatformGroups();
  const totalChannels = getTotalSocialChannelCount();
  const { handle, url } = brandSocial.x;

  return (
    <section className="border-y border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,252,247,0.9),rgba(255,255,255,0.95))]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Social Harbors
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
              Find your fleet online
            </h2>
            <p className="mt-3 text-[var(--color-muted-foreground)]">
              Top homeschool groups, channels, and communities on every major platform — curated with
              short descriptions so you know what each one offers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <PlatformIcon platform="x" className="h-4 w-4" />
                Follow @{handle}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/social">
                View all {totalChannels} channels
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-navy-deep)] text-white shadow-sm">
          <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col justify-between gap-6 px-5 py-6 sm:px-6 sm:py-7">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-beam)]">
                  <PlatformIcon platform="x" className="h-3.5 w-3.5" color="currentColor" />
                  From our deck
                </p>
                <h3 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
                  Latest posts from @{handle}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
                  Fresh beacons, resource finds, and fair-winds notes from Homeschool Lighthouse on X.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Follow @{handle}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
                >
                  <Link href="/social#lighthouse-signals">Open full X feed</Link>
                </Button>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[var(--color-cream)] p-4 text-[var(--color-navy-deep)] sm:p-5 lg:border-l lg:border-t-0">
              <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                <XTimelineEmbed height={420} className="min-h-[280px]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <PlatformPreviewCard key={group.platform} group={group} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Radio className="h-4 w-4 text-[var(--color-accent)]" />
          <span>
            {groups.length} platforms · {totalChannels} curated channels · updated for homeschool families
          </span>
        </div>
      </div>
    </section>
  );
}
