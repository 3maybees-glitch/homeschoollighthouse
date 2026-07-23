"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";
import { brandSocial } from "@/lib/brand-social";

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

  useEffect(() => {
    window.twttr?.widgets?.load(containerRef.current);
  }, [handle, height]);

  return (
    <div ref={containerRef} className={className} data-x-embed={reactId}>
      <a
        className="twitter-timeline"
        href={url}
        data-height={String(height)}
        data-theme="light"
        data-chrome="noheader nofooter noborders transparent"
        data-dnt="true"
      >
        Posts from @{handle}
      </a>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.twttr?.widgets?.load(containerRef.current);
        }}
      />
    </div>
  );
}
