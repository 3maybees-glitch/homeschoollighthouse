import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Star } from "lucide-react";
import { getListingBySlug } from "@/data/seed-listings";
import { brand } from "@/lib/brand-vocabulary";
import { listingTypeOptions } from "@/lib/directory/filter-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAgeRange, formatPrice } from "@/lib/utils";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const typeLabel =
    listingTypeOptions.find((option) => option.value === listing.listingType)?.label ??
    listing.listingType;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Link href="/browse" className="text-sm font-medium text-amber-700 hover:underline">
          ← Back to {brand.browse.title}
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{typeLabel}</Badge>
            <Badge className="bg-slate-100 text-slate-700">{listing.format.replace("_", " ")}</Badge>
            {listing.isFeatured ? <Badge className="bg-amber-500 text-white">Bright Beacon</Badge> : null}
          </div>
          <CardTitle className="text-3xl">{listing.title}</CardTitle>
          <p className="text-slate-600">{listing.shortDescription}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {listing.ratingAvg.toFixed(1)} ({listing.ratingCount} signals)
            </span>
            <span>{formatPrice(listing.priceMin, listing.priceMax, listing.priceType)}</span>
            <span>{formatAgeRange(listing.ageMin, listing.ageMax)}</span>
            {listing.state ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.city ? `${listing.city}, ` : ""}
                {listing.state}
              </span>
            ) : (
              <span>Virtual / Nationwide</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="text-base leading-7 text-slate-700">{listing.description}</p>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoBlock title="Philosophies" items={listing.philosophies} />
            <InfoBlock title="Values" items={listing.values} />
            <InfoBlock title="Religious Affiliation" items={listing.religions} />
            <InfoBlock title="Subjects" items={listing.subjects} />
          </div>

          <Button asChild size="lg">
            <a href={listing.websiteUrl} target="_blank" rel="noreferrer">
              Visit Resource <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <Badge key={item} className="bg-white text-slate-700">
              {item.replaceAll("_", " ")}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-500">Not specified</span>
        )}
      </div>
    </div>
  );
}
