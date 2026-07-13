import { ExternalLink } from "lucide-react";
import type { SocialChannel } from "@/types/social-media";

export function SocialChannelCard({
  channel,
  rank,
}: {
  channel: SocialChannel;
  rank?: number;
}) {
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-lg hover:shadow-[rgba(0,31,63,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {rank ? (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              #{rank}
            </span>
          ) : null}
          <h3 className="mt-1 font-semibold text-[var(--color-navy-deep)] group-hover:text-[var(--color-primary)]">
            {channel.name}
          </h3>
          {channel.handle ? (
            <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">{channel.handle}</p>
          ) : null}
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] opacity-0 transition group-hover:opacity-100" />
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
        {channel.description}
      </p>

      {channel.memberCount ? (
        <p className="mt-4 text-xs font-medium text-[var(--color-secondary)]">{channel.memberCount}</p>
      ) : null}
    </a>
  );
}
