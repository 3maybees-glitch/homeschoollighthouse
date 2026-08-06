import { HomeHero } from "@/components/home/home-hero";
import { BrightBeaconsSection } from "@/components/home/bright-beacons-section";
import { NavigatorPromo } from "@/components/home/navigator-promo";
import { FaithFreedomMapsPromo } from "@/components/home/faith-freedom-maps-promo";
import { CategoryCards } from "@/components/home/category-cards";
import { SocialHarborsPreview } from "@/components/home/social-harbors-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PricingBand } from "@/components/home/pricing-band";

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <BrightBeaconsSection />
      <NavigatorPromo />
      <FaithFreedomMapsPromo />
      <CategoryCards />
      <SocialHarborsPreview />
      <TestimonialsSection />
      <PricingBand />
    </div>
  );
}
