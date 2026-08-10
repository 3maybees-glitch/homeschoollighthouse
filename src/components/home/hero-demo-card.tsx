import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import type { HeroDemoListing } from "@/lib/home/hero-demo";
import { formatAgeRange, formatPrice } from "@/lib/utils";

const typeAccent: Record<string, string> = {
  curriculum: "from-[#e6b422]/35 to-[#2a9d8f]/25",
  online_course: "from-[#2a9d8f]/35 to-[#001f3f]/20",
  scholarship: "from-[#ffd966]/40 to-[#e6b422]/20",
  standardized_test: "from-[#c5d4e3]/50 to-[#2a9d8f]/20",
  coop: "from-[#2a9d8f]/30 to-[#ffd966]/20",
  supplement: "from-[#e6b422]/30 to-[#c5d4e3]/30",
};

type HeroDemoCardProps = {
  listing: HeroDemoListing;
  compact?: boolean;
};

export function HeroDemoCard({ listing, compact = false }: HeroDemoCardProps) {
  const typeLabel =
    listingTypeOptions.find((option) => option.value === listing.listingType)?.label ??
    listing.listingType;
  const accent = typeAccent[listing.listingType] ?? "from-[#e6b422]/30 to-[#2a9d8f]/20";
  const initial = listing.title.trim().charAt(0).toUpperCase() || "H";

  if (compact) {
    return (
      <Link
        href={`/listing/${listing.slug}`}
        className="flex min-w-[16.5rem] max-w-[18rem] shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur transition hover:border-[var(--color-beam)]/45 hover:bg-white/15"
      >
        <DemoThumb listing={listing} accent={accent} initial={initial} size={44} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{listing.title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-300">
            {typeLabel} · {formatAgeRange(listing.ageMin, listing.ageMax)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex gap-3 rounded-2xl border border-white/12 bg-white/[0.08] p-3 backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--color-beam)]/40 hover:bg-white/[0.12]"
    >
      <DemoThumb listing={listing} accent={accent} initial={initial} size={56} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-display text-sm font-semibold text-white transition group-hover:text-[var(--color-beam)] sm:text-base">
            {listing.title}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--color-beam)]">
            <Star className="h-3 w-3 fill-[var(--color-beam)]" aria-hidden="true" />
            {listing.ratingAvg.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-300">
          {listing.shortDescription}
        </p>
        <p className="mt-2 truncate text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate-400">
          {typeLabel}
          <span className="mx-1.5 text-white/20">·</span>
          {formatAgeRange(listing.ageMin, listing.ageMax)}
          <span className="mx-1.5 text-white/20">·</span>
          {formatPrice(listing.priceMin, listing.priceMax, listing.priceType)}
        </p>
      </div>
    </Link>
  );
}

function DemoThumb({
  listing,
  accent,
  initial,
  size,
}: {
  listing: HeroDemoListing;
  accent: string;
  initial: string;
  size: number;
}) {
  if (listing.coverImageUrl) {
    return (
      <span
        className="relative shrink-0 overflow-hidden rounded-xl bg-white/95 shadow-md shadow-black/20"
        style={{ width: size, height: size }}
      >
        <Image
          src={listing.coverImageUrl}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain p-1"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} font-display text-lg font-semibold text-white shadow-md shadow-black/20`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
