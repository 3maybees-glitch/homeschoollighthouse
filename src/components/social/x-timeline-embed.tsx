"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
import { ArrowUpRight } from "lucide-react";
import { brandSocial } from "@/lib/brand-social";
import { PlatformIcon } from "@/components/social/platform-icon";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

type XTimelineEmbedProps = {
  height?: number;
  className?: string;
};

export function XTimelineEmbed({ height = 560, className }: XTimelineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const { handle, url } = brandSocial.x;
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady) return;
    window.twttr?.widgets?.load(containerRef.current);
  }, [handle, height, scriptReady]);

  return (
    <div ref={containerRef} className={className} data-x-embed={reactId}>
      <a
        className="twitter-timeline block px-4 py-5 text-[var(--color-navy-deep)] no-underline"
        href={url}
        data-height={String(height)}
        data-theme="light"
        data-chrome="noheader nofooter noborders transparent"
        data-dnt="true"
      >
        <span className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <PlatformIcon platform="x" className="h-4 w-4" color="currentColor" />
          </span>
          <span>
            <span className="block font-semibold">Posts from @{handle}</span>
            <span className="mt-1 flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
              Open the live timeline on X
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </span>
      </a>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptReady(true);
          window.twttr?.widgets?.load(containerRef.current);
        }}
      />
    </div>
  );
}
