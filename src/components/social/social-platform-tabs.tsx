"use client";

import { useEffect, useState } from "react";
import type { SocialPlatform, SocialPlatformGroup } from "@/types/social-media";
import { PlatformIcon } from "@/components/social/platform-icon";
import { SocialChannelCard } from "@/components/social/social-channel-card";

function platformFromHash(hash: string, groups: SocialPlatformGroup[]): SocialPlatform | null {
  const value = hash.replace("#", "");
  if (!value) return null;
  return groups.some((group) => group.platform === value) ? (value as SocialPlatform) : null;
}

export function SocialPlatformTabs({ groups }: { groups: SocialPlatformGroup[] }) {
  const [activePlatform, setActivePlatform] = useState(groups[0]?.platform ?? "facebook");

  useEffect(() => {
    const syncFromHash = () => {
      const platform = platformFromHash(window.location.hash, groups);
      if (platform) setActivePlatform(platform);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [groups]);

  const selectPlatform = (platform: SocialPlatform) => {
    setActivePlatform(platform);
    window.history.replaceState(null, "", `#${platform}`);
  };

  const activeGroup = groups.find((group) => group.platform === activePlatform) ?? groups[0];

  if (!activeGroup) return null;

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {groups.map((group) => {
          const isActive = group.platform === activePlatform;
          return (
            <button
              key={group.platform}
              type="button"
              onClick={() => selectPlatform(group.platform)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-navy-deep)] shadow-sm"
                  : "border-[var(--color-border)] bg-white text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-cream)]"
              }`}
            >
              <PlatformIcon platform={group.platform} className="h-4 w-4" />
              {group.label}
            </button>
          );
        })}
      </div>

      <div
        id={activeGroup.platform}
        className="mt-8 scroll-mt-24 rounded-3xl border border-[var(--color-border)] bg-[var(--color-cream)]/50 p-6 sm:p-8"
      >
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
          {activeGroup.tagline}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {activeGroup.channels.map((channel, index) => (
            <SocialChannelCard key={channel.id} channel={channel} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
