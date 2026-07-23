/**
 * Soft-sell config for MaybeeCreates Faith & Freedom World Maps on Etsy.
 * Fans / Future product lines are intentionally excluded.
 */
export const faithFreedomMaps = {
  brandName: "Maybee Creates",
  productName: "Faith & Freedom World Maps",
  eyebrow: "Chart Table pick",
  headline: "Faith & Freedom World Maps",
  body: "Printable discovery maps for Bible study and American liberty — Soul Explorer and Liberty Explorer only. A quiet recommendation from the Lighthouse crew for families who learn with maps in hand.",
  shopUrl: "https://www.etsy.com/shop/MaybeeCreates",
  faith: {
    label: "Faith maps",
    description: "Soul Explorer Bible world maps",
    // Shop search scoped to Faith / Soul Explorer listings
    url: "https://www.etsy.com/shop/MaybeeCreates?search_query=Soul+Explorer",
  },
  freedom: {
    label: "Freedom maps",
    description: "Liberty Explorer history maps",
    // Shop search scoped to Freedom / Liberty Explorer listings
    url: "https://www.etsy.com/shop/MaybeeCreates?search_query=Liberty+Explorer",
  },
  coverImageUrl: "/logos/maybee-creations.jpg",
  mapPreviewUrl: "/logos/maybee-madison-map.jpg",
} as const;
