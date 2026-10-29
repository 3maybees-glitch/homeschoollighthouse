import Stripe from "stripe";
import {
  isCurrentNavigatorPrice,
  selectNavigatorPriceId,
  type NavigatorPriceSnapshot,
} from "@/lib/billing/navigator-price";

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
    label: "Lifetime Lantern",
    priceLabel: "$14.99 lifetime",
    envKey: "STRIPE_PREMIUM_LIFETIME_PRICE_ID",
  },
  navigator: {
    label: "The Navigator",
    priceLabel: "$47 one-time",
    envKey: "STRIPE_NAVIGATOR_PRICE_ID",
  },
} as const;

export type StripePlan = keyof typeof stripePlans;

export function isOneTimePlan(plan: StripePlan) {
  return plan === "lifetime" || plan === "navigator";
}

function productIdOf(product: Stripe.Price["product"]) {
  return typeof product === "string" ? product : product.id;
}

function productNameOf(product: Stripe.Price["product"]) {
  if (typeof product === "string" || product.deleted) return undefined;
  return product.name;
}

function snapshotPrice(price: Stripe.Price, productName?: string): NavigatorPriceSnapshot {
  return {
    id: price.id,
    active: price.active,
    currency: price.currency,
    type: price.type,
    unitAmount: price.unit_amount,
    productId: productIdOf(price.product),
    productName: productName ?? productNameOf(price.product),
  };
}

/**
 * Checkout must charge the active $47 Navigator price. If the configured
 * price id is an older amount (the archived $77 price), select the current
 * $47 price instead. This does not create, archive, or edit Stripe prices.
 */
export async function resolveNavigatorPriceId(stripe: Stripe, configuredPriceId: string) {
  const configuredPrice = await stripe.prices.retrieve(configuredPriceId, {
    expand: ["product"],
  });
  const configured = snapshotPrice(configuredPrice);
  if (isCurrentNavigatorPrice(configured)) return configured.id;

  const candidates: NavigatorPriceSnapshot[] = [];
  const sameProduct = await stripe.prices.list({
    product: configured.productId,
    active: true,
    limit: 100,
  });
  for (const price of sameProduct.data) {
    candidates.push(snapshotPrice(price, configured.productName));
  }

  const onSameProduct = selectNavigatorPriceId(configured, candidates);
  if (onSameProduct) return onSameProduct;

  const products = await stripe.products.search({
    query: "active:'true' AND name~'Navigator'",
    limit: 10,
  });

  for (const product of products.data) {
    if (!/navigator/i.test(product.name) || product.id === configured.productId) continue;
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 100,
    });
    for (const price of prices.data) {
      candidates.push(snapshotPrice(price, product.name));
    }
  }

  return selectNavigatorPriceId(configured, candidates);
}
