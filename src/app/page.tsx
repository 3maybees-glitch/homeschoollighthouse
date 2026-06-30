import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { getFeaturedListings } from "@/lib/listings/catalog";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/directory/listing-card";
import { HomeHero } from "@/components/home/home-hero";
import { CategoryCards } from "@/components/home/category-cards";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PricingBand } from "@/components/home/pricing-band";

export default function HomePage() {
  const featured = getFeaturedListings(6);

  return (
    <div>
      <HomeHero />

      <section id="beacons" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {brand.featured}
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
              {brand.featuredSubtitle}
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-muted-foreground)]">
              Trusted resources families love, hand-picked from our directory of{" "}
              {brand.stats.listings} listings.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/browse?featured=1">View all beacons</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <CategoryCards />
      <TestimonialsSection />
      <PricingBand />
    </div>
  );
}
