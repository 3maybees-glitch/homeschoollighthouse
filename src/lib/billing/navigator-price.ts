/** The Navigator is a one-time $47 charge. Amounts are Stripe cents. */
export const NAVIGATOR_UNIT_AMOUNT_CENTS = 4700;

export type NavigatorPriceSnapshot = {
  id: string;
  active: boolean;
  currency: string;
  type: "one_time" | "recurring";
  unitAmount: number | null;
  productId: string;
  productName?: string;
};

export function isCurrentNavigatorPrice(price: NavigatorPriceSnapshot) {
  return (
    price.active &&
    price.currency === "usd" &&
    price.type === "one_time" &&
    price.unitAmount === NAVIGATOR_UNIT_AMOUNT_CENTS
  );
}

/**
 * Prefer the configured price when it is already the active $47 price.
 * Otherwise use an active $47 one-time price on the same product, then an
 * active $47 price whose product name is The Navigator. Never returns a
 * different amount (including the archived $77 price).
 */
export function selectNavigatorPriceId(
  configured: NavigatorPriceSnapshot,
  candidates: NavigatorPriceSnapshot[],
) {
  if (isCurrentNavigatorPrice(configured)) return configured.id;

  const sameProduct = candidates.find(
    (price) => price.productId === configured.productId && isCurrentNavigatorPrice(price),
  );
  if (sameProduct) return sameProduct.id;

  const named = candidates.find(
    (price) => isCurrentNavigatorPrice(price) && /navigator/i.test(price.productName ?? ""),
  );
  return named?.id ?? null;
}
