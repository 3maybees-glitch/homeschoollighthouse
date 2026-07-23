import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { brandSocial } from "@/lib/brand-social";
import { Button } from "@/components/ui/button";
import {
  getSocialPlatformGroups,
  getTotalSocialChannelCount,
} from "@/data/homeschool-social-media";
import { SocialPlatformTabs } from "@/components/social/social-platform-tabs";
import { LighthouseSignals } from "@/components/social/lighthouse-signals";

export const metadata: Metadata = {
  title: "Homeschool Social Media Communities",
  description:
    "Top homeschool Facebook groups, YouTube channels, Instagram accounts, TikTok creators, Pinterest boards, Reddit communities, Discord servers, and X accounts — plus live posts from Homeschool Lighthouse on X.",
};

export default function SocialPage() {
  const groups = getSocialPlatformGroups();
  const totalChannels = getTotalSocialChannelCount();

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            Social Harbors
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Homeschool communities on every platform
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {totalChannels} curated groups, channels, and accounts across {groups.length} platforms.
            Each listing includes a short description of what content and community you can expect.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="#lighthouse-signals">See our X posts</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
              <a href={brandSocial.x.url} target="_blank" rel="noopener noreferrer">
                Follow @{brandSocial.x.handle}
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <LighthouseSignals />
        <SocialPlatformTabs groups={groups} />

        <section className="mt-16 rounded-3xl border border-[var(--color-border)] bg-[var(--color-cream)]/60 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-navy-deep)]">
            Know a great homeschool community we missed?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted-foreground)]">
            Send us a signal and we&apos;ll consider adding it to the directory.
          </p>
          <Button asChild className="mt-6">
            <Link href="/submit">{brand.submit.title}</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
