/**
 * Create Stripe products/prices for Homeschool Lighthouse premium.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
 *
 * Prints price IDs to copy into .env.local and Vercel.
 */
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
if (!secretKey) {
  console.error("Missing STRIPE_SECRET_KEY.");
  console.error("Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs");
  process.exit(1);
}

const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

const PRODUCT_NAME = "Homeschool Lighthouse Premium";
const YEARLY_AMOUNT_CENTS = 777;
const LIFETIME_AMOUNT_CENTS = 1499;

async function findExistingProduct() {
  const products = await stripe.products.list({ limit: 100, active: true });
  return products.data.find((product) => product.name === PRODUCT_NAME) ?? null;
}

async function findPrice(productId, lookupKey) {
  const prices = await stripe.prices.list({ product: productId, limit: 100, active: true });
  return prices.data.find((price) => price.lookup_key === lookupKey) ?? null;
}

async function main() {
  let product = await findExistingProduct();
  if (!product) {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description:
        "Full Beam access: premium filters, Harbor Huddle, Beacon Bookshelf, Credit Logbook, and more.",
      metadata: { app: "homeschoollighthouse" },
    });
    console.log(`Created product: ${product.id}`);
  } else {
    console.log(`Using existing product: ${product.id}`);
  }

  let yearlyPrice = await findPrice(product.id, "premium_yearly");
  if (!yearlyPrice) {
    yearlyPrice = await stripe.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: YEARLY_AMOUNT_CENTS,
      recurring: { interval: "year" },
      lookup_key: "premium_yearly",
      transfer_lookup_key: true,
      metadata: { plan: "yearly" },
    });
    console.log(`Created yearly price: ${yearlyPrice.id}`);
  } else {
    console.log(`Using existing yearly price: ${yearlyPrice.id}`);
  }

  let lifetimePrice = await findPrice(product.id, "premium_lifetime");
  if (!lifetimePrice) {
    lifetimePrice = await stripe.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: LIFETIME_AMOUNT_CENTS,
      lookup_key: "premium_lifetime",
      transfer_lookup_key: true,
      metadata: { plan: "lifetime" },
    });
    console.log(`Created lifetime price: ${lifetimePrice.id}`);
  } else {
    console.log(`Using existing lifetime price: ${lifetimePrice.id}`);
  }

  const mode = secretKey.startsWith("sk_live_") ? "live" : "test";

  console.log("\n--- Copy these into .env.local and Vercel ---\n");
  console.log(`STRIPE_SECRET_KEY=${secretKey}`);
  console.log(`STRIPE_PREMIUM_YEARLY_PRICE_ID=${yearlyPrice.id}`);
  console.log(`STRIPE_PREMIUM_LIFETIME_PRICE_ID=${lifetimePrice.id}`);
  console.log("STRIPE_WEBHOOK_SECRET=whsec_...  # from Stripe Dashboard or `stripe listen`");
  console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_${mode}_...`);
  console.log("NEXT_PUBLIC_SITE_URL=https://homeschoollighthouse.com");
  console.log("\n--- Webhook endpoint ---\n");
  console.log("Production: https://homeschoollighthouse.com/api/webhooks/stripe");
  console.log("Local: stripe listen --forward-to localhost:3000/api/webhooks/stripe");
  console.log("\nEnable events:");
  console.log("  - checkout.session.completed");
  console.log("  - invoice.payment_succeeded");
  console.log("  - customer.subscription.deleted");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
