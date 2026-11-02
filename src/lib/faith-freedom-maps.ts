/**
 * Soft-sell config for Maybee Creations Faith & Freedom World Maps
 * on the Maybee Creations Shopify store (shop.maybeecreations.com).
 * Fans / Future product lines are intentionally excluded.
 */
export const faithFreedomMaps = {
  brandName: "Maybee Creations",
  productName: "Faith & Freedom World Maps",
  eyebrow: "Chart Table pick",
  headline: "Faith & Freedom World Maps",
  body: "Printable discovery maps for Bible study and American liberty — Soul Explorer and Liberty Explorer only. A quiet recommendation from the Lighthouse crew for families who learn with maps in hand.",
  shopUrl: "https://shop.maybeecreations.com/",
  faith: {
    label: "Faith maps",
    description: "Soul Explorer Bible world maps",
    // Shopify "Faith" collection (Soul Explorer Bible maps)
    url: "https://shop.maybeecreations.com/collections/faith",
  },
  freedom: {
    label: "Freedom maps",
    description: "Liberty Explorer history maps",
    // Shopify "Freedom" collection (Liberty Explorer history maps)
    url: "https://shop.maybeecreations.com/collections/freedom",
  },
  coverImageUrl: "/logos/maybee-creations.jpg",
  mapPreviewUrl: "/logos/maybee-madison-map.jpg",
} as const;
