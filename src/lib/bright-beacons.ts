import { brand } from "@/lib/brand-vocabulary";

/** Total exclusive Bright Beacon advertising slots on the homepage. */
export const BRIGHT_BEACON_TOTAL_SPOTS = brand.advertise.spotCount;

/** Active featured listings shown in the top row (rest are open ad spots). */
export const BRIGHT_BEACON_ACTIVE_ROW = 4;

export const brightBeaconBenefits = [
  {
    title: "Homepage spotlight",
    description:
      "Your brand sits in the Bright Beacons section on every homepage visit — prime real estate above the fold of discovery.",
  },
  {
    title: "Directory depth",
    description: `Families browse ${brand.stats.listings} trusted resources. A Bright Beacon badge marks you as a hand-picked signal worth following.`,
  },
  {
    title: "Monthly Beacon Bulletin",
    description:
      "Get featured in our monthly crew newsletter — Bright Beacons, seasonal guidance, and new routes delivered to engaged homeschool families.",
  },
  {
    title: "Exclusive scarcity",
    description: `Only ${BRIGHT_BEACON_TOTAL_SPOTS} Bright Beacon spots exist. Scarcity keeps attention high and your placement memorable.`,
  },
] as const;

export const brightBeaconUpsells = [
  {
    title: "Beacon + Bulletin Spotlight",
    price: "+$49/month",
    description:
      "Extra newsletter callout with your logo, short pitch, and direct link — ideal for launches and seasonal enrollments.",
  },
  {
    title: "Social Harbors Bundle",
    price: "+$79/month",
    description:
      "Pair your Bright Beacon with a Social Harbors mention and a Fair Winds Weekly blog shout-out once per quarter.",
  },
  {
    title: "Founding Beacon (annual)",
    price: "Included with yearly",
    description:
      "Lock your spot for 12 months at $797, keep priority renewal, and receive one complimentary Bulletin Spotlight.",
  },
] as const;
