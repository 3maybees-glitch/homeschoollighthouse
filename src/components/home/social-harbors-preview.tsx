import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSocialPlatformGroups,
  getTotalSocialChannelCount,
} from "@/data/homeschool-social-media";
import { PlatformIcon } from "@/components/social/platform-icon";

const PREVIEW_COUNT = 3;

export function SocialHarborsPreview() {
  const groups = getSocialPlatformGroups();
  const totalChannels = getTotalSocialChannelCount();

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
              <Link href="/social#lighthouse-signals">
                <PlatformIcon platform="x" className="h-4 w-4" />
                Our X posts
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/social">
                View all {totalChannels} channels
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <div
              key={group.platform}
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
