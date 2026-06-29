import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
  });
}

export const stripePlans = {
  yearly: {
    label: "Annual Pass",
    priceLabel: "$7.77/year",
    envKey: "STRIPE_PREMIUM_YEARLY_PRICE_ID",
  },
  lifetime: {
    label: "Lifetime Beacon",
    priceLabel: "$14.99 lifetime",
    envKey: "STRIPE_PREMIUM_LIFETIME_PRICE_ID",
  },
} as const;

export type StripePlan = keyof typeof stripePlans;
