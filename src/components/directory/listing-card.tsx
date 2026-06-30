import Link from "next/link";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatAgeRange, formatPrice } from "@/lib/utils";
import type { Listing } from "@/types/listing";
import { listingTypeOptions } from "@/lib/directory/filter-config";

export function ListingCard({ listing }: { listing: Listing }) {
  const typeLabel =
    listingTypeOptions.find((option) => option.value === listing.listingType)?.label ??
    listing.listingType;

  return (
    <Card className="group h-full border-[var(--color-border)] bg-white transition hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-lg hover:shadow-[rgba(0,31,63,0.08)]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                {typeLabel}
              </Badge>
              {listing.isFeatured ? (
                <Badge className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
                  Bright Beacon
                </Badge>
              ) : null}
            </div>
            <CardTitle>
              <Link
                href={`/listing/${listing.slug}`}
                className="font-display text-[var(--color-navy-deep)] transition group-hover:text-[var(--color-secondary)]"
              >
                {listing.title}
              </Link>
            </CardTitle>
            <CardDescription>{listing.shortDescription}</CardDescription>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition group-hover:text-[var(--color-primary)]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-[var(--color-primary)] text-[var(--color-primary)]" />
            {listing.ratingAvg.toFixed(1)} ({listing.ratingCount})
          </span>
          <span>{formatPrice(listing.priceMin, listing.priceMax, listing.priceType)}</span>
          <span>{formatAgeRange(listing.ageMin, listing.ageMax)}</span>
        </div>
        {listing.state ? (
          <p className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {listing.city ? `${listing.city}, ` : ""}
            {listing.state}
          </p>
        ) : (
          <p>Virtual / Nationwide</p>
        )}
        <div className="flex flex-wrap gap-2">
          {listing.philosophies.slice(0, 3).map((philosophy) => (
            <Badge key={philosophy} className="bg-[var(--color-muted)]/60 text-[var(--color-muted-foreground)]">
              {philosophy.replaceAll("_", " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
