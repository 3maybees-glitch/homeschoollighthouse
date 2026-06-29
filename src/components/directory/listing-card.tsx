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
    <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge>{typeLabel}</Badge>
              {listing.isFeatured ? <Badge className="bg-amber-500 text-white">Bright Beacon</Badge> : null}
            </div>
            <CardTitle>
              <Link href={`/listing/${listing.slug}`} className="hover:text-amber-700">
                {listing.title}
              </Link>
            </CardTitle>
            <CardDescription>{listing.shortDescription}</CardDescription>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
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
            <Badge key={philosophy} className="bg-slate-100 text-slate-700">
              {philosophy.replaceAll("_", " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
