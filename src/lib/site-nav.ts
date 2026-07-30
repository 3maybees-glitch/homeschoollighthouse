import { brand } from "@/lib/brand-vocabulary";

export type NavItem = {
  href: string;
  label: string;
  /** Plain-English explanation of the (often nautical) label. */
  description: string;
  /** Marks features included with Lighthouse Premium. */
  premium?: boolean;
};

const explore: NavItem = {
  href: "/browse",
  label: "Explore",
  description: "Search 16,000+ homeschool resources",
};

const brightBeacons: NavItem = {
  href: "/browse?featured=1",
  label: brand.featured,
  description: "Our hand-picked featured resources",
};

const localHarbors: NavItem = {
  href: "/harbors",
  label: brand.nav.harbors,
  description: "Co-ops, groups & events near you",
};

const socialHarbors: NavItem = {
  href: "/social",
  label: "Social Harbors",
  description: "Homeschool groups & channels on Facebook, YouTube, and more",
};

const blog: NavItem = {
  href: "/blog",
  label: "Blog",
  description: `${brand.nav.blog} — homeschool tips & encouragement`,
};

const pricing: NavItem = {
  href: "/pricing",
  label: "Pricing",
  description: "Compare the free and Premium plans",
};

const lighthouseLibrary: NavItem = {
  href: "/lighthouse-library",
  label: brand.nav.bookshelf,
  description: "300 curated living books for every age",
  premium: true,
};

const creditLogbook: NavItem = {
  href: "/credit-logbook",
  label: brand.nav.creditLogbook,
  description: "High school transcript, credits & GPA tool",
  premium: true,
};

const navigator: NavItem = {
  href: "/navigator",
  label: brand.nav.navigator,
  description: "Academic profile matching for 1st–12th grade — 3 choices per subject",
};

const harborHuddle: NavItem = {
  href: "/harbor-huddle",
  label: brand.nav.huddle,
  description: "Members-only monthly community thread",
  premium: true,
};

const captainsLog: NavItem = {
  href: "/account",
  label: brand.nav.captainsLog,
  description: "Your account — saved resources & membership",
};

/** Primary header links (desktop top bar) — keep this short for a clean top bar. */
export const primaryNavItems: NavItem[] = [explore, localHarbors, blog, pricing];

/** Everything free to browse, in menu order. */
export const freeNavItems: NavItem[] = [explore, brightBeacons, navigator, localHarbors, socialHarbors, blog];

/** Tools included with Lighthouse Premium. */
export const premiumNavItems: NavItem[] = [lighthouseLibrary, creditLogbook, harborHuddle];

/** Standalone paid products (not Full Beam). */
export const standaloneNavItems: NavItem[] = [navigator];

/** The signed-in account page. */
export const accountNavItem: NavItem = captainsLog;

/** Extra free links that aren't in the primary top bar (for the More menu). */
export const moreFreeNavItems: NavItem[] = [brightBeacons, navigator];
