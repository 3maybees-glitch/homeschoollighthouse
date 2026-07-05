import { brand } from "@/lib/brand-vocabulary";

export type NavItem = {
  href: string;
  label: string;
};

/** Primary header links — keep this short for a clean top bar. */
export const primaryNavItems: NavItem[] = [
  { href: "/browse", label: "Explore" },
  { href: "/beacon-bookshelf", label: brand.nav.bookshelf },
  { href: "/harbors", label: brand.nav.harbors },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Premium" },
];

/** Secondary links — available in the More menu and mobile drawer. */
export const secondaryNavItems: NavItem[] = [
  { href: "/browse?featured=1", label: brand.nav.beacons },
  { href: "/credit-logbook", label: brand.nav.creditLogbook },
  { href: "/harbor-huddle", label: brand.nav.huddle },
  { href: "/account", label: brand.nav.captainsLog },
];

export const allNavItems: NavItem[] = [...primaryNavItems, ...secondaryNavItems];
